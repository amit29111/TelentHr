import AsyncStorage from '@react-native-async-storage/async-storage';
import {io} from 'socket.io-client';

// Web uses the same backend as REST API; 3300 is the dedicated attendance socket.
export const ATTENDANCE_SOCKET_URLS = [
  'https://uat-backend-hrms.ezcompliance.in',
  'http://13.235.48.48:3300',
];
export const ATTENDANCE_SOCKET_URL = ATTENDANCE_SOCKET_URLS[1];
export const ATTENDANCE_POLL_INTERVAL_MS = 3000;

const JOIN_EVENTS = [
  'join',
  'subscribe',
  'register',
  'employee:join',
  'attendance:join',
  'attendance:subscribe',
  'subscribe:attendance',
  'joinRoom',
];

const REQUEST_EVENTS = [
  'getAttendance',
  'getInitialAttendance',
  'fetchAttendance',
  'attendance:sync',
  'requestAttendance',
  'getAttendanceWithTime',
];

const sockets = new Map();
let onUpdateHandler = null;

export const setAttendanceSocketHandler = handler => {
  onUpdateHandler = handler;
};

export const isoToTimeString = iso => {
  if (!iso) {
    return null;
  }
  try {
    return new Date(iso).toISOString().split('T')[1].split('.')[0];
  } catch {
    return null;
  }
};

export const parseAttendancePayload = payload => {
  if (!payload) {
    return null;
  }

  if (payload?.data?.trackStatus) {
    return payload.data;
  }

  if (payload?.trackStatus) {
    return payload;
  }

  if (payload?.data?.data?.trackStatus) {
    return payload.data.data;
  }

  return null;
};

export const trackStatusFromPayload = (eventName, payload) => {
  const record = parseAttendancePayload(payload);
  if (record?.trackStatus) {
    return record.trackStatus;
  }

  const normalizedEvent = String(eventName || '').toLowerCase();
  if (normalizedEvent.includes('breakin')) {
    return 'breakIn';
  }
  if (normalizedEvent.includes('breakout')) {
    return 'breakOut';
  }
  if (normalizedEvent.includes('checkout')) {
    return 'checkOut';
  }
  if (normalizedEvent.includes('checkin')) {
    return 'checkIn';
  }

  return null;
};

const formatProgress = value => {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return '0.0';
  }
  return Math.max(0, Math.min(100, num)).toFixed(1);
};

const secondsToHMS = totalSeconds => {
  const secs = Math.max(0, Math.floor(totalSeconds));
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const calculateWorkingSeconds = record => {
  if (!record?.checkIn) {
    return 0;
  }

  const checkInDate = new Date(record.checkIn);
  if (isNaN(checkInDate.getTime())) {
    return 0;
  }

  let endDate = record.checkOut ? new Date(record.checkOut) : new Date();
  if (isNaN(endDate.getTime())) {
    endDate = new Date();
  }

  if (record.trackStatus === 'breakIn' && Array.isArray(record.breaks)) {
    const activeBreak = [...record.breaks]
      .reverse()
      .find(item => item?.breakIn && !item?.breakOut);
    if (activeBreak) {
      const breakStart = new Date(activeBreak.breakIn);
      if (!isNaN(breakStart.getTime())) {
        endDate = breakStart;
      }
    }
  }

  let totalMs = endDate - checkInDate;

  if (Array.isArray(record.breaks)) {
    record.breaks.forEach(breakItem => {
      const breakIn = new Date(breakItem.breakIn);
      const breakOut = breakItem.breakOut ? new Date(breakItem.breakOut) : null;
      if (!isNaN(breakIn.getTime()) && breakOut && !isNaN(breakOut.getTime())) {
        totalMs -= breakOut - breakIn;
      }
    });
  }

  return Math.max(0, Math.floor(totalMs / 1000));
};

export const buildWorkProgress = (record, requiredHours = 8.333) => {
  const totalSeconds = calculateWorkingSeconds(record);
  const calculated = {
    hoursElapsed: secondsToHMS(totalSeconds),
    percentage: formatProgress((totalSeconds / 3600 / requiredHours) * 100),
  };

  const serverWorkedTime = record?.workedTimeFormatted;
  const serverProgress = record?.progress;
  const hasValidServerTime =
    Boolean(serverWorkedTime) && serverWorkedTime !== '00:00:00';
  const hasValidServerProgress =
    typeof serverProgress === 'number' &&
    !Number.isNaN(serverProgress) &&
    serverProgress > 0;

  if (!hasValidServerTime && !hasValidServerProgress) {
    return calculated;
  }

  return {
    hoursElapsed: hasValidServerTime ? serverWorkedTime : calculated.hoursElapsed,
    percentage: hasValidServerProgress
      ? formatProgress(serverProgress)
      : calculated.percentage,
  };
};

export const buildWorkProgressFromClockIn = (
  checkInTimeStr,
  breaks = [],
  trackStatus,
  requiredHours = 8.333,
) => {
  if (!checkInTimeStr) {
    return {hoursElapsed: '00:00:00', percentage: '0.0'};
  }

  const now = new Date();
  const [hh, mm, ss] = checkInTimeStr.split(':').map(Number);
  const startTime = new Date();
  startTime.setHours(hh, mm, ss || 0);

  let endTime = now;
  if (trackStatus === 'breakIn' && Array.isArray(breaks)) {
    const activeBreak = [...breaks]
      .reverse()
      .find(item => item?.breakIn && !item?.breakOut);
    if (activeBreak) {
      endTime = new Date(activeBreak.breakIn);
    }
  }

  let totalSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000));

  if (Array.isArray(breaks)) {
    breaks.forEach(breakItem => {
      const breakIn = new Date(breakItem.breakIn);
      const breakOut = breakItem.breakOut ? new Date(breakItem.breakOut) : null;
      if (!isNaN(breakIn.getTime()) && breakOut && !isNaN(breakOut.getTime())) {
        totalSeconds = Math.max(
          0,
          totalSeconds - Math.floor((breakOut - breakIn) / 1000),
        );
      }
    });
  }

  const hoursElapsed = secondsToHMS(totalSeconds);
  const hoursDecimal = totalSeconds / 3600;

  return {
    hoursElapsed,
    percentage: formatProgress((hoursDecimal / requiredHours) * 100),
  };
};

const handleSocketPayload = (eventName, payload) => {
  if (!onUpdateHandler) {
    return;
  }

  const record = parseAttendancePayload(payload);
  if (record?.trackStatus) {
    onUpdateHandler(eventName, payload, record);
    return;
  }

  const status = trackStatusFromPayload(eventName, payload);
  if (status) {
    const partial = parseAttendancePayload(payload) || {};
    onUpdateHandler(eventName, payload, {...partial, trackStatus: status});
  }
};

const getSocketCredentials = async () => {
  const [empId, orgId, authToken] = await Promise.all([
    AsyncStorage.getItem('empId'),
    AsyncStorage.getItem('orgId'),
    AsyncStorage.getItem('authToken'),
  ]);

  return {empId, orgId, authToken};
};

const buildSocketOptions = ({empId, orgId, authToken}) => ({
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  timeout: 15000,
  autoConnect: false,
  query: {
    employeeId: empId || '',
    orgId: orgId || '',
    token: authToken || '',
  },
  auth: {
    token: authToken || '',
    employeeId: empId || '',
    orgId: orgId || '',
  },
  extraHeaders: authToken
    ? {
        Authorization: `Bearer ${authToken}`,
        org_uuid: orgId || '',
      }
    : {},
});

const joinAttendanceRoom = async socket => {
  const {empId, orgId, authToken} = await getSocketCredentials();
  if (!empId) {
    return;
  }

  const payload = {employeeId: empId, orgId, token: authToken};
  const rooms = [empId, `employee:${empId}`, `employee_${empId}`, `emp:${empId}`];

  JOIN_EVENTS.forEach(eventName => {
    socket.emit(eventName, payload);
    socket.emit(eventName, empId);
  });

  rooms.forEach(room => {
    socket.emit('join', room);
    socket.emit('joinRoom', room);
    socket.emit('subscribe', room);
  });

  REQUEST_EVENTS.forEach(eventName => {
    socket.emit(eventName, payload);
  });
};

const ensureSocketListeners = (socket, url) => {
  if (socket.__attendanceSetup) {
    return;
  }

  socket.on('connect', () => {
    joinAttendanceRoom(socket);
  });

  socket.onAny((eventName, ...args) => {
    handleSocketPayload(eventName, args[0]);
  });

  socket.on('connect_error', error => {
    console.log('attendance socket connect_error', url, error.message);
  });

  socket.__attendanceSetup = true;
};

const getOrCreateSocket = async url => {
  const credentials = await getSocketCredentials();
  let socket = sockets.get(url);

  if (socket) {
    const tokenChanged = socket.auth?.token !== credentials.authToken;
    if (tokenChanged) {
      socket.disconnect();
      sockets.delete(url);
      socket = null;
    }
  }

  if (!socket) {
    socket = io(url, buildSocketOptions(credentials));
    ensureSocketListeners(socket, url);
    sockets.set(url, socket);
  }

  if (!socket.connected) {
    socket.connect();
  }

  if (socket.connected) {
    await joinAttendanceRoom(socket);
  }

  return socket;
};

export const connectAttendanceSocket = async () => {
  const credentials = await getSocketCredentials();
  if (!credentials.empId) {
    return null;
  }

  await Promise.all(ATTENDANCE_SOCKET_URLS.map(url => getOrCreateSocket(url)));
  return sockets.get(ATTENDANCE_SOCKET_URLS[0]) || sockets.get(ATTENDANCE_SOCKET_URLS[1]);
};

export const disconnectAttendanceSocket = () => {
  sockets.forEach(socket => {
    socket.removeAllListeners();
    socket.__attendanceSetup = false;
    socket.disconnect();
  });
  sockets.clear();
  onUpdateHandler = null;
};

export const enrichAttendanceRecord = (record, requiredHours = 8.333) => {
  if (!record) {
    return null;
  }

  const computed = buildWorkProgress(record, requiredHours);

  return {
    ...record,
    workedTimeFormatted:
      record.workedTimeFormatted && record.workedTimeFormatted !== '00:00:00'
        ? record.workedTimeFormatted
        : computed.hoursElapsed,
    progress:
      typeof record.progress === 'number' &&
      !Number.isNaN(record.progress) &&
      record.progress > 0
        ? record.progress
        : Number(computed.percentage),
  };
};

export const buildAttendanceSocketEnvelope = (
  record,
  message = 'Initial attendance data with time',
) => ({
  status: 'success',
  message,
  data: record,
});

const BROADCAST_EVENTS = [
  'attendance',
  'attendance:update',
  'attendanceUpdated',
  'attendance-update',
  'attendanceData',
  'attendance:data',
  'attendance:sync',
  'employeeAttendance',
  'employee:attendance',
  'broadcastAttendance',
  'notifyAttendance',
  'attendance:notify',
  'syncAttendance',
];

const ACTION_EVENT_SUFFIXES = actionEvent => [
  actionEvent,
  `attendance:${actionEvent}`,
  `attendance/${actionEvent}`,
  `${actionEvent}Attendance`,
];

const emitOnAllSockets = (emitFn) => {
  sockets.forEach((socket, url) => {
    if (socket.connected) {
      emitFn(socket, url);
    }
  });
};

export const emitAttendanceAction = async (
  actionEvent,
  record,
  actionBody = {},
  requiredHours = 8.333,
) => {
  if (!record?.trackStatus) {
    return;
  }

  await connectAttendanceSocket();

  const {empId, orgId, authToken} = await getSocketCredentials();
  const attendanceData = enrichAttendanceRecord(
    {
      ...record,
      employeeId: record.employeeId || empId,
      reportingChannel: 'web',
    },
    requiredHours,
  );
  const envelope = buildAttendanceSocketEnvelope(attendanceData);
  const roomPayload = {employeeId: empId, orgId, token: authToken, ...envelope};

  const actionPayload = {
    employeeId: empId,
    orgId,
    token: authToken,
    reportingChannel: 'web',
    reportingType: 'web',
    userLat: '22.7487527',
    userLng: '75.8957078',
    ...actionBody,
  };

  const actionEvents = ACTION_EVENT_SUFFIXES(actionEvent);
  const broadcastEvents = [
    attendanceData.trackStatus,
    ...BROADCAST_EVENTS,
  ].filter(Boolean);

  emitOnAllSockets(socket => {
    [...new Set(actionEvents)].forEach(eventName => {
      socket.emit(eventName, actionPayload);
      socket.emit(eventName, envelope);
      socket.emit(eventName, envelope.data);
      socket.emit(eventName, {...actionPayload, ...envelope});
    });

    [...new Set(broadcastEvents)].forEach(eventName => {
      socket.emit(eventName, envelope);
      socket.emit(eventName, roomPayload);
      socket.emit(eventName, attendanceData);
    });

    const rooms = [empId, `employee:${empId}`, `employee_${empId}`];
    rooms.forEach(room => {
      socket.emit('pushToRoom', {
        room,
        event: 'attendance',
        payload: envelope,
      });
      socket.emit('broadcastToRoom', {
        room,
        event: 'attendance',
        data: envelope,
      });
    });
  });
};

export const broadcastAttendanceUpdate = async (
  record,
  actionEvent = 'attendance',
  requiredHours = 8.333,
  actionBody = {},
) => {
  await emitAttendanceAction(actionEvent, record, actionBody, requiredHours);
};

export const requestAttendanceSync = async () => {
  await connectAttendanceSocket();
  await Promise.all(
    [...sockets.values()]
      .filter(socket => socket.connected)
      .map(socket => joinAttendanceRoom(socket)),
  );
};
