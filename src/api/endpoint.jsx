export const ENDPOINT = {
    AUTH :{
        LOGIN:'auth/login',
        EMPBYID:(empId)=>`employee/getEmployeeById/${empId}`,
        NOTIFICATION:(empId)=>`notification/getNotification/${empId}`
        
    },
     BREAK :{
        CHECKIN:'attendance/checkIn',
        CHECKOUT:'attendance/checkOut',
        BREAKIN:'attendance/breakIn',
        BREAKOUT:'attendance/breakOut',
        CHECKCHECKIN:(empId)=>`attendance/todayAttendanceByEmployeeId/${empId}`,
    }
}