import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchEmployeeById } from '../redux/employeeSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const gridItems = [
  { label: 'Personal Info', image: require('../../src/assets/profileicon/PersonalInfo.png')},
  { label: 'Support',       image: require('../../src/assets/profileicon/headphones.png') },
  { label: 'Meetings',      image: require('../../src/assets/profileicon/Meeting.png')},
  { label: 'Job Details',   image: require('../../src/assets/profileicon/Jobdetail.png')},
  { label: 'Documents',     image: require('../../src/assets/profileicon/file-text-fill.png')},
  { label: 'Visits',        image: require('../../src/assets/profileicon/Visit.png')},
  { label: 'Attendance',    image: require('../../src/assets/profileicon/Attendance.png')},
  { label: 'Leave',         image: require('../../src/assets/profileicon/clock.png')},
  { label: 'Approval',      image: require('../../src/assets/profileicon/Visit.png')},
  { label: 'Expense',       image: require('../../src/assets/profileicon/taxdocument.png')},
  { label: 'Notice',        image: require('../../src/assets/profileicon/volume-up-fill.png')},
  { label: 'Logout',        image: require('../../src/assets/profileicon/LogOut.png')},
];

const ProfileScreen = ({ navigation }) => {
  const [allRecord, setAllRecord] = useState(null);
  const dispatch = useDispatch();
  const employee = useSelector((state) => state.employee);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empId = await AsyncStorage.getItem('empId');
        if (empId) {
          dispatch(fetchEmployeeById(empId));
        } else {
          Alert.alert('Error', 'Employee ID not found. Please log in again.');
        }
      } catch (e) {
        console.error('❌ Error fetching empId:', e);
        Alert.alert('Error', 'Failed to fetch employee data. Please try again.');
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (employee) {
      setAllRecord(employee.employeeData);
    }
  }, [employee]);

  // Handle loading and error states
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Handle navigation for grid items
  const handleGridItemPress = (label) => {
    switch (label) {
      case 'Personal Info':
        navigation.navigate('PersonalInfoScreen');
        break;
      case 'Job Details':
        navigation.navigate('JobDetailScreen');
        break;
      case 'Documents':
        navigation.navigate('DocumentsScreen');
        break;
      case 'Logout':
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                try {
                  await AsyncStorage.removeItem('empId');
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'LoginScreen' }],
                  });
                } catch (e) {
                  console.error('❌ Error during logout:', e);
                  Alert.alert('Error', 'Failed to logout. Please try again.');
                }
              },
            },
          ],
          { cancelable: true }
        );
        break;
      default:
        Alert.alert('Info', `${label} functionality is not implemented yet.`);
    }
  };

  const handleImageUpload = () => {
    navigation.navigate('ProfileScreen')
  };

  return (
    <LinearGradient colors={['#402530', '#DAA3A3']} style={styles.container}>
      <StatusBar backgroundColor="#5A2A55" barStyle="light-content" />

      {/* Top Card */}
      <View style={styles.topCardContainer}>
        <View style={styles.topCard}>



        <View style={styles.profilePicContainer}>
            <Image
              source={
                allRecord?.photoUrl
                  ? { uri: allRecord.photoUrl }
                  : require('../../src/assets/dashboardIcon/birthday.png')
              }
              style={styles.profilePic}
            />
            <TouchableOpacity style={styles.plusIconContainer} onPress={handleImageUpload}>
              <Image
                source={require('../../src/assets/profileicon/pencil.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {allRecord?.firstName || allRecord?.lastName
                ? `${allRecord.firstName} ${allRecord.lastName}`
                : 'Unknown User 123'}
            </Text>
            <Text style={styles.designation}>{allRecord?.jobTitle || 'No Title'}</Text>
            <Text style={styles.empId}>{allRecord?.customId || 'No ID'}</Text>
          </View>
          <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#402530" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid Menu */}
      <View style={styles.gridContainer}>
        {gridItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.gridItem, { backgroundColor: item.backgroundColor || '#fff' }]}
            onPress={() => handleGridItemPress(item.label)}
          >
            <View style={styles.gridItemContent}>
              <Image
                source={item.image}
                style={styles.gridImage}
                defaultSource={require('../../src/assets/dashboardIcon/birthday.png')}
              />
              <Text style={styles.gridText}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  topCardContainer: {
    alignItems: 'center',
  },
  topCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
    marginTop: 40,
    width: 370,
    height:127,
    borderRadius: 10,
    backgroundColor: '#FDF7F2',
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 10,
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: -3,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  icon: {
    width: 18,
    height: 18,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  name: {
    color: '#402530',
    fontSize: 18,
    fontWeight: 'bold',
  },
  designation: {
    color: '#402530',
    fontSize: 14,
  },
  empId: {
    color: '#402530',
    fontSize: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 15,
  },
  gridItem: {
    width: 122,
    height: 62,
    margin: 4,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  gridItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 8,
  },
  gridText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#5A2A55',
  },
});
