import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Modal,
  Image,
} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchEmployeeById,
  fetchEmployeeNotification,
} from '../redux/employeeSlice';
import {fetchByOrg} from '../redux/slice';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const AnnouncementScreen = () => {
  const [allRecord, setAllRecord] = useState(null);
  const [getNotifications, setGetNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const employee = useSelector(state => state?.employee?.employeeData);
  const notifications = useSelector(state => state?.employee?.notificationData);
  const orgDetails = useSelector(state => state.auth.employeeData);

  const [showNotifications, setShowNotifications] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

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

  return (
    <View style={styles.container}>
      {/* Header with Notification */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleBackPress}>
          <Image
            source={require('../assets/victorIconImage/arrowLeft.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Announcement Screen</Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setShowNotifications(true)}>
          <Image
            source={require('../assets/victorIconImage/bell.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          {getNotifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{getNotifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notification Panel */}
      <Modal
        transparent
        visible={showNotifications}
        animationType="fade"
        onRequestClose={handleOutsidePress}>
        <Pressable style={styles.modalBackground} onPress={handleOutsidePress}>
          <Pressable style={styles.notificationPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Notifications</Text>
              <TouchableOpacity onPress={handleOutsidePress}>
                <Image
                  source={require('../assets/victorIconImage/arrowLeft.png')}
                  style={styles.arrowLeft}
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

      <View style={styles.noAnnouncementWrapper}>
        <Text style={styles.noAnnouncementText}>No Announcement Yet</Text>
      </View>
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
    minHeight: 80,
  },
  title: {color: '#fff', fontSize: 18, fontWeight: '600', top:10},
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
  notificationPanel: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 250,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
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
  },
  noAnnouncementWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAnnouncementText: {
    fontSize: 20, // text बड़ा कर दिया
    fontWeight: '600',
    color: '#333',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', // subtle circle
    top:10
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default AnnouncementScreen;
