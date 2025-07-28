import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const schedule = [
    { date: 31, title: 'Client Consultation', type: 'Meeting', time: '04:00 PM - 05:30 PM (UTC)', day: 'Mon' },
    { date: 21, title: 'Industry Networking Night', type: 'Event', time: '06:00 PM - 09:00 PM (UTC)', day: 'Tue' },
    { date: 31, title: 'Client Consultation', type: 'Meeting', time: '04:00 PM - 05:30 PM (UTC)', day: 'Wed' },
    { date: 12, title: 'UI/UX Design Principles', type: 'Workshop', time: '01:30 PM - 03:30 PM (UTC)', day: 'Thu' },
     { date: 12, title: 'UI/UX Design Principles', type: 'Workshop', time: '01:30 PM - 03:30 PM (UTC)', day: 'Thu' },
      { date: 12, title: 'UI/UX Design Principles', type: 'Workshop', time: '01:30 PM - 03:30 PM (UTC)', day: 'Thu' },
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const [calendarDays, setCalendarDays] = useState([]);
  const [startDay, setStartDay] = useState(0);

  useEffect(() => {
    const days = Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);
    setCalendarDays(days);
    setStartDay(getFirstDayOfMonth(currentMonth, currentYear));
  }, [currentMonth, currentYear]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(1);
  };

  const renderDay = (day) => {
    const isSelected = day === selectedDate;
    return (
      <TouchableOpacity
        style={[styles.dayContainer, isSelected && styles.selectedDay]}
        onPress={() => setSelectedDate(day)}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>
      </TouchableOpacity>
    );
  };
  const navigation = useNavigation();


  const backgroundColors = ['#EAD4D3', '#F3D3D2', '#D4BFBF', '#DBADAC'];

  const renderScheduleItem = ({ item, index }) => (
    <View style={[styles.scheduleItem, { backgroundColor: backgroundColors[index % backgroundColors.length] }]}>
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.dayOfWeekText}>{item.day}</Text>
      </View>
      <View style={styles.scheduleDetails}>
        <Text style={styles.scheduleTitle}>{item.title}</Text>
        <Text style={styles.scheduleType}>{item.type}</Text>
        <Text style={styles.scheduleTime}>{item.time}</Text>
      </View>
    </View>
  );

 const handleBackPress = () => {
  navigation.navigate('Dashboard');
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <AntDesign name="arrowleft" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Calendar</Text>
      </View>
      <View style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>{`${months[currentMonth]} ${currentYear}`}</Text>
          <View style={styles.arrowContainer}>
            <TouchableOpacity onPress={prevMonth}>
              <Text style={styles.arrowText}>
                <Entypo name="chevron-small-up" size={18} color="black" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextMonth}>
              <Text style={styles.arrowText}>
                <Entypo name="chevron-small-down" size={18} color="black" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.daysOfWeekContainer}>
          {daysOfWeek.map((day) => (
            <Text key={day} style={styles.dayOfWeekText}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {Array(startDay).fill(null).map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptyDayContainer} />
          ))}
          {calendarDays.map((day) => renderDay(day))}
        </View>
      </View>
      <View style={styles.scheduleContainer}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
            <Text style={styles.filterTextActive}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Meeting</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Event</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Holiday</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Birthday</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={schedule}
          renderItem={renderScheduleItem}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          style={styles.scheduleList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F0',
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#402530',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  calendarContainer: {
    padding: 8, // Reduced padding to decrease height
    backgroundColor: '#F6E7E0',
    borderRadius: 10,
    marginHorizontal: 20, // Reduced margin to decrease width
    marginTop:12,
    height:270,
    width:370,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6, // Reduced margin to decrease height
  },
  monthText: {
    fontSize: 16, // Reduced font size for compactness
    fontWeight: 'bold',
    color: '#4A2C3B',
      marginTop:8,
  },
  arrowContainer: {
    flexDirection: 'row',
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
    paddingHorizontal: 8, // Reduced padding
    marginBottom: 6, // Reduced margin to decrease height
      marginTop:20,
  },
  dayOfWeekText: {
    fontSize: 12, // Reduced font size
    color: '#4A2C3B',
    textAlign: 'center',
    width: '14.28%', // 100% / 7 days for equal spacing
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingLeft: 4, // Reduced padding for right shift
  },
  dayContainer: {
    width: '14.28%', // 100% / 7 days for equal spacing
    height: 30, // Reduced height for compactness
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2, // Reduced margin
    borderRadius: 15, // Adjusted for smaller size
  },
  emptyDayContainer: {
    width: '14.28%',
    height: 30, // Match dayContainer height
    marginVertical: 2,
  },
  selectedDay: {
    backgroundColor: '#E8C3B9',
  },
  dayText: {
    fontSize: 12, // Reduced font size
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
    fontSize: 16,
    fontFamily: 'HankenGrotesk-Bold',
    color: '#2E3135',
    marginBottom: 10,
    
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#5C3C45',
    backgroundColor: '#fff',
    marginBottom: 15,
     marginTop:4,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginVertical: 5,
  },
  filterButtonActive: {
    backgroundColor: '#5C3C45',
  },
  filterText: {
    fontSize: 12,
    color: '#939393',
    fontFamily: 'poppins',
  },
  filterTextActive: {
    fontSize: 12,
    color: '#FFF',
  },
  scheduleList: {
    flex: 1,
  },
  scheduleItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
 marginBottom: 10,
  },
  dateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A2C3B',
  },
  dayOfWeekText: {
    fontSize: 12,
    color: '#4A2C3B',
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2C3B',
  },
  scheduleType: {
    fontSize: 14,
    color: '#4A2C3B',
    marginVertical: 2,
  },
  scheduleTime: {
    fontSize: 12,
    color: '#4A2C3B',
  },
});

export default CalendarScreen;


