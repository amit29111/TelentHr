

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomTab from './BottomTab';
import ProfileScreen from '../screens/ProfileScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import JobDetialScreen from '../screens/JobDetialScreen'
import DocumentsScreen from '../screens/DocumentsScreen';
import FolderDetailScreen from '../screens/FolderDetailScreen';
import LeaveScreen from '../screens/LeaveScreen';
import ApplyLeaveScreen from '../screens/ApplyLeaveScreen';
import SplashScreen from '../screens/SplashScreen';
import AttendanceScreen from '../screens/AttendanceScreen'

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator>

      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={BottomTab}
        options={{ headerShown: false }}
      />

      <Stack.Screen
      name="AttendanceScreen"
      component={AttendanceScreen}
      options={{ headerShown: false }}
      // options={{ title: 'Attendance' }}
      
    />

<Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="PersonalInfoScreen"
        component={PersonalInfoScreen}
        options={{ headerShown: false }}
      />


<Stack.Screen
        name="JobDetialScreen"
        component={JobDetialScreen}
        options={{ headerShown: false }}
      />
 
 <Stack.Screen
        name="DocumentsScreen"
        component={DocumentsScreen}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="FolderDetailScreen"
        component={FolderDetailScreen}
        options={{ headerShown: false }}
      />
    <Stack.Screen 
      name="LeaveScreen" component={LeaveScreen} 
      options={{ headerShown: false }}
      />

        <Stack.Screen name="ApplyLeaveScreen" component={ApplyLeaveScreen} />




    </Stack.Navigator>
  );
};

export default StackNavigation;





// // import React from 'react';
// // import { createStackNavigator } from '@react-navigation/stack';
// // import WelcomeScreen from '../screens/WelcomeScreen';
// // import LoginScreen from '../screens/LoginScreen';
// // import BottomTab from './BottomTab';
// // import ProfileScreen from '../screens/ProfileScreen';

// // const Stack = createStackNavigator();

// // const StackNavigation = () => {
// //   return (
// //     <Stack.Navigator>
// //       <Stack.Screen
// //         name="Welcome"
// //         component={WelcomeScreen}
// //         options={{ headerShown: false }}
// //       />
// //       <Stack.Screen
// //         name="LoginScreen"
// //         component={LoginScreen}
// //         options={{ headerShown: false }}
// //       />
// //       <Stack.Screen
// //         name="Dashboard"
// //         component={BottomTab}
// //         options={{ headerShown: false }}
// //       />
// //       <Stack.Screen
// //         name="Profile"
// //         component={ProfileScreen}
// //         options={{ headerShown: false }}
// //       />
// //     </Stack.Navigator>
// //   );
// // };

// // export default StackNavigation;

// import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';
// import WelcomeScreen from '../screens/WelcomeScreen';
// import LoginScreen from '../screens/LoginScreen';
// import BottomTab from './BottomTab';
// import ProfileScreen from '../screens/ProfileScreen';
// import PersonalInfoScreen from '../screens/PersonalInfoScreen';
// import JobDetialScreen from '../screens/JobDetialScreen';
// import DocumentScreen from '../screens/DocumentScreen';
// import FolderDetailScreen from '../screens/FolderDetailScreen';

// const Stack = createStackNavigator();

// const StackNavigation = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Welcome"
//         component={WelcomeScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="LoginScreen"
//         component={LoginScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="Main"
//         component={BottomTab}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="ProfileScreen"
//         component={ProfileScreen}
//         options={{
//           headerShown: false,
//           // Ensure the tab bar remains visible by not overriding the tabBarStyle
//         }}
//       />
//       <Stack.Screen
//         name="PersonalInfoScreen"
//         component={PersonalInfoScreen}
//         options={{
//           headerShown: false,
//         }}
//       />
//        <Stack.Screen
//         name="JobDetialScreen"
//         component={JobDetialScreen}
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Stack.Screen
//         name="DocumentScreen"
//         component={DocumentScreen}
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Stack.Screen
//        name="FolderDetailScreen"
//         component={FolderDetailScreen}
//         options={{
//           headerShown: false,
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default StackNavigation;