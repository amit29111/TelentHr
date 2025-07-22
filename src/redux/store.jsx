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
//   },

// });




// // // // src/redux/store.js
// // // // import { configureStore } from '@reduxjs/toolkit';
// // // // import authReducer from './slice'; // Adjust path as needed

// // // // export const store = configureStore({
// // // //   reducer: {
// // // //     auth: authReducer,
// // // //   },
// // // // });

// // // import { configureStore } from '@reduxjs/toolkit';
// // // import authReducer from './slice';  // ✅ Adjust path if needed

// // // export const store = configureStore({
// // //   reducer: {
// // //     auth: authReducer,
// // //   },
// // //   // ✅ DO NOT manually override middleware unless needed
// // // });


// // import { configureStore } from '@reduxjs/toolkit';
// // import authReducer from './slice';
// // import employeeReducer from './employeeSlice';

// // export const store = configureStore({
// //   reducer: {
// //     auth: authReducer,
// //     employee: employeeReducer,
// //   },

// // });


// // // store.js
// // import { configureStore } from '@reduxjs/toolkit';
// // import appReducer from '../redux/slice';

// // export const store = configureStore({
// //   reducer: {
// //     app: appReducer,
// //   },
// // });

// store.js
import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../redux/slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});