import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';

// import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {ENDPOINT} from '../api/endpoint';
import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');
const scaleFont = size => (width / 375) * size;

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedFilter, setSelectedFilter] = useState('Meeting');

  const [calendarDays, setCalendarDays] = useState([]);
  const [startDay, setStartDay] = useState(0);

  const [mettingData, setMettingData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [birthdayData, setBirthdayData] = useState([]);
  const [holidayData, setHolidayData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  const navigation = useNavigation();
  // CalendarScreen ke andar top par add karein
const [attendanceData, setAttendanceData] = useState([]);

useEffect(() => {
  fetchAttendance(); // Attendance fetch karne ke liye
}, [currentMonth, currentYear]);

const fetchAttendance = async () => {
  try {
    const empId = await AsyncStorage.getItem('empId');
    const orgId = "67a3412da38daae94d9861d2";

    const {start, end} = getMonthStartEnd(currentYear, currentMonth);

    const url = `/attendance/getAttendanceByDateRange/${empId}?startDate=${start}&endDate=${end}&organizationId=${orgId}`;

    const resp = await apiClient.get(url);

    if (resp?.data?.data) {
      const {attendanceRecords, weekOffDates} = resp.data.data;

      // ✅ Attendance Records map
      const attendanceFormatted = attendanceRecords.map(item => {
  const d = new Date(item.date);

  return {
    date: d.getDate(),
    fullDate: item.date,
    title: item.status, // Present / Absent
    type: 'Attendance', // ✅ IMPORTANT
    checkIn: item.checkIn,
    checkOut: item.checkOut,
    totalHours: item.totalHoursWorked,
    remarks: item.remarks,
    day: d.toLocaleString('en-US', {weekday: 'short'}),
  };
});

      // ✅ WeekOff ko alag se map karo
      const weekOffFormatted = weekOffDates.map(dateStr => {
  const d = new Date(dateStr);

  return {
    date: d.getDate(),
    fullDate: dateStr,
    title: 'Week Off',
    type: 'Attendance', // ✅ same filter me aayega
    isWeekOff: true,
    day: d.toLocaleString('en-US', {weekday: 'short'}),
  };
});

      // ✅ Dono merge karo
      setAttendanceData([...attendanceFormatted, ...weekOffFormatted]);
    }
  } catch (err) {
    console.log('❌ Attendance API Error:', err);
  }
};

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const getMonthStartEnd = (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };
  };

  useEffect(() => {
    const days = Array.from(
      {length: getDaysInMonth(currentMonth, currentYear)},
      (_, i) => i + 1,
    );
    setCalendarDays(days);
    setStartDay(getFirstDayOfMonth(currentMonth, currentYear));
  }, [currentMonth, currentYear]);

 useEffect(() => {
  fetchHolidays();
  fetchEvent();
  fetchMetting();
  fetchAttendance(); // <-- Ye line add karein
}, [currentMonth, currentYear]);

  // useEffect(() => {
  //   const markDates = () => {
  //     const newMarked = {};

  //     const addToMarked = (arr, colorKey) => {
  //       arr.forEach(item => {
  //         const dateKey = `${currentYear}-${currentMonth + 1}-${item.date}`;
  //         if (!newMarked[dateKey]) newMarked[dateKey] = new Set();
  //         newMarked[dateKey].add(colorKey);
  //       });
  //     };

  //     addToMarked(mettingData, 'green');
  //     addToMarked(eventData, 'blue');
  //     addToMarked(holidayData, 'red');

  //     setMarkedDates(newMarked);
  //   };

  //   markDates();
  // }, [mettingData, eventData, holidayData, currentMonth, currentYear]);
useEffect(() => {
  const markDates = () => {
    const newMarked = {};

    const addToMarked = (arr, colorKey) => {
      arr.forEach(item => {

        let dateKey;

        // ✅ Attendance (fullDate wala)
        if (item.fullDate) {
          dateKey = item.fullDate.split('T')[0];
        } 
        // ✅ Meeting/Event/Holiday (date number wala)
        else {
          dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(item.date).padStart(2, '0')}`;
        }

        if (!newMarked[dateKey]) newMarked[dateKey] = new Set();
        newMarked[dateKey].add(colorKey);
      });
    };

    addToMarked(mettingData, 'blue');
    addToMarked(eventData, 'green');
    addToMarked(holidayData, 'red');

    // ✅ WeekOff
    addToMarked(attendanceData.filter(a => a.isWeekOff), 'grey');

    setMarkedDates(newMarked);
  };

  markDates();
}, [mettingData, eventData, holidayData, attendanceData, currentMonth, currentYear]);
  const fetchHolidays = async () => {
    try {
      const {start, end} = getMonthStartEnd(currentYear, currentMonth);
      const url = ENDPOINT.CALENDAR.SHOWHOLIDAY(start, end, 1, 50);
      const resp = await apiClient.get(url);
      if (resp?.data?.data) {
        const formatted = resp.data.data.map(h => {
          const d = new Date(h.date);
          console.log('hhhhhhhhhhh', h);
          return {
            date: d.getDate(),
            title: h.holidayName,
            type: 'Holiday',
            time: 'All Day',
            day: d.toLocaleString('en-US', {weekday: 'short'}),
          };
        });
        setHolidayData(formatted);
      }
    } catch (err) {
      console.log('❌ Holiday API Error:', err);
    }
  };

  const fetchEvent = async () => {
    try {
      const {start, end} = getMonthStartEnd(currentYear, currentMonth);
      const startDateObj = new Date(start);
      const endDateObj = new Date(end);

      const url = ENDPOINT.CALENDAR.SHOWEVENT(1, 100);
      const resp = await apiClient.get(url);
      if (resp?.data?.data) {
        const formatted = resp.data.data
          .filter(event => {
            const d = new Date(event.date);
            return d >= startDateObj && d <= endDateObj;
          })
          .map(event => {
            const d = new Date(event.date);
            return {
              date: d.getDate(),
              title: event.eventName || 'Untitled Event',
              type: 'Event',
              time: 'All Day',
              day: d.toLocaleString('en-US', {weekday: 'short'}),
            };
          });
        setEventData(formatted);
      }
    } catch (err) {
      console.log('❌ Event API Error:', err);
    }
  };

  const fetchMetting = async () => {
    try {
      const empId = await AsyncStorage.getItem('empId');
      const {start, end} = getMonthStartEnd(currentYear, currentMonth);
      const url = ENDPOINT.CALENDAR.SHOWMETTING(empId, start, end);
      const resp = await apiClient.get(url);

      if (resp?.data?.data) {
        const formatted = resp.data.data
          .filter(event => event?.date !== null)
          .map(event => {
            const d = new Date(event.date);
            return {
              date: d.getDate(),
              title:
                event.source == 'Candidate'
                  ? 'Job Interview'
                  : event.source == 'Resignation'
                  ? 'Exit Interview'
                  : 'Concerm Resolution Meeting' || 'Untitled Meeting',
              type: 'Meeting',
              time: 'All Day',
              day: d.toLocaleString('en-US', {weekday: 'short'}),
            };
          });
        setMettingData(formatted);
      }
    } catch (err) {
      console.log('❌ Meeting API Error:', err);
    }
  };

 const allData = [
  ...mettingData,
  ...eventData,
  ...holidayData,
  ...attendanceData, // <-- Attendance data merge kiya
];

  // Is logic se click ki gayi date ka data niche show hoga
const selectedDateFull = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

const dayWiseData = allData.filter(item => item.date === selectedDate); // Sirf select ki gayi date ka data

// Filter buttons ke liye logic
const filtered = selectedFilter 
  ? dayWiseData.filter(item => item.type === selectedFilter)
  : dayWiseData;

  // const filtered = selectedFilter
  //   ? allData.filter(item => item.type === selectedFilter)
  //   : allData;

  const handleBackPress = () => {
    try {
      // Navigate to the Dashboard tab and specify DashboardScreen
      navigation.navigate('Dashboard', {screen: 'DashboardScreen'});
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.goBack(); // Fallback to previous screen
    }
  };

 const renderDay = (day) => {
  const isSelected = day === selectedDate;
  
  // Date format match karne ke liye string banayein (YYYY-MM-DD)
  // Month + 1 kyunki JavaScript months 0 se start hote hain
  const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  // Check karein ki ye date aapke array mein hai ya nahi
//  const isWeekOff = attendanceData.some(item => {
//   const d = item.fullDate?.split('T')[0];
//   return d === dateString && item.isWeekOff;
// });

  // const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
  // const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  // const types = markedDates[dateKey] || new Set();

  const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const isWeekOff = markedDates[dateKey]?.has('grey');
const types = markedDates[dateKey] || new Set();

  return (
    <TouchableOpacity
      key={day}
      style={[
        styles.dayContainer,
        isSelected && styles.selectedDay,
        // Agar Week Off hai toh Grey background
        isWeekOff && !isSelected && { backgroundColor: '#D3D3D3', borderRadius: 8 } 
      ]}
      onPress={() => setSelectedDate(day)}
    >
      <Text style={[
        styles.dayText, 
        isSelected && styles.selectedDayText,
        isWeekOff && { color: '#555', fontWeight: 'bold' } // Week off text style
      ]}>
        {day}
      </Text>
      
      <View style={styles.indicatorContainer}>
        {Array.from(types).map((color, index) => (
          <View key={index} style={[styles.dot, { backgroundColor: color }]} />
        ))}
      </View>
    </TouchableOpacity>
  );
};
  const formatTime = (time) => {
  if (!time) return '--';
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const renderItem = ({item, index}) => {
  const bg = ['#EAD4D3', '#F3D3D2', '#D4BFBF', '#DBADAC'][index % 4];

  return (
    <View style={[styles.scheduleItem, {backgroundColor: bg}]}>
      
      {/* LEFT DATE BOX (same for all) */}
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.dayText}>{item.day}</Text>
      </View>

      {/* RIGHT CONTENT */}
      <View style={styles.scheduleDetails}>
        
        {/* TITLE */}
        <Text style={styles.scheduleTitle}>{item.title}</Text>

        {/* 👉 Attendance UI */}
        {item.type === 'Attendance' ? (
          <>
            {item.isWeekOff ? (
              <Text style={styles.scheduleType}>Week Off</Text>
            ) : (
              <>
                <Text style={styles.scheduleType}>
                  Check-in / Check-out: {formatTime(item.checkIn)} - {formatTime(item.checkOut)}
                </Text>

                <Text style={styles.scheduleTime}>
                  ⏳ {item.totalHours ? item.totalHours + ' hrs' : '--'}
                </Text>

                <Text style={styles.scheduleTime}>
                  Remarks: {item.remarks || '--'}
                </Text>
              </>
            )}
          </>
        ) : (
          <>
            {/* 👉 OLD UI (Meeting / Event / Holiday SAME rahega) */}
            <Text style={styles.scheduleType}>{item.type}</Text>
            <Text style={styles.scheduleTime}>{item.time}</Text>
          </>
        )}

      </View>
    </View>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                  <Image
                    source={require('../assets/victorIconImage/arrowLeft.png')}
                    style={styles.arrowLeft
                      
                    }
                    resizeMode="contain"
                  />
                </TouchableOpacity>
        <Text style={styles.headerText}>Calendar</Text>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <Text
            style={
              styles.monthText
            }>{`${months[currentMonth]} ${currentYear}`}</Text>
          <View style={styles.arrowContainer}>
            <TouchableOpacity
              onPress={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(prev => prev - 1);
                } else {
                  setCurrentMonth(prev => prev - 1);
                }
                setSelectedDate(1);
              }}>
              <Text style={styles.arrowText}>
                <Image
                  source={require('../assets/victorIconImage/calenderleft.png')}
                  style={styles.arrowImage}
                  resizeMode="contain"
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(prev => prev + 1);
                } else {
                  setCurrentMonth(prev => prev + 1);
                }
                setSelectedDate(1);
              }}>
              <Text style={styles.arrowText}>
                 <Image
                  source={require('../assets/victorIconImage/calenderright.png')}
                  style={styles.arrowImage}
                  resizeMode="contain"
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.daysOfWeekContainer}>
          {daysOfWeek.map(day => (
            <Text key={day} style={styles.dayOfWeekText}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {Array(startDay)
            .fill(null)
            .map((_, idx) => (
              <View key={`empty-${idx}`} style={styles.emptyDayContainer} />
            ))}
          {calendarDays.map(day => renderDay(day))}
        </View>
      </View>

      <View style={styles.scheduleContainer}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.filterContainer}>
          {['Meeting', 'Event', 'Holiday', 'Attendance'].map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                selectedFilter === f && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(f)}>
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === f && styles.filterTextActive,
                ]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item, idx) => `${item.type}-${item.date}-${idx}`}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF5F0'},
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#402530',
  },
  backButton: {marginRight: 10},
  headerText: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  calendarContainer: {
    padding: 8,
    backgroundColor: '#F6E7E0',
    borderRadius: 10,
    marginHorizontal: '5%',
    marginTop: 12,
    height: height * 0.42,
    width: '90%',
    alignSelf: 'center',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  monthText: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#4A2C3B',
    marginTop: 8,
  },
  arrowContainer: {
    flexDirection: 'row',
    // backgroundColor:'red'
  },
  arrowText: {
    fontSize: 12, // Reduced font size
    color: '#4A2C3B',
    marginLeft: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 6,
    marginTop: 10,
  },
  dayOfWeekText: {
    fontSize: scaleFont(10),
    color: '#4A2C3B',
    textAlign: 'center',
    width: `${100 / 7}%`,
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingLeft: 4,
  },
  dayContainer: {
    width: `${100 / 7}%`,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 15,
  },
  selectedDay: {
    backgroundColor: '#E8C3B9',
  },
  emptyDayContainer: {
    width: `${100 / 7}%`,
    height: 36,
    marginVertical: 2,
  },
  dayText: {
    fontSize: scaleFont(10),
    color: '#4A2C3B',
    textAlign: 'center',
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  scheduleContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFF5F0',
    borderRadius: 30,
  },
  sectionTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#2E3135',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#5C3C45',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  filterButtonActive: {
    backgroundColor: '#5C3C45',
  },
  filterText: {
    fontSize: scaleFont(10),
    color: '#939393',
  },
  filterTextActive: {
    fontSize: scaleFont(10),
    color: '#FFF',
  },
  scheduleItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  dateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.12,
    height: width * 0.12,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.03,
  },
  dateText: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#4A2C3B',
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#4A2C3B',
  },
  scheduleType: {
    fontSize: scaleFont(12),
    marginVertical: 2,
    color: '#4A2C3B',
  },
  scheduleTime: {
    fontSize: scaleFont(10),
    color: '#4A2C3B',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
    gap: 2,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  arrowImage: {width: 10, height: 10},
  arrowLeft: { width: 20, height: 20 },
});

export default CalendarScreen;
