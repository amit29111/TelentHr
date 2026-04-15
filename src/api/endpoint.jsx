export const ENDPOINT = {
  AUTH: {
    LOGIN: 'auth/login',
    EMPBYID: empId => `employee/getEmployeeById/${empId}`,
    NOTIFICATION: empId => `notification/getNotification/${empId}`,
    ORGDETAIL: orgId => `organization/getOrganization/${orgId}`,
  },
  BREAK: {
    CHECKIN: 'attendance/checkIn',
    CHECKOUT: 'attendance/checkOut',
    BREAKIN: 'attendance/breakIn',
    BREAKOUT: 'attendance/breakOut',
    CHECKCHECKIN: empId => `attendance/todayAttendanceByEmployeeId/${empId}`,
    CHART: empId => `attendance/getAttendanceRateChart?employeeId=${empId}`,
    ATTENDANCERECORD: (empId, startDate, endDate) => `attendance/getAttendanceByDateRange/${empId}?startDate=${startDate}&endDate=${endDate}`,

  },
  LEAVE: {
    LEAVESHOW : (empId, page, limit) => `leave/getAllLeaveRequestsForEmployee/${empId}?page=${page}&limit=${limit}`,
    LEAVEBALANCE : (empId) => `leave/leaveTypeByEmployeeId/${empId}`,
    LEAVE : `leave/createLeaveRequest`,
    GETLEAVETYPE: empId => `leave/leaveTypeByEmployeeId/${empId}`,
    UPDATEEMPLOYEE: empId => `employee/updateEmployee/${empId}`,


  


  },
  CALENDAR:{
    SHOWHOLIDAY:(startDate,endDate, page, limit) => `holiday/getAllHolidays?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`,
   
    SHOWEVENT:( page, limit) => `event/getAllEvents?page=${page}&limit=${limit}`,
   SHOWMETTING:(empId,startDate,endDate) => `employee/getEmployeeInterviewsByDate/${empId}?startDate=${startDate}&endDate=${endDate}`,
  },
  UPLOADPHOTO:{
    UPLOADPHOTO:(empId) => `employee/employeeImg/${empId}`
  },


  // Naya section add karein
   CONCERN: {
    ADD_CONCERN: 'resignation/addPreResignation',
    GET_CONCERNS: (empId) =>
      `resignation/getAllPreResignations?employeeId=${empId}`,
  },
};

  

