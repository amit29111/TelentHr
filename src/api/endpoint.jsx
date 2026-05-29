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
  PAYROLL: {
    MY_CLAIMS_SUMMARY: 'payRoll/employee/myClaimsSummary',
    MY_CLAIMS: 'payRoll/employee/myClaims',
    REIMBURSEMENT_HEADS: 'payRoll/employee/reimbursementHeads',
    SUBMIT_CLAIM: 'payRoll/employee/submitClaim',
    MY_PAYSLIPS: financialYear =>
      `payRoll/employee/myPayslips?financialYear=${financialYear}`,
    ANNUAL_SALARY_STATEMENT: financialYear =>
      `payRoll/employee/annualSalaryStatement?financialYear=${financialYear}`,
    SALARY_PDF_DOWNLOAD: payslipId =>
      `payroll/employee/getMySalaryPdfdownload/${payslipId}`,
    DASHBOARD: 'payroll/employee/dashboard',
    FORM16_PART_A: financialYear =>
      `payRoll/employee/form16/part-a/download?financialYear=${financialYear}`,
    FORM16_PART_B: financialYear =>
      `payRoll/employee/form16/part-b/download?financialYear=${financialYear}`,
    VPF_START: 'payRoll/employee/vpf/start',
    VPF_APPROVE: requestId => `payroll/employee/vpf/${requestId}/approve`,
    VPF_ALL: 'payroll/vpf/all',
    EMPLOYEE_VPF: 'payroll/employee/vpf',
    TDS_EMPLOYEE: (empId, financialYear) =>
      `payRoll/tds/employee/${empId}?financialYear=${financialYear}`,
    TDS_INVESTMENT_DECLARATION: 'payroll/tds/investment-declaration',
    TDS_PROOF_OF_INVESTMENT: 'payroll/tds/proof-of-investment',
    FILE_UPLOAD: 'upload/file',
    TDS_TAX_REPORT: financialYear =>
      `payRoll/tds/tax-report?financialYear=${financialYear}`,
    TDS_TAX_REPORT_DOWNLOAD: financialYear =>
      `payRoll/tds/tax-report/download?financialYear=${financialYear}`,
    FORM16: financialYear =>
      `payRoll/employee/form16?financialYear=${financialYear}`,
    FORM16_DOWNLOAD: financialYear =>
      `payRoll/employee/form16/download?financialYear=${financialYear}`,
  },
};

  

