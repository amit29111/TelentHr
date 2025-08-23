import React, {useMemo, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextTicker from 'react-native-text-ticker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchEmployeeById,
  fetchEmployeeNotification,
} from '../redux/employeeSlice';
import {fetchByOrg} from '../redux/slice';
import {Modal} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

const DashboardScreen = ({navigation}) => {
  const [allRecord, setAllRecord] = useState(null);
  const [getNotifications, setGetNotifications] = useState([]);
  const dispatch = useDispatch();

  const employee = useSelector(state => state?.employee?.employeeData);
  const notifications = useSelector(state => state?.employee?.notificationData);
  const loading = useSelector(state => state.isLoading);
  const orgDetails = useSelector(state => state.auth.employeeData);

  const [showNotifications, setShowNotifications] = useState(false);

  const handleOutsidePress = () => {
    setShowNotifications(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgId = await AsyncStorage.getItem('orgId');
        const empId = await AsyncStorage.getItem('empId');

        if (empId) {
          dispatch(fetchEmployeeById(empId));
          dispatch(fetchByOrg(orgId));
          dispatch(fetchEmployeeNotification(empId));
        }
      } catch (e) {
        console.log('❌ Error fetching empId:', e);
      }
    };
    fetchData();
  }, [dispatch]);
  useEffect(() => {
    if (employee) setAllRecord(employee);
    if (notifications) setGetNotifications(notifications.data || []);
  }, [employee, notifications]);

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
      image: require('../../src/assets/mypayroll.png'),
      backgroundColor: '#FDE3BF',
    },
    {
      title: 'Attendance',
      image: require('../../src/assets/attendence.png'),
      backgroundColor: '#005FDF54',
    },
    {
      title: 'Leave',
      image: require('../../src/assets/leave.png'),
      backgroundColor: '#FF415554',
    },
    {
      title: 'Announcements',
      image: require('../../src/assets/announcement.png'),
      backgroundColor: '#84272754',
    },
    {
      title: 'Raise Concern',
      image: require('../../src/assets/raiseconcern.png'),
      backgroundColor: '#EA5E9C54',
    },
    {
      title: 'Reports',
      image: require('../../src/assets/reports.png'),
      backgroundColor: '#9CD06954',
    },
    {
      title: 'Learning & Development',
      image: require('../../src/assets/learning&dev.png'),
      backgroundColor: '#F6665954',
    },
    {
      title: 'Task & Management',
      image: require('../../src/assets/taskmanagement.png'),
      backgroundColor: '#AB3D0454',
    },
    {
      title: 'Performance',
      image: require('../../src/assets/perfomance.png'),
      backgroundColor: '#26A69A54',
    },
  ];

  const overviewCards = [
    {
      title: 'Payroll',
      image: require('../../src/assets/dashboardIcon/payrollslide.png'),
      backgroundColor: '#124A5A',
    },
    {
      title: 'Apply Leave',
      image: require('../../src/assets/dashboardIcon/applyleaveslide.png'),
    },
    {
      title: 'Attendance',
      image: require('../../src/assets/dashboardIcon/attandenceslide.png'),
    },
    {
      title: 'Calendar',
      image: require('../../src/assets/dashboardIcon/calenderslide.png'),
    },
    {
      title: 'Announcements',
      image: require('../../src/assets/dashboardIcon/announceslide.png'),
    },
  ];

  const chunkedFeatureCards = useMemo(() => {
    const chunkArray = (arr, size) =>
      Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
        arr.slice(i * size, i * size + size),
      );
    return chunkArray(featureCards, 3);
  }, []);

  const handleImageUpload = () => {
    navigation.navigate('ProfileScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profilePicContainer}>
            {allRecord?.photoUrl ? (
              <Image
                source={{uri: allRecord.photoUrl}}
                style={styles.profilePic}
              />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>
                  {allRecord?.firstName
                    ? allRecord.firstName.substring(0, 2).toUpperCase()
                    : ''}
                   ̰
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.plusIconContainer}
              onPress={handleImageUpload}>
              <Image
                source={require('../../src/assets/dashboardIcon/plusicon.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.greeting}>Hello,</Text>
            <TextTicker
              style={styles.greeting}
              duration={5000}
              loop
              bounce={false}
              numberOfLines={1}
              repeatSpacer={60}
              marqueeDelay={500}>
              {allRecord?.firstName} {allRecord?.lastName}
            </TextTicker>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* <TouchableOpacity>
            <Ionicons name="notifications" size={24} color="white" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{getNotifications.length}</Text>
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => setShowNotifications(true)}>
            <Ionicons name="notifications" size={24} color="white" />
            {getNotifications.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{getNotifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <Image
            source={orgDetails?.logo ? {uri: orgDetails?.logo} : ''}
            style={styles.companyLogo}
          />
          <Modal
            transparent
            visible={showNotifications}
            animationType="fade"
            onRequestClose={handleOutsidePress}>
            <Pressable
              style={styles.modalBackground}
              onPress={handleOutsidePress}>
              <Pressable style={styles.notificationPanel}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>Notifications</Text>
                  <TouchableOpacity onPress={handleOutsidePress}>
                    <Ionicons name="close" size={20} color="black" />
                  </TouchableOpacity>
                </View>
                {getNotifications.length > 0 ? (
                  getNotifications.map((note, index) => (
                    <View key={index}>
                      <Text style={styles.notificationText}>
                        {note.message || 'New notification'} :-{' '}
                        <Text style={{color: 'red'}}>{note.title}</Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.notificationText}>No notifications</Text>
                )}
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      </View>

      {/* Birthday Section */}
      <View style={styles.birthdaySection}>
        <View style={styles.birthdayCard}>
          <View style={styles.birthdayHeader}>
            <Image
              source={require('../../src/assets/dashboardIcon/Birthdaystext.png')}
              style={styles.BirthdaystextPic}
            />
            <Image
              source={
                allRecord?.photoUrl
                  ? {uri: allRecord.photoUrl}
                  : require('../../src/assets/dashboardIcon/birthday.png')
              }
              style={styles.birthdayPic}
            />
          </View>

          <View style={styles.birthdayInfo}>
            <View style={styles.timeContainer}>
              <Image
                source={require('../../src/assets/dashboardIcon/watch.png')}
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

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{paddingBottom: 100}}>
        {/* Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
            {/* <TouchableOpacity>
              <Text style={styles.viewMore}>View More</Text>
            </TouchableOpacity> */}
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
                    {backgroundColor: card.backgroundColor || '#EBEBEB'},
                  ]}
                  onPress={() => {
                    if (card.title === 'Payroll')
                      navigation.navigate('MyPayRollScreen');
                    else if (card.title === 'Apply Leave')
                      navigation.navigate('LeaveScreen');
                    else if (card.title === 'Attendance')
                      navigation.navigate('AttendanceScreen');
                    else if (card.title === 'Calendar')
                      navigation.navigate('CalendarScreen');
                    else if (card.title === 'Announcements')
                      navigation.navigate('AnnouncementScreen');
                  }}>
                  <Image source={card.image} style={styles.overviewImage} />
                </TouchableOpacity>
                <Text style={styles.ManageWorkcardText} numberOfLines={1}>
                  {card.title}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Features */}
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
                    {backgroundColor: card.backgroundColor},
                  ]}
                  onPress={() => {
                    const screenMap = {
                      Leave: 'LeaveScreen',
                      'Raise Concern': 'RaiseConcernScreen',
                      'My Payroll': 'MyPayRollScreen',
                      Attendance: 'AttendanceScreen',
                      Announcements: 'AnnouncementScreen',
                      Reports: 'ReportScreen',
                      'Learning & Development': 'LearningDevelopmentScreen',
                      'Task & Management': 'TaskManagementScreen',
                      Performance: 'PerfomanceScreen',
                    };
                    const screen = screenMap[card.title];
                    if (screen) navigation.navigate(screen);
                  }}>
                  <Image source={card.image} style={styles.featureImage} />
                  <Text style={styles.cardText} numberOfLines={2}>
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
            From onboarding to retirement,{'\n'}manage it all here. →
          </Text>
          <Image
            source={require('../../src/assets/TALENT_LOGO.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#452300',
    minHeight: 140,
    zIndex: 1,
    elevation: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  profilePicContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // overflow: 'hidden',
    position: 'relative', // <-- important
  },

  plusIconContainer: {
    position: 'absolute',
    bottom: 40,
    right: 42,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 999, // high value
    elevation: 10, // for Android
  },

  // profilePicContainer: {position: 'relative'},
  profilePic: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
  },

  icon: {
    width: 12,
    height: 12,
    // zIndex:10,
    // elevation: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    maxWidth: '100%',
  },
  headerRight: {flexDirection: 'row', alignItems: 'center', zIndex: 1, gap: 15},
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
  badgeText: {color: 'white', fontSize: 12},
  companyLogo: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  birthdaySection: {backgroundColor: '#452300'},
  birthdayCard: {
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
  BirthdaystextPic: {width: 80, height: 20, resizeMode: 'contain'},
  birthdayPic: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    marginLeft: 75,
  },
  birthdayInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  timeContainer: {flexDirection: 'row', alignItems: 'center'},
  birthdayTime: {fontSize: 14, color: '#666', marginLeft: 12},
  sendWishes: {fontSize: 14, color: '#23B480', fontWeight: 'bold'},
  section: {paddingHorizontal: 16},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {fontSize: 14, fontWeight: 'bold', color: '#000',marginTop:20,},
  viewMore: {color: '#CE1C1C', fontSize: 10},
  overviewScroll: {flexDirection: 'row'},
  overviewCard: {
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    width: width * 0.16,
    height: width * 0.16,
  },
  overviewImage: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },
  ManageWorkcardText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#959595',
    marginTop: 5,
    maxWidth: 80,
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  featureCard: {
    width: width * 0.29,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  featureImage: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    borderRadius: 20,
    // marginBottom: 10,
  },
  cardText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#1B1D4D',
    maxWidth: 80,
  },
  footer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 4,
    margin: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
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
  notificationPanel: {
    position: 'absolute',
    top: 40, // icon ke neeche ka space
    right: 10, // screen ke right se distance
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 250,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    zIndex: 10000,
    elevation: 9999,
  },

  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationText: {
    fontSize: 14,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingRight: 10,
    zIndex: 999,
    height: 200,
  },
  
  initialsContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50', // choose any color
  },
  initialsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
