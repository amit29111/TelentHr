import React, {useEffect, useState} from 'react';
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
  Button
} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import {ENDPOINT} from '../api/endpoint';
import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const attendanceChartData = [
  {value: 6, label: 'Mon', frontColor: '#FE970080'},
  {value: 7, label: 'Tue', frontColor: '#FE970080'},
  {value: 9, label: 'Wed', frontColor: '#FE970080'},
  {value: 5, label: 'Thu', frontColor: '#FE9700'},
  {value: 4, label: 'Fri', frontColor: '#FE970080'},
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

const AttendanceCard = ({item}) => {
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
  const [workProgress, setWorkProgress] = useState({ hoursElapsed: '0', percentage: '0' });
const [checkInTime, setCheckInTime] = useState('')
  const progress = 0.75;  
  console.log('workProgress', workProgress)

  // useEffect(() => {
  //   const checkClockIn = async () => {
  //     setIsLoadingIn(true);
  //     try {
  //       const empId = await AsyncStorage.getItem('empId');
  //       const url = ENDPOINT.BREAK.CHECKCHECKIN(empId);
  //       const response = await apiClient.get(url);
  //       console.log('111111111111', response.data.data.trackStatus);
  //       if (response.status === 200 || response.status === 201) {
  //         setCheckInSuccess(response.data.data.trackStatus);
  //       } else {
  //         Alert.alert('Error', response.data.message || 'Failed to clock in.');
  //       }
  //     } catch (error) {
  //       console.log(error.message)
  //       // Alert.alert(
  //       //   'Error',
  //       //   error.response?.data?.message ||
  //       //     'Something went wrong. Please try again.',
  //       // );
  //     } finally {
  //       setIsLoadingIn(false);
  //     }
  //   };
  //   checkClockIn();
  // }, [checkInSuccess]);

//  useEffect(() => {
//   const checkClockIn = async () => {
//     setIsLoadingIn(true);
//     try {
//       const empId = await AsyncStorage.getItem('empId');
//       const url = ENDPOINT.BREAK.CHECKCHECKIN(empId);
//       const response = await apiClient.get(url);

//       if (response.status === 200 || response.status === 201) {
//         const data = response.data.data;
//         setCheckInSuccess(data.trackStatus);

//         // Helper functions
//         const timeStringToSeconds = (timeStr) => {
//           const [hours, minutes, seconds] = timeStr.split(':').map(Number);
//           return hours * 3600 + minutes * 60 + seconds;
//         };

//         const secondsToHMS = (totalSeconds) => {
//           const hours = Math.floor(totalSeconds / 3600);
//           const minutes = Math.floor((totalSeconds % 3600) / 60);
//           const seconds = totalSeconds % 60;
//           return `${hours.toString().padStart(2, '0')}:${minutes
//             .toString()
//             .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//         };

//         // Get current time (IST) and check-in time (UTC)
//         const currentTimeIST = new Date().toLocaleTimeString('en-IN', {
//           timeZone: 'Asia/Kolkata',
//           hour12: false,
//         });

//         const checkInUTC = new Date(data.checkIn).toISOString().split('T')[1].split('.')[0];

//         // Convert both to seconds
//         const currentSecs = timeStringToSeconds(currentTimeIST);
//         const checkInSecs = timeStringToSeconds(checkInUTC);

//         // Calculate difference
//         let diffSecs = currentSecs - checkInSecs;

//         // ⏱️ Subtract total break time
//         let totalBreakDurationMs = 0;
//         if (Array.isArray(data.breaks)) {
//           data.breaks.forEach((breakItem, index) => {
//             const breakIn = new Date(breakItem.breakIn);
//             const breakOut = new Date(breakItem.breakOut);

//             if (!isNaN(breakIn) && !isNaN(breakOut)) {
//               const duration = breakOut - breakIn;
//               totalBreakDurationMs += duration;
//               console.log(`☕ Break ${index + 1}: ${(duration / 60000).toFixed(2)} minutes`);
//             }
//           });
//         }

//         const breakSecs = Math.floor(totalBreakDurationMs / 1000);
//         const finalWorkingSecs = diffSecs - breakSecs;

//         const formattedWorkingTime = secondsToHMS(finalWorkingSecs);

//         console.log("🕒 Total Working Time (HH:mm:ss):", formattedWorkingTime);
//       } else {
//         Alert.alert('Error', response.data.message || 'Failed to clock in.');
//       }
//     } catch (error) {
//       console.log(error.message);
//     } finally {
//       setIsLoadingIn(false);
//     }
//   };

//   checkClockIn();
// }, [checkInSuccess]);

useEffect(() => {
  const checkClockIn = async () => {
    setIsLoadingIn(true);
    try {
      const empId = await AsyncStorage.getItem('empId');
      const url = ENDPOINT.BREAK.CHECKCHECKIN(empId);
      const response = await apiClient.get(url);

      if (response.status === 200 || response.status === 201) {
        const data = response.data.data;
        setCheckInSuccess(data.trackStatus);

        // Helper functions
        const timeStringToSeconds = (timeStr) => {
          const [hours, minutes, seconds] = timeStr.split(':').map(Number);
          return hours * 3600 + minutes * 60 + seconds;
        };

        const secondsToHMS = (totalSeconds) => {
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        // Get current time (IST) and check-in time (UTC)
        const currentTimeIST = new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
        });

        const checkInUTC = new Date(data.checkIn).toISOString().split('T')[1].split('.')[0];
        setCheckInTime(checkInUTC)

        // Convert both to seconds
        const currentSecs = timeStringToSeconds(currentTimeIST);
        const checkInSecs = timeStringToSeconds(checkInUTC);

        // Calculate difference
        let diffSecs = currentSecs - checkInSecs;

        // ⏱️ Subtract total break time
        let totalBreakDurationMs = 0;
        if (Array.isArray(data.breaks)) {
          data.breaks.forEach((breakItem, index) => {
            const breakIn = new Date(breakItem.breakIn);
            const breakOut = new Date(breakItem.breakOut);

            if (!isNaN(breakIn) && !isNaN(breakOut)) {
              const duration = breakOut - breakIn;
              totalBreakDurationMs += duration;
              console.log(`☕ Break ${index + 1}: ${(duration / 60000).toFixed(2)} minutes`);
            }
          });
        }

        const breakSecs = Math.floor(totalBreakDurationMs / 1000);
        const finalWorkingSecs = diffSecs - breakSecs;

        const formattedWorkingTime = secondsToHMS(finalWorkingSecs);

        // ✅ Set workProgress state
        const [hh, mm, ss] = formattedWorkingTime.split(':').map(Number);
        const hoursDecimal = hh + mm / 60 + ss / 3600;
        const totalRequiredHours = 8;
        const progressPercent = ((hoursDecimal / totalRequiredHours) * 100).toFixed(2);

        setWorkProgress({
          hoursElapsed: hoursDecimal.toFixed(2),
          percentage: progressPercent,
        });

        console.log("📊 Work Progress:", {
          hoursElapsed: hoursDecimal.toFixed(2),
          percentage: progressPercent,
        });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to clock in.');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingIn(false);
    }
  };

  checkClockIn();
}, [checkInSuccess]);


  const handleClockIn = async () => {
    setIsLoadingIn(true);
    try {
      const empId = await AsyncStorage.getItem('empId');
      const orgId = await AsyncStorage.getItem('orgId');
      const now = new Date();

      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const yy = String(now.getFullYear()).slice(-2);

      const formattedDate = `${mm}/${dd}/${yy}`;
      const currentTime = now.toTimeString().split(' ')[0];

      const response = await apiClient.post(ENDPOINT.BREAK.CHECKIN, {
        employeeId: empId,
        date: formattedDate,
        checkIn: currentTime,
        orgId: orgId,
        userLat: '22.7487527',
        userLng: '75.8957078',
      });

      if (response.status === 200 || response.status === 201) {
        // setCheckInSuccess(response.data.status);
        Alert.alert('Success', response.data.message || 'Break in successful!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to clock in.');
      }
    } catch (error) {
      console.log(error.message)
      // Alert.alert(
      //   'Error',
      //   error.response?.data?.message ||
      //     'Something went wrong. Please try again.',
      // );
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

      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const yy = String(now.getFullYear()).slice(-2);

      const formattedDate = `${mm}/${dd}/${yy}`;
      const currentTime = now.toTimeString().split(' ')[0];

      const response = await apiClient.post(ENDPOINT.BREAK.CHECKOUT, {
        employeeId: empId,
        date: formattedDate,
        checkOut: currentTime,
        orgId: orgId,
        userLat: '22.7487527',
        userLng: '75.8957078',
      });

      if (response.status === 200 || response.status === 201) {
        setCheckInSuccess('');
        Alert.alert(
          'Success',
          response.data.message || 'Break out successful!',
        );
      } else {
        Alert.alert('Error', response.data.message || 'Failed to break out.');
      }
    } catch (error) {
      console.log(error.message)
      // Alert.alert(
      //   'Error',
      //   error.response?.data?.message ||
      //     'Something went wrong. Please try again.',
      // );
    } finally {
      setIsLoadingOut(false);
    }
  };

  const handleBreakIn = async () => {
    try {
      const empId = await AsyncStorage.getItem('empId');
      const orgId = await AsyncStorage.getItem('orgId');
      const now = new Date();

      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const yy = String(now.getFullYear()).slice(-2);
      const formattedDate = `${mm}/${dd}/${yy}`;
      const currentTime = now.toTimeString().split(' ')[0];

      const response = await apiClient.post(ENDPOINT.BREAK.BREAKIN, {
        employeeId: empId,
        date: formattedDate,
        breakIn: currentTime,
        orgId: orgId,
        userLat: '22.7487527',
        userLng: '75.8957078',
      });
      if (response.status === 200 || response.status === 201) {
        setCheckInSuccess('breakIn')
        // Alert.alert('Success', response.data.message || 'Break In successful!');
        // await refreshTrackStatus(); // Get latest status
      } else {
        Alert.alert('Error', response.data.message || 'Failed to Break In.');
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setIsLoadingIn(false);
    }
  };

  const handleBreakOut = async () => {
    // setIsLoadingOut(true);
    try {
      const empId = await AsyncStorage.getItem('empId');
      const orgId = await AsyncStorage.getItem('orgId');
      const now = new Date();

      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const yy = String(now.getFullYear()).slice(-2);
      const formattedDate = `${mm}/${dd}/${yy}`;
      const currentTime = now.toTimeString().split(' ')[0];

      const response = await apiClient.post(ENDPOINT.BREAK.BREAKOUT, {
        employeeId: empId,
        date: formattedDate,
        breakOut: currentTime,
        orgId: orgId,
        userLat: '22.7487527',
        userLng: '75.8957078',
      });

      if (response.status === 200 || response.status === 201) {
        setCheckInSuccess('breakOut')
      } else {
        Alert.alert('Error', response.data.message || 'Failed to Break Out.');
      }
    } catch (error) {
      console.log(error.message)
      // Alert.alert(
      //   'Error',
      //   error.response?.data?.message ||
      //     'Something went wrong during Break Out.',
      // );
    } finally {
      setIsLoadingOut(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 20}}>
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
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
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
        {/* Clock Info */}
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
              <Text style={styles.timeValue}>{checkInTime}</Text>
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
              <Text style={styles.timeValue}>{workProgress.hoursElapsed}</Text>
              <Text style={styles.timeLabel}>Duration</Text>
            </View>
          </View>

          <Text style={styles.dateTextLarge}>Monday, 19 May 2025</Text>

          <View style={styles.circle}>
            <Progress.Circle
              size={160}
              progress={(workProgress.percentage)/100}
              color="#F38D0E"
              unfilledColor="#E4392F"
              borderWidth={0}
              thickness={20}
              showsText={false}
            />
            <View style={styles.circleTextContainer}>
              <Text style={styles.circleTop}>START</Text>
              <Text style={styles.circleBottom}>{workProgress.percentage}%</Text>
            </View>
          </View>

          {/* <View style={styles.buttonRow}>
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
                      {checkInSuccess === 'checkIn' ? 'CHECK IN' : 'Break In'}
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
          </View> */}

          <View style={styles.buttonRow}>
            {/* {checkInSuccess === 'checkIn' && (
              <>
                <TouchableOpacity
                  style={[styles.clockBtn, isLoadingIn && styles.disabledBtn]}
                  onPress={() => {
                    setCheckInSuccess('breakIn');
                    handleClockIn();
                  }}
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
                        <Text style={styles.btnText}>Break In</Text>
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
                        <Text style={styles.btnText}>Break Out</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}

            {checkInSuccess === 'breakIn' && (
              <TouchableOpacity
                style={[styles.clockBtn, isLoadingOut && styles.disabledBtn]}
                onPress={() => {
                  setCheckInSuccess('breakOut');
                  handleClockOut();
                }}
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
                      <Text style={styles.btnText}>Break Out</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {checkInSuccess === 'breakOut' && (
              <>
                <TouchableOpacity
                  style={[styles.clockBtn, isLoadingIn && styles.disabledBtn]}
                  onPress={() => {
                    setCheckInSuccess('breakIn');
                    handleClockIn();
                  }}
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
                        <Text style={styles.btnText}>Break In</Text>
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
                        <Text style={styles.btnText}>Check Out</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )} */}

            {console.log(checkInSuccess,'dsfsfdsfdsfdsfdsf')}

            {checkInSuccess === 'checkIn' && (
              <>
                <Button onPress={handleBreakIn} title="Break In" />
                <Button onPress={handleClockOut} title="Check Out" />
              </>
            )}
            {checkInSuccess === 'breakIn' && (
              <Button onPress={handleBreakOut} title="Break Out" />
            )}
            {checkInSuccess === 'breakOut' && (
              <>
                <Button onPress={handleBreakIn} title="Break In" />
                <Button onPress={handleClockOut} title="Check Out" />
              </>
            )}
          </View>
        </View>

        {/* Attendance Section */}
        <View style={styles.AttendanceSection}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>Attendance</Text>
            <TouchableOpacity style={styles.exportBtn}>
              <Text style={styles.exportText}>Export Report</Text>
            </TouchableOpacity>
          </View>
          <BarChart
            data={attendanceChartData}
            barWidth={width * 0.04}
            spacing={width * 0.05}
            noOfSections={5}
            maxValue={10}
            frontColor="#FF6B6B"
            yAxisThickness={0}
            xAxisThickness={0}
            width={width - 40}
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
            renderItem={({item}) => <AttendanceCard item={item} />}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingBottom: 20,
              gap: 10,
            }}
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
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Poppins', // Make sure Poppins is linked properly
    fontSize: 15,
    lineHeight: 21, // 140% of 15px => 15 * 1.4 = 21
    letterSpacing: 0, // 0% = 0
    textAlign: 'left',
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    fontSize: 22,
    marginBottom: 4,
    color: '#333',
    fontFamily: 'HankenGrotesk-ExtraBold',
    lineHeight: 29.28,
    letterSpacing: 0,
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
    fontFamily: 'ABeeZee', // Make sure the font is properly linked or loaded
    // fontWeight: '400',           // Normal weight
    fontSize: 16,
    lineHeight: 16, // 100% of 16px = 16
    letterSpacing: 1, // 1px
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#4C4544',
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
    fontFamily: 'Poppins-Bold', // Adjust based on font file name

    fontSize: 16,
    lineHeight: 20 * 1.4, // 140% of fontSize = 28
    letterSpacing: 0, // 0% letter spacing
  },
  exportBtn: {
    backgroundColor: '#A78090',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  exportText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Poppins', // Ensure "Poppins-Medium" is loaded and mapped as 'Poppins'
    fontWeight: '500', // Medium weight
    fontSize: 12,
    lineHeight: 16.8, // 140% of 12px = 12 * 1.4 = 16.8
    letterSpacing: 0, // 0% = 0
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
    fontFamily: 'Poppins',
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
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
// import {ENDPOINT} from '../api/endpoint'; // Import the provided ENDPOINT
// import apiClient from '../api/apiClient';
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
//   const [checkInSuccess, setCheckInSuccess] = useState('');
//   const progress = 0.75;

//   useEffect(() => {
//     const checkClockIn = async () => {
//       setIsLoadingIn(true);
//       try {
//         const empId = await AsyncStorage.getItem('empId');

//         // CALL the function with empId
//         const url = ENDPOINT.BREAK.CHECKCHECKIN(empId);
//         console.log('Final API URL:', url);

//         const response = await apiClient.get(url);
//         console.log('API Response:', response.data.status);

//         if (response.status === 200 || response.status === 201) {
//           setCheckInSuccess(response.data.status);
//         } else {
//           Alert.alert('Error', response.data.message || 'Failed to clock in.');
//         }
//       } catch (error) {
//         console.error('Clock In Error:', error);
//         Alert.alert(
//           'Error',
//           error.response?.data?.message ||
//             'Something went wrong. Please try again.',
//         );
//       } finally {
//         setIsLoadingIn(false);
//       }
//     };

//     checkClockIn();
//   }, []);

//   const handleClockIn = async () => {
//     setIsLoadingIn(true);
//     try {
//       const empId = await AsyncStorage.getItem('empId');
//       const orgId = await AsyncStorage.getItem('orgId');
//       const now = new Date();

//       const mm = String(now.getMonth() + 1).padStart(2, '0'); // Month (01-12)
//       const dd = String(now.getDate()).padStart(2, '0'); // Day (01-31)
//       const yy = String(now.getFullYear()).slice(-2); // Last two digits of year

//       const formattedDate = `${mm}/${dd}/${yy}`;
//       const currentTime = now.toTimeString().split(' ')[0]; // e.g., "13:45:30"

//       const response = await apiClient.post(ENDPOINT.BREAK.CHECKIN, {
//         employeeId: empId,
//         date: formattedDate,
//         checkIn: currentTime,
//         orgId: orgId,
//         userLat: '22.7487527',
//         userLng: '75.8957078',
//       });

//       if (response.status === 200 || response.status === 201) {
//         setCheckInSuccess(response.data.status);
//         Alert.alert('Success', response.data.message || 'Break in successful!');
//       } else {
//         Alert.alert('Error', response.data.message || 'Failed to clock in.');
//       }
//     } catch (error) {
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

//   const handleClockOut = async () => {
//     setIsLoadingOut(true);
//     try {
//       const empId = await AsyncStorage.getItem('empId');
//       const orgId = await AsyncStorage.getItem('orgId');
//       const now = new Date();

//       const mm = String(now.getMonth() + 1).padStart(2, '0'); // Month (01-12)
//       const dd = String(now.getDate()).padStart(2, '0'); // Day (01-31)
//       const yy = String(now.getFullYear()).slice(-2); // Last two digits of year

//       const formattedDate = `${mm}/${dd}/${yy}`;
//       const currentTime = now.toTimeString().split(' ')[0]; // e.g., "13:45:30"

//       const response = await apiClient.post(ENDPOINT.BREAK.CHECKOUT, {
//         employeeId: empId,
//         date: formattedDate,
//         checkOut: currentTime,
//         orgId: orgId,
//         userLat: '22.7487527',
//         userLng: '75.8957078',
//       });

//       if (response.status === 200 || response.status === 201) {
//         setCheckInSuccess(''); // Reset to allow "Break In" again
//         Alert.alert(
//           'Success',
//           response.data.message || 'Break out successful!',
//         );
//       } else {
//         Alert.alert('Error', response.data.message || 'Failed to break out.');
//       }
//     } catch (error) {
//       Alert.alert(
//         'Error',
//         error.response?.data?.message ||
//           'Something went wrong. Please try again.',
//       );
//       console.error('Break Out Error:', error);
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
//         {/* Clock Data */}
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
//                   <>
//                     <Image
//                       source={require('../assets/checkarrowone.png')}
//                       style={styles.buttonIcon}
//                     />
//                     <Text style={styles.btnText}>
//                       {checkInSuccess !== 'success' ? 'CHECK IN' : 'Break In'}
//                     </Text>
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
//                     <Text style={styles.btnText}>
//                       {checkInSuccess !== 'success' ? 'CHECK OUT' : 'Break Out'}
//                     </Text>
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
//     color: '#FFFFFF',
//     marginLeft: 8,
//     fontFamily: 'Poppins', // Make sure Poppins is linked properly
//     fontSize: 15,
//     lineHeight: 21, // 140% of 15px => 15 * 1.4 = 21
//     letterSpacing: 0, // 0% = 0
//     textAlign: 'left',
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
//     fontSize: 22,
//     marginBottom: 4,
//     color: '#333',
//     fontFamily: 'HankenGrotesk-ExtraBold',
//     lineHeight: 29.28,
//     letterSpacing: 0,
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
//     fontFamily: 'ABeeZee', // Make sure the font is properly linked or loaded
//     // fontWeight: '400',           // Normal weight
//     fontSize: 16,
//     lineHeight: 16, // 100% of 16px = 16
//     letterSpacing: 1, // 1px
//     textAlign: 'center',
//     textTransform: 'uppercase',
//     color: '#4C4544',
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
//     fontFamily: 'Poppins-Bold', // Adjust based on font file name

//     fontSize: 16,
//     lineHeight: 20 * 1.4, // 140% of fontSize = 28
//     letterSpacing: 0, // 0% letter spacing
//   },
//   exportBtn: {
//     backgroundColor: '#A78090',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   exportText: {
//     fontSize: 12,
//     color: '#fff',
//     fontFamily: 'Poppins', // Ensure "Poppins-Medium" is loaded and mapped as 'Poppins'
//     fontWeight: '500', // Medium weight
//     fontSize: 12,
//     lineHeight: 16.8, // 140% of 12px = 12 * 1.4 = 16.8
//     letterSpacing: 0, // 0% = 0
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
//     fontFamily: 'Poppins',
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
//     fontFamily:'Poppins'
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
//     fontFamily:'Poppins'
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
