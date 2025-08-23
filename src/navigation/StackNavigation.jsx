import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomTab from './BottomTab';
import SplashScreen from '../screens/SplashScreen';
import LeaveRequestView from '../screens/leaveRequestView';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
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
        name="MainApp"
        component={BottomTab}
        options={{ headerShown: false }}
      />
       {/* <Stack.Screen
        name="leaveRequestView"
        component={LeaveRequestView}
        options={{ headerShown: false }}
      /> */}

      

      
    </Stack.Navigator>
  );
};

export default StackNavigation;