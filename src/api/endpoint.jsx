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
  },
  //     BREAK :{
  //     CHECKIN:'attendance/checkIn',
  //     CHECKOUT:'attendance/checkOut',
  //     BREAKIN:'attendance/breakIn',
  //     BREAKOUT:'attendance/breakOut',
  //     CHECKCHECKIN:(empId)=>`attendance/todayAttendanceByEmployeeId/${empId}`,
  //     BREAKIN:(empId)=>`attendance/breakIn/${empId}`,
  // }
};
