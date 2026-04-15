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
} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import {ENDPOINT} from '../api/endpoint';
import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {Modal} from 'react-native-paper';
import {fetchEmployeeById} from '../redux/employeeSlice';
import { useDispatch, useSelector } from 'react-redux';

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
  const convertISTtoUTC = timeStr => {
    // Check for null, empty, or invalid format
    if (!timeStr || !/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
      return '--:--:--';
    }

    const [hours, minutes, seconds] = timeStr.split(':').map(Number);

    // If any part is NaN, fallback
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return '--:--:--';
    }

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    // Subtract 5 hours 30 minutes (330 mins)
    date.setMinutes(date.getMinutes() - 330);

    const utcHours = String(date.getHours()).padStart(2, '0');
    const utcMinutes = String(date.getMinutes()).padStart(2, '0');
    // const utcSeconds = String(date.getSeconds()).padStart(2, '0');

    return `${utcHours}:${utcMinutes}`;
  };

  const clockInUTC = convertISTtoUTC(item.clockIn);
  const clockOutUTC = convertISTtoUTC(item.clockOut);

  return (
    <View style={styles.attCard}>
      <View style={styles.sideBar} />
      <View style={styles.cardContent}>
        <View style={styles.timeRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateText}>{item.date || '--/--/----'}</Text>
            <Text style={styles.typeText}>{item.type || '--'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Clock In</Text>
            <Text style={styles.timeValue}>{clockInUTC}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Clock Out</Text>
            <Text style={styles.timeValue}>{clockOutUTC}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const AttendanceScreen = () => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState('Home');
  const [isLoadingIn, setIsLoadingIn] = useState(false);
  const [isLoadingOut, setIsLoadingOut] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState('');
  const [workProgress, setWorkProgress] = useState({
    hoursElapsed: '0',
    percentage: '0',
  });
  // const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [attendaceRecord, setAttendaceRecord] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const progress = 0.75;

  const [checkInTime, setCheckInTime] = useState(null);
  const [duration, setDuration] = useState('00:00:00');
  const { employee, loading, error } = useSelector((state) => state.employee);
  console.log('Employee Data:', employee?.shiftId?.compulsoryWorkHours );
  const [requiredHours, setRequiredHours] = useState(8.333); // Default value
  const totalRequiredHours = requiredHours;

  useEffect(() => {
    let timer = null;

    // Jab user checked-in ho aur break par na ho tab timer chalega
    if (checkInSuccess === 'checkIn' || checkInSuccess === 'breakOut') {
      timer = setInterval(() => {
        if (checkInTime) {
          // 1. Current Time and Start Time setup
          const now = new Date();
          const [hh, mm, ss] = checkInTime.split(':').map(Number);

          const startTime = new Date();
          startTime.setHours(hh, mm, ss);

          // 2. Time Difference in Seconds
          const diffMs = now - startTime;
          const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

          // 3. Format to HH:MM:SS
          const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
          const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
            2,
            '0',
          );
          const s = String(totalSeconds % 60).padStart(2, '0');

          const formattedHMS = `${h}:${m}:${s}`; // Ab seconds bhi aayenge

          // 4. Calculate Percentage (Decimal hours for accuracy)
          const hoursDecimal = totalSeconds / 3600;
          const progressPercent = (
            (hoursDecimal / totalRequiredHours) *
            100
          ).toFixed(2);

          // Update State
          setWorkProgress({
            hoursElapsed: formattedHMS, // HH:MM:SS format
            percentage: Math.min(progressPercent, 100),
          });
        }
      }, 1000); // Har 1 second mein chalega
    } else if (checkInSuccess === 'startDay' || !checkInSuccess) {
      // Agar check-out ho gaya hai ya day start nahi hua to reset
      setWorkProgress({hoursElapsed: '00:00:00', percentage: '0'});
    }

    return () => clearInterval(timer);
  }, [checkInTime, checkInSuccess]);



  useEffect(() => {
    const checkClockIn = async () => {
      try {
        const empId = await AsyncStorage.getItem('empId');
        const url = ENDPOINT.BREAK.CHECKCHECKIN(empId);
        const response = await apiClient.get(url);

        if (response.status === 200 || response.status === 201) {
          const data = response.data.data;
          setCheckInSuccess(data?.trackStatus);

          // Helper functions
          const timeStringToSeconds = timeStr => {
            const [hours, minutes, seconds] = timeStr.split(':').map(Number);
            return hours * 3600 + minutes * 60 + seconds;
          };

          const secondsToHMS = totalSeconds => {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          };

          const currentTimeIST = new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: false,
          });

          const checkInUTC = new Date(data?.checkIn)
            .toISOString()
            .split('T')[1]
            .split('.')[0];
          setCheckInTime(checkInUTC);

          const checkOutUTC =
            data?.checkOut &&
            new Date(data?.checkOut).toISOString().split('T')[1].split('.')[0];
          setCheckOutTime(checkOutUTC);

          const currentSecs = timeStringToSeconds(currentTimeIST);
          const checkInSecs = timeStringToSeconds(checkInUTC);
          let diffSecs = currentSecs - checkInSecs;

          let totalBreakDurationMs = 0;
          if (Array.isArray(data.breaks)) {
            data.breaks.forEach(breakItem => {
              const breakIn = new Date(breakItem.breakIn);
              const breakOut = new Date(breakItem.breakOut);

              if (!isNaN(breakIn) && !isNaN(breakOut)) {
                const duration = breakOut - breakIn;
                totalBreakDurationMs += duration;
              }
            });
          }

          const breakSecs = Math.floor(totalBreakDurationMs / 1000);
          const finalWorkingSecs = diffSecs - breakSecs;

          // HH:MM:SS format
          const formattedWorkingTime = secondsToHMS(finalWorkingSecs);

          // सिर्फ HH:MM निकालना
          const formattedHHMM = formattedWorkingTime.slice(0, 5);

          // Decimal hours for percentage calculation
          const [hh, mm, ss] = formattedWorkingTime.split(':').map(Number);
          const hoursDecimal = hh + mm / 60 + ss / 3600;

          // const totalRequiredHours = 8.333;
          const progressPercent = (
            (hoursDecimal / totalRequiredHours) *
            100
          ).toFixed(2);

          setWorkProgress({
            hoursElapsed: formattedHHMM, // अब HH:MM format में
            percentage: progressPercent,
          });
        } else {
          Alert.alert('Error', response.data.message || 'Failed to clock in.');
        }
      } catch (error) {
        setCheckInSuccess('startDay');
        console.log(error);
      } finally {
        setIsLoadingIn(false);
      }
    };

    checkClockIn();
  }, []);

 useEffect(() => {
  const loadData = async () => {
    const empId = await AsyncStorage.getItem('empId');
    if (empId) {
      try {
        const result = await dispatch(fetchEmployeeById(empId)).unwrap();
        
        // Agar response minutes mein hai (e.g. 500)
        const shiftMinutes = result?.shiftId?.compulsoryWorkHours; 
        
        if (shiftMinutes) {
          // Minutes ko hours mein convert karein (Decimal format mein)
          const hoursInDecimal = shiftMinutes / 60; 
          
          console.log("Converted Hours:", hoursInDecimal);
          
          // State mein set karein taaki Progress Circle aur Timer ise use kar sakein
          setRequiredHours(hoursInDecimal);
        }
      } catch (err) {
        console.log("Error fetching employee:", err);
      }
    }
  };
  loadData();
}, [dispatch]);

  useEffect(() => {
    const chartIn = async () => {
      try {
        const empId = await AsyncStorage.getItem('empId');
        const response = await apiClient.get(ENDPOINT.BREAK.CHART(empId));
        if (response.status === 200) {
          const data = response.data.data;
        } else {
          Alert.alert('Error', response.data.message || 'Failed to clock in.');
        }
      } catch (error) {
        console.log(error, '11222333333');
      } finally {
        setIsLoadingIn(false);
      }
    };

    chartIn();
  }, []);

  useEffect(() => {
    const attendanceRecord = async () => {
      setIsLoadingIn(true);
      try {
        const empId = await AsyncStorage.getItem('empId');
        const endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        const startDate = moment().subtract(8, 'days').format('YYYY-MM-DD');

        const url = ENDPOINT.BREAK.ATTENDANCERECORD(empId, startDate, endDate);
        const response = await apiClient.get(url);

        if (response.status === 200) {
          const rawData = response.data.data;
          // console.log(rawData, '✅ attendanceListData 11111111111111');
          const attendanceListData = rawData?.attendanceRecords?.map(item => ({
            date: moment(item.date).format('D MMMM YYYY'), // e.g., 21 July 2025
            clockIn: item.checkIn
              ? moment(item.checkIn).format('HH:mm:ss')
              : '--:--:--',
            clockOut: item.checkOut
              ? moment(item.checkOut).format('HH:mm:ss')
              : '--:--:--',
            type: item.status || 'Regular', // fallback to 'Regular' if missing
          }));
          setAttendaceRecord(attendanceListData);
          // console.log(
          //   attendanceListData,
          //   '✅ attendanceListData 11111111111111',
          // );
        } else {
          Alert.alert(
            'Error',
            response.data.message || 'Failed to fetch attendance record.',
          );
        }
      } catch (error) {
        console.log(error, '❌ Error in attendance fetch');
      } finally {
        setIsLoadingIn(false);
      }
    };

    attendanceRecord();
  }, []);

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
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0]; // HH:mm:ss

        setCheckInTime(currentTime); // Timer start karne ke liye
        setCheckInSuccess('checkIn');
        Alert.alert('Success', response.data.message || 'Break in successful!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to clock in.');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingIn(false);
    }
  };

  const handleClockOut = async () => {
    setModalVisible(false); // Close modal
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
        reportingType: 'mobile'
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
      console.log(error.message);
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
        setCheckInSuccess('breakIn');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to Break In.');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingIn(false);
    }
  };

  const handleBreakOut = async () => {
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
        setCheckInSuccess('breakOut');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to Break Out.');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoadingOut(false);
    }
  };

  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.navigate('DashboardScreen');
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    weekday: 'long', // Monday
    day: '2-digit', // 19
    month: 'long', // May
    year: 'numeric', // 2025
  });

  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled={true}
      contentContainerStyle={{paddingBottom: 20}}>
      {/* Header */}
      <View style={styles.headerTextContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
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
              <Text style={styles.timeValue}>{checkOutTime}</Text>
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

          <Text style={styles.dateTextLarge}>{formattedDate}</Text>

          <View style={styles.circle}>
            <Progress.Circle
              size={160}
              progress={workProgress.percentage / 100}
              color="#F38D0E"
              unfilledColor="#E4392F"
              borderWidth={0}
              thickness={20}
              showsText={false}
            />
            <View style={styles.circleTextContainer}>
              <Text style={styles.circleTop}>START</Text>
              <Text style={styles.circleBottom}>
                {workProgress.percentage}%
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            {checkInSuccess === 'startDay' && (
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
                      <Text style={styles.btnText}>Check In</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {checkInSuccess === 'checkIn' && (
              <>
                <TouchableOpacity
                  style={[styles.clockBtn, isLoadingIn && styles.disabledBtn]}
                  onPress={handleBreakIn}
                  disabled={isLoadingIn}>
                  <View style={styles.buttonContent}>
                    {isLoadingIn ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Image
                          source={require('../assets/checkarrowone.png')} // Update with appropriate icon
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.btnText}>Break In</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.clockBtn, isLoadingOut && styles.disabledBtn]}
                  onPress={() => setModalVisible(true)}
                  disabled={isLoadingOut}>
                  <View style={styles.buttonContent}>
                    {isLoadingOut ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Image
                          source={require('../assets/checkarrowone.png')}
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.btnText}>Check Out</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}
            {checkInSuccess === 'breakIn' && (
              <TouchableOpacity
                style={[styles.clockBtn, isLoadingOut && styles.disabledBtn]}
                onPress={handleBreakOut}
                disabled={isLoadingOut}>
                <View style={styles.buttonContent}>
                  {isLoadingOut ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Image
                        source={require('../assets/checkarrowone.png')}
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
                  onPress={handleBreakIn}
                  disabled={isLoadingIn}>
                  <View style={styles.buttonContent}>
                    {isLoadingIn ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Image
                          source={require('../assets/checkarrowone.png')} // Update with appropriate icon
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.btnText}>Break In</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.clockBtn, isLoadingOut && styles.disabledBtn]}
                  onPress={() => setModalVisible(true)}
                  disabled={isLoadingOut}>
                  <View style={styles.buttonContent}>
                    {isLoadingOut ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Image
                          source={require('../assets/checkarrowone.png')} // Update with appropriate icon
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.btnText}>Check Out</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Are you sure you want to check out?
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleClockOut}
                    style={styles.confirmButton}>
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {/* Attendance Section */}
        <View style={styles.AttendanceSection}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>Attendance</Text>
            {/* <TouchableOpacity style={styles.exportBtn}>
              <Text style={styles.exportText}>Export Report</Text>
            </TouchableOpacity> */}
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
            {/* <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity> */}
          </View>
          <FlatList
            data={attendaceRecord}
            renderItem={({item}) => <AttendanceCard item={item} />}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
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
    fontFamily: 'Poppins',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0,
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
    width: 15,
    height: 17,
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
    fontFamily: 'ABeeZee',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 1,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    justifyContent: 'center',
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
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    lineHeight: 20 * 1.4,
    letterSpacing: 0,
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
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16.8,
    letterSpacing: 0,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    height: 150,
    justifyContent: 'center', // ensures vertical alignment inside modal box
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: '500',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },

  confirmButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#E66957',
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },

  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AttendanceScreen;



// import React, {useState} from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView
// } from "react-native";

// const ProfileScreen = () => {

//   const [activeTab, setActiveTab] = useState("Attendance");

//   const attendanceData = [
//     {label: "Total Days", value: "28"},
//     {label: "Total Working Days", value: "28"},
//     {label: "Total Holidays", value: "0"},
//     {label: "Total Days Present", value: "01"},
//     {label: "Total Days Absent", value: "27"},
//     {label: "Total Leave Days", value: "0"},
//     {label: "Total LWS Days", value: "0"},
//     {label: "Total Paid Half Days", value: "0"},
//     {label: "Total Unpaid Half Days", value: "0"},
//     {label: "Average Checkin", value: "N/A"},
//   ];

//   return (
//     <ScrollView style={styles.container}>

//       {/* Profile Header */}
//       <View style={styles.profileCard}>
//         <Image
//           source={{uri: "https://i.pravatar.cc/300"}}
//           style={styles.avatar}
//         />

//         <Text style={styles.name}>Tanishka Tyagi</Text>
//         <Text style={styles.role}>UI/UX Designer</Text>
//         <Text style={styles.empId}>E2031</Text>

//         <Text style={styles.info}>📧 tanishka.tyagi@talentcompliance.in</Text>
//         <Text style={styles.info}>📞 +91 9068359688</Text>
//         <Text style={styles.info}>📍 Sector 134, Noida, Uttar Pradesh</Text>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabs}>
//         {["Personal Info","Job Details","Attendance","Leaves"].map(tab => (
//           <TouchableOpacity key={tab} onPress={()=>setActiveTab(tab)}>
//             <Text style={[
//               styles.tabText,
//               activeTab === tab && styles.activeTab
//             ]}>
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Attendance Card */}
//       {activeTab === "Attendance" && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Monthly Attendance Summary</Text>

//           {attendanceData.map((item,index)=>(
//             <View key={index} style={styles.row}>
//               <Text style={styles.label}>{item.label}</Text>
//               <Text style={styles.value}>{item.value}</Text>
//             </View>
//           ))}

//         </View>
//       )}

//     </ScrollView>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({

//   container:{
//     flex:1,
//     backgroundColor:"#f3f4f6"
//   },

//   profileCard:{
//     backgroundColor:"#fff",
//     alignItems:"center",
//     padding:20,
//     borderBottomLeftRadius:20,
//     borderBottomRightRadius:20
//   },

//   avatar:{
//     width:80,
//     height:80,
//     borderRadius:40,
//     marginBottom:10
//   },

//   name:{
//     fontSize:18,
//     fontWeight:"bold"
//   },

//   role:{
//     color:"#555"
//   },

//   empId:{
//     color:"#888",
//     marginBottom:10
//   },

//   info:{
//     fontSize:13,
//     color:"#444",
//     marginTop:2
//   },

//   tabs:{
//     flexDirection:"row",
//     justifyContent:"space-around",
//     backgroundColor:"#fff",
//     paddingVertical:10,
//     marginTop:10
//   },

//   tabText:{
//     color:"#555",
//     fontSize:14
//   },

//   activeTab:{
//     color:"#ef4444",
//     borderBottomWidth:2,
//     borderBottomColor:"#ef4444",
//     paddingBottom:4
//   },

//   card:{
//     backgroundColor:"#fff",
//     margin:15,
//     borderRadius:10,
//     padding:15
//   },

//   cardTitle:{
//     fontSize:16,
//     fontWeight:"600",
//     marginBottom:10
//   },

//   row:{
//     flexDirection:"row",
//     justifyContent:"space-between",
//     paddingVertical:6
//   },

//   label:{
//     color:"#ef4444"
//   },

//   value:{
//     color:"#333"
//   }

// });