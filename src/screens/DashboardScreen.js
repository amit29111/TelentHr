import React, {useMemo, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import TextTicker from 'react-native-text-ticker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchEmployeeById,
  fetchEmployeeNotification,
  fetchEmployeeHighlights,
} from '../redux/employeeSlice';
import {fetchByOrg} from '../redux/slice';
import {Modal} from 'react-native';

const {width} = Dimensions.get('window');

const DashboardScreen = ({navigation}) => {
  const [allRecord, setAllRecord] = useState(null);
  const [getNotifications, setGetNotifications] = useState([]);
  const dispatch = useDispatch();

  const employee = useSelector(state => state?.employee?.employeeData);
  const notifications = useSelector(state => state?.employee?.notificationData);
  const orgDetails = useSelector(state => state.auth.employeeData);
  const highlightsData = useSelector(state => state.employee.highlightsData);

  const loading = useSelector(state => state.employee.loading);

  const [showNotifications, setShowNotifications] = useState(false);

  const handleOutsidePress = () => {
    setShowNotifications(false);
  };

  const navigateToPayroll = () => {
    const tabNavigation = navigation.getParent?.();
    if (tabNavigation?.navigate) {
      tabNavigation.navigate('Payroll', {screen: 'PayrollDashboard'});
      return;
    }
    navigation.navigate('Payroll', {screen: 'PayrollDashboard'});
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
          dispatch(fetchEmployeeHighlights());
        }
      } catch (e) {
        console.log('❌ Error fetching empId:', e);
      }
    };
    fetchData();
  }, [dispatch]);


  const filteredHighlights = highlightsData?.filter(
    item => item.type === 'birthday' || item.type === 'work_anniversary',
  );

  useEffect(() => {
    if (employee) setAllRecord(employee);
    if (notifications) setGetNotifications(notifications.data || []);
  }, [employee, notifications]);

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // ✅ Only Attendance & Leave
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
  ];

  const overviewCards = [
    // {
    //   title: 'Payroll',
    //   image: require('../../src/assets/dashboardIcon/payrollslide.png'),
    //   backgroundColor: '#124A5A',
    // },
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

          <View style={{flex: 1, marginLeft: -30}}>
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
          <TouchableOpacity onPress={() => setShowNotifications(true)}>
            <Image
              source={require('../assets/victorIconImage/bell.png')}
              style={styles.eyeImage}
              resizeMode="contain"
            />
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
              <Pressable
                style={styles.notificationPanel}
                onPress={e => e.stopPropagation()}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>Notifications</Text>
                  <TouchableOpacity onPress={handleOutsidePress}>
                    <Image
                      source={require('../assets/victorIconImage/bell.png')}
                      style={styles.eyeImage}
                      resizeMode="contain"
                    />
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
      {/* <View style={styles.birthdaySection}>
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
      </View> */}

      <View style={styles.birthdaySection}>
        <View style={styles.birthdayCard}>
          <Text style={styles.cardTitle}>Birthdays & Work Anniversaries</Text>

          {filteredHighlights?.map((item, index) => (
            <View key={index} style={styles.eventRow}>
              {/* LEFT ICON */}
              <Text style={styles.eventIcon}>
                {item.type === 'birthday' ? '🎉' : '🏆'}
              </Text>

              {/* CENTER CONTENT */}
              <View style={{flex: 1}}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventSubtitle}>{item.details}</Text>
                <Text style={styles.eventDate}>
                  {new Date(item.date).toDateString()}
                </Text>
              </View>

              {/* RIGHT BUTTON */}
              <TouchableOpacity>
                <Text style={styles.actionText}>
                  {item.type === 'birthday' ? 'Send Wishes' : 'Congratulate'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
                    if (card.title === 'Payroll') navigateToPayroll();
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
                    if (card.title === 'My Payroll') {
                      navigateToPayroll();
                      return;
                    }
                    const screenMap = {
                      Attendance: 'AttendanceScreen',
                      Leave: 'LeaveScreen',
                      'Raise Concern': 'RaiseConcernScreen',
                      Announcements: 'AnnouncementScreen',
                      Reports: 'ReportScreen',
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
    position: 'relative',
    marginTop: 36,
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
    zIndex: 999,
    elevation: 10,
  },
  profilePic: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
  },
  icon: {width: 12, height: 12},
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
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
  // featureRow: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-between',
  //   marginVertical: 12,
  // },
  // featureCard: {
  //   width: width * 0.29,
  //   borderRadius: 10,
  //   padding: 12,
  //   alignItems: 'center',
  //   marginBottom: 12,
  // },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center', // ✅ दोनों cards ek sath chipke rahenge
    marginVertical: 12,
  },

  featureCard: {
    width: width * 0.29,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 8, // ✅ equal gap dono side
    marginBottom: 12,
  },

  featureImage: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  cardText: {
    fontSize: 10,
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
  logo: {width: 120, height: 40},
  cardContainer: {alignItems: 'center', marginRight: 12},
  notificationPanel: {
    position: 'absolute',
    top: 90,
    right: 30,
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
  panelTitle: {fontSize: 16, fontWeight: 'bold'},
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
    backgroundColor: '#4CAF50',
  },

  eyeIcon: {position: 'absolute', right: 15},
  eyeImage: {width: 20, height: 20},
  initialsText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },

  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  eventIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  eventSubtitle: {
    fontSize: 12,
    color: '#555',
  },

  eventDate: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },

  actionText: {
    fontSize: 13,
    color: '#23B480',
    fontWeight: '600',
  },
});

export default DashboardScreen;
