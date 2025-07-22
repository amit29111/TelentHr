// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   FlatList,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import {BarChart} from 'react-native-gifted-charts';
// import * as Progress from 'react-native-progress';
// import LinearGradient from 'react-native-linear-gradient';
// import {ENDPOINT} from '../api/endpoint'; // Import the provided authConfig and ENDPOINT
// import apiClient from '../api/config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const {width} = Dimensions.get('window');

// const attendanceChartData = [
//   {value: 6, label: 'Mon', frontColor: '#FE970080'},
//   {value: 7, label: 'Tue', frontColor: '#FE970080'},
//   {value: 9, label: 'Wed', frontColor: '#FE970080'},
//   {value: 5, label: 'Thu', frontColor: '#FE9700'},
//   {value: 4, label: 'Fri', frontColor: '#FE970080'},
// ];

// const attendanceListData = [
//   {
//     date: '8 December 2024',
//     clockIn: '08:45:00',
//     clockOut: '17:10:00',
//     type: 'Regular',
//   },
//   {
//     date: '7 December 2024',
//     clockIn: '09:00:00',
//     clockOut: '17:45:00',
//     type: 'Regular',
//   },
//   {
//     date: '6 December 2024',
//     clockIn: '08:45:00',
//     clockOut: '17:10:00',
//     type: 'Regular',
//   },
//   {
//     date: '5 December 2024',
//     clockIn: '09:00:00',
//     clockOut: '17:45:00',
//     type: 'Regular',
//   },
// ];



// // Define AttendanceCard component separately
// const AttendanceCard = ({item}) => {
//   return (
//     <View style={styles.attCard}>
//       <View style={styles.sideBar} />
//       <View style={styles.cardContent}>
//         <View style={styles.timeRow}>
//           <View style={styles.dateBlock}>
//             <Text style={styles.dateText}>{item.date}</Text>
//             <Text style={styles.typeText}>{item.type}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.timeBlock}>
//             <Text style={styles.timeLabel}>Clock In</Text>
//             <Text style={styles.timeValue}>{item.clockIn}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.timeBlock}>
//             <Text style={styles.timeLabel}>Clock Out</Text>
//             <Text style={styles.timeValue}>{item.clockOut}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// const AttendanceScreen = () => {
//   const [mode, setMode] = useState('Home');
//   const [isLoadingIn, setIsLoadingIn] = useState(false);
//   const [isLoadingOut, setIsLoadingOut] = useState(false);
//   const progress = 0.75;
//   const [checkInSuccess, setCheckInSuccess] = useState([])

//  useEffect(() => {
//   const checkClockIn = async () => {
//     setIsLoadingIn(true);
//     try {
//       const empId = await AsyncStorage.getItem('empId');

//       // ✅ CALL the function with empId
//       const url = ENDPOINT.BREAK.CHECKCHECKIN(empId);
//       console.log('Final API URL:', url); // Should print: /break/check-checkin/67a49...

//       const response = await apiClient.get(url);
//       console.log('API Response:', response.data.status);

//       if (response.status === 200 || response.status === 201) {
//         setCheckInSuccess(response.data.status);
//         // Alert.alert('Success', 'Clocked in successfully! 11111111111');
//       } else {
//         Alert.alert('Error', response.data.message || 'Failed to clock in.');
//       }
//     } catch (error) {
//       console.error('Clock In Error:', error);
//       Alert.alert(
//         'Error',
//         error.response?.data?.message || 'Something went wrong. Please try again.'
//       );
//     } finally {
//       setIsLoadingIn(false);
//     }
//   };

//   checkClockIn();
// }, []);



//   const handleClockIn = async () => {
//     setIsLoadingIn(true);
//     const empId = await AsyncStorage.getItem('empId');
//     const orgId = await AsyncStorage.getItem('orgId');
//     const now = new Date();

//     const mm = String(now.getMonth() + 1).padStart(2, '0'); // Month (01-12)
//     const dd = String(now.getDate()).padStart(2, '0'); // Day (01-31)
//     const yy = String(now.getFullYear()).slice(-2); // Last two digits of year

//     const formattedDate = `${mm}/${dd}/${yy}`;
//     console.log(formattedDate); // e.g., "07/21/25"
//     //     const now = new Date();
//     const currentTime = now.toTimeString().split(' ')[0]; // "13:45:30"
//     console.log(currentTime);
//     try {
//       const response = await apiClient.post(ENDPOINT.BREAK.CHECKIN, {
//         employeeId: empId,
//         date: formattedDate,
//         checkIn: currentTime,
//         orgId: orgId,
//         userLat: '22.7487527',
//         userLng: '75.8957078',
//       });
//       console.log('33333333', response);
//       if (response.status == 200 || response.status == 201) {
//         setCheckInSuccess(response.data.status)
//         // Optionally update attendanceListData or other UI state
//       } else {
//         console.log('222222222');
//         Alert.alert('Error', response.data.message || 'Failed to clock in.');
//       }
//     } catch (error) {
//       console.log('11111111111111');
//       Alert.alert(
//         'Error',
//         error.response?.data?.message ||
//           'Something went wrong. Please try again.',
//       );
//       console.error('Clock In Error:', error);
//     } finally {
//       setIsLoadingIn(false);
//     }
//   };

//   // API call for Clock Out
//   const handleClockOut = async () => {
//     setIsLoadingOut(true);
//     try {
//       console.log('fdsfdsfdsfds', authConfig);
//       const response = await authConfig.post(ENDPOINT.BREAK.CHECKOUT, {
//         empId: empId,
//         mode: mode,
//         timestamp: new Date().toISOString(),
//       });

//       if (response.status === 200 || response.status === 201) {
//         Alert.alert(
//           'Success',
//           response.data.message || 'Clocked out successfully!',
//         );
//         // Optionally update attendanceListData or other UI state
//       } else {
//         Alert.alert('Error', response.data.message || 'Failed to clock out.');
//       }
//     } catch (error) {
//       Alert.alert(
//         'Error',
//         error.response?.data?.message ||
//           'Something went wrong. Please try again.',
//       );
//       console.error('Clock Out Error:', error);
//     } finally {
//       setIsLoadingOut(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerTextContainer}>
//         <TouchableOpacity style={styles.backButton}>
//           <Image
//             source={require('../assets/BackArrow.png')}
//             style={styles.backArrowIcon}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Choose your remote mode</Text>
//       </View>

//       {/* Toggle */}
//       <View style={styles.toggleContentHeader}>
//         <LinearGradient
//           colors={['#ED8C85', '#8C86BD']}
//           style={styles.toggleContainer}
//           start={{x: 0, y: 0}}
//           end={{x: 1, y: 0}}>
//           <TouchableOpacity
//             style={[
//               styles.toggleOption,
//               mode === 'Home' && styles.activeToggle,
//             ]}
//             onPress={() => setMode('Home')}>
//             <View style={styles.toggleContent}>
//               <Image
//                 source={require('../assets/Home.png')}
//                 style={[
//                   styles.buttonIcon,
//                   mode === 'Home' && styles.activeIcon,
//                 ]}
//               />
//               Excellency
//               <Text
//                 style={[
//                   styles.toggleText,
//                   mode === 'Home' && styles.activeToggleText,
//                 ]}>
//                 Home
//               </Text>
//             </View>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.toggleOption,
//               mode === 'Office' && styles.activeToggle,
//             ]}
//             onPress={() => setMode('Office')}>
//             <View style={styles.toggleContent}>
//               <Image
//                 source={require('../assets/Office.png')}
//                 style={[
//                   styles.buttonIcon,
//                   mode === 'Office' && styles.activeIcon,
//                 ]}
//               />
//               <Text
//                 style={[
//                   styles.toggleText,
//                   mode === 'Office' && styles.activeToggleText,
//                 ]}>
//                 Office
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </LinearGradient>
//       </View>

//       {/* Main Content */}
//       <View style={styles.combinedSection}>
//         {/* Clock Data” */}
//         <View style={styles.middleSection}>
//           <View style={styles.timeRow}>
//             <View style={styles.timeBox}>
//               <Image
//                 source={require('../assets/map.png')}
//                 style={styles.timePic}
//               />
//             </View>
//             <View style={styles.timeBox}>
//               <Image
//                 source={require('../assets/watchIn.png')}
//                 style={styles.timePic}
//               />
//               <Text style={styles.timeValue}>08:15 AM</Text>
//               <Text style={styles.timeLabel}>Clock In</Text>
//             </View>
//             <View style={styles.timeBox}>
//               <Image
//                 source={require('../assets/watchOut.png')}
//                 style={styles.timePic}
//               />
//               <Text style={styles.timeValue}>06:15 PM</Text>
//               <Text style={styles.timeLabel}>Clock Out</Text>
//             </View>
//             <View style={styles.timeBox}>
//               <Image
//                 source={require('../assets/watchthree.png')}
//                 style={styles.timePic}
//               />
//               <Text style={styles.timeValue}>09 hrs</Text>
//               <Text style={styles.timeLabel}>Duration</Text>
//             </View>
//           </View>

//           <Text style={styles.dateTextLarge}>Monday, 19 May 2025</Text>

//           <View style={styles.circle}>
//             <Progress.Circle
//               size={160}
//               progress={progress}
//               color="#F38D0E"
//               unfilledColor="#E4392F"
//               borderWidth={0}
//               thickness={20}
//               showsText={false}
//             />
//             <View style={styles.circleTextContainer}>
//               <Text style={styles.circleTop}>START</Text>
//               <Text style={styles.circleBottom}>10:30 {'\n'} AM</Text>
//             </View>
//           </View>

//           <View style={styles.buttonRow}>
//             <TouchableOpacity
//               style={[styles.clockBtn, isLoadingIn && styles.disabledBtn]}
//               onPress={handleClockIn}
//               disabled={isLoadingIn}>
//               <View style={styles.buttonContent}>
//                 {isLoadingIn ? (
//                   <ActivityIndicator size="small" color="#FFF" />
//                 ) : (
               
//                  <>
//                  {  checkInSuccess !== 'success' ? 
//                     <>
//                     <Image
//                       source={require('../assets/checkarrowone.png')}
//                       style={styles.buttonIcon}
//                     />
//                     <Text style={styles.btnText}>CHECKIN IN 1</Text>
//                     </>
//                     :
//                     <>
//                     <Image
//                       source={require('../assets/checkarrowone.png')}
//                       style={styles.buttonIcon}
//                     />
//                     <Text style={styles.btnText}>Breack In</Text>
//                     </>
//                     }
//                   </>
//                 )}
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.clockBtn, isLoadingOut && styles.disabledBtn]}
//               onPress={handleClockOut}
//               disabled={isLoadingOut}>
//               <View style={styles.buttonContent}>
//                 {isLoadingOut ? (
//                   <ActivityIndicator size="small" color="#FFF" />
//                 ) : (
//                   <>
//                     <Image
//                       source={require('../assets/checkarrowtwo.png')}
//                       style={styles.buttonIcon}
//                     />
//                     <Text style={styles.btnText}>CLOCK OUT</Text>
//                   </>
//                 )}
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Attendance Chart */}
//         <View style={styles.AttendanceSection}>
//           <View style={styles.attendanceHeader}>
//             <Text style={styles.attendanceTitle}>Attendance</Text>
//             <TouchableOpacity style={styles.exportBtn}>
//               <Text style={styles.exportText}>Export Report</Text>
//             </TouchableOpacity>
//           </View>
//           <BarChart
//             data={attendanceChartData}
//             barWidth={16}
//             spacing={20}
//             noOfSections={5}
//             maxValue={10}
//             frontColor="#FF6B6B"
//             yAxisThickness={0}
//             xAxisThickness={0}
//             width={400}
//             height={120}
//           />
//         </View>

//         {/* Attendance List */}
//         <View style={styles.attendanceListContainer}>
//           <View style={styles.listHeader}>
//             <Text style={styles.headerTitle}>Attendance Data</Text>
//             <TouchableOpacity>
//               <Text style={styles.seeAll}>See All</Text>
//             </TouchableOpacity>
//           </View>
//           <FlatList
//             data={attendanceListData}
//             renderItem={({item}) => <AttendanceCard item={item} />}
//             keyExtractor={(item, index) => index.toString()}
//             contentContainerStyle={styles.listContainer}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#402530',
//     padding: 8,
//   },
//   headerTextContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//   },
//   backButton: {
//     padding: 8,
//   },
//   backArrowIcon: {
//     width: 14,
//     height: 12,
//     tintColor: '#FFFFFF',
//   },
//   headerText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginLeft: 8,
//   },
//   toggleContentHeader: {
//     marginBottom: 14,
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     borderRadius: 25,
//     padding: 4,
//     marginHorizontal: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   toggleOption: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderRadius: 20,
//   },
//   activeToggle: {
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   toggleContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   timePic: {
//     width: 24,
//     height: 24,
//     marginRight: 8,
//     tintColor: '#E4392F',
//   },
//   buttonIcon: {
//     width: 12,
//     height: 12,
//     marginRight: 8,
//     tintColor: '#FFFFFF',
//   },
//   activeIcon: {
//     tintColor: '#402530',
//   },
//   toggleText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   activeToggleText: {
//     color: '#402530',
//   },
//   combinedSection: {
//     backgroundColor: '#F5F5F0',
//     borderRadius: 10,
//     padding: 10,
//   },
//   middleSection: {
//     padding: 16,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     backgroundColor: '#F6E7E0',
//   },
//   AttendanceSection: {
//     padding: 16,
//     borderRadius: 10,
//   },
//   timeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   timeBox: {
//     alignItems: 'center',
//   },
//   timeLabel: {
//     fontSize: 12,
//     color: '#6A3A3A',
//   },
//   timeValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//   },
//   dateTextLarge: {
//     textAlign: 'center',
//     fontSize: 24,
//     fontWeight: '600',
//     marginBottom: 4,
//     color: '#333',
//   },
//   circle: {
//     alignSelf: 'center',
//     width: 200,
//     height: 200,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//     position: 'relative',
//   },
//   circleTextContainer: {
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   circleTop: {
//     fontSize: 14,
//     color: '#6A3A3A',
//   },
//   circleBottom: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#E66957',
//     textAlign: 'center',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   clockBtn: {
//     flex: 0.45,
//     marginHorizontal: 5,
//     backgroundColor: '#916248',
//     padding: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   disabledBtn: {
//     backgroundColor: '#cccccc',
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   btnText: {
//     color: '#FFF',
//     fontWeight: '600',
//     fontSize: 12,
//     fontFamily: 'inter',
//   },
//   attendanceHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   attendanceTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   exportBtn: {
//     backgroundColor: '#A78090',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   exportText: {
//     fontSize: 12,
//     color: '#fff',
//   },
//   attendanceListContainer: {
//     paddingHorizontal: 0,
//     paddingBottom: 20,
//     backgroundColor: '#F5F5F0',
//   },
//   listHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     paddingHorizontal: 16,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   seeAll: {
//     color: '#808080',
//     fontSize: 14,
//   },
//   listContainer: {
//     paddingHorizontal: 16,
//     gap: 10,
//   },
//   attCard: {
//     flexDirection: 'row',
//     height: 70,
//     backgroundColor: '#F0F0F0',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   sideBar: {
//     width: 5,
//     backgroundColor: '#FFA500',
//     borderTopLeftRadius: 10,
//     borderBottomLeftRadius: 10,
//   },
//   cardContent: {
//     flex: 1,
//     paddingLeft: 10,
//   },
//   timeBlock: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: '#F0F0F0',
//     padding: 5,
//     borderRadius: 5,
//   },
//   dateText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   typeText: {
//     fontSize: 14,
//     color: '#555555',
//   },
//   timeLabel: {
//     fontSize: 12,
//     color: '#777777',
//   },
//   timeValue: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#000000',
//   },
//   divider: {
//     width: 1,
//     height: 40,
//     backgroundColor: '#CCCCCC',
//     marginHorizontal: 10,
//   },
// });

// export default AttendanceScreen;




import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import { ENDPOINT } from '../api/endpoint'; // Import the provided ENDPOINT
import apiClient from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const attendanceChartData = [
  { value: 6, label: 'Mon', frontColor: '#FE970080' },
  { value: 7, label: 'Tue', frontColor: '#FE970080' },

  { value: 9, label: 'Wed', frontColor: '#FE970080' },
  { value: 5, label: 'Thu', frontColor: '#FE9700' },
  { value: 4, label: 'Fri', frontColor: '#FE970080' },
];

const attendanceListData = [
  {
    date: '8 December 2024',
    clockIn: '08:45:00',
    clockOut: '17:10:00',
    type: 'Regular',
  },
  {
    date: '7 December 2024',
    clockIn: '09:00:00',
    clockOut: '17:45:00',
    type: 'Regular',
  },
  {
    date: '6 December 2024',
    clockIn: '08:45:00',
    clockOut: '17:10:00',
    type: 'Regular',
  },
  {
    date: '5 December 2024',
    clockIn: '09:00:00',
    clockOut: '17:45:00',
    type: 'Regular',
  },
];

// Define AttendanceCard component separately
const AttendanceCard = ({ item }) => {
  return (
    <View style={styles.attCard}>
      <View style={styles.sideBar} />
      <View style={styles.cardContent}>
        <View style={styles.timeRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Clock In</Text>
            <Text style={styles.timeValue}>{item.clockIn}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Clock Out</Text>
            <Text style={styles.timeValue}>{item.clockOut}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const AttendanceScreen = () => {
  const [mode, setMode] = useState('Home');
  const [isLoadingIn, setIsLoadingIn] = useState(false);
  const [isLoadingOut, setIsLoadingOut] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState('');
  const progress = 0.75;

  useEffect(() => {
    const checkClockIn = async () => {
      setIsLoadingIn(true);
      try {
        const empId = await AsyncStorage.getItem('empId');

        // CALL the function with empId
        const url = ENDPOINT.BREAK.CHECKCHECKIN(empId);
        console.log('Final API URL:', url);

        const response = await apiClient.get(url);
        console.log('API Response:', response.data.status);

        if (response.status === 200 || response.status === 201) {
          setCheckInSuccess(response.data.status);
        } else {
          Alert.alert('Error', response.data.message || 'Failed to clock in.');
        }
      } catch (error) {
        console.error('Clock In Error:', error);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Something went wrong. Please try again.',
        );
      } finally {
        setIsLoadingIn(false);
      }
    };

    checkClockIn();
  }, []);

  const handleClockIn = async () => {
    setIsLoadingIn(true);
    try {
      const empId = await AsyncStorage.getItem('empId');
      const orgId = await AsyncStorage.getItem('orgId');
      const now = new Date();

      const mm = String(now.getMonth() + 1).padStart(2, '0'); // Month (01-12)
      const dd = String(now.getDate()).padStart(2, '0'); // Day (01-31)
      const yy = String(now.getFullYear()).slice(-2); // Last two digits of year

      const formattedDate = `${mm}/${dd}/${yy}`;
      const currentTime = now.toTimeString().split(' ')[0]; // e.g., "13:45:30"

      const response = await apiClient.post(ENDPOINT.BREAK.CHECKIN, {
        employeeId: empId,
        date: formattedDate,
        checkIn: currentTime,
        orgId: orgId,
        userLat: '22.7487527',
        userLng: '75.8957078',
      });

      if (response.status === 200 || response.status === 201) {
        setCheckInSuccess(response.data.status);
        Alert.alert('Success', response.data.message || 'Break in successful!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to clock in.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong. Please try again.',
      );
      console.error('Clock In Error:', error);
    } finally {
      setIsLoadingIn(false);
    }
  };

  const handleClockOut = async () => {
    setIsLoadingOut(true);
    try {
      const empId = await AsyncStorage.getItem('empId');
      const orgId = await AsyncStorage.getItem('orgId');
      const now = new Date();

      const mm = String(now.getMonth() + 1).padStart(2, '0'); // Month (01-12)
      const dd = String(now.getDate()).padStart(2, '0'); // Day (01-31)
      const yy = String(now.getFullYear()).slice(-2); // Last two digits of year

      const formattedDate = `${mm}/${dd}/${yy}`;
      const currentTime = now.toTimeString().split(' ')[0]; // e.g., "13:45:30"

      const response = await apiClient.post(ENDPOINT.BREAK.CHECKOUT, {
        employeeId: empId,
        date: formattedDate,
        checkOut: currentTime,
        orgId: orgId,
        userLat: '22.7487527',
        userLng: '75.8957078',
      });

      if (response.status === 200 || response.status === 201) {
        setCheckInSuccess(''); // Reset to allow "Break In" again
        Alert.alert('Success', response.data.message || 'Break out successful!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to break out.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong. Please try again.',
      );
      console.error('Break Out Error:', error);
    } finally {
      setIsLoadingOut(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerTextContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../assets/BackArrow.png')}
            style={styles.backArrowIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Choose your remote mode</Text>
      </View>

      {/* Toggle */}
      <View style={styles.toggleContentHeader}>
        <LinearGradient
          colors={['#ED8C85', '#8C86BD']}
          style={styles.toggleContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              mode === 'Home' && styles.activeToggle,
            ]}
            onPress={() => setMode('Home')}>
            <View style={styles.toggleContent}>
              <Image
                source={require('../assets/Home.png')}
                style={[
                  styles.buttonIcon,
                  mode === 'Home' && styles.activeIcon,
                ]}
              />
              <Text
                style={[
                  styles.toggleText,
                  mode === 'Home' && styles.activeToggleText,
                ]}>
                Home
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              mode === 'Office' && styles.activeToggle,
            ]}
            onPress={() => setMode('Office')}>
            <View style={styles.toggleContent}>
              <Image
                source={require('../assets/Office.png')}
                style={[
                  styles.buttonIcon,
                  mode === 'Office' && styles.activeIcon,
                ]}
              />
              <Text
                style={[
                  styles.toggleText,
                  mode === 'Office' && styles.activeToggleText,
                ]}>
                Office
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Main Content */}
      <View style={styles.combinedSection}>
        {/* Clock Data */}
        <View style={styles.middleSection}>
          <View style={styles.timeRow}>
            <View style={styles.timeBox}>
              <Image
                source={require('../assets/map.png')}
                style={styles.timePic}
              />
            </View>
            <View style={styles.timeBox}>
              <Image
                source={require('../assets/watchIn.png')}
                style={styles.timePic}
              />
              <Text style={styles.timeValue}>08:15 AM</Text>
              <Text style={styles.timeLabel}>Clock In</Text>
            </View>
            <View style={styles.timeBox}>
              <Image
                source={require('../assets/watchOut.png')}
                style={styles.timePic}
              />
              <Text style={styles.timeValue}>06:15 PM</Text>
              <Text style={styles.timeLabel}>Clock Out</Text>
            </View>
            <View style={styles.timeBox}>
              <Image
                source={require('../assets/watchthree.png')}
                style={styles.timePic}
              />
              <Text style={styles.timeValue}>09 hrs</Text>
              <Text style={styles.timeLabel}>Duration</Text>
            </View>
          </View>

          <Text style={styles.dateTextLarge}>Monday, 19 May 2025</Text>

          <View style={styles.circle}>
            <Progress.Circle
              size={160}
              progress={progress}
              color="#F38D0E"
              unfilledColor="#E4392F"
              borderWidth={0}
              thickness={20}
              showsText={false}
            />
            <View style={styles.circleTextContainer}>
              <Text style={styles.circleTop}>START</Text>
              <Text style={styles.circleBottom}>10:30 {'\n'} AM</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.clockBtn, isLoadingIn && styles.disabledBtn]}
              onPress={handleClockIn}
              disabled={isLoadingIn}>
              <View style={styles.buttonContent}>
                {isLoadingIn ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Image
                      source={require('../assets/checkarrowone.png')}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.btnText}>
                      {checkInSuccess !== 'success' ? 'CHECK IN' : 'Break In'}
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.clockBtn, isLoadingOut && styles.disabledBtn]}
              onPress={handleClockOut}
              disabled={isLoadingOut}>
              <View style={styles.buttonContent}>
                {isLoadingOut ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Image
                      source={require('../assets/checkarrowtwo.png')}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.btnText}>
                      {checkInSuccess !== 'success' ? 'CHECK OUT' : 'Break Out'}
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
          
        </View>

        {/* Attendance Chart */}
        <View style={styles.AttendanceSection}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>Attendance</Text>
            <TouchableOpacity style={styles.exportBtn}>
              <Text style={styles.exportText}>Export Report</Text>
            </TouchableOpacity>
          </View>
          <BarChart
            data={attendanceChartData}
            barWidth={16}
            spacing={20}
            noOfSections={5}
            maxValue={10}
            frontColor="#FF6B6B"
            yAxisThickness={0}
            xAxisThickness={0}
            width={400}
            height={120}
          />
        </View>

        {/* Attendance List */}
        <View style={styles.attendanceListContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.headerTitle}>Attendance Data</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={attendanceListData}
            renderItem={({ item }) => <AttendanceCard item={item} />}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402530',
    padding: 8,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
  },
  backArrowIcon: {
    width: 14,
    height: 12,
    tintColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  toggleContentHeader: {
    marginBottom: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePic: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#E4392F',
  },
  buttonIcon: {
    width: 12,
    height: 12,
    marginRight: 8,
    tintColor: '#FFFFFF',
  },
  activeIcon: {
    tintColor: '#402530',
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  activeToggleText: {
    color: '#402530',
  },
  combinedSection: {
    backgroundColor: '#F5F5F0',
    borderRadius: 10,
    padding: 10,
  },
  middleSection: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#F6E7E0',
  },
  AttendanceSection: {
    padding: 16,
    borderRadius: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeBox: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6A3A3A',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  dateTextLarge: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  circle: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  circleTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleTop: {
    fontSize: 14,
    color: '#6A3A3A',
  },
  circleBottom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E66957',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  clockBtn: {
    flex: 0.45,
    marginHorizontal: 5,
    backgroundColor: '#916248',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#cccccc',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
    fontFamily: 'inter',
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  attendanceTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  exportBtn: {
    backgroundColor: '#A78090',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  exportText: {
    fontSize: 12,
    color: '#fff',
  },
  attendanceListContainer: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    backgroundColor: '#F5F5F0',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAll: {
    color: '#808080',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  attCard: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sideBar: {
    width: 5,
    backgroundColor: '#FFA500',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 10,
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 5,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  typeText: {
    fontSize: 14,
    color: '#555555',
  },
  timeLabel: {
    fontSize: 12,
    color: '#777777',
  },
  timeValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 10,
  },
});

export default AttendanceScreen;