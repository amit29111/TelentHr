import AsyncStorage from '@react-native-async-storage/async-storage';
import apiAuth from './authConfig';
import { ENDPOINT } from './endpoint';
import apiClient from './apiClient';

const handleError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      data: error.response.data,
      message: error.response.data.message || 'API request failed',
    };
  } else if (error.request) {
    return { message: 'No response from server. Please check your network.' };
  } else {
    return { message: error.message || 'Request setup error' };
  }
};

const apiService = {
  async logInUser(email, password) {
    try {
      const response = await apiAuth.post(ENDPOINT.AUTH.LOGIN, {
        systemUserEmail: email,
        systemUserPassword: password,
      });
      // console.log('🌐 Login API Response:', response.data);
      return response.data;
    } catch (error) {
      // console.error('❌ Login API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async getEmployeeById(empId) {
    try {
      const response = await apiClient.get(ENDPOINT.AUTH.EMPBYID(empId));
      return response.data;
    } catch (error) {
      // console.error('❌ Get Employee API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async getEmployeeNotification(empId) {
    try {
      const response = await apiClient.get(ENDPOINT.AUTH.NOTIFICATION(empId));
      // console.log('🌐 ', response.data); // Debug
      return response.data;
    } catch (error) {
      console.error('❌ Notification API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async checkIn() {
    try {
      const response = await apiClient.post(ENDPOINT.BREAK.CHECKIN);
      // console.log('🌐 Check-In API Response:', response.data);
      return response.data;
    } catch (error) {
      // console.error('❌ Check-In API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async checkOut() {
    try {
      const response = await apiClient.post(ENDPOINT.BREAK.CHECKOUT);
      // console.log('🌐 Check-Out API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Check-Out API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async breakIn() {
    try {
      const response = await apiClient.post(ENDPOINT.BREAK.BREAKIN);
      // console.log('🌐 Break-In API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Break-In API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async breakOut() {
    try {
      const response = await apiClient.post(ENDPOINT.BREAK.BREAKOUT);
      // console.log('🌐 Break-Out API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Break-Out API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async getAttendance(empId, date) {
    try {
      const response = await apiClient.get(
        `${ENDPOINT.AUTH.EMPBYID(empId)}/attendance?date=${date}`
      );
      // console.log('🌐 Attendance API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Attendance API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async getOrganition(orgId) {
    try {
      const response = await apiClient.get(
        `${ENDPOINT.AUTH.ORGDETAIL(orgId)}`
      );
      return response.data;
    } catch (error) {
      // console.error('❌ Attendance API Error:2222222222', error.response?.data || error);
      throw handleError(error);
    }
  },
  // async getAllPreResignations(empId) {
  //   try {
     
  //     const response = await apiClient.get(
  //        ENDPOINT.CONCERN.GET_CONCERNS(empId)
  //     );
  //      console.log('Using endpoint:', response); 
  //     // console.log('🌐 Pre-Resignations API Response:', response.data);
  //     return response.data;
  //   } catch (error) {
  //     // console.error('❌ Pre-Resignations API Error:', error.response?.data || error);
  //     throw handleError(error);
  //   }
  // }
  async getAllPreResignations(empId) {
  try {
    const response = await apiClient.get(
      ENDPOINT.CONCERN.GET_CONCERNS(empId)
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
},
 async addPreResignation(formData) {
    try {
      const response = await apiClient.post(ENDPOINT.CONCERN.ADD_CONCERN, formData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async getEmployeeHighlights() {
  try {
    const response = await apiClient.get(
      '/employee/getEmployeeHighlights'
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
},
  async getMyClaimsSummary() {
    try {
      const response = await apiClient.get(
        ENDPOINT.PAYROLL.MY_CLAIMS_SUMMARY,
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async getReimbursementHeads() {
    try {
      const response = await apiClient.get(
        ENDPOINT.PAYROLL.REIMBURSEMENT_HEADS,
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async submitClaim(payload) {
    try {
      const response = await apiClient.post(
        ENDPOINT.PAYROLL.SUBMIT_CLAIM,
        payload,
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async getMyPayslips(financialYear) {
    console.log('financialYear', financialYear);
    try {
      const response = await apiClient.get(
        ENDPOINT.PAYROLL.MY_PAYSLIPS(financialYear),
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async getAnnualSalaryStatement(financialYear) {
    try {
      const response = await apiClient.get(
        ENDPOINT.PAYROLL.ANNUAL_SALARY_STATEMENT(financialYear),
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async startVpfRequest(payload) {
    try {
      const response = await apiClient.post(ENDPOINT.PAYROLL.VPF_START, payload);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async getMyVpfConfig() {
    try {
      const response = await apiClient.get(ENDPOINT.PAYROLL.EMPLOYEE_VPF);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async getAllVpfRequests() {
    try {
      const response = await apiClient.get(ENDPOINT.PAYROLL.VPF_ALL);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async approveVpfRequest(requestId) {
    try {
      const response = await apiClient.post(ENDPOINT.PAYROLL.VPF_APPROVE(requestId));
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async getPayrollDashboard() {
    try {
      const response = await apiClient.get(ENDPOINT.PAYROLL.DASHBOARD);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async downloadForm16PartA(financialYear) {
    try {
      const response = await apiClient.get(
        ENDPOINT.PAYROLL.FORM16_PART_A(financialYear),
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  async downloadForm16PartB(financialYear) {
    try {
      const response = await apiClient.get(
        ENDPOINT.PAYROLL.FORM16_PART_B(financialYear),
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

};



export default apiService;