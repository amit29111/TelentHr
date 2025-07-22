// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { StyleSheet, Text, Image,View } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import DashboardScreen from '../screens/DashboardScreen';
// import CalendarScreen from '../screens/CalendarScreen';
// import MyTeamScreen from '../screens/MyTeamScreen';
// import WorkSpace from '../screens/WorkSpace';
// import { useDispatch } from 'react-redux';
// import { logout } from '../redux/slice';

// const Tab = createBottomTabNavigator();

// const BottomTab = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('authToken');
//       dispatch(logout()); // Clear Redux state
//       console.log('User logged out');
//       navigation.navigate('LoginScreen');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <Tab.Navigator
//       initialRouteName="DashboardScreen" // Set DashboardScreen as default
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           if (route.name === 'Calendar') {
//             return (
//               <Image
//                 source={require('../assets/bottamIcon/calendar.png')}
//                 style={{
//                   width: 28,
//                   height: 20,
//                   tintColor: focused ? '#8D777D' : '#666',
//                 }}
//               />
//             );
//           } else if (route.name === 'DashboardScreen') {
//             return (
//               <Image
//                 source={require('../assets/bottamIcon/Frame.png')}
//                 style={{
//                   width: 64,
//                   height: 64,
//                   marginBottom: 16,
//                   backgroundColor: '#fff',
//                   borderRadius: 35,
//                   padding: 24,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   elevation: 8,
//                   shadowColor: '#000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: focused ? 0.3 : 0.1,
//                   shadowRadius: 4,
//                 }}
//               />
//             );
//           } else if (route.name === 'WorkSpace') {
//             return (
//               <Image
//                 source={require('../assets/bottamIcon/Wallet.png')}
//                 style={{
//                   width: 28,
//                   height: 20,
//                   tintColor: focused ? '#8D777D' : '#666',
//                 }}
//               />
//             );
//           } else if (route.name === 'My Team') {
//             return (
//               <Image
//                 source={require('../assets/bottamIcon/pepole.png')}
//                 style={{
//                   width: 28,
//                   height: 20,
//                   tintColor: focused ? '#8D777D' : '#666',
//                 }}
//               />
//             );
//           } else if (route.name === 'Logout') {
//             return (
//               <Image
//                 source={require('../assets/bottamIcon/arrow.png')}
//                 style={{
//                   width: 24,
//                   height: 26,
//                   tintColor: focused ? '#8D777D' : '#666',
//                 }}
//               />
//             );
//           }

//           // Fallback icons
//           let iconName;
//           if (route.name === 'MyTeamScreen') {
//             iconName = focused ? 'people' : 'people-outline';
//           } else if (route.name === 'Logout') {
//             iconName = focused ? 'log-out' : 'log-out-outline';
//           }
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarLabel: ({ focused }) => {
//           return (
//             <Text style={[styles.navText, { color: focused ? '#8D777D' : '#666' }]}>
//               {route.name === 'Logout' ? 'Logout' : route.name}
//             </Text>
//           );
//         },
//         tabBarStyle: styles.bottomNav,
//         tabBarItemStyle: ({ focused }) => [
//           styles.navItem,
//           focused && styles.activeNav,
//         ],
//         tabBarActiveTintColor: '#8D777D',
//         tabBarInactiveTintColor: '#666',
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Calendar" component={CalendarScreen} />
//       <Tab.Screen name="WorkSpace" component={WorkSpace} />
//       <Tab.Screen name="DashboardScreen" component={DashboardScreen} />
//       <Tab.Screen name="My Team" component={MyTeamScreen} />
//       <Tab.Screen
//         name="Logout"
//         component={View}
//         listeners={{
//           tabPress: (e) => {
//             e.preventDefault();
//             handleLogout();
//           },
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   bottomNav: {
//     width: '100%',
//     height: 90,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 12,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E0E0E0',
//   },
//   navItem: {
//     alignItems: 'center',
//   },
//   activeNav: {
//     backgroundColor: '#4A2C2A',
//     borderRadius: 25,
//     padding: 10,
//   },
//   navText: {
//     fontSize: 10,
//     marginTop: 5,
//   },
// });

// export default BottomTab;


import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DashboardScreen from '../screens/DashboardScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import WorkSpace from '../screens/WorkSpace';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slice';

const Tab = createBottomTabNavigator();

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

  return (
    <Tab.Navigator
      initialRouteName="DashboardScreen" // Set DashboardScreen as default
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Calendar') {
            return (
              <Image
                source={require('../assets/bottamIcon/calendar.png')}
                style={{
                  width: 29,
                  height: 26,
                  tintColor: focused ? '#5C3C45' : '#666',
                }}
              />
            );
          } else if (route.name === 'DashboardScreen') {
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
                  tintColor: focused ? '#5C3C45' : '#666',
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
                  tintColor: focused ? '#5C3C45' : '#666',
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
                  tintColor: focused ? '#8D777D' : '#666',
                }}
              />
            );
          }

          // Fallback icons
          let iconName;
          if (route.name === 'MyTeamScreen') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused }) => {
          // Return null for DashboardScreen to hide the label
          if (route.name === 'DashboardScreen') {
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
      <Tab.Screen name="WorkSpace" component={WorkSpace} />
      <Tab.Screen name="DashboardScreen" component={DashboardScreen} />
      <Tab.Screen name="My Team" component={MyTeamScreen} />
      <Tab.Screen
        name="Logout"
        component={View}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
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