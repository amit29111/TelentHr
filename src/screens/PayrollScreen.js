import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import TextTicker from 'react-native-text-ticker';
import {
  fetchEmployeeById,
  fetchEmployeeNotification,
  fetchEmployeeHighlights,
} from '../redux/employeeSlice';
import {fetchByOrg} from '../redux/slice';

import PayrollDashboard from './PayrollDashboard';

const {width} = Dimensions.get('window');

const PayrollScreen = ({navigation}) => {
  const [allRecord, setAllRecord] = useState(null);
  const [getNotifications, setGetNotifications] = useState([]);
  const dispatch = useDispatch();

  const employee = useSelector(state => state?.employee?.employeeData);
  const notifications = useSelector(state => state?.employee?.notificationData);
  const orgDetails = useSelector(state => state.auth.employeeData);

  const [showNotifications, setShowNotifications] = useState(false);

  const handleOutsidePress = () => {
    setShowNotifications(false);
  };

  const handleImageUpload = () => {
    const tabNavigation = navigation.getParent?.();
    if (tabNavigation?.navigate) {
      tabNavigation.navigate('Dashboard', {screen: 'ProfileScreen'});
      return;
    }
    navigation.navigate('ProfileScreen');
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
        console.log('Error fetching employee data:', e);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (employee) setAllRecord(employee);
    if (notifications) setGetNotifications(notifications.data || []);
  }, [employee, notifications]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

        <View style={styles.payrollSection}>
          <View style={styles.payrollContentCard}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.navigate('PayrollSalary')}>
                <Text style={styles.tabText}>Salary</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.navigate('PayrollTaxation')}>
                <Text style={styles.tabText}>Taxation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.navigate('PayrollClaims')}>
                <Text style={styles.tabText}>Claims</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.navigate('PayrollRequests')}>
                <Text style={styles.tabText}>Requests</Text>
              </TouchableOpacity>
            </View>

            <PayrollDashboard navigation={navigation} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PayrollScreen;

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
  payrollSection: {backgroundColor: '#452300'},
  payrollContentCard: {
    backgroundColor: '#F2E7E6',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 15,
    paddingBottom: 8,
    minHeight: 120,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3ECEC',
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: 30,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 24,
  },
  tabText: {
    color: '#555',
    fontSize: 12,
    fontWeight: '600',
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
