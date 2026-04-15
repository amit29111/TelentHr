import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, Image, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DashboardScreen from '../screens/DashboardScreen';
import CalendarScreen from '../screens/CalendarScreen';
// import MyTeamScreen from '../screens/MyTeamScreen';
// import WorkSpace from '../screens/WorkSpace';
import MyPayRollScreen from '../screens/MyPayRollScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import RaiseConcernScreen from '../screens/RaiseConcernScreen';
import ReportScreen from '../screens/ReportScreen';
import LearningDevelopmentScreen from '../screens/LearningDevelopmentScreen';
import TaskManagementScreen from '../screens/TaskManagementScreen';
import PerfomanceScreen from '../screens/PerfomanceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import JobDetialScreen from '../screens/JobDetialScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import FolderDetailScreen from '../screens/FolderDetailScreen';
import LeaveScreen from '../screens/LeaveScreen';
import ApplyLeaveScreen from '../screens/ApplyLeaveScreen';
import leaveRequestView from '../screens/leaveRequestView';
import JobDetais from '../screens/JobDetais';
// import CalendarScreen from '../screens/CalendarScreen';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slice';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Nested Stack Navigator for Dashboard and related screens
const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="DashboardScreen">
      <Stack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{ headerShown: false }}
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
        name="LeaveScreen"
        component={LeaveScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ApplyLeaveScreen"
        component={ApplyLeaveScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="leaveRequestView"
        component={leaveRequestView}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MyPayRollScreen"
        component={MyPayRollScreen}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="AttendanceScreen"
        component={AttendanceScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AnnouncementScreen"
        component={AnnouncementScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RaiseConcernScreen"
        component={RaiseConcernScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LearningDevelopmentScreen"
        component={LearningDevelopmentScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TaskManagementScreen"
        component={TaskManagementScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PerfomanceScreen"
        component={PerfomanceScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="JobDetais"
        component={JobDetais}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
};

const BottomTab = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      dispatch(logout()); // Clear Redux state
      console.log('User logged out');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const confirmLogout = () => {
   Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                try {
                  await AsyncStorage.removeItem('empId');
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'LoginScreen'}],
                  });
                } catch (e) {
                  console.error('❌ Error during logout:', e);
                  Alert.alert('Error', 'Failed to logout. Please try again.');
                }
              },
            },
          ],
          {cancelable: true},
        );
};

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Calendar') {
            return (
              <Image
                source={require('../assets/bottamIcon/calendar.png')}
                style={{
                  width: 29,
                  height: 26,
                  tintColor: focused ? '#541212' : '#666',
                }}
              />
            );
          } else if (route.name === 'Dashboard') {
            return (
              <Image
                source={require('../assets/bottamIcon/Frame.png')}
                style={{
                  width: 64,
                  height: 64,
                  marginBottom: 16,
                  backgroundColor: '#fff',
                  borderRadius: 35,
                  padding: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: focused ? 0.3 : 0.1,
                  shadowRadius: 4,
                }}
              />
            );
          } else if (route.name === 'WorkSpace') {
            return (
              <Image
                source={require('../assets/bottamIcon/Wallet.png')}
                style={{
                  width: 25,
                  height: 20,
                  tintColor: focused ? '#541212' : '#666',
                }}
              />
            );
          } else if (route.name === 'My Team') {
            return (
              <Image
                source={require('../assets/bottamIcon/pepole.png')}
                style={{
                  width: 28,
                  height: 20,
                  tintColor: focused ? '#541212' : '#666',
                }}
              />
            );
          } else if (route.name === 'Logout') {
            return (
              <Image
                source={require('../assets/bottamIcon/arrow.png')}
                style={{
                  width: 24,
                  height: 26,
                  tintColor: focused ? '#541212' : '#666',
                }}
              />
            );
          }

          // Fallback icons
          let iconName;
          if (route.name === 'My Team') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused }) => {
          if (route.name === 'Dashboard') {
            return null;
          }
          return (
            <Text style={[styles.navText, { color: focused ? '#8D777D' : '#666' }]}>
              {route.name === 'Logout' ? 'Logout' : route.name}
            </Text>
          );
        },
        tabBarStyle: styles.bottomNav,
        tabBarItemStyle: ({ focused }) => [
          styles.navItem,
          focused && styles.activeNav,
        ],
        tabBarActiveTintColor: '#8D777D',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      {/* <Tab.Screen name="WorkSpace" component={WorkSpace} /> */}
      <Tab.Screen name="Dashboard" component={AppStack} />
      {/* <Tab.Screen name="My Team" component={MyTeamScreen} /> */}
      <Tab.Screen
        name="Logout"
        component={View}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            confirmLogout();;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    alignItems: 'center',
  },
  activeNav: {
    backgroundColor: '#4A2C2A',
    borderRadius: 25,
    padding: 10,
  },
  navText: {
    fontSize: 10,
    marginTop: 5,
  },
});

export default BottomTab;


