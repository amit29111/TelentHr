// // // // import axios from 'axios';
// // // // import { ENDPOINT } from './endpoint';

// // // // // ✅ Axios instance
// // // // const authConfig = axios.create({
// // // //   baseURL: 'http://20.197.12.95:5000/',
// // // //   headers: {
// // // //     'Content-Type': 'application/json',
// // // //   },
// // // // });

// // // // // ✅ Login API function
// // // // export const loginUser = async (email, password) => {
// // // //   console.log('Hitting:', authConfig.defaults.baseURL + ENDPOINT.AUTH.LOGIN);
// // // //   const systemUserEmail = email;
// // // //   const systemUserPassword = password;

// // // //   try {
// // // //     console.log('sdfsdfsdfsdfdsf' );
// // // //     const response = await authConfig.post(ENDPOINT.AUTH.LOGIN, {
// // // //       systemUserEmail,
// // // //       systemUserPassword,
// // // //     });

// // // //     console.log('API Response:', response.data);
// // // //     return response.data;
// // // //   } catch (error) {
// // // //     console.error('API Error:', error);
// // // //     throw error;
// // // //   }
// // // // };

// // // import axios from 'axios';
// // // import { ENDPOINT } from './endpoint';
// // // import AsyncStorage from '@react-native-async-storage/async-storage'

// // // // ✅ Axios instance
// // // const authConfig = axios.create({
// // //   baseURL: 'http://20.197.12.95:5000/',
// // //   headers: {
// // //     'Content-Type': 'application/json',
// // //   },
// // // });

// // // // ✅ Login API function
// // // export const loginUser = async (data) => {
// // //   try {
// // //     const response = await authConfig.post(ENDPOINT.AUTH.LOGIN, {
// // //       systemUserEmail: data.email,
// // //       systemUserPassword: data.password,
// // //     });
// // //     console.log('✅ API Success:', response.data);

// // //     try {
// // //       await AsyncStorage.setItem('authToken', response.data.token);
// // //       await AsyncStorage.setItem('permissionList', JSON.stringify(response.data.permissions));
// // //       await AsyncStorage.setItem('categoryId', response.data.data.categoryId);
// // //       await AsyncStorage.setItem('empId', response.data.data.linkSystemUser[0].employeeId);
// // //       await AsyncStorage.setItem('orgId', response.data.data.linkSystemUser[0].organizationId);
// // //       await AsyncStorage.setItem('organizationName', response.data.data.linkSystemUser[0].organizationName);
// // //       await AsyncStorage.setItem('systemUserId', response.data.data._id);
// // //       console.log('✅ AsyncStorage Save Success');
// // //     } catch (storageError) {
// // //       console.log('❌ AsyncStorage Save Error:', storageError);
// // //     }

// // //     return response.data;
// // //   } catch (error) {
// // //     if (error.response) {
// // //       throw new Error(error.response.data.message || 'Login failed');
// // //     } else if (error.request) {
// // //       throw new Error('No response from server. Please check your network.');
// // //     } else {
// // //       throw new Error('An error occurred. Please try again.');
// // //     }
// // //   }
// // // };


// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import apiAuth from './authConfig';
// // // import { ENDPOINT } from './endpoint';
// // // import apiClient from './config';

// // // const handleError = (error) => {
// // //   if (error.response) {
// // //     return {
// // //       status: error.response.status,
// // //       data: error.response.data,
// // //       message: error.response.data.message || 'API request failed',
// // //     };
// // //   } else if (error.request) {
// // //     return { message: 'No response from server. Please check your network.' };
// // //   } else {
// // //     return { message: error.message || 'Request setup error' };
// // //   }
// // // };

// // // const apiService = {
// // //   async logInUser(email, password) {
// // //     try {
// // //       const response = await apiAuth.post(ENDPOINT.AUTH.LOGIN, {
// // //         systemUserEmail: email,
// // //         systemUserPassword: password,
// // //       });
// // //       console.log('🌐 Login API Response:', response.data);
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('❌ Login API Error:', error.response?.data || error);
// // //       throw handleError(error);
// // //     }
// // //   },
// // //   async getEmployeeById(empId) {
// // //     try {
// // //       const response = await apiClient.get(ENDPOINT.AUTH.EMPBYID(empId));
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('❌ Get Employee API Error:', error.response?.data || error);
// // //       throw handleError(error);
// // //     }
// // //   },
// // //   async getEmployeeNotification(empId) {
// // // //     try {
// // // //       const response = await apiClient.get(ENDPOINT.AUTH.NOTIFICATION(empId));
// // // //       console.log('sdfsdfsdf', response);
// // // //       return response.data;
// // // //     } catch (error) {
// // // //       throw handleError(error);
// // // //     }
// // // //   },
 

// // // // };

// // // // export default apiService;
// // // // apiService.js
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import apiAuth from './authConfig';
// // // import { ENDPOINT } from './endpoint';
// // // import apiClient from './config';

// // // const handleError = (error) => {
// // //   if (error.response) {
// // //     return {
// // //       status: error.response.status,
// // //       data: error.response.data,
// // //       message: error.response.data.message || 'API request failed',
// // //     };
// // //   } else if (error.request) {
// // //     return { message: 'No response from server. Please check your network.' };
// // //   } else {
// // //     return { message: error.message || 'Request setup error' };
// // //   }
// // // };

// // // const apiService = {
// // //   async logInUser(email, password) {
// // //     try {
// // //       const response = await apiAuth.post(ENDPOINT.AUTH.LOGIN, {
// // //         systemUserEmail: email,
// // //         systemUserPassword: password,
// // //       });
// // //       console.log('🌐 Login API Response:', response.data);
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('❌ Login API Error:', error.response?.data || error);
// // //       throw handleError(error);
// // //     }
// // //   },
// // //   async getEmployeeById(empId) {
// // //     try {
// // //       const response = await apiClient.get(ENDPOINT.AUTH.EMPBYID(empId));
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('❌ Get Employee API Error:', error.response?.data || error);
// // //       throw handleError(error);
// // //     }
// // //   },
// // //   async getEmployeeNotification(empId) {
// // //     try {
// // //       const response = await apiClient.get(ENDPOINT.AUTH.NOTIFICATION(empId));
// // //       console.log('sdfsdfsdf', response);
// // //       return response.data;
// // //     } catch (error) {
// // //       throw handleError(error);
// // //     }
// // //   },
// // //   async checkIn() {
// // //     try {
// // //       const response = await apiClient.post(ENDPOINT.BREAK.CHECKIN);
// // //       console.log('🌐 Check-In API Response:', response.data);
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('❌ Check-In API Error:', error.response?.data || error);
// // //       throw handleError(error);
// // //     }
// // //   },
// // //   async checkOut() {
// // //     try {
// // //       const response = await apiClient.post(ENDPOINT.BREAK.CHECKOUT);
// // //       console.log('🌐 Check-Out API Response:', response.data);
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('❌ Check-Out API Error:', error.response?.data || error);
// // //       throw handleError(error);
// // //     }
// // //   },
// // //   async breakIn() {
// // //     try {
// // //       const response = await apiClient.post(ENDPOINT.BREAK.BREAKIN);
// // //       console.log('🌐 Break-In API Response:', response.data);
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('❌ Break-In API Error:', error.response?.data || error);
// // //       throw handleError(error);
// // //     }
// // //   },
// // //   async breakOut() {
// // //     try {
// // //       const response = await apiClient.post(ENDPOINT.BREAK.BREAKOUT);
// // //       console.log('🌐 Break-Out API Response:', response.data);
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('❌ Break-Out API Error:', error.response?.data || error);
// // //       throw handleError(error);
// // //     }
// // //   },
// // //   async getAttendance(empId, date) {
// // //     try {
// // //       const response = await apiClient.get(
// // //         `${ENDPOINT.AUTH.EMPBYID(empId)}/attendance?date=${date}`
// // //       );
// // //       console.log('🌐 Attendance API Response:', response.data);
// // //       return response.data;
// // //     } catch (error) {
// // //       console.error('❌ Attendance API Error:', error.response?.data || error);
// // //       throw handleError(error);
// // //     }
// // //   },
// // // };

// // // export default apiService;

// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import apiAuth from './authConfig';
// // import { ENDPOINT } from './endpoint';
// // import apiClient from './config';

// // const handleError = (error) => {
// //   if (error.response) {
// //     return {
// //       status: error.response.status,
// //       data: error.response.data,
// //       message: error.response.data.message || 'API request failed',
// //     };
// //   } else if (error.request) {
// //     return { message: 'No response from server. Please check your network.' };
// //   } else {
// //     return { message: error.message || 'Request setup error' };
// //   }
// // };

// // const apiService = {
// //   async logInUser(email, password) {
// //     try {
// //       const response = await apiAuth.post(ENDPOINT.AUTH.LOGIN, {
// //         systemUserEmail: email,
// //         systemUserPassword: password,
// //       });
// //       console.log('🌐 Login API Response:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error('❌ Login API Error:', error.response?.data || error);
// //       throw handleError(error);
// //     }
// //   },
// //   async getEmployeeById(empId) {
// //     try {
// //       const response = await apiClient.get(ENDPOINT.AUTH.EMPBYID(empId));
// //       return response.data;
// //     } catch (error) {
// //       console.error('❌ Get Employee API Error:', error.response?.data || error);
// //       throw handleError(error);
// //     }
// //   },
// //   async getEmployeeNotification(empId) {
// //     try {
// //       const response = await apiClient.get(ENDPOINT.AUTH.NOTIFICATION(empId));
// //       console.log('sdfsdfsdf', response);
// //       return response.data;
// //     } catch (error) {
// //       throw handleError(error);
// //     }
// //   },
// // };

// // export default apiService;
// // apiService.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import apiAuth from './authConfig';
// import { ENDPOINT } from './endpoint';
// import apiClient from './config';

// const handleError = (error) => {
//   if (error.response) {
//     return {
//       status: error.response.status,
//       data: error.response.data,
//       message: error.response.data.message || 'API request failed',
//     };
//   } else if (error.request) {
//     return { message: 'No response from server. Please check your network.' };
//   } else {
//     return { message: error.message || 'Request setup error' };
//   }
// };

// const apiService = {
//   async logInUser(email, password) {
//     try {
//       const response = await apiAuth.post(ENDPOINT.AUTH.LOGIN, {
//         systemUserEmail: email,
//         systemUserPassword: password,
//       });
//       console.log('🌐 Login API Response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Login API Error:', error.response?.data || error);
//       throw handleError(error);
//     }
//   },
//   async getEmployeeById(empId) {
//     try {
//       const response = await apiClient.get(ENDPOINT.AUTH.EMPBYID(empId));
//       return response.data;
//     } catch (error) {
//       console.error('❌ Get Employee API Error:', error.response?.data || error);
//       throw handleError(error);
//     }
//   },
//   async getEmployeeNotification(empId) {
//     try {
//       const response = await apiClient.get(ENDPOINT.AUTH.NOTIFICATION(empId));
//       console.log('sdfsdfsdf', response);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },
//   async checkIn() {
//     try {
//       const response = await apiClient.post(ENDPOINT.BREAK.CHECKIN);
//       console.log('🌐 Check-In API Response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Check-In API Error:', error.response?.data || error);
//       throw handleError(error);
//     }
//   },
//   async checkOut() {
//     try {
//       const response = await apiClient.post(ENDPOINT.BREAK.CHECKOUT);
//       console.log('🌐 Check-Out API Response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Check-Out API Error:', error.response?.data || error);
//       throw handleError(error);
//     }
//   },
//   async breakIn() {
//     try {
//       const response = await apiClient.post(ENDPOINT.BREAK.BREAKIN);
//       console.log('🌐 Break-In API Response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Break-In API Error:', error.response?.data || error);
//       throw handleError(error);
//     }
//   },
//   async breakOut() {
//     try {
//       const response = await apiClient.post(ENDPOINT.BREAK.BREAKOUT);
//       console.log('🌐 Break-Out API Response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Break-Out API Error:', error.response?.data || error);
//       throw handleError(error);
//     }
//   },
//   async getAttendance(empId, date) {
//     try {
//       const response = await apiClient.get(
//         `${ENDPOINT.AUTH.EMPBYID(empId)}/attendance?date=${date}`
//       );
//       console.log('🌐 Attendance API Response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Attendance API Error:', error.response?.data || error);
//       throw handleError(error);
//     }
//   },
// };

// export default apiService;
// apiService.js
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
      console.log('🌐 Login API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async getEmployeeById(empId) {
    try {
      const response = await apiClient.get(ENDPOINT.AUTH.EMPBYID(empId));
      return response.data;
    } catch (error) {
      console.error('❌ Get Employee API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async getEmployeeNotification(empId) {
    try {
      const response = await apiClient.get(ENDPOINT.AUTH.NOTIFICATION(empId));
      console.log('🌐 Notification API Response:', response.data); // Debug
      return response.data;
    } catch (error) {
      console.error('❌ Notification API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async checkIn() {
    try {
      const response = await apiClient.post(ENDPOINT.BREAK.CHECKIN);
      console.log('🌐 Check-In API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Check-In API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async checkOut() {
    try {
      const response = await apiClient.post(ENDPOINT.BREAK.CHECKOUT);
      console.log('🌐 Check-Out API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Check-Out API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async breakIn() {
    try {
      const response = await apiClient.post(ENDPOINT.BREAK.BREAKIN);
      console.log('🌐 Break-In API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Break-In API Error:', error.response?.data || error);
      throw handleError(error);
    }
  },
  async breakOut() {
    try {
      const response = await apiClient.post(ENDPOINT.BREAK.BREAKOUT);
      console.log('🌐 Break-Out API Response:', response.data);
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
      console.log('🌐 Attendance API Response:', response.data);
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
      console.error('❌ Attendance API Error:2222222222', error.response?.data || error);
      throw handleError(error);
    }
  },
};

export default apiService;