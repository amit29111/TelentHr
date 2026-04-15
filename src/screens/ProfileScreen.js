import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Modal,
  Alert,
  Platform,

} from 'react-native';
// Removed Ionicons import to fix the error
import {fetchEmployeeById} from '../redux/employeeSlice';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {launchImageLibrary} from 'react-native-image-picker';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {ENDPOINT} from '../api/endpoint';
import apiClient from '../api/apiClient';

const {width} = Dimensions.get('window');

const gridItems = [
  {
    label: 'Personal Info',
    image: require('../../src/assets/profileicon/PersonalInfo.png'),
  },
  {
    label: 'Meetings',
    image: require('../../src/assets/profileicon/Meeting.png'),
  },
  {
    label: 'Job Details',
    image: require('../../src/assets/profileicon/Jobdetail.png'),
  },
  {
    label: 'Attendance',
    image: require('../../src/assets/profileicon/Attendance.png'),
  },
  {label: 'Leave', image: require('../../src/assets/profileicon/clock.png')},
  {label: 'Logout', image: require('../../src/assets/profileicon/LogOut.png')},
];

const ProfileScreen = ({navigation}) => {
  const [allRecord, setAllRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const employee = useSelector(state => state.employee);
  const loading = useSelector(state => state.loading);
  const error = useSelector(state => state.error);

  const [profileImage, setProfileImage] = useState(null);

  const requestGalleryPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
      const current = await check(permission);

      if (current === RESULTS.GRANTED) return true;

      if (current === RESULTS.DENIED) {
        const result = await request(permission);
        if (result === RESULTS.GRANTED) return true;
        return false;
      }
      
      if (current === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission blocked',
          'Please allow photo access in Settings to change your profile picture.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => openSettings()},
          ],
        );
      }
      return false;
    } catch (err) {
      console.warn('permission error', err);
      return false;
    }
  };

  const handleImageSelection = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    launchImageLibrary(
      {mediaType: 'photo', quality: 0.8},
      async pickerResponse => {
        if (pickerResponse.didCancel) return;
        if (pickerResponse.errorMessage) {
          Alert.alert('Error', pickerResponse.errorMessage);
          return;
        }

        if (pickerResponse.assets?.length > 0) {
          const selectedImage = pickerResponse.assets[0];
          try {
            const empId = await AsyncStorage.getItem('empId');
            const url = ENDPOINT.UPLOADPHOTO.UPLOADPHOTO(empId);

            const imageUri =
              Platform.OS === 'android'
                ? selectedImage.uri
                : selectedImage.uri.replace('file://', '');

            const formData = new FormData();
            formData.append('file', {
              uri: imageUri,
              type: selectedImage.type || 'image/jpeg',
              name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
            });

            const apiResponse = await apiClient.post(url, formData, {
              headers: {'Content-Type': 'multipart/form-data'},
            });

            if (apiResponse.status === 200 || apiResponse.status === 201) {
              setProfileImage(selectedImage.uri);
            } else {
              Alert.alert('Error', apiResponse.data?.message || 'Upload failed.');
            }
          } catch (error) {
            Alert.alert('Upload Failed', 'Something went wrong');
          } finally {
            setModalVisible(false);
          }
        }
      },
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empId = await AsyncStorage.getItem('empId');
        if (empId) {
          dispatch(fetchEmployeeById(empId));
        }
      } catch (e) {
        console.error('❌ Error fetching:', e);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (employee) {
      setAllRecord(employee.employeeData);
    }
  }, [employee]);

  const handleGridItemPress = label => {
    switch (label) {
      case 'Personal Info':
        navigation.navigate('PersonalInfoScreen');
        break;
      case 'Meetings':
        navigation.navigate('CalendarScreen');
        break;
      case 'Job Details':
        navigation.navigate('JobDetialScreen');
        break;
      case 'Attendance':
        navigation.navigate('AttendanceScreen');
        break;
      case 'Leave':
        navigation.navigate('LeaveScreen');
        break;
      case 'Logout':
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Logout',
            onPress: async () => {
              await AsyncStorage.removeItem('empId');
              navigation.reset({index: 0, routes: [{name: 'LoginScreen'}]});
            },
          },
        ]);
        break;
    }
  };

  if (loading) return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;

  return (
    <LinearGradient colors={['#402530', '#DAA3A3']} style={styles.container}>
      <StatusBar backgroundColor="#5A2A55" barStyle="light-content" />

      {/* Top Card */}
      <View style={styles.topCardContainer}>
        <View style={styles.topCard}>
          <View style={styles.profilePicContainer}>
            {profileImage ? (
              <Image source={{uri: profileImage}} style={styles.profilePic} />
            ) : allRecord?.photoUrl ? (
              <Image source={{uri: allRecord.photoUrl}} style={styles.profilePic} />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>
                  {allRecord?.firstName ? allRecord?.firstName.substring(0, 2).toUpperCase() : '??'}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.plusIconContainer} onPress={() => setModalVisible(true)}>
              <Image
                source={require('../../src/assets/profileicon/pencil.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {allRecord?.firstName ? `${allRecord.firstName} ${allRecord.lastName}` : 'User Name'}
            </Text>
            <Text style={styles.designation}>{allRecord?.jobTitle || 'No Title'}</Text>
            <Text style={styles.empId}>{allRecord?.customId || 'No ID'}</Text>
          </View>

          {/* Replaced Ionicons with Image */}
          <TouchableOpacity onPress={() => navigation.navigate('DashboardScreen')}>
            <Image 
              source={require('../../src/assets/Menu-Icon-PNG.png')} 
              style={styles.menuIcon} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid Menu */}
      <View style={styles.gridContainer}>
        {gridItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => handleGridItemPress(item.label)}>
            <View style={styles.gridItemContent}>
              <Image source={item.image} style={styles.gridImage} />
              <Text style={styles.gridText}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Profile Photo?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.importButton]} onPress={handleImageSelection}>
                <Text style={styles.importButtonText}>Import Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 60 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topCardContainer: { alignItems: 'center' },
  topCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
    marginTop: 40,
    width: width * 0.9,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#FDF7F2',
  },
  profilePicContainer: { width: 60, height: 60, position: 'relative' },
  profilePic: { width: '100%', height: '100%', borderRadius: 30 },
  initialsContainer: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', borderRadius: 30 },
  initialsText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  plusIconContainer: { position: 'absolute', bottom: 0, right: -5, backgroundColor: '#fff', borderRadius: 10, padding: 2, elevation: 5 },
  icon: { width: 16, height: 16 },
  profileInfo: { flex: 1, marginHorizontal: 15 },
  name: { color: '#402530', fontSize: 16, fontWeight: 'bold' },
  designation: { color: '#402530', fontSize: 13 },
  empId: { color: '#402530', fontSize: 11 },
  menuIcon: { width: 24, height: 24, tintColor: '#402530' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 15 },
  gridItem: { width: 110, height: 60, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 2 },
  gridItemContent: { flexDirection: 'row', alignItems: 'center' },
  gridImage: { width: 20, height: 20, marginRight: 8 },
  gridText: { fontSize: 11, color: '#5A2A55' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: 300, backgroundColor: '#FFF', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 16, color: '#402530', marginBottom: 20, textAlign: 'center' },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 5, alignItems: 'center', borderWidth: 1 },
  cancelButton: { borderColor: '#5A2A55' },
  cancelButtonText: { color: '#5A2A55' },
  importButton: { backgroundColor: '#402530', borderColor: '#402530' },
  importButtonText: { color: '#fff' },
});






// import React, {useEffect, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
//   Modal,
//   PermissionsAndroid,
//   Alert,
//   Platform,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {fetchEmployeeById} from '../redux/employeeSlice';
// import {useDispatch, useSelector} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LinearGradient from 'react-native-linear-gradient';
// import {launchImageLibrary} from 'react-native-image-picker';

// import {
//   check,
//   request,
//   openSettings,
//   PERMISSIONS,
//   RESULTS,
// } from 'react-native-permissions';
// import {ENDPOINT} from '../api/endpoint';
// import apiClient from '../api/apiClient';

// const {width} = Dimensions.get('window');

// const gridItems = [
//   {
//     label: 'Personal Info',
//     image: require('../../src/assets/profileicon/PersonalInfo.png'),
//   },
//   // {
//   //   label: 'Support',
//   //   image: require('../../src/assets/profileicon/headphones.png'),
//   // },
//   {
//     label: 'Meetings',
//     image: require('../../src/assets/profileicon/Meeting.png'),
//   },
//   {
//     label: 'Job Details',
//     image: require('../../src/assets/profileicon/Jobdetail.png'),
//   },
//   // {
//   //   label: 'Documents',
//   //   image: require('../../src/assets/profileicon/file-text-fill.png'),
//   // },
//   // {label: 'Visits', 
//   //   image: require('../../src/assets/profileicon/Visit.png')
//   // },
//   {
//     label: 'Attendance',
//     image: require('../../src/assets/profileicon/Attendance.png'),
//   },
//   {label: 'Leave', image: require('../../src/assets/profileicon/clock.png')},
//   // {
//   //   label: 'Approval',
//   //   image: require('../../src/assets/profileicon/Approval.png'),
//   // },
//   // {
//   //   label: 'Expense',
//   //   image: require('../../src/assets/profileicon/taxdocument.png'),
//   // },
//   // {
//   //   label: 'Notice',
//   //   image: require('../../src/assets/profileicon/volume-up-fill.png'),
//   // },
//   {label: 'Logout', image: require('../../src/assets/profileicon/LogOut.png')},
// ];

// const ProfileScreen = ({navigation}) => {
//   const [allRecord, setAllRecord] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const dispatch = useDispatch();
//   const employee = useSelector(state => state.employee);
//   const loading = useSelector(state => state.loading);
//   const error = useSelector(state => state.error);

//   const [profileImage, setProfileImage] = useState(null);

//   const requestGalleryPermission = async () => {
//     try {
//       const permission =
//         Platform.OS === 'android'
//           ? Platform.Version >= 33
//             ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES // Android 13+
//             : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE // Android <=12
//           : PERMISSIONS.IOS.PHOTO_LIBRARY;
//       const current = await check(permission);
//       console.log('permission check:', permission, current);

//       if (current === RESULTS.GRANTED) return true;

//       if (current === RESULTS.DENIED) {
//         const result = await request(permission);
//         console.log('permission request result:', result);
//         if (result === RESULTS.GRANTED) return true;

//         if (result === RESULTS.BLOCKED) {
//           // user chose "Don't ask again" or settings blocked it
//           Alert.alert(
//             'Permission blocked',
//             'Please allow photo access in Settings to change your profile picture.',
//             [
//               {text: 'Cancel', style: 'cancel'},
//               {text: 'Open Settings', onPress: () => openSettings()},
//             ],
//           );
//           return false;
//         }
//         return false;
//       }
//       if (current === RESULTS.BLOCKED) {
//         Alert.alert(
//           'Permission blocked',
//           'Please allow photo access in Settings to change your profile picture.',
//           [
//             {text: 'Cancel', style: 'cancel'},
//             {text: 'Open Settings', onPress: () => openSettings()}, // works after correct import
//           ],
//         );
//       }
//       const fallback = await request(permission);
//       return fallback === RESULTS.GRANTED;
//     } catch (err) {
//       console.warn('permission error', err);
//       return false;
//     }
//   };

//   const handleImageSelection = async () => {
//     const hasPermission = await requestGalleryPermission();
//     if (!hasPermission) {
//       Alert.alert(
//         'Permission Denied',
//         'Cannot access gallery without permission',
//       );
//       return;
//     }

//    launchImageLibrary(
//   { mediaType: 'photo', quality: 0.8 },
//   async (pickerResponse) => {
//     if (pickerResponse.didCancel) return;
//     if (pickerResponse.errorMessage) {
//       Alert.alert('Error', pickerResponse.errorMessage);
//       return;
//     }

//     if (pickerResponse.assets?.length > 0) {
//       const selectedImage = pickerResponse.assets[0];
//       console.log('Selected Image:', selectedImage.uri);

//       try {
//         const empId = await AsyncStorage.getItem('empId');
//         const orgId = await AsyncStorage.getItem('orgId'); // if required by API
//         const url = ENDPOINT.UPLOADPHOTO.UPLOADPHOTO(empId);

//         // Fix iOS URI issue
//         const imageUri =
//           Platform.OS === 'android'
//             ? selectedImage.uri
//             : selectedImage.uri.replace('file://', '');

//         // Match backend's expected key and format
//         const formData = new FormData();
//         formData.append(
//           'file', // <-- must match backend key from web version
//           {
//             uri: imageUri,
//             type: selectedImage.type || 'image/jpeg',
//             name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
//           }
//         );

//         // Upload
//         const apiResponse = await apiClient.post(url, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });

//         if (apiResponse.status === 200 || apiResponse.status === 201) {
//           setProfileImage(selectedImage.uri);
//         } else {
//           Alert.alert(
//             'Error',
//             apiResponse.data?.message || 'Upload failed.'
//           );
//         }
//       } catch (error) {
//         console.error('❌ Upload error:', error);
//         Alert.alert(
//           'Upload Failed',
//           error.response?.data?.message || error.message || 'Something went wrong'
//         );
//       } finally {
//         setModalVisible(false);
//       }
//     }
//   }
// );


//   };

//   // const handleImageSelection = async () => {
//   //   const hasPermission = await requestGalleryPermission();
//   //   if (!hasPermission) {
//   //     Alert.alert(
//   //       'Permission Denied',
//   //       'Cannot access gallery without permission',
//   //     );
//   //     return;
//   //   }

//   //   launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
//   //     if (response.didCancel) return;
//   //     if (response.errorMessage) {
//   //       Alert.alert('Error', response.errorMessage);
//   //     } else if (response.assets && response.assets.length > 0) {
//   //       const selectedImage = response.assets[0];
//   //       console.log('Selected Image:', selectedImage.uri);
//   //       // Upload logic here
//   //     }
//   //   });
//   // };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const empId = await AsyncStorage.getItem('empId');
//         if (empId) {
//           dispatch(fetchEmployeeById(empId));
//         } else {
//           Alert.alert('Error', 'Employee ID not found. Please log in again.');
//         }
//       } catch (e) {
//         console.error('❌ Error fetching empId:', e);
//         Alert.alert(
//           'Error',
//           'Failed to fetch employee data. Please try again.',
//         );
//       }
//     };
//     fetchData();
//   }, [dispatch]);

//   useEffect(() => {
//     if (employee) {
//       setAllRecord(employee.employeeData);
//     }
//   }, [employee]);

//   const handleImageUpload = () => {
//     setModalVisible(true);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Error: {error}</Text>
//       </View>
//     );
//   }

//   // Handle navigation for grid items
//   const handleGridItemPress = label => {
//     switch (label) {
//       case 'Personal Info':
//         navigation.navigate('PersonalInfoScreen');
//         break;
//         case 'Meetings':
//         navigation.navigate('CalendarScreen');
//         break;
//       case 'Support':
//         navigation.navigate('Support');
//         break;

//       case 'Job Details':
//         navigation.navigate('JobDetais');
//         break;
//       case 'Documents':
//         navigation.navigate('DocumentsScreen');
//         break;
//       case 'Attendance':
//         navigation.navigate('AttendanceScreen');
//         break;

//       case 'Leave':
//         navigation.navigate('LeaveScreen');
//         break;
//       case 'Logout':
//         Alert.alert(
//           'Logout',
//           'Are you sure you want to logout?',
//           [
//             {text: 'Cancel', style: 'cancel'},
//             {
//               text: 'Logout',
//               style: 'destructive',
//               onPress: async () => {
//                 try {
//                   await AsyncStorage.removeItem('empId');
//                   navigation.reset({
//                     index: 0,
//                     routes: [{name: 'LoginScreen'}],
//                   });
//                 } catch (e) {
//                   console.error('❌ Error during logout:', e);
//                   Alert.alert('Error', 'Failed to logout. Please try again.');
//                 }
//               },
//             },
//           ],
//           {cancelable: true},
//         );
//         break;
//       default:
//         Alert.alert('Info', `${label} functionality is not implemented yet.`);
//     }
//   };

//   return (
//     <LinearGradient colors={['#402530', '#DAA3A3']} style={styles.container}>
//       <StatusBar backgroundColor="#5A2A55" barStyle="light-content" />

//       {/* Top Card */}
//       <View style={styles.topCardContainer}>
//         <View style={styles.topCard}>
//           <View style={styles.profilePicContainer}>
//             {/* <Image
//               source={
//                 allRecord?.photoUrl
//                   ? {uri: allRecord.photoUrl}
//                   : require('../../src/assets/dashboardIcon/birthday.png')
//               }
//               style={styles.profilePic}
//             /> */}

//             {profileImage ? (
//               <Image source={{uri: profileImage}} style={styles.profilePic} />
//             ) : allRecord?.photoUrl ? (
//               <Image
//                 source={{uri: allRecord.photoUrl}}
//                 style={styles.profilePic}
//               />
//             ) : (
//               <View style={styles.initialsContainer}>
//                 <Text style={styles.initialsText}>
//                   {allRecord?.firstName
//                     ? allRecord?.firstName.substring(0, 2).toUpperCase()
//                     : ''}
//                 </Text>
//               </View>
//             )}

//             {/* {allRecord?.photoUrl ? (
//               <Image
//                 source={{uri: allRecord.photoUrl}}
//                 style={styles.profilePic}
//               />
//             ) : (
//               <View style={styles.initialsContainer}>
//                 <Text style={styles.initialsText}>
//                   {allRecord?.firstName
//                     ? allRecord?.firstName.substring(0, 2).toUpperCase()
//                     : ''}
//                 </Text>
//               </View>
//             )} */}
//             <TouchableOpacity
//               style={styles.plusIconContainer}
//               onPress={handleImageUpload}>
//               <Image
//                 source={require('../../src/assets/profileicon/pencil.png')}
//                 style={styles.icon}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.profileInfo}>
//             <Text style={styles.name}>
//               {allRecord?.firstName || allRecord?.lastName
//                 ? `${allRecord.firstName} ${allRecord.lastName}`
//                 : 'Unknown User 123'}
//             </Text>
//             <Text style={styles.designation}>
//               {allRecord?.jobTitle || 'No Title'}
//             </Text>
//             <Text style={styles.empId}>{allRecord?.customId || 'No ID'}</Text>
//           </View>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('DashboardScreen')}>
//             <Ionicons name="menu" size={24} color="#402530" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Grid Menu */}
//       <View style={styles.gridContainer}>
//         {gridItems.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[
//               styles.gridItem,
//               {backgroundColor: item.backgroundColor || '#fff'},
//             ]}
//             onPress={() => handleGridItemPress(item.label)}>
//             <View style={styles.gridItemContent}>
//               <Image
//                 source={item.image}
//                 style={styles.gridImage}
//                 defaultSource={require('../../src/assets/dashboardIcon/birthday.png')}
//               />
//               <Text style={styles.gridText}>{item.label}</Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Custom Modal for Image Upload */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>
//               Do you want Change {'\n'} your Profile Photo?
//             </Text>
//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setModalVisible(false)}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.importButton]}
//                 // onPress={handleImageSelection}
//                 onPress={handleImageSelection}>
//                 <Text style={styles.importButtonText}>Import Image</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </LinearGradient>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingBottom: 60,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
//   topCardContainer: {
//     alignItems: 'center',
//   },
//   topCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     justifyContent: 'space-between',
//     marginTop: 40,
//     width: 370,
//     height: 127,
//     borderRadius: 10,
//     backgroundColor: '#FDF7F2',
//   },
//   // profilePicContainer: {
//   //   position: 'relative',
//   // },
//   profilePic: {
//     width: 55,
//     height: 55,
//     borderRadius: 30,
//     marginRight: 0,
//   },
//   // plusIconContainer: {
//   //   position: 'absolute',
//   //   bottom: -3,
//   //   right: 5,
//   //   backgroundColor: 'white',
//   //   borderRadius: 10,
//   // },
//   icon: {
//     width: 18,
//     height: 18,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   profileInfo: {
//     flex: 1,
//     marginHorizontal: 15,
//   },
//   name: {
//     color: '#402530',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   designation: {
//     color: '#402530',
//     fontSize: 14,
//   },
//   empId: {
//     color: '#402530',
//     fontSize: 12,
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginVertical: 15,
//   },
//   gridItem: {
//     width: 110,
//     height: 62,
//     margin: 4,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 3,
//     padding: 10,
//   },
//   gridItemContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   gridImage: {
//     width: 22,
//     height: 22,
//     resizeMode: 'contain',
//     marginRight: 8,
//   },
//   gridText: {
//     fontSize: 12,
//     textAlign: 'center',
//     color: '#5A2A55',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center', // Centers vertically
//     alignItems: 'center', // Centers horizontally
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//   },
//   modalContainer: {
//     width: 300,
//     height: 200, // Increased height for a taller modal
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center', // Ensures content inside modal is centered horizontally
//     justifyContent: 'center', // Ensures content inside modal is centered vertically
//     elevation: 5,
//     marginBottom: 245,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontFamily: 'Manrope-Regular',
//     color: '#402530',
//     marginBottom: 20,
//     textAlign: 'center',
//     justifyContent: 'center',
//   },
//   modalButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   modalButton: {
//     flex: 1,
//     padding: 10,
//     marginHorizontal: 5,
//     borderRadius: 5,
//     borderWidth: 1,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     borderColor: '#5A2A55',
//     backgroundColor: '#fff', // Inactive state
//     borderRadius: 10,
//   },
//   cancelButtonText: {
//     color: '#5A2A55',
//     fontSize: 12,
//     fontFamily: 'Manrope-Regular',
//   },
//   importButton: {
//     borderColor: '#402530',
//     backgroundColor: '#402530', // Active state
//     borderRadius: 10,
//   },

//   plusIconContainer: {
//   position: 'absolute',
//   top: 33,
//   right: 2,
//   backgroundColor: '#fff',
//   borderRadius: 20,
//   padding: 0,
//   borderWidth: 1,
//   borderColor: '#ccc',
//   zIndex: 999,       // high value
//   elevation: 10,     // for Android
// },

//   importButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontFamily: 'Manrope-Bold',
//   },
//   // profilePicContainer: {
//   //   width: 50,
//   //   height: 50,
//   //   borderRadius: 25,
//   //   overflow: 'hidden',
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   //   backgroundColor: '#ccc', // initials background color
//   // },
//    profilePicContainer: {
//   width: 50,
//   height: 50,
//   borderRadius: 25,
//   // overflow: 'hidden',
//   position: 'relative', // <-- important
// },
//   profilePic: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 25,
//   },
//   initialsContainer: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4CAF50', // choose any color
//   },
//   initialsText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });







// import React, {useEffect, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
//   Modal,
//   Alert,
//   Platform,
// } from 'react-native';
// import {fetchEmployeeById} from '../redux/employeeSlice';
// import {useDispatch, useSelector} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LinearGradient from 'react-native-linear-gradient';
// import {launchImageLibrary} from 'react-native-image-picker';
// import {
//   check,
//   request,
//   openSettings,
//   PERMISSIONS,
//   RESULTS,
// } from 'react-native-permissions';
// import {ENDPOINT} from '../api/endpoint';
// import apiClient from '../api/apiClient';

// const {width} = Dimensions.get('window');

// const gridItems = [
//   {label: 'Personal Info', image: require('../../src/assets/profileicon/PersonalInfo.png')},
//   {label: 'Meetings', image: require('../../src/assets/profileicon/Meeting.png')},
//   {label: 'Job Details', image: require('../../src/assets/profileicon/Jobdetail.png')},
//   {label: 'Attendance', image: require('../../src/assets/profileicon/Attendance.png')},
//   {label: 'Leave', image: require('../../src/assets/profileicon/clock.png')},
//   {label: 'Logout', image: require('../../src/assets/profileicon/LogOut.png')},
// ];

// const ProfileScreen = ({navigation}) => {
//   const [allRecord, setAllRecord] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [profileImage, setProfileImage] = useState(null);

//   const dispatch = useDispatch();
//   const employee = useSelector(state => state.employee);
//   const loading = useSelector(state => state.loading);
//   const error = useSelector(state => state.error);

//   useEffect(() => {
//     const loadData = async () => {
//       const empId = await AsyncStorage.getItem('empId');
//       if (empId) dispatch(fetchEmployeeById(empId));
//     };
//     loadData();
//   }, [dispatch]);

//   useEffect(() => {
//     if (employee?.employeeData) {
//       setAllRecord(employee.employeeData);
//     }
//   }, [employee]);

//   const handleGridItemPress = label => {
//     if (label === 'Logout') {
//       Alert.alert('Logout', 'Are you sure?', [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Logout',
//           onPress: async () => {
//             await AsyncStorage.removeItem('empId');
//             navigation.reset({
//               index: 0,
//               routes: [{name: 'LoginScreen'}],
//             });
//           },
//         },
//       ]);
//       return;
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <LinearGradient colors={['#402530', '#DAA3A3']} style={styles.container}>
//       <StatusBar backgroundColor="#402530" barStyle="light-content" />

//       {/* TOP CARD */}
//       <View style={styles.topCard}>
//         <View style={styles.profilePicContainer}>
//           {profileImage || allRecord?.photoUrl ? (
//             <Image
//               source={{uri: profileImage || allRecord.photoUrl}}
//               style={styles.profilePic}
//             />
//           ) : (
//             <View style={styles.initials}>
//               <Text style={styles.initialText}>
//                 {allRecord?.firstName?.substring(0, 2).toUpperCase()}
//               </Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.profileInfo}>
//           <Text style={styles.name}>
//             {allRecord?.firstName} {allRecord?.lastName}
//           </Text>
//           <Text style={styles.designation}>{allRecord?.jobTitle}</Text>
//           <Text style={styles.empId}>{allRecord?.customId}</Text>
//         </View>

//         {/* 🔥 HAMBURGER ICON (NO VECTOR / NO IMAGE) */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() => navigation.navigate('DashboardScreen')}>
//           <View style={styles.menuIcon}>
//             <View style={styles.menuBar} />
//             <View style={styles.menuBar} />
//             <View style={styles.menuBar} />
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* GRID */}
//       <View style={styles.gridContainer}>
//         {gridItems.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.gridItem}
//             onPress={() => handleGridItemPress(item.label)}>
//             <Image source={item.image} style={styles.gridImage} />
//             <Text style={styles.gridText}>{item.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </LinearGradient>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   center: {flex: 1, justifyContent: 'center', alignItems: 'center'},

//   topCard: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   margin: 20,
//   marginTop: 40,   // 👈 yahan se poora card neeche aayega
//   padding: 15,
//   borderRadius: 10,
//   backgroundColor: '#FDF7F2',
// },


//   profilePicContainer: {
//     width: 55,
//     height: 55,
//     borderRadius: 28,
//     overflow: 'hidden',
//   },
//   profilePic: {width: '100%', height: '100%'},
//   initials: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   initialText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},

//   profileInfo: {flex: 1, marginHorizontal: 15},
//   name: {fontSize: 18, fontWeight: 'bold', color: '#402530'},
//   designation: {fontSize: 14, color: '#402530'},
//   empId: {fontSize: 12, color: '#402530'},

//   /* 🔥 HAMBURGER STYLES */
//   menuIcon: {
//     width: 24,
//     height: 18,
//     justifyContent: 'space-between',
//   },
//   menuBar: {
//     height: 3,
//     width: '100%',
//     backgroundColor: '#402530',
//     borderRadius: 2,
//   },

//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   gridItem: {
//     width: 110,
//     height: 60,
//     backgroundColor: '#fff',
//     margin: 5,
//     borderRadius: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   gridImage: {width: 22, height: 22, marginRight: 8},
//   gridText: {fontSize: 12, color: '#402530'},
// });







// import React, {useEffect, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
//   Modal,
//   Alert,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// import {fetchEmployeeById} from '../redux/employeeSlice';
// import {useDispatch, useSelector} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LinearGradient from 'react-native-linear-gradient';
// import {launchImageLibrary} from 'react-native-image-picker';
// import {
//   check,
//   request,
//   openSettings,
//   PERMISSIONS,
//   RESULTS,
// } from 'react-native-permissions';
// import {ENDPOINT} from '../api/endpoint';
// import apiClient from '../api/apiClient';

// const {width} = Dimensions.get('window');

// const gridItems = [
//   { label: 'Personal Info', image: require('../../src/assets/profileicon/PersonalInfo.png') },
//   { label: 'Meetings', image: require('../../src/assets/profileicon/Meeting.png') },
//   { label: 'Job Details', image: require('../../src/assets/profileicon/Jobdetail.png') },
//   { label: 'Attendance', image: require('../../src/assets/profileicon/Attendance.png') },
//   { label: 'Leave', image: require('../../src/assets/profileicon/clock.png') },
//   { label: 'Logout', image: require('../../src/assets/profileicon/LogOut.png') },
// ];

// const ProfileScreen = ({navigation}) => {
//   const [allRecord, setAllRecord] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [profileImage, setProfileImage] = useState(null);

//   const dispatch = useDispatch();
//   const { employeeData: employee, loading, error } = useSelector(state => state.employee);

//   useEffect(() => {
//     fetchData();
//   }, [dispatch]);

//   useEffect(() => {
//     if (employee) {
//       setAllRecord(employee);
//     }
//   }, [employee]);

//   const fetchData = async () => {
//     try {
//       const empId = await AsyncStorage.getItem('empId');
//       if (empId) {
//         dispatch(fetchEmployeeById(empId));
//       }
//     } catch (e) {
//       console.error('❌ Error fetching empId:', e);
//     }
//   };

//   const requestGalleryPermission = async () => {
//     try {
//       const permission = Platform.OS === 'android'
//         ? (Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
//         : PERMISSIONS.IOS.PHOTO_LIBRARY;
      
//       const current = await check(permission);
//       if (current === RESULTS.GRANTED) return true;

//       const result = await request(permission);
//       if (result === RESULTS.GRANTED) return true;

//       if (result === RESULTS.BLOCKED) {
//         Alert.alert(
//           'Permission Blocked',
//           'Please allow photo access in Settings to change your profile picture.',
//           [{ text: 'Cancel' }, { text: 'Open Settings', onPress: () => openSettings() }]
//         );
//       }
//       return false;
//     } catch (err) {
//       return false;
//     }
//   };

//   const handleImageSelection = async () => {
//     const hasPermission = await requestGalleryPermission();
//     if (!hasPermission) return;

//     launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, async (response) => {
//       if (response.didCancel || response.errorMessage) {
//         setModalVisible(false);
//         return;
//       }

//       if (response.assets?.length > 0) {
//         const selected = response.assets[0];
//         uploadImage(selected);
//       }
//     });
//   };

//   const uploadImage = async (selectedImage) => {
//     setUploading(true);
//     try {
//       const empId = await AsyncStorage.getItem('empId');
//       const url = ENDPOINT.UPLOADPHOTO.UPLOADPHOTO(empId);

//       const formData = new FormData();
//       formData.append('file', {
//         uri: Platform.OS === 'android' ? selectedImage.uri : selectedImage.uri.replace('file://', ''),
//         type: selectedImage.type || 'image/jpeg',
//         name: selectedImage.fileName || `profile_${Date.now()}.jpg`,
//       });

//       const res = await apiClient.post(url, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       if (res.status === 200 || res.status === 201) {
//         setProfileImage(selectedImage.uri);
//         Alert.alert('Success', 'Profile photo updated successfully!');
//       }
//     } catch (err) {
//       Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
//     } finally {
//       setUploading(false);
//       setModalVisible(false);
//     }
//   };

//   const handleGridItemPress = (label) => {
//     if (label === 'Logout') {
//       Alert.alert('Logout', 'Are you sure?', [
//         { text: 'Cancel' },
//         { text: 'Logout', onPress: async () => {
//             await AsyncStorage.removeItem('empId');
//             navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
//         }}
//       ]);
//       return;
//     }
//     const routes = {
//       'Personal Info': 'PersonalInfoScreen',
//       'Meetings': 'CalendarScreen',
//       'Job Details': 'JobDetais',
//       'Attendance': 'AttendanceScreen',
//       'Leave': 'LeaveScreen',
//     };
//     if (routes[label]) navigation.navigate(routes[label]);
//   };

//   return (
//     <LinearGradient colors={['#402530', '#DAA3A3']} style={styles.container}>
//       <StatusBar backgroundColor="#402530" barStyle="light-content" />

//       <View style={styles.topCardContainer}>
//         <View style={styles.topCard}>
//           <View style={styles.profilePicWrapper}>
//             <View style={styles.imageCircle}>
//               {profileImage || allRecord?.photoUrl ? (
//                 <Image 
//                   source={{ uri: profileImage || allRecord?.photoUrl }} 
//                   style={styles.profilePic} 
//                 />
//               ) : (
//                 <View style={styles.initialsContainer}>
//                   <Text style={styles.initialsText}>
//                     {allRecord?.firstName?.substring(0, 2).toUpperCase() || '??'}
//                   </Text>
//                 </View>
//               )}
//             </View>
            
//             <TouchableOpacity 
//               style={styles.pencilBtn} 
//               onPress={() => setModalVisible(true)}
//               activeOpacity={0.7}
//             >
//               <Image 
//                 source={require('../../src/assets/profileicon/pencil.png')} 
//                 style={styles.pencilIcon} 
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.profileInfo}>
//             <Text style={styles.name} numberOfLines={1}>
//               {allRecord ? `${allRecord.firstName} ${allRecord.lastName}` : 'Loading...'}
//             </Text>
//             <Text style={styles.designation}>{allRecord?.jobTitle || 'Designation'}</Text>
//             <Text style={styles.empId}>{allRecord?.customId || 'ID: ---'}</Text>
//           </View>

//           <TouchableOpacity onPress={() => navigation.navigate('DashboardScreen')}>
//             <Ionicons name="menu" size={28} color="#402530" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.gridContainer}>
//         {gridItems.map((item, index) => (
//           <TouchableOpacity 
//             key={index} 
//             style={styles.gridItem} 
//             onPress={() => handleGridItemPress(item.label)}
//           >
//             <Image source={item.image} style={styles.gridImage} />
//             <Text style={styles.gridText}>{item.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Modal visible={modalVisible} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Update Profile Photo?</Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
//                 <Text style={styles.btnTextDark}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.btnImport} onPress={handleImageSelection}>
//                 {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextLight}>Import Image</Text>}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </LinearGradient>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   topCardContainer: { alignItems: 'center', marginTop: 50 },
//   topCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FDF7F2',
//     width: width * 0.9,
//     padding: 15,
//     borderRadius: 15,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//   },
//   profilePicWrapper: {
//     position: 'relative', // Pencil icon ki positioning ke liye zaroori hai
//     width: 65,
//     height: 65,
//   },
//   imageCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     overflow: 'hidden',
//     backgroundColor: '#ddd',
//   },
//   profilePic: { width: '100%', height: '100%' },
//   initialsContainer: {
//     flex: 1,
//     backgroundColor: '#5A2A55',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   initialsText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
//   pencilBtn: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#FFFFFF',
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: '#eee',
//     zIndex: 10, // Top par dikhne ke liye
//   },
//   pencilIcon: { width: 14, height: 14, tintColor: '#402530' },
//   profileInfo: { flex: 1, marginLeft: 15 },
//   name: { fontSize: 18, fontWeight: 'bold', color: '#402530' },
//   designation: { fontSize: 14, color: '#666' },
//   empId: { fontSize: 12, color: '#888' },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     paddingTop: 30,
//   },
//   gridItem: {
//     width: width * 0.28,
//     backgroundColor: '#fff',
//     padding: 12,
//     margin: 6,
//     borderRadius: 10,
//     alignItems: 'center',
//     flexDirection: 'row',
//     elevation: 2,
//   },
//   gridImage: { width: 20, height: 20, marginRight: 8, resizeMode: 'contain' },
//   gridText: { fontSize: 11, color: '#402530', fontWeight: '500' },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     padding: 25,
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
//   btnCancel: { flex: 1, padding: 12, marginRight: 5, borderWidth: 1, borderColor: '#402530', borderRadius: 8, alignItems: 'center' },
//   btnImport: { flex: 1, padding: 12, marginLeft: 5, backgroundColor: '#402530', borderRadius: 8, alignItems: 'center' },
//   btnTextDark: { color: '#402530', fontWeight: '600' },
//   btnTextLight: { color: '#fff', fontWeight: '600' },
// });

