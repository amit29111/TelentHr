// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
// } from 'react-native';

// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Entypo from 'react-native-vector-icons/Entypo';
// import {useNavigation} from '@react-navigation/native';
// import { ENDPOINT } from '../api/endpoint';
// import apiClient from '../api/apiClient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');

// // Helper function for font scaling
// const scaleFont = (size) => (width / 375) * size; // 375 is iPhone X width reference


// const CalendarScreen = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date().getDate());
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [selectedFilter, setSelectedFilter] = useState('Metting');
//   const [filteredSchedule, setFilteredSchedule] = useState([]);

//   useEffect(() => {
//     if (selectedFilter === '') {
//       setFilteredSchedule(allData);
//     } else {
//       const filtered = allData.filter(item => item.type === selectedFilter);
//       setFilteredSchedule(filtered);
//     }
//   }, [selectedFilter]);

//   const schedule = [
//     {
//       date: 31,
//       title: 'Client Consultation',
//       type: 'Meeting',
//       time: '04:00 PM - 05:30 PM (UTC)',
//       day: 'Mon',
//     },
//     {
//       date: 21,
//       title: 'Industry Networking Night',
//       type: 'Event',
//       time: '06:00 PM - 09:00 PM (UTC)',
//       day: 'Tue',
//     },
//     {
//       date: 31,
//       title: 'Client Consultation',
//       type: 'Meeting',
//       time: '04:00 PM - 05:30 PM (UTC)',
//       day: 'Wed',
//     },
//     {
//       date: 12,
//       title: 'UI/UX Design Principles',
//       type: 'Workshop',
//       time: '01:30 PM - 03:30 PM (UTC)',
//       day: 'Thu',
//     },
//     {
//       date: 12,
//       title: 'UI/UX Design Principles',
//       type: 'Workshop',
//       time: '01:30 PM - 03:30 PM (UTC)',
//       day: 'Thu',
//     },
//     {
//       date: 12,
//       title: 'UI/UX Design Principles',
//       type: 'Workshop',
//       time: '01:30 PM - 03:30 PM (UTC)',
//       day: 'Thu',
//     },
//   ];

//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const months = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];

//   const getDaysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (month, year) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const [calendarDays, setCalendarDays] = useState([]);
//   const [startDay, setStartDay] = useState(0);

//   const [mettingData, setMettingData] = useState([]);
//   const [eventData, setEventData] = useState([]);
//   const [birthdayData,setBirthdayData] = useState([]);
//   const [holidayData, setHolidayData] = useState([]);

//   // Fetch holidays for next 7 days on mount
//   useEffect(() => {
//     const fetchHolidays = async () => {
//       try {
//         const today = new Date();
//         const formatDate = date => date.toISOString().split('T')[0];
//         const startDate = formatDate(today);
//         const endDate = formatDate(
//           new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
//         );
//         const url = ENDPOINT.CALENDAR.SHOWHOLIDAY(startDate, endDate, 1, 50); // Assuming this is a function
//         const resp = await apiClient.get(url);
//         if (resp.data?.data) {
//           const formatted = resp.data.data.map(h => {
//             const d = new Date(h.date);
//             return {
//               date: d.getDate(),
//               title: h.name || h.title,
//               type: 'Holiday',
//               time: 'All Day',
//               day: d.toLocaleString('en-US', {weekday: 'short'}),
//             };
//           });
//           setHolidayData(formatted);
//         }
//       } catch (err) {
//         console.log('❌ Holiday API Error:', err);
//       }
//     };

//     fetchHolidays();
//   }, []);
//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const today = new Date();
//         const formatDate = date => date.toISOString().split('T')[0];
//         const url = ENDPOINT.CALENDAR.SHOWEVENT(1, 50); // Assuming this builds your API URL
//         const resp = await apiClient.get(url);

//         if (resp?.data?.data) {
//           const formatted = resp?.data?.data
//             .filter(event => event?.date !== null) // skip if date is null
//             .map(event => {
//               const d = new Date(event?.date);
//               return {
//                 date: d.getDate(),
//                 title: event.eventName || 'Untitled Event',
//                 type: 'Event',
//                 time: 'All Day',
//                 day: d.toLocaleString('en-US', {weekday: 'short'}),
//               };
//             });

//           setEventData(formatted);
//         }
//       } catch (err) {
//         console.log('❌ Event API Error:', err);
//       }
//     };

//     fetchEvent();
//   }, []);

//   useEffect(() => {
//     const fetchMetting = async () => {
//       try {
//         const today = new Date();
//         const formatDate = date => date.toISOString().split('T')[0];
//         const startDate = formatDate(today);
//         const empId = await AsyncStorage.getItem('empId');
//         const endDate = formatDate(
//           new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
//         );

//         const url = ENDPOINT.CALENDAR.SHOWMETTING(empId, startDate, endDate);
//         const resp = await apiClient.get(url);

//         if (resp?.data?.data) {
//           const formatted = resp?.data?.data
//             .filter(event => event?.date !== null) // skip if date is null
//             .map(event => {
//               const d = new Date(event?.date);
//               return {
//                 date: d.getDate(),
//                 title: event.eventName || 'Untitled Event',
//                 type: 'Event',
//                 time: 'All Day',
//                 day: d.toLocaleString('en-US', {weekday: 'short'}),
//               };
//             });

//           setEventData(formatted);
//         }
//       } catch (err) {
//        setMettingData([
//           {
//             date: '',
//             title: 'No Metting Sedule Today',
//             type: 'Metting',
//             time: '',
//             day: '',
//           },
//         ]);
//         console.log('❌ Event API Error:', err);
//       }
//     };

//     fetchMetting();
//   }, []);

//   // Combine and filter data
//   const allData = [
//     ...mettingData,
//     ...eventData,
//     ...holidayData,
//     ...birthdayData,
//   ];
//   const filtered = selectedFilter
//     ? allData.filter(item => item.type === selectedFilter)
//     : allData;

//   const renderItem = ({item, index}) => {
//     const bg = ['#EAD4D3', '#F3D3D2', '#D4BFBF', '#DBADAC'][index % 4];
//     return (
//       <View style={[styles.scheduleItem, {backgroundColor: bg}]}>
//         <View style={styles.dateBox}>
//           <Text style={styles.dateText}>{item.date}</Text>
//           <Text style={styles.dayText}>{item.day}</Text>
//         </View>
//         <View style={styles.scheduleDetails}>
//           <Text style={styles.scheduleTitle}>{item.title}</Text>
//           <Text style={styles.scheduleType}>{item.type}</Text>
//           <Text style={styles.scheduleTime}>{item.time}</Text>
//         </View>
//       </View>
//     );
//   };

//   useEffect(() => {
//     const days = Array.from(
//       {length: getDaysInMonth(currentMonth, currentYear)},
//       (_, i) => i + 1,
//     );
//     setCalendarDays(days);
//     setStartDay(getFirstDayOfMonth(currentMonth, currentYear));
//   }, [currentMonth, currentYear]);

//   const prevMonth = () => {
//     if (currentMonth === 0) {
//       setCurrentMonth(11);
//       setCurrentYear(currentYear - 1);
//     } else {
//       setCurrentMonth(currentMonth - 1);
//     }
//     setSelectedDate(1);
//   };

//   const nextMonth = () => {
//     if (currentMonth === 11) {
//       setCurrentMonth(0);
//       setCurrentYear(currentYear + 1);
//     } else {
//       setCurrentMonth(currentMonth + 1);
//     }
//     setSelectedDate(1);
//   };

//   const renderDay = day => {
//     const isSelected = day === selectedDate;
//     return (
//       <TouchableOpacity
//         style={[styles.dayContainer, isSelected && styles.selectedDay]}
//         onPress={() => setSelectedDate(day)}>
//         <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
//           {day}
//         </Text>
//       </TouchableOpacity>
//     );
//   };
//   const navigation = useNavigation();

//   const backgroundColors = ['#EAD4D3', '#F3D3D2', '#D4BFBF', '#DBADAC'];

//   const handleBackPress = () => {
//     navigation.navigate('DashboardScreen');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//           <AntDesign name="arrowleft" size={24} color="#FFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Calendar</Text>
//       </View>
//       <View style={styles.calendarContainer}>
//         <View style={styles.monthHeader}>
//           <Text
//             style={
//               styles.monthText
//             }>{`${months[currentMonth]} ${currentYear}`}</Text>
//           <View style={styles.arrowContainer}>
//             <TouchableOpacity onPress={prevMonth}>
//               <Text style={styles.arrowText}>
//                 <Entypo name="chevron-small-up" size={18} color="black" />
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={nextMonth}>
//               <Text style={styles.arrowText}>
//                 <Entypo name="chevron-small-down" size={18} color="black" />
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View style={styles.daysOfWeekContainer}>
//           {daysOfWeek.map(day => (
//             <Text key={day} style={styles.dayOfWeekText}>
//               {day}
//             </Text>
//           ))}
//         </View>
//         <View style={styles.daysContainer}>
//           {Array(startDay)
//             .fill(null)
//             .map((_, index) => (
//               <View key={`empty-${index}`} style={styles.emptyDayContainer} />
//             ))}
//           {calendarDays.map(day => renderDay(day))}
//         </View>
//       </View>
//       <View style={styles.scheduleContainer}>
//         <Text style={styles.sectionTitle}>Schedule</Text>

//         <SafeAreaView style={styles.container}>
//           <View style={styles.filterContainer}>
//             {['Metting', 'Event', 'Holiday', 'Birthday'].map(f => (
//               <TouchableOpacity
//                 key={f}
//                 style={[
//                   styles.filterButton,
//                   selectedFilter === f && styles.filterButtonActive,
//                 ]}
//                 onPress={() => setSelectedFilter(f)}>
//                 <Text
//                   style={[
//                     styles.filterText,
//                     selectedFilter === f && styles.filterTextActive,
//                   ]}>
//                   {f}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <FlatList
//             data={filtered}
//             keyExtractor={(item, idx) => `${item.type}-${item.date}-${idx}`}
//             renderItem={renderItem}
//             contentContainerStyle={{paddingBottom: 100}}
//              showsVerticalScrollIndicator={false}
//           />
//         </SafeAreaView>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF5F0',
//   },
//   header: {
//     padding: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#402530',
//   },
//   backButton: {
//     marginRight: 10,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF',
//     textAlign: 'center',
//   },
//   calendarContainer: {
//     padding: 8, // Reduced padding to decrease height
//     backgroundColor: '#F6E7E0',
//     borderRadius: 10,
//     marginHorizontal: 20, // Reduced margin to decrease width
//     marginTop: 12,
//     height: 285,
//     width: 370,
//   },
//   daysContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start',
//     paddingLeft: 4, // Reduced padding for right shift
    
//   },
//   dayContainer: {
//     width: '14.28%', // 100% / 7 days for equal spacing
//     height: 30, // Reduced height for compactness
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 2, // Reduced margin
//     borderRadius: 15, // Adjusted for smaller size
    
//   },
//   emptyDayContainer: {
//     width: '14.25%',
//     height: 30, // Match dayContainer height
//     marginVertical: 2,
//     backgroundColor:'red'
//   },
//   monthHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 6, // Reduced margin to decrease height
//   },
//   monthText: {
//     fontSize: 16, // Reduced font size for compactness
//     fontWeight: 'bold',
//     color: '#4A2C3B',
//     marginTop: 8,
//   },
//   arrowContainer: {
//     flexDirection: 'row',
//   },
//   arrowText: {
//     fontSize: 12, // Reduced font size
//     color: '#4A2C3B',
//     marginLeft: 8,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 6,
//     padding: 3,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   dateBox: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 50,
//     height: 50,
//     marginRight: 10,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//   },
//   dateText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#4A2C3B',
//   },
//   dayOfWeekText: {
//     fontSize: 12,
//     color: '#4A2C3B',
//   },
  
//   selectedDay: {
//     backgroundColor: '#E8C3B9',
//   },
//   dayText: {
//     fontSize: 12, // Reduced font size
//     color: '#4A2C3B',
//     textAlign: 'center',
//   },
//    scheduleTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#4A2C3B',
//   },
//   scheduleType: {
//     fontSize: 14,
//     color: '#4A2C3B',
//     marginVertical: 2,
//   },
//   scheduleTime: {
//     fontSize: 12,
//     color: '#4A2C3B',
//   },
//   filterButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 15,
//     marginVertical: 5,
//   },
//   daysOfWeekContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 8, // Reduced padding
//     marginBottom: 6, // Reduced margin to decrease height
//     marginTop: 20,
//   },
//   dayOfWeekText: {
//     fontSize: 12, // Reduced font size
//     color: '#4A2C3B',
//     textAlign: 'center',
//     width: '14.28%', // 100% / 7 days for equal spacing
//     fontWeight: '600',
//   },
  
//   selectedDayText: {
//     fontWeight: 'bold',
//   },
//   scheduleContainer: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: '#FFF5F0',
//     borderRadius: 30,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontFamily: 'HankenGrotesk-Bold',
//     color: '#2E3135',
//     marginBottom: 10,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     borderRadius: 38,
//     borderWidth: 2,
//     borderColor: '#5C3C45',
//     backgroundColor: '#fff',
//     marginBottom: 15,
//     marginTop: 4,
//   },
  
//   filterButtonActive: {
//     backgroundColor: '#5C3C45',
//   },
//   filterText: {
//     fontSize: 12,
//     color: '#939393',
//     fontFamily: 'poppins',
//   },
//   filterTextActive: {
//     fontSize: 12,
//     color: '#FFF',
//   },
//   scheduleList: {
//     flex: 1,
//   },
//   scheduleItem: {
//     flexDirection: 'row',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
  
//   scheduleDetails: {
//     flex: 1,
//   },
 
// });

// export default CalendarScreen;







import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {ENDPOINT} from '../api/endpoint';
import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');
const scaleFont = (size) => (width / 375) * size;

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

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
  const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
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
  }, [currentMonth, currentYear]);

  useEffect(() => {
    const markDates = () => {
      const newMarked = {};

      const addToMarked = (arr, colorKey) => {
        arr.forEach(item => {
          const dateKey = `${currentYear}-${currentMonth + 1}-${item.date}`;
          if (!newMarked[dateKey]) newMarked[dateKey] = new Set();
          newMarked[dateKey].add(colorKey);
        });
      };

      addToMarked(mettingData, 'green');
      addToMarked(eventData, 'blue');
      addToMarked(holidayData, 'red');

      setMarkedDates(newMarked);
    };

    markDates();
  }, [mettingData, eventData, holidayData, currentMonth, currentYear]);

  const fetchHolidays = async () => {
    try {
      const {start, end} = getMonthStartEnd(currentYear, currentMonth);
      const url = ENDPOINT.CALENDAR.SHOWHOLIDAY(start, end, 1, 50);
      const resp = await apiClient.get(url);
      if (resp?.data?.data) {
        const formatted = resp.data.data.map((h) => {
          const d = new Date(h.date);
          console.log('hhhhhhhhhhh', h)
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
          .filter((event) => {
            const d = new Date(event.date);
            return d >= startDateObj && d <= endDateObj;
          })
          .map((event) => {
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
          .filter((event) => event?.date !== null)
          .map((event) => {
            const d = new Date(event.date);
            return {
              date: d.getDate(),
              title: event.source == "Candidate" ?"Job Interview":  event.source == "Resignation"?"Exit Interview" :"Concerm Resolution Meeting" || 'Untitled Meeting',
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

  const allData = [...mettingData, ...eventData, ...holidayData, ...birthdayData];
  const filtered = selectedFilter
    ? allData.filter((item) => item.type === selectedFilter)
    : allData;

  const handleBackPress = () => {
    try {
      // Navigate to the Dashboard tab and specify DashboardScreen
      navigation.navigate('Dashboard', { screen: 'DashboardScreen' });
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.goBack(); // Fallback to previous screen
    }
  };

  const renderDay = (day) => {
    const isSelected = day === selectedDate;
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    const types = markedDates[dateKey] || new Set();

    return (
      <TouchableOpacity
        key={day}
        style={[styles.dayContainer, isSelected && styles.selectedDay]}
        onPress={() => setSelectedDate(day)}>
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
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

  const renderItem = ({item, index}) => {
    const bg = ['#EAD4D3', '#F3D3D2', '#D4BFBF', '#DBADAC'][index % 4];
    return (
      <View style={[styles.scheduleItem, {backgroundColor: bg}]}>
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.dayText}>{item.day}</Text>
        </View>
        <View style={styles.scheduleDetails}>
          <Text style={styles.scheduleTitle}>{item.title}</Text>
          <Text style={styles.scheduleType}>{item.type}</Text>
          <Text style={styles.scheduleTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <AntDesign name="arrowleft" size={scaleFont(20)} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Calendar</Text>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>{`${months[currentMonth]} ${currentYear}`}</Text>
          <View style={styles.arrowContainer}>
            <TouchableOpacity onPress={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(prev => prev - 1);
              } else {
                setCurrentMonth(prev => prev - 1);
              }
              setSelectedDate(1);
            }}>
              <Text style={styles.arrowText}>
                <Entypo name="chevron-small-up" size={18} color="black" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(prev => prev + 1);
              } else {
                setCurrentMonth(prev => prev + 1);
              }
              setSelectedDate(1);
            }}>
              <Text style={styles.arrowText}>
                <Entypo name="chevron-small-down" size={18} color="black" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.daysOfWeekContainer}>
          {daysOfWeek.map((day) => (
            <Text key={day} style={styles.dayOfWeekText}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {Array(startDay).fill(null).map((_, idx) => (
            <View key={`empty-${idx}`} style={styles.emptyDayContainer} />
          ))}
          {calendarDays.map((day) => renderDay(day))}
        </View>
      </View>

      <View style={styles.scheduleContainer}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.filterContainer}>
          {['Meeting', 'Event', 'Holiday', 'Birthday'].map((f) => (
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

});

export default CalendarScreen;

