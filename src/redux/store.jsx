


// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slice';
// import employeeReducer from './employeeSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     employee: employeeReducer,
//   },

// });




// // // src/redux/store.js
// // // import { configureStore } from '@reduxjs/toolkit';
// // // import authReducer from './slice'; // Adjust path as needed

// // // export const store = configureStore({
// // //   reducer: {
// // //     auth: authReducer,
// // //   },
// // // });

// // import { configureStore } from '@reduxjs/toolkit';
// // import authReducer from './slice';  // ✅ Adjust path if needed

// // export const store = configureStore({
// //   reducer: {
// //     auth: authReducer,
// //   },
// //   // ✅ DO NOT manually override middleware unless needed
// // });


// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slice';
// import employeeReducer from './employeeSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     employee: employeeReducer,
 
//     org:authReducer.organizationReducer
//   },

// });
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slice'; // Importing the consolidated appSlice
import {employeeReducer} from './employeeSlice'; // Assuming this exists in your project

export const store = configureStore({
  reducer: {
    auth: appReducer, // Use appReducer for all app-related state, including organization data
    employee: employeeReducer, // Employee reducer remains unchanged
  },
});

// // store.js
// import { configureStore } from '@reduxjs/toolkit';
// import appReducer from '../redux/slice';

// export const store = configureStore({
//   reducer: {
//     app: appReducer,
//   },
// });

// store.js
// import { configureStore } from '@reduxjs/toolkit';
// import appReducer from '../redux/slice';

// export const store = configureStore({
//   reducer: {
//     app: appReducer,
//   },
// });