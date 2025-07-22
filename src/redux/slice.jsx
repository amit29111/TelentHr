// // // // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // // // import { loginUserApi } from '../api/apiService';  // ✅ Adjust path if needed

// // // // // ✅ Thunk for login
// // // // export const loginUser = createAsyncThunk(
// // // //   'auth/loginUser',
// // // //   async ( email, password , { rejectWithValue }) => {
// // // //     try {
// // // //       const response = await loginUserApi(email, password);
// // // //       return response;
// // // //     } catch (error) {
// // // //       return rejectWithValue(error.message);
// // // //     }
// // // //   }
// // // // );
// // // // // console.log('asdasdasdas÷d', email, password)
// // // // const authSlice = createSlice({
// // // //   name: 'auth',
// // // //   initialState: {
// // // //     user: null,
// // // //     loading: false,
// // // //     error: null,
// // // //   },
  
// // // //   reducers: {},
// // // //   extraReducers: (builder) => {
// // // //     builder
// // // //       .addCase(loginUser.pending, (state) => {
// // // //         console.log('pending')
// // // //         state.loading = true;
// // // //         state.error = null;
// // // //       })
// // // //       .addCase(loginUser.fulfilled, (state, action) => {
// // // //         console.log('fulfilled')
// // // //         state.loading = false;
// // // //         state.user = action.payload;
// // // //       })
// // // //       .addCase(loginUser.rejected, (state, action) => {
// // // //         console.log('rejected')
// // // //         state.loading = false;
// // // //         state.error = action.payload;
// // // //       });
// // // //   },
// // // // });

// // // // export default authSlice.reducer;

// // // // src/redux/slice.js
// // // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // // import { loginUserApi } from '../api/apiService';

// // // // ✅ Redux AsyncThunk
// // // export const loginUser = createAsyncThunk(
// // //   'auth/loginUser',
// // //   async ({ email, password }, { rejectWithValue }) => {
// // //     console.log('👉 Thunk Start: loginUser with', email, password);

// // //     try {
// // //       const response = await loginUserApi(email, password);
// // //       console.log('👉 Thunk API Success:', response);
// // //       return response;
// // //     } catch (error) {
// // //       console.log('👉 Thunk API Error:', error);
// // //       return rejectWithValue(error.message);
// // //     }
// // //   }
// // // );

// // // // ✅ Auth Slice
// // // const authSlice = createSlice({
// // //   name: 'auth',
// // //   initialState: {
// // //     user: null,
// // //     loading: false,
// // //     error: null,
// // //   },
// // //   reducers: {},
// // //   extraReducers: (builder) => {
// // //     builder
// // //       .addCase(loginUser.pending, (state) => {
// // //         console.log('🕒 Reducer: loginUser.pending');
// // //         state.loading = true;
// // //         state.error = null;
// // //       })
// // //       .addCase(loginUser.fulfilled, (state, action) => {
// // //         console.log('✅ Reducer: loginUser.fulfilled:', action.payload);
// // //         state.loading = false;
// // //         state.user = action.payload;
// // //       })
// // //       .addCase(loginUser.rejected, (state, action) => {
// // //         console.log('❌ Reducer: loginUser.rejected:', action.payload);
// // //         state.loading = false;
// // //         state.error = action.payload;
// // //       });
// // //   },
// // // });

// // // export default authSlice.reducer;


// // // // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // // // import { loginUserApi } from '../api/apiService';  // ✅ Correct import

// // // // export const loginUser = createAsyncThunk(
// // // //   'auth/loginUser',
// // // //   async ({ email, password }, { rejectWithValue }) => {
// // // //     try {
// // // //       const response = await loginUserApi(email, password);
// // // //       return response;
// // // //     } catch (error) {
// // // //       return rejectWithValue(error.message);
// // // //     }
// // // //   }
// // // // );

// // // // const authSlice = createSlice({
// // // //   name: 'auth',
// // // //   initialState: {
// // // //     user: null,
// // // //     loading: false,
// // // //     error: null,
// // // //   },
// // // //   reducers: {},
// // // //   extraReducers: (builder) => {
// // // //     builder
// // // //       .addCase(loginUser.pending, (state) => {
// // // //         state.loading = true;
// // // //         state.error = null;
// // // //       })
// // // //       .addCase(loginUser.fulfilled, (state, action) => {
// // // //         state.loading = false;
// // // //         state.user = action.payload;
// // // //       })
// // // //       .addCase(loginUser.rejected, (state, action) => {
// // // //         state.loading = false;
// // // //         state.error = action.payload;
// // // //       });
// // // //   },
// // // // });

// // // // export default authSlice.reducer;


// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import apiService from '../api/apiService';
// // export const userLogin = createAsyncThunk(
// //     'auth/login',
// //     async ({ email, password }, { rejectWithValue }) => {
// //       try {
// //         const response = await apiService.logInUser(email, password);
// //         const { 
// //           token,
// //           permissions,
// //           data: { categoryId, _id: systemUserId, linkSystemUser },
// //         } = response;
  
// //         const orgId = linkSystemUser?.[0]?.organizationId || null;
// //         const organizationName = linkSystemUser?.[0]?.organizationName || null;
// //         const empId = linkSystemUser?.[0]?.employeeId || null;
  
// //         if (!orgId) {
// //           throw new Error('Organization UUID not found in API response');
// //         }
  
// //         const expiresAt =
// //           response.expiresAt || Date.now() + (response.expiresIn ? response.expiresIn * 1000 : 24 * 60 * 60 * 1000);
  
// //         await AsyncStorage.setItem('authToken', token);
// //         await AsyncStorage.setItem('tokenExpiresAt', expiresAt.toString());
// //         await AsyncStorage.setItem('permissionList', JSON.stringify(permissions));
// //         await AsyncStorage.setItem('categoryId', categoryId);
// //         await AsyncStorage.setItem('orgId', orgId);
// //         await AsyncStorage.setItem('organizationName', organizationName);
// //         await AsyncStorage.setItem('systemUserId', systemUserId);
// //         await AsyncStorage.setItem('empId', empId);
  
// //         return { ...response, expiresAt };
// //       } catch (error) {
// //         return rejectWithValue(error.message || 'Login failed');
// //       }
// //     }
// //   );
//     import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import apiService from '../api/apiService';

// export const userLogin = createAsyncThunk(
//   'auth/login',
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await apiService.logInUser(email, password);
//       const {
//         token,
//         permissions,
//         data: { categoryId, _id: systemUserId, linkSystemUser },
//       } = response;

//       // Validate response data
//       if (!token || !categoryId || !systemUserId) {
//         throw new Error('Invalid API response: Missing required fields');
//       }

//       const orgId = linkSystemUser?.[0]?.organizationId || null;
//       const organizationName = linkSystemUser?.[0]?.organizationName || null;
//       const empId = linkSystemUser?.[0]?.employeeId || null;

//       if (!orgId) {
//         throw new Error('Organization UUID not found in API response');
//       }

//       const expiresAt =
//         response.expiresAt ||
//         Date.now() + (response.expiresIn ? response.expiresIn * 1000 : 24 * 60 * 60 * 1000);

//       // Store sensitive data securely (consider using a secure storage library in production)
//       await AsyncStorage.multiSet([
//         ['authToken', token],
//         ['tokenExpiresAt', expiresAt.toString()],
//         ['permissionList', JSON.stringify(permissions)],
//         ['categoryId', categoryId],
//         ['orgId', orgId],
//         ['organizationName', organizationName || ''],
//         ['systemUserId', systemUserId],
//         ['empId', empId || ''],
//       ]);
//       const check = AsyncStorage.getItem('empId')

//       return { ...response, expiresAt };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Login failed');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: null,
//     isLoading: false,
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.error = null;
//       AsyncStorage.clear();
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(userLogin.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(userLogin.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.data;
//         state.token = action.payload.token;
//       })
//       .addCase(userLogin.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;




// // // // // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // // // // import { loginUserApi } from '../api/apiService';  // ✅ Adjust path if needed

// // // // // // ✅ Thunk for login
// // // // // export const loginUser = createAsyncThunk(
// // // // //   'auth/loginUser',
// // // // //   async ( email, password , { rejectWithValue }) => {
// // // // //     try {
// // // // //       const response = await loginUserApi(email, password);
// // // // //       return response;
// // // // //     } catch (error) {
// // // // //       return rejectWithValue(error.message);
// // // // //     }
// // // // //   }
// // // // // );
// // // // // // console.log('asdasdasdas÷d', email, password)
// // // // // const authSlice = createSlice({
// // // // //   name: 'auth',
// // // // //   initialState: {
// // // // //     user: null,
// // // // //     loading: false,
// // // // //     error: null,
// // // // //   },
  
// // // // //   reducers: {},
// // // // //   extraReducers: (builder) => {
// // // // //     builder
// // // // //       .addCase(loginUser.pending, (state) => {
// // // // //         console.log('pending')
// // // // //         state.loading = true;
// // // // //         state.error = null;
// // // // //       })
// // // // //       .addCase(loginUser.fulfilled, (state, action) => {
// // // // //         console.log('fulfilled')
// // // // //         state.loading = false;
// // // // //         state.user = action.payload;
// // // // //       })
// // // // //       .addCase(loginUser.rejected, (state, action) => {
// // // // //         console.log('rejected')
// // // // //         state.loading = false;
// // // // //         state.error = action.payload;
// // // // //       });
// // // // //   },
// // // // // });

// // // // // export default authSlice.reducer;

// // // // // src/redux/slice.js
// // // // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // // // import { loginUserApi } from '../api/apiService';

// // // // // ✅ Redux AsyncThunk
// // // // export const loginUser = createAsyncThunk(
// // // //   'auth/loginUser',
// // // //   async ({ email, password }, { rejectWithValue }) => {
// // // //     console.log('👉 Thunk Start: loginUser with', email, password);

// // // //     try {
// // // //       const response = await loginUserApi(email, password);
// // // //       console.log('👉 Thunk API Success:', response);
// // // //       return response;
// // // //     } catch (error) {
// // // //       console.log('👉 Thunk API Error:', error);
// // // //       return rejectWithValue(error.message);
// // // //     }
// // // //   }
// // // // );

// // // // // ✅ Auth Slice
// // // // const authSlice = createSlice({
// // // //   name: 'auth',
// // // //   initialState: {
// // // //     user: null,
// // // //     loading: false,
// // // //     error: null,
// // // //   },
// // // //   reducers: {},
// // // //   extraReducers: (builder) => {
// // // //     builder
// // // //       .addCase(loginUser.pending, (state) => {
// // // //         console.log('🕒 Reducer: loginUser.pending');
// // // //         state.loading = true;
// // // //         state.error = null;
// // // //       })
// // // //       .addCase(loginUser.fulfilled, (state, action) => {
// // // //         console.log('✅ Reducer: loginUser.fulfilled:', action.payload);
// // // //         state.loading = false;
// // // //         state.user = action.payload;
// // // //       })
// // // //       .addCase(loginUser.rejected, (state, action) => {
// // // //         console.log('❌ Reducer: loginUser.rejected:', action.payload);
// // // //         state.loading = false;
// // // //         state.error = action.payload;
// // // //       });
// // // //   },
// // // // });

// // // // export default authSlice.reducer;


// // // // // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // // // // import { loginUserApi } from '../api/apiService';  // ✅ Correct import

// // // // // export const loginUser = createAsyncThunk(
// // // // //   'auth/loginUser',
// // // // //   async ({ email, password }, { rejectWithValue }) => {
// // // // //     try {
// // // // //       const response = await loginUserApi(email, password);
// // // // //       return response;
// // // // //     } catch (error) {
// // // // //       return rejectWithValue(error.message);
// // // // //     }
// // // // //   }
// // // // // );

// // // // // const authSlice = createSlice({
// // // // //   name: 'auth',
// // // // //   initialState: {
// // // // //     user: null,
// // // // //     loading: false,
// // // // //     error: null,
// // // // //   },
// // // // //   reducers: {},
// // // // //   extraReducers: (builder) => {
// // // // //     builder
// // // // //       .addCase(loginUser.pending, (state) => {
// // // // //         state.loading = true;
// // // // //         state.error = null;
// // // // //       })
// // // // //       .addCase(loginUser.fulfilled, (state, action) => {
// // // // //         state.loading = false;
// // // // //         state.user = action.payload;
// // // // //       })
// // // // //       .addCase(loginUser.rejected, (state, action) => {
// // // // //         state.loading = false;
// // // // //         state.error = action.payload;
// // // // //       });
// // // // //   },
// // // // // });

// // // // // export default authSlice.reducer;


// // // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import apiService from '../api/apiService';
// // // export const userLogin = createAsyncThunk(
// // //     'auth/login',
// // //     async ({ email, password }, { rejectWithValue }) => {
// // //       try {
// // //         const response = await apiService.logInUser(email, password);
// // //         const { 
// // //           token,
// // //           permissions,
// // //           data: { categoryId, _id: systemUserId, linkSystemUser },
// // //         } = response;
  
// // //         const orgId = linkSystemUser?.[0]?.organizationId || null;
// // //         const organizationName = linkSystemUser?.[0]?.organizationName || null;
// // //         const empId = linkSystemUser?.[0]?.employeeId || null;
  
// // //         if (!orgId) {
// // //           throw new Error('Organization UUID not found in API response');
// // //         }
  
// // //         const expiresAt =
// // //           response.expiresAt || Date.now() + (response.expiresIn ? response.expiresIn * 1000 : 24 * 60 * 60 * 1000);
  
// // //         await AsyncStorage.setItem('authToken', token);
// // //         await AsyncStorage.setItem('tokenExpiresAt', expiresAt.toString());
// // //         await AsyncStorage.setItem('permissionList', JSON.stringify(permissions));
// // //         await AsyncStorage.setItem('categoryId', categoryId);
// // //         await AsyncStorage.setItem('orgId', orgId);
// // //         await AsyncStorage.setItem('organizationName', organizationName);
// // //         await AsyncStorage.setItem('systemUserId', systemUserId);
// // //         await AsyncStorage.setItem('empId', empId);
  
// // //         return { ...response, expiresAt };
// // //       } catch (error) {
// // //         return rejectWithValue(error.message || 'Login failed');
// // //       }
// // //     }
// // //   );
// //     import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import apiService from '../api/apiService';

// // export const userLogin = createAsyncThunk(
// //   'auth/login',
// //   async ({ email, password }, { rejectWithValue }) => {
// //     try {
// //       const response = await apiService.logInUser(email, password);
// //       const {
// //         token,
// //         permissions,
// //         data: { categoryId, _id: systemUserId, linkSystemUser },
// //       } = response;

// //       // Validate response data
// //       if (!token || !categoryId || !systemUserId) {
// //         throw new Error('Invalid API response: Missing required fields');
// //       }

// //       const orgId = linkSystemUser?.[0]?.organizationId || null;
// //       const organizationName = linkSystemUser?.[0]?.organizationName || null;
// //       const empId = linkSystemUser?.[0]?.employeeId || null;

// //       if (!orgId) {
// //         throw new Error('Organization UUID not found in API response');
// //       }

// //       const expiresAt =
// //         response.expiresAt ||
// //         Date.now() + (response.expiresIn ? response.expiresIn * 1000 : 24 * 60 * 60 * 1000);

// //       // Store sensitive data securely (consider using a secure storage library in production)
// //       await AsyncStorage.multiSet([
// //         ['authToken', token],
// //         ['tokenExpiresAt', expiresAt.toString()],
// //         ['permissionList', JSON.stringify(permissions)],
// //         ['categoryId', categoryId],
// //         ['orgId', orgId],
// //         ['organizationName', organizationName || ''],
// //         ['systemUserId', systemUserId],
// //         ['empId', empId || ''],
// //       ]);
// //       const check = AsyncStorage.getItem('empId')

// //       return { ...response, expiresAt };
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Login failed');
// //     }
// //   }
// // );

// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState: {
// //     user: null,
// //     token: null,
// //     isLoading: false,
// //     error: null,
// //   },
// //   reducers: {
// //     logout: (state) => {
// //       state.user = null;
// //       state.token = null;
// //       state.error = null;
// //       AsyncStorage.clear();
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(userLogin.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(userLogin.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.user = action.payload.data;
// //         state.token = action.payload.token;
// //       })
// //       .addCase(userLogin.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       });
// //   },
// // });

// // export const { logout } = authSlice.actions;
// // export default authSlice.reducer;




// // // appSlice.js
// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import apiService from '../api/apiService';

// // export const userLogin = createAsyncThunk(
// //   'app/login',
// //   async ({ email, password }, { rejectWithValue }) => {
// //     try {
// //       const response = await apiService.logInUser(email, password);
// //       const {
// //         token,
// //         permissions,
// //         data: { categoryId, _id: systemUserId, linkSystemUser },
// //       } = response;

// //       if (!token || !categoryId || !systemUserId) {
// //         throw new Error('Invalid API response: Missing required fields');
// //       }

// //       const orgId = linkSystemUser?.[0]?.organizationId || null;
// //       const organizationName = linkSystemUser?.[0]?.organizationName || null;
// //       const empId = linkSystemUser?.[0]?.employeeId || null;

// //       if (!orgId) {
// //         throw new Error('Organization UUID not found in API response');
// //       }

// //       const expiresAt =
// //         response.expiresAt ||
// //         Date.now() + (response.expiresIn ? response.expiresIn * 1000 : 24 * 60 * 60 * 1000);

// //       await AsyncStorage.multiSet([
// //         ['authToken', token],
// //         ['tokenExpiresAt', expiresAt.toString()],
// //         ['permissionList', JSON.stringify(permissions)],
// //         ['categoryId', categoryId],
// //         ['orgId', orgId],
// //         ['organizationName', organizationName || ''],
// //         ['systemUserId', systemUserId],
// //         ['empId', empId || ''],
// //       ]);

// //       return { ...response, expiresAt };
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Login failed');
// //     }
// //   }
// // );

// // export const fetchEmployee = createAsyncThunk(
// //   'app/fetchEmployee',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const empId = await AsyncStorage.getItem('empId');
// //       if (!empId) {
// //         throw new Error('Employee ID not found');
// //       }
// //       const response = await apiService.getEmployeeById(empId);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Failed to fetch employee');
// //     }
// //   }
// // );

// // export const checkIn = createAsyncThunk(
// //   'app/checkIn',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await apiService.checkIn();
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Check-in failed');
// //     }
// //   }
// // );

// // export const checkOut = createAsyncThunk(
// //   'app/checkOut',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await apiService.checkOut();
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Check-out failed');
// //     }
// //   }
// // );

// // export const breakIn = createAsyncThunk(
// //   'app/breakIn',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await apiService.breakIn();
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Break-in failed');
// //     }
// //   }
// // );

// // export const breakOut = createAsyncThunk(
// //   'app/breakOut',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await apiService.breakOut();
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Break-out failed');
// //     }
// //   }
// // );

// // export const fetchAttendance = createAsyncThunk(
// //   'app/fetchAttendance',
// //   async (date, { rejectWithValue }) => {
// //     try {
// //       const empId = await AsyncStorage.getItem('empId');
// //       if (!empId) {
// //         throw new Error('Employee ID not found');
// //       }
// //       const response = await apiService.getAttendance(empId, date);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Failed to fetch attendance');
// //     }
// //   }
// // );

// // export const getEmployeeNotification = createAsyncThunk(
// //   'app/getEmployeeNotification',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const empId = await AsyncStorage.getItem('empId');
// //       if (!empId) {
// //         throw new Error('Employee ID not found');
// //       }
// //       const response = await apiService.getEmployeeNotification(empId);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Failed to fetch notifications');
// //     }
// //   }
// // );

// // const appSlice = createSlice({
// //   name: 'app',
// //   initialState: {
// //     user: null,
// //     token: null,
// //     employee: null,
// //     attendance: null,
// //     trackStatus: null,
// //     notifications: null,
// //     isLoading: false,
// //     error: null,
// //   },
// //   reducers: {
// //     logout: (state) => {
// //       state.user = null;
// //       state.token = null;
// //       state.employee = null;
// //       state.attendance = null;
// //       state.trackStatus = null;
// //       state.notifications = null;
// //       state.error = null;
// //       AsyncStorage.clear();
// //     },
// //     resetError: (state) => {
// //       state.error = null;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       // Login
// //       .addCase(userLogin.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(userLogin.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.user = action.payload.data;
// //         state.token = action.payload.token;
// //       })
// //       .addCase(userLogin.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       })
// //       // Fetch Employee
// //       .addCase(fetchEmployee.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchEmployee.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.employee = action.payload;
// //       })
// //       .addCase(fetchEmployee.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       })
// //       // Check In
// //       .addCase(checkIn.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(checkIn.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.attendance = action.payload;
// //         state.trackStatus = action.payload.trackStatus;
// //       })
// //       .addCase(checkIn.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       })
// //       // Check Out
// //       .addCase(checkOut.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(checkOut.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.attendance = action.payload;
// //         state.trackStatus = action.payload.trackStatus;
// //       })
// //       .addCase(checkOut.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       })
// //       // Break In
// //       .addCase(breakIn.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(breakIn.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.attendance = action.payload;
// //         state.trackStatus = action.payload.trackStatus;
// //       })
// //       .addCase(breakIn.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       })
// //       // Break Out
// //       .addCase(breakOut.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(breakOut.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.attendance = action.payload;
// //         state.trackStatus = action.payload.trackStatus;
// //       })
// //       .addCase(breakOut.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       })
// //       // Fetch Attendance
// //       .addCase(fetchAttendance.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchAttendance.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.attendance = action.payload;
// //         state.trackStatus = action.payload.trackStatus;
// //       })
// //       .addCase(fetchAttendance.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       })
// //       // Fetch Notifications
// //       .addCase(getEmployeeNotification.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(getEmployeeNotification.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.notifications = action.payload;
// //       })
// //       .addCase(getEmployeeNotification.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       });
// //   },
// // });

// // export const { logout, resetError } = appSlice.actions;
// // export default appSlice.reducer;


// appSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../api/apiService';

export const userLogin = createAsyncThunk(
  'app/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiService.logInUser(email, password);
      const {
        token,
        permissions,
        data: { categoryId, _id: systemUserId, linkSystemUser },
      } = response;

      if (!token || !categoryId || !systemUserId) {
        throw new Error('Invalid API response: Missing required fields');
      }

      const orgId = linkSystemUser?.[0]?.organizationId || null;
      const organizationName = linkSystemUser?.[0]?.organizationName || null;
      const empId = linkSystemUser?.[0]?.employeeId || null;

      if (!orgId) {
        throw new Error('Organization UUID not found in API response');
      }

      const expiresAt =
        response.expiresAt ||
        Date.now() + (response.expiresIn ? response.expiresIn * 1000 : 24 * 60 * 60 * 1000);

      await AsyncStorage.multiSet([
        ['authToken', token],
        ['tokenExpiresAt', expiresAt.toString()],
        ['permissionList', JSON.stringify(permissions)],
        ['categoryId', categoryId],
        ['orgId', orgId],
        ['organizationName', organizationName || ''],
        ['systemUserId', systemUserId],
        ['empId', empId || ''],
      ]);

      return { ...response, expiresAt };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const fetchEmployee = createAsyncThunk(
  'app/fetchEmployee',
  async (_, { rejectWithValue }) => {
    try {
      const empId = await AsyncStorage.getItem('empId');
      if (!empId) {
        throw new Error('Employee ID not found');
      }
      const response = await apiService.getEmployeeById(empId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch employee');
    }
  }
);

export const checkIn = createAsyncThunk(
  'app/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.checkIn();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Check-in failed');
    }
  }
);

export const checkOut = createAsyncThunk(
  'app/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.checkOut();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Check-out failed');
    }
  }
);

export const breakIn = createAsyncThunk(
  'app/breakIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.breakIn();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Break-in failed');
    }
  }
);

export const breakOut = createAsyncThunk(
  'app/breakOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.breakOut();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Break-out failed');
    }
  }
);

export const fetchAttendance = createAsyncThunk(
  'app/fetchAttendance',
  async (date, { rejectWithValue }) => {
    try {
      const empId = await AsyncStorage.getItem('empId');
      if (!empId) {
        throw new Error('Employee ID not found');
      }
      const response = await apiService.getAttendance(empId, date);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch attendance');
    }
  }
);

export const getEmployeeNotification = createAsyncThunk(
  'app/getEmployeeNotification',
  async (_, { rejectWithValue }) => {
    try {
      const empId = await AsyncStorage.getItem('empId');
      if (!empId) {
        throw new Error('Employee ID not found');
      }
      const response = await apiService.getEmployeeNotification(empId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

const appSlice = createSlice({
  name: 'app',
  initialState: {
    user: null,
    token: null,
    employee: null,
    attendance: null,
    trackStatus: null,
    notifications: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.employee = null;
      state.attendance = null;
      state.trackStatus = null;
      state.notifications = null;
      state.error = null;
      AsyncStorage.clear();
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Employee
      .addCase(fetchEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Check In
      .addCase(checkIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload;
        state.trackStatus = action.payload.trackStatus;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload;
        state.trackStatus = action.payload.trackStatus;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Break In
      .addCase(breakIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(breakIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload;
        state.trackStatus = action.payload.trackStatus;
      })
      .addCase(breakIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Break Out
      .addCase(breakOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(breakOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload;
        state.trackStatus = action.payload.trackStatus;
      })
      .addCase(breakOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload;
        state.trackStatus = action.payload.trackStatus;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Notifications
      .addCase(getEmployeeNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEmployeeNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(getEmployeeNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetError } = appSlice.actions;
export default appSlice.reducer;