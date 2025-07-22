// // import React, {useMemo, useEffect, useState} from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   Image,
// //   ActivityIndicator,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import BottomTab from '../navigation/BottomTab';
// // import {useDispatch, useSelector} from 'react-redux';
// // import {
// //   fetchEmployeeById,
// //   fetchEmployeeNotification,
// // } from '../redux/employeeSlice';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const DashboardScreen = ({navigation}) => {
// //   const [allRecord, setAllRecord] = useState(null);
// //   const [getNotifications, setGetNotifications] = useState([]);
// //   const dispatch = useDispatch();

// //   // const employee = useSelector(state => state.employee.employeeData);

// //   // const employee = useSelector(state => state.app.employee);
// //   // const notifications = useSelector(state => state.employee.notificationData);
// //   // const loading = useSelector(state => state.employee.loading);
// //   // const error = useSelector(state => state.employee.error);

// //   const employee = useSelector(state => state.app.employee);
// //   const notifications = useSelector(state => state.app.notifications);
// //   const loading = useSelector(state => state.app.isLoading);
// //   const error = useSelector(state => state.app.error);
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const empId = await AsyncStorage.getItem('empId');
// //         if (empId) {
// //           dispatch(fetchEmployeeById(empId));
// //           dispatch(fetchEmployeeNotification(empId));
// //         }
// //       } catch (e) {
// //         console.log('❌ Error fetching empId:', e);
// //       }
// //     };
// //     fetchData();
// //   }, [dispatch]);

// //   useEffect(() => {
// //     if (employee) setAllRecord(employee);
// //     if (notifications) setGetNotifications(notifications.data || []);
// //   }, [employee, notifications]);

// //   const currentDate = new Date().toLocaleDateString('en-US', {
// //     weekday: 'long',
// //     day: 'numeric',
// //     month: 'short',
// //     year: 'numeric',
// //   });

// //   const currentTime = new Date().toLocaleTimeString('en-US', {
// //     hour: '2-digit',
// //     minute: '2-digit',
// //     hour12: true,
// //   });

// //   const featureCards = [
// //     {
// //       title: 'My Payroll',
// //       image: require('../../src/assets/mypayroll.png'),
// //       backgroundColor: '#FDE3BF',
// //     },
// //     {
// //       title: 'Attendance',
// //       image: require('../../src/assets/attendence.png'),
// //       backgroundColor: '#005FDF54',
// //     },
// //     {
// //       title: 'Leave',
// //       image: require('../../src/assets/leave.png'),
// //       backgroundColor: '#FF415554',
// //     },
// //     {
// //       title: 'Announcements',
// //       image: require('../../src/assets/announcement.png'),
// //       backgroundColor: '#84272754',
// //     },
// //     {
// //       title: 'Raise Concern',
// //       image: require('../../src/assets/raiseconcern.png'),
// //       backgroundColor: '#EA5E9C54',
// //     },
// //     {
// //       title: 'Reports',
// //       image: require('../../src/assets/reports.png'),
// //       backgroundColor: '#9CD06954',
// //     },
// //     {
// //       title: 'Learning & Development',
// //       image: require('../../src/assets/learning&dev.png'),
// //       backgroundColor: '#F6665954',
// //     },
// //     {
// //       title: 'Task & Management',
// //       image: require('../../src/assets/taskmanagement.png'),
// //       backgroundColor: '#AB3D0454',
// //     },
// //     {
// //       title: 'Performance',
// //       image: require('../../src/assets/perfomance.png'),
// //       backgroundColor: '#26A69A54',
// //     },
// //   ];

// //   const overviewCards = [
// //     {
// //       title: 'Payroll',
// //       image: require('../../src/assets/dashboardIcon/payrollslide.png'),
// //       backgroundColor: '#124A5A',
// //     },
// //     {
// //       title: 'Apply Leave',
// //       image: require('../../src/assets/dashboardIcon/applyleaveslide.png'),
// //     },
// //     {
// //       title: 'Attendance',
// //       image: require('../../src/assets/dashboardIcon/attandenceslide.png'),
// //     },
// //     {
// //       title: 'Calendar',
// //       image: require('../../src/assets/dashboardIcon/calenderslide.png'),
// //     },
// //     {
// //       title: 'Announcements',
// //       image: require('../../src/assets/dashboardIcon/announceslide.png'),
// //     },
// //   ];

// //   const chunkedFeatureCards = useMemo(() => {
// //     const chunkArray = (arr, size) =>
// //       Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
// //         arr.slice(i * size, i * size + size),
// //       );
// //     return chunkArray(featureCards, 3);
// //   }, []);

// //   const handleImageUpload = () => {
// //     navigation.navigate('ProfileScreen');
// //   };

// //   if (loading || !allRecord) {
// //     return (
// //       <View style={styles.centerContainer}>
// //         <ActivityIndicator size="large" color="#4A2C2A" />
// //         <Text>Loading...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View style={styles.headerLeft}>
// //           <View style={styles.profilePicContainer}>
// //             <Image
// //               source={
// //                 allRecord?.photoUrl
// //                   ? {uri: allRecord.photoUrl}
// //                   : require('../../src/assets/dashboardIcon/birthday.png')
// //               }
// //               style={styles.profilePic}
// //             />
// //             <TouchableOpacity
// //               style={styles.plusIconContainer}
// //               onPress={handleImageUpload}>
// //               <Image
// //                 source={require('../../src/assets/dashboardIcon/plusicon.png')}
// //                 style={styles.icon}
// //                 resizeMode="contain"
// //               />
// //             </TouchableOpacity>
// //           </View>
// //           <View>
// //             <Text style={styles.greeting}>
// //               Hello, {allRecord?.firstName} {allRecord?.lastName}
// //             </Text>
// //             <Text style={styles.date}>{currentDate}</Text>
// //           </View>
// //         </View>
// //         <View style={styles.headerRight}>
// //           <TouchableOpacity>
// //             <Ionicons name="notifications" size={24} color="white" />
// //             <View style={styles.notificationBadge}>
// //               <Text style={styles.badgeText}>{getNotifications.length}</Text>
// //             </View>
// //           </TouchableOpacity>
// //           <Image
// //             source={require('../../src/assets/dashboardIcon/avatar.png')}
// //             style={styles.companyLogo}
// //           />
// //         </View>

// //         <TouchableOpacity style={styles.searchIconContainer}>
// //           <Ionicons name="search" size={24} color="white" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Birthdays Section */}
// //       <View style={styles.birthdaySection}>
// //         <View style={styles.birthdayCard}>
// //           <View style={styles.birthdayHeader}>
// //             <View style={styles.birthdayTitle}>
// //               <Image
// //                 source={require('../../src/assets/dashboardIcon/Birthdaystext.png')}
// //                 style={styles.BirthdaystextPic}
// //               />
// //             </View>

// //             <View style={styles.centerContainer}>
// //               <Image
// //                 source={
// //                   allRecord?.photoUrl
// //                     ? {uri: allRecord.photoUrl}
// //                     : require('../../src/assets/dashboardIcon/birthday.png')
// //                 }
// //                 style={styles.birthdayPic}
// //               />
// //             </View>
// //           </View>

// //           <View style={styles.birthdayInfo}>
// //             <View style={styles.timeContainer}>
// //               <Image
// //                 source={require('../../src/assets/dashboardIcon/watch.png')}
// //                 style={styles.icon}
// //                 resizeMode="contain"
// //               />
// //               <Text style={styles.birthdayTime}>Today • {currentTime}</Text>
// //             </View>
// //             <TouchableOpacity>
// //               <Text style={styles.sendWishes}>🎉 Send Wishes</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Main Content */}
// //       <ScrollView style={styles.content}>
// //         {/* Overview */}
// //         <View style={styles.section}>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>Overview</Text>
// //             <TouchableOpacity>
// //               <Text style={styles.viewMore}>View More</Text>
// //             </TouchableOpacity>
// //           </View>
// //           <ScrollView
// //             horizontal
// //             showsHorizontalScrollIndicator={false}
// //             style={styles.overviewScroll}>
// //             {overviewCards.map((card, index) => (
// //               <View key={index} style={styles.cardContainer}>
// //                 <TouchableOpacity
// //                   style={[
// //                     styles.overviewCard,
// //                     {backgroundColor: card.backgroundColor || '#EBEBEB'},
// //                   ]}>
// //                   <Image source={card.image} style={styles.overviewImage} />
// //                 </TouchableOpacity>
// //                 <Text
// //                   style={styles.ManageWorkcardText}
// //                   numberOfLines={1}
// //                   ellipsizeMode="tail">
// //                   {card.title}
// //                 </Text>
// //               </View>
// //             ))}
// //           </ScrollView>
// //         </View>

// //         {/* Feature Cards */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>
// //             Manage Work & Benefits in One Place
// //           </Text>
// //           {chunkedFeatureCards.map((row, rowIndex) => (
// //             <View key={rowIndex} style={styles.featureRow}>
// //               {row.map((card, index) => (
// //                 // <TouchableOpacity
// //                 //   key={index}
// //                 //   style={[
// //                 //     styles.featureCard,
// //                 //     {backgroundColor: card.backgroundColor},
// //                 //   ]}
// //                 //   onPress={() => {
// //                 //     if (card.title === 'Leave') {
// //                 //       navigation.navigate('LeaveScreen');
// //                 //     }
// //                 //   }}>
// //                 //   <Image source={card.image} style={styles.featureImage} />
// //                 //   <Text
// //                 //     style={styles.cardText}
// //                 //     numberOfLines={2}
// //                 //     ellipsizeMode="tail">
// //                 //     {card.title}
// //                 //   </Text>
// //                 // </TouchableOpacity>
// //                  <TouchableOpacity
// //                   key={index}
// //                   style={[
// //                     styles.featureCard,
// //                     { backgroundColor: card.backgroundColor },
// //                   ]}
// //                   onPress={() => {
// //                     if (card.title === 'Leave') {
// //                       navigation.navigate('LeaveScreen');
// //                     } else if (card.title === 'Attendance') {
// //                       navigation.navigate('AttendanceScreen'); // ✅ Navigate here
// //                     }
// //                   }}>
// //                   <Image source={card.image} style={styles.featureImage} />
// //                   <Text
// //                     style={styles.cardText}
// //                     numberOfLines={2}
// //                     ellipsizeMode="tail">
// //                     {card.title}
// //                   </Text>
// //                 </TouchableOpacity>
// //               ))}
// //             </View>
// //           ))}
// //         </View>

// //         {/* Footer */}
// //         <View style={styles.footer}>
// //           <Text style={styles.heading}>
// //             One platform. Endless possibilities.
// //           </Text>
// //           <Text style={styles.subtext}>
// //             From onboarding to retirement,{'\n'}manage it all here. →
// //           </Text>
// //           <Image
// //             source={require('../../src/assets/TALENT_LOGO.png')}
// //             style={styles.logo}
// //             resizeMode="contain"
// //           />
// //         </View>
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {flex: 1, backgroundColor: '#F5F5F5'},
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     padding: 20,
// //     backgroundColor: '#5C3C45',
// //     minHeight: 140,
// //     marginTop: -20,
// //   },
// //   headerLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   profilePicContainer: {
// //     position: 'relative',
// //   },
// //   profilePic: {
// //     width: 55,
// //     height: 55,
// //     borderRadius: 30,
// //     marginRight: 10,
// //   },
// //   plusIconContainer: {
// //     position: 'absolute',
// //     bottom: -3,
// //     right: 5,
// //     backgroundColor: 'white',
// //     borderRadius: 10,
// //   },
// //   icon: {
// //     width: 18,
// //     height: 18,
// //   },
// //   greeting: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: 'white',
// //   },
// //   date: {
// //     fontSize: 14,
// //     color: '#E0E0E0',
// //   },
// //   headerRight: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 15,
// //   },
// //   notificationBadge: {
// //     position: 'absolute',
// //     top: -6,
// //     right: -6,
// //     backgroundColor: 'red',
// //     borderRadius: 10,
// //     width: 20,
// //     height: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   badgeText: {
// //     color: 'white',
// //     fontSize: 12,
// //   },
// //   companyLogo: {
// //     width: 55,
// //     height: 55,
// //     borderRadius: 30,
// //     borderWidth: 2,
// //     borderColor: '#FFFFFF',
// //   },
// //   searchIconContainer: {
// //     position: 'absolute',
// //     bottom: 4,
// //     left: 16,
// //     padding: 8,
// //   },
// //   content: {
// //     flex: 1,
// //   },
// //   birthdaySection: {
// //     backgroundColor: '#5C3C45',
// //   },
// //   birthdayCard: {
// //     flexDirection: 'column',
// //     backgroundColor: '#F2E7E6',
// //     borderTopLeftRadius: 28,
// //     borderTopRightRadius: 28,
// //     padding: 15,
// //     minHeight: 135,
// //   },
// //   birthdayHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   birthdayTitle: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   sectionTitle: {
// //     fontSize: 14,
// //     fontFamily: 'Poppins-bold',
// //     color: '#000000',
// //     marginTop: 8,
// //   },
// //   centerContainer: {
// //     alignItems: 'center',
// //   },
// //   BirthdaystextPic: {
// //     marginTop: -50,
// //   },
// //   birthdayPic: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 40,
// //     marginBottom: 12,
// //     marginLeft: 52,
// //     marginTop: -10,
// //   },
// //   birthdayInfo: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     width: '100%',
// //     paddingHorizontal: 10,
// //   },
// //   timeContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   birthdayTime: {
// //     fontSize: 14,
// //     color: '#666',
// //     marginLeft: 12,
// //   },
// //   sendWishes: {
// //     fontSize: 14,
// //     color: '#23B480',
// //     fontWeight: 'bold',
// //     marginTop: -50,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   viewMore: {
// //     color: '#CE1C1C',
// //     fontSize: 10,
// //     fontFamily: 'Poppins',
// //   },
// //   overviewScroll: {
// //     flexDirection: 'row',
// //     paddingLeft: 5,
// //   },
// //   section: {
// //     paddingHorizontal: 16, // Added padding for left and right
// //   },
// //   overviewCard: {
// //     borderRadius: 10,
// //     padding: 15,
// //     marginRight: 12,
// //     alignItems: 'center',
// //     width: 64,
// //     height: 64,
// //   },
// //   overviewImage: {
// //     width: 23,
// //     height: 23,
// //     resizeMode: 'contain',
// //   },
// //   ManageWorkcardText: {
// //     fontSize: 12,
// //     textAlign: 'center',
// //     color: '#959595',
// //     marginTop: 5,
// //     maxWidth: 80,
// //     fontFamily: 'inter',
// //   },
// //   cardText: {
// //     fontSize: 12,
// //     textAlign: 'center',
// //     color: '#1B1D4D',
// //     marginTop: 5,
// //     maxWidth: 80,
// //     fontFamily: 'inter',
// //   },

// //   featureRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 12,
// //     marginHorizontal: 5,
// //     marginTop: 8,
// //   },
// //   featureCard: {
// //     width: '32%',
// //     borderRadius: 10,
// //     padding: 12,
// //     alignItems: 'center',
// //   },
// //   featureImage: {
// //     width: 40,
// //     height: 40,
// //     resizeMode: 'contain',
// //     marginBottom: 10,
// //     backgroundColor: '#fff',
// //     borderRadius: 20,
// //     padding: 10,
// //   },
// //   footer: {
// //     backgroundColor: '#FFF',
// //     borderRadius: 16,
// //     paddingVertical: 24,
// //     paddingHorizontal: 20,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 10,
// //     elevation: 4,
// //     margin: 16,
// //   },
// //   heading: {
// //     fontSize: 18,
// //     fontFamily: 'Poppins-Bold',
// //     color: '#000',
// //     textAlign: 'center',
// //     marginBottom: 8,
// //   },
// //   subtext: {
// //     fontSize: 14,
// //     fontFamily: 'Poppins',
// //     color: '#333',
// //     textAlign: 'center',
// //     marginBottom: 10,
// //   },
// //   logo: {
// //     width: 120,
// //     height: 40,
// //   },
// //   cardContainer: {
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// // });

// // export default DashboardScreen;





// import React, {useMemo, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import BottomTab from '../navigation/BottomTab';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   fetchEmployeeById,
//   fetchEmployeeNotification,
// } from '../redux/employeeSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const DashboardScreen = ({navigation}) => {
//   const [allRecord, setAllRecord] = useState(null);
//   const [getNotifications, setGetNotifications] = useState([]);
//   const dispatch = useDispatch();

//   const employee = useSelector(state => state.employee.employeeData);
//   const notifications = useSelector(state => state.employee.notificationData);
//   const loading = useSelector(state => state.employee.loading);
//   const error = useSelector(state => state.employee.error);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const empId = await AsyncStorage.getItem('empId');
//         if (empId) {
//           dispatch(fetchEmployeeById(empId));
//           dispatch(fetchEmployeeNotification(empId));
//         }
//       } catch (e) {
//         console.log('❌ Error fetching empId:', e);
//       }
//     };
//     fetchData();
//   }, [dispatch]);

//   useEffect(() => {
//     if (employee) setAllRecord(employee);
//     if (notifications) setGetNotifications(notifications.data || []);
//   }, [employee, notifications]);

//   const currentDate = new Date().toLocaleDateString('en-US', {
//     weekday: 'long',
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   });

//   const currentTime = new Date().toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

//   const featureCards = [
//     {
//       title: 'My Payroll',
//       image: require('../../src/assets/mypayroll.png'),
//       backgroundColor: '#FDE3BF',
//     },
//     {
//       title: 'Attendance',
//       image: require('../../src/assets/attendence.png'),
//       backgroundColor: '#005FDF54',
//     },
//     {
//       title: 'Leave',
//       image: require('../../src/assets/leave.png'),
//       backgroundColor: '#FF415554',
//     },
//     {
//       title: 'Announcements',
//       image: require('../../src/assets/announcement.png'),
//       backgroundColor: '#84272754',
//     },
//     {
//       title: 'Raise Concern',
//       image: require('../../src/assets/raiseconcern.png'),
//       backgroundColor: '#EA5E9C54',
//     },
//     {
//       title: 'Reports',
//       image: require('../../src/assets/reports.png'),
//       backgroundColor: '#9CD06954',
//     },
//     {
//       title: 'Learning & Development',
//       image: require('../../src/assets/learning&dev.png'),
//       backgroundColor: '#F6665954',
//     },
//     {
//       title: 'Task & Management',
//       image: require('../../src/assets/taskmanagement.png'),
//       backgroundColor: '#AB3D0454',
//     },
//     {
//       title: 'Performance',
//       image: require('../../src/assets/perfomance.png'),
//       backgroundColor: '#26A69A54',
//     },
//   ];

//   const overviewCards = [
//     {
//       title: 'Payroll',
//       image: require('../../src/assets/dashboardIcon/payrollslide.png'),
//       backgroundColor: '#124A5A',
//     },
//     {
//       title: 'Apply Leave',
//       image: require('../../src/assets/dashboardIcon/applyleaveslide.png'),
//     },
//     {
//       title: 'Attendance',
//       image: require('../../src/assets/dashboardIcon/attandenceslide.png'),
//     },
//     {
//       title: 'Calendar',
//       image: require('../../src/assets/dashboardIcon/calenderslide.png'),
//     },
//     {
//       title: 'Announcements',
//       image: require('../../src/assets/dashboardIcon/announceslide.png'),
//     },
//   ];

//   const chunkedFeatureCards = useMemo(() => {
//     const chunkArray = (arr, size) =>
//       Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
//         arr.slice(i * size, i * size + size),
//       );
//     return chunkArray(featureCards, 3);
//   }, []);

//   const handleImageUpload = () => {
//     navigation.navigate('ProfileScreen');
//   };

//   if (loading || !allRecord) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#4A2C2A" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <View style={styles.profilePicContainer}>
//             <Image
//               source={
//                 allRecord?.photoUrl
//                   ? {uri: allRecord.photoUrl}
//                   : require('../../src/assets/dashboardIcon/birthday.png')
//               }
//               style={styles.profilePic}
//             />
//             <TouchableOpacity
//               style={styles.plusIconContainer}
//               onPress={handleImageUpload}>
//               <Image
//                 source={require('../../src/assets/dashboardIcon/plusicon.png')}
//                 style={styles.icon}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>
//           <View>
//             <Text style={styles.greeting}>
//               Hello, {allRecord?.firstName} {allRecord?.lastName}
//             </Text>
//             <Text style={styles.date}>{currentDate}</Text>
//           </View>
//         </View>
//         <View style={styles.headerRight}>
//           <TouchableOpacity>
//             <Ionicons name="notifications" size={24} color="white" />
//             <View style={styles.notificationBadge}>
//               <Text style={styles.badgeText}>{getNotifications.length}</Text>
//             </View>
//           </TouchableOpacity>
//           <Image
//             source={require('../../src/assets/dashboardIcon/avatar.png')}
//             style={styles.companyLogo}
//           />
//         </View>

//         <TouchableOpacity style={styles.searchIconContainer}>
//           <Ionicons name="search" size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Birthdays Section */}
//       <View style={styles.birthdaySection}>
//         <View style={styles.birthdayCard}>
//           <View style={styles.birthdayHeader}>
//             <View style={styles.birthdayTitle}>
//               <Image
//                 source={require('../../src/assets/dashboardIcon/Birthdaystext.png')}
//                 style={styles.BirthdaystextPic}
//               />
//             </View>

//             <View style={styles.centerContainer}>
//               <Image
//                 source={
//                   allRecord?.photoUrl
//                     ? {uri: allRecord.photoUrl}
//                     : require('../../src/assets/dashboardIcon/birthday.png')
//                 }
//                 style={styles.birthdayPic}
//               />
//             </View>
//           </View>

//           <View style={styles.birthdayInfo}>
//             <View style={styles.timeContainer}>
//               <Image
//                 source={require('../../src/assets/dashboardIcon/watch.png')}
//                 style={styles.icon}
//                 resizeMode="contain"
//               />
//               <Text style={styles.birthdayTime}>Today • {currentTime}</Text>
//             </View>
//             <TouchableOpacity>
//               <Text style={styles.sendWishes}>🎉 Send Wishes</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Main Content */}
//       <ScrollView style={styles.content}>
//         {/* Overview */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Overview</Text>
//             <TouchableOpacity>
//               <Text style={styles.viewMore}>View More</Text>
//             </TouchableOpacity>
//           </View>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.overviewScroll}>
//             {overviewCards.map((card, index) => (
//               <View key={index} style={styles.cardContainer}>
//                 <TouchableOpacity
//                   style={[
//                     styles.overviewCard,
//                     {backgroundColor: card.backgroundColor || '#EBEBEB'},
//                   ]}>
//                   <Image source={card.image} style={styles.overviewImage} />
//                 </TouchableOpacity>
//                 <Text
//                   style={styles.ManageWorkcardText}
//                   numberOfLines={1}
//                   ellipsizeMode="tail">
//                   {card.title}
//                 </Text>
//               </View>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Feature Cards */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             Manage Work & Benefits in One Place
//           </Text>
//           {chunkedFeatureCards.map((row, rowIndex) => (
//             <View key={rowIndex} style={styles.featureRow}>
//               {row.map((card, index) => (
//                 // <TouchableOpacity
//                 //   key={index}
//                 //   style={[
//                 //     styles.featureCard,
//                 //     {backgroundColor: card.backgroundColor},
//                 //   ]}
//                 //   onPress={() => {
//                 //     if (card.title === 'Leave') {
//                 //       navigation.navigate('LeaveScreen');
//                 //     }
//                 //   }}>
//                 //   <Image source={card.image} style={styles.featureImage} />
//                 //   <Text
//                 //     style={styles.cardText}
//                 //     numberOfLines={2}
//                 //     ellipsizeMode="tail">
//                 //     {card.title}
//                 //   </Text>
//                 // </TouchableOpacity>
//                  <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.featureCard,
//                     { backgroundColor: card.backgroundColor },
//                   ]}
//                   onPress={() => {
//                     if (card.title === 'Leave') {
//                       navigation.navigate('LeaveScreen');
//                     } else if (card.title === 'Attendance') {
//                       navigation.navigate('AttendanceScreen'); // ✅ Navigate here
//                     }
//                   }}>
//                   <Image source={card.image} style={styles.featureImage} />
//                   <Text
//                     style={styles.cardText}
//                     numberOfLines={2}
//                     ellipsizeMode="tail">
//                     {card.title}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           ))}
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.heading}>
//             One platform. Endless possibilities.
//           </Text>
//           <Text style={styles.subtext}>
//             From onboarding to retirement,{'\n'}manage it all here. →
//           </Text>
//           <Image
//             source={require('../../src/assets/TALENT_LOGO.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#F5F5F5'},
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#5C3C45',
//     minHeight: 140,
//     marginTop: -20,
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   profilePicContainer: {
//     position: 'relative',
//   },
//   profilePic: {
//     width: 55,
//     height: 55,
//     borderRadius: 30,
//     marginRight: 10,
//   },
//   plusIconContainer: {
//     position: 'absolute',
//     bottom: -3,
//     right: 5,
//     backgroundColor: 'white',
//     borderRadius: 10,
//   },
//   icon: {
//     width: 18,
//     height: 18,
//   },
//   greeting: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   date: {
//     fontSize: 14,
//     color: '#E0E0E0',
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 15,
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: -6,
//     right: -6,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//   },
//   companyLogo: {
//     width: 55,
//     height: 55,
//     borderRadius: 30,
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   searchIconContainer: {
//     position: 'absolute',
//     bottom: 4,
//     left: 16,
//     padding: 8,
//   },
//   content: {
//     flex: 1,
//   },
//   birthdaySection: {
//     backgroundColor: '#5C3C45',
//   },
//   birthdayCard: {
//     flexDirection: 'column',
//     backgroundColor: '#F2E7E6',
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     padding: 15,
//     minHeight: 135,
//   },
//   birthdayHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   birthdayTitle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontFamily: 'Poppins-bold',
//     color: '#000000',
//     marginTop: 8,
//   },
//   centerContainer: {
//     alignItems: 'center',
//   },
//   BirthdaystextPic: {
//     marginTop: -50,
//   },
//   birthdayPic: {
//     width: 70,
//     height: 70,
//     borderRadius: 40,
//     marginBottom: 12,
//     marginLeft: 52,
//     marginTop: -10,
//   },
//   birthdayInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     paddingHorizontal: 10,
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   birthdayTime: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 12,
//   },
//   sendWishes: {
//     fontSize: 14,
//     color: '#23B480',
//     fontWeight: 'bold',
//     marginTop: -50,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   viewMore: {
//     color: '#CE1C1C',
//     fontSize: 10,
//     fontFamily: 'Poppins',
//   },
//   overviewScroll: {
//     flexDirection: 'row',
//     paddingLeft: 5,
//   },
//   section: {
//     paddingHorizontal: 16, // Added padding for left and right
//   },
//   overviewCard: {
//     borderRadius: 10,
//     padding: 15,
//     marginRight: 12,
//     alignItems: 'center',
//     width: 64,
//     height: 64,
//   },
//   overviewImage: {
//     width: 23,
//     height: 23,
//     resizeMode: 'contain',
//   },
//   ManageWorkcardText: {
//     fontSize: 12,
//     textAlign: 'center',
//     color: '#959595',
//     marginTop: 5,
//     maxWidth: 80,
//     fontFamily: 'inter',
//   },
//   cardText: {
//     fontSize: 12,
//     textAlign: 'center',
//     color: '#1B1D4D',
//     marginTop: 5,
//     maxWidth: 80,
//     fontFamily: 'inter',
//   },

//   featureRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     marginHorizontal: 5,
//     marginTop: 8,
//   },
//   featureCard: {
//     width: '32%',
//     borderRadius: 10,
//     padding: 12,
//     alignItems: 'center',
//   },
//   featureImage: {
//     width: 40,
//     height: 40,
//     resizeMode: 'contain',
//     marginBottom: 10,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 10,
//   },
//   footer: {
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 4,
//     margin: 16,
//   },
//   heading: {
//     fontSize: 18,
//     fontFamily: 'Poppins-Bold',
//     color: '#000',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subtext: {
//     fontSize: 14,
//     fontFamily: 'Poppins',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   logo: {
//     width: 120,
//     height: 40,
//   },
//   cardContainer: {
//     alignItems: 'center',
//     marginRight: 12,
//   },
// });

// export default DashboardScreen;
// DashboardScreen.js
import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployee, getEmployeeNotification } from '../redux/slice'; // Updated imports
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({ navigation }) => {
  const [allRecord, setAllRecord] = useState(null);
  const [getNotifications, setGetNotifications] = useState([]);
  const dispatch = useDispatch();

  // Updated selectors to use state.app
  const employee = useSelector(state => {
    console.log('Redux State:', JSON.stringify(state, null, 2)); // Debug: Log entire state
    return state.app?.employee || null; // Fallback to null
  });
  const notifications = useSelector(state => state.app?.notifications || null);
  const isLoading = useSelector(state => state.app?.isLoading || false);
  const error = useSelector(state => state.app?.error || null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empId = await AsyncStorage.getItem('empId');
        console.log('empId from AsyncStorage:', empId); // Debug
        if (empId) {
          dispatch(fetchEmployee(empId)); // Updated action
          dispatch(getEmployeeNotification(empId)); // Updated action
        } else {
          console.log('No empId found, redirecting to Login');
          navigation.navigate('Login');
        }
      } catch (e) {
        console.log('❌ Error fetching empId:', e);
      }
    };
    fetchData();
  }, [dispatch, navigation]);

  useEffect(() => {
    if (error) {
      console.log('Error from Redux:', error); // Debug
      navigation.navigate('Login'); // Redirect on error
    }
    if (employee) {
      setAllRecord(employee);
    }
    if (notifications) {
      setGetNotifications(notifications.data || notifications || []);
    }
  }, [employee, notifications, error, navigation]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const featureCards = [
    {
      title: 'My Payroll',
      image: require('../assets/mypayroll.png'),
      backgroundColor: '#FDE3BF',
    },
    {
      title: 'Attendance',
      image: require('../assets/attendence.png'),
      backgroundColor: '#005FDF54',
    },
    {
      title: 'Leave',
      image: require('../assets/leave.png'),
      backgroundColor: '#FF415554',
    },
    {
      title: 'Announcements',
      image: require('../assets/announcement.png'),
      backgroundColor: '#84272754',
    },
    {
      title: 'Raise Concern',
      image: require('../assets/raiseconcern.png'),
      backgroundColor: '#EA5E9C54',
    },
    {
      title: 'Reports',
      image: require('../assets/reports.png'),
      backgroundColor: '#9CD06954',
    },
    {
      title: 'Learning & Development',
      image: require('../assets/learning&dev.png'),
      backgroundColor: '#F6665954',
    },
    {
      title: 'Task & Management',
      image: require('../assets/taskmanagement.png'),
      backgroundColor: '#AB3D0454',
    },
    {
      title: 'Performance',
      image: require('../assets/perfomance.png'),
      backgroundColor: '#26A69A54',
    },
  ];

  const overviewCards = [
    {
      title: 'Payroll',
      image: require('../assets/dashboardIcon/payrollslide.png'),
      backgroundColor: '#124A5A',
    },
    {
      title: 'Apply Leave',
      image: require('../assets/dashboardIcon/applyleaveslide.png'),
    },
    {
      title: 'Attendance',
      image: require('../assets/dashboardIcon/attandenceslide.png'),
    },
    {
      title: 'Calendar',
      image: require('../assets/dashboardIcon/calenderslide.png'),
    },
    {
      title: 'Announcements',
      image: require('../assets/dashboardIcon/announceslide.png'),
    },
  ];

  const chunkedFeatureCards = useMemo(() => {
    const chunkArray = (arr, size) =>
      Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
      );
    return chunkArray(featureCards, 3);
  }, []);

  const handleImageUpload = () => {
    navigation.navigate('ProfileScreen');
  };

  if (isLoading || !allRecord) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A2C2A" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profilePicContainer}>
            <Image
              source={
                allRecord?.photoUrl
                  ? { uri: allRecord.photoUrl }
                  : require('../assets/dashboardIcon/birthday.png')
              }
              style={styles.profilePic}
            />
            <TouchableOpacity
              style={styles.plusIconContainer}
              onPress={handleImageUpload}>
              <Image
                source={require('../assets/dashboardIcon/plusicon.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.greeting}>
              Hello, {allRecord?.firstName || 'User'} {allRecord?.lastName || ''}
            </Text>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Ionicons name="notifications" size={24} color="white" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{getNotifications.length}</Text>
            </View>
          </TouchableOpacity>
          <Image
            source={require('../assets/dashboardIcon/avatar.png')}
            style={styles.companyLogo}
          />
        </View>

        <TouchableOpacity style={styles.searchIconContainer}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Birthdays Section */}
      <View style={styles.birthdaySection}>
        <View style={styles.birthdayCard}>
          <View style={styles.birthdayHeader}>
            <View style={styles.birthdayTitle}>
              <Image
                source={require('../assets/dashboardIcon/Birthdaystext.png')}
                style={styles.BirthdaystextPic}
              />
            </View>

            <View style={styles.centerContainer}>
              <Image
                source={
                  allRecord?.photoUrl
                    ? { uri: allRecord.photoUrl }
                    : require('../assets/dashboardIcon/birthday.png')
                }
                style={styles.birthdayPic}
              />
            </View>
          </View>

          <View style={styles.birthdayInfo}>
            <View style={styles.timeContainer}>
              <Image
                source={require('../assets/dashboardIcon/watch.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.birthdayTime}>Today • {currentTime}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.sendWishes}>🎉 Send Wishes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <TouchableOpacity>
              <Text style={styles.viewMore}>View More</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.overviewScroll}>
            {overviewCards.map((card, index) => (
              <View key={index} style={styles.cardContainer}>
                <TouchableOpacity
                  style={[
                    styles.overviewCard,
                    { backgroundColor: card.backgroundColor || '#EBEBEB' },
                  ]}>
                  <Image source={card.image} style={styles.overviewImage} />
                </TouchableOpacity>
                <Text
                  style={styles.ManageWorkcardText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {card.title}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Feature Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Manage Work & Benefits in One Place
          </Text>
          {chunkedFeatureCards.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.featureRow}>
              {row.map((card, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.featureCard,
                    { backgroundColor: card.backgroundColor },
                  ]}
                  onPress={() => {
                    if (card.title === 'Leave') {
                      navigation.navigate('LeaveScreen');
                    } else if (card.title === 'Attendance') {
                      navigation.navigate('AttendanceScreen');
                    }
                  }}>
                  <Image source={card.image} style={styles.featureImage} />
                  <Text
                    style={styles.cardText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {card.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.heading}>
            One platform. Endless possibilities.
          </Text>
          <Text style={styles.subtext}>
            From onboarding to retirement, manage it all here. →
          </Text>
          <Image
            source={require('../assets/TALENT_LOGO.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#5C3C45',
    minHeight: 140,
    marginTop: -20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 10,
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: -3,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  icon: {
    width: 18,
    height: 18,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  companyLogo: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchIconContainer: {
    position: 'absolute',
    bottom: 4,
    left: 16,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  birthdaySection: {
    backgroundColor: '#5C3C45',
  },
  birthdayCard: {
    flexDirection: 'column',
    backgroundColor: '#F2E7E6',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 15,
    minHeight: 135,
  },
  birthdayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  birthdayTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-bold',
    color: '#000000',
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BirthdaystextPic: {
    marginTop: -50,
  },
  birthdayPic: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginBottom: 12,
    marginLeft: 52,
    marginTop: -10,
  },
  birthdayInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthdayTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  sendWishes: {
    fontSize: 14,
    color: '#23B480',
    fontWeight: 'bold',
    marginTop: -50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewMore: {
    color: '#CE1C1C',
    fontSize: 10,
    fontFamily: 'Poppins',
  },
  overviewScroll: {
    flexDirection: 'row',
    paddingLeft: 5,
  },
  section: {
    paddingHorizontal: 16,
  },
  overviewCard: {
    borderRadius: 10,
    padding: 15,
    marginRight: 12,
    alignItems: 'center',
    width: 64,
    height: 64,
  },
  overviewImage: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
  ManageWorkcardText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#959595',
    marginTop: 5,
    maxWidth: 80,
    fontFamily: 'inter',
  },
  cardText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#1B1D4D',
    marginTop: 5,
    maxWidth: 80,
    fontFamily: 'inter',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginHorizontal: 5,
    marginTop: 8,
  },
  featureCard: {
    width: '32%',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  featureImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
  },
  footer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    margin: 16,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 40,
  },
  cardContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
});

export default DashboardScreen;