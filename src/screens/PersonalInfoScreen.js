

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
//   TextInput,
//   Alert,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import apiClient from '../api/apiClient';
// import { ENDPOINT } from '../api/endpoint';
// // import { updateEmployeeData } from '../redux/employeeSlice'; // 👈 अगर redux update करना है तो

// const { width } = Dimensions.get('window');

// const PersonalInfoScreen = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const employee = useSelector((state) => state.employee.employeeData);

//   const [isEditing, setIsEditing] = useState(false);
//   const [editValues, setEditValues] = useState({});
//   const [empId, setEmpId] = useState(null);

//   // 🔹 LocalStorage से empId निकालना
//   useEffect(() => {
//     const getEmpId = async () => {
//       const storedEmpId = await AsyncStorage.getItem('empId');
//       if (storedEmpId) {
//         setEmpId(storedEmpId);
//       }
//     };
//     getEmpId();
//   }, []);

//   // 🔹 Initial values set करना
//   useEffect(() => {
//     if (employee) {
//       const address = [
//         employee?.permanentAddress?.street,
//         employee?.permanentAddress?.address,
//         employee?.permanentAddress?.city,
//         employee?.permanentAddress?.country,
//         employee?.permanentAddress?.state,
//         employee?.permanentAddress?.zip,
//       ]
//         .filter(Boolean)
//         .join(', ');

//       setEditValues({
//         spouseName: employee.maritalInfo?.spouseName || '',
//         contact: employee.maritalInfo?.mobilePhone || '',
//         status: employee.maritalInfo?.status || '',
//         anniversary: employee.maritalInfo?.anniversary || '',
//         children: employee.maritalInfo?.numberOfChildren?.toString() || '',
//         pan: employee.nationalID?.pan || '',
//         aadhaar: employee.nationalID?.aadhar || '',
//         passport: employee.nationalID?.passport || '',
//         passportValid: employee.nationalID?.passportValid || '',
//         nationality: employee.demographics?.nationality || '',
//         religion: employee.demographics?.religion || '',
//         qualification: employee.demographics?.qualification || '',
//         handicapped: employee.handicappedInfo?.handicapped || '',
//         hDate: employee.handicappedInfo?.from || '',
//         e_name: employee.emergencyContact?.name || '',
//         e_mobile: employee.emergencyContact?.mobilePhone || '',
//         e_alternate: employee.emergencyContact?.homePhone || '',
//         address: address || '',
//       });
//     }
//   }, [employee]);

//   // 🔹 Save Changes → Update API Call
//   const handleSave = async () => {
//     try {
//       if (!empId) {
//         Alert.alert('Error', 'Employee ID not found in storage');
//         return;
//       }

//       const payload = {
//         demographics: {
//           nationality: editValues.nationality,
//           religion: editValues.religion,
//           qualification: editValues.qualification,
//         },
//         maritalInfo: {
//           spouseName: editValues.spouseName,
//           status: editValues.status,
//           anniversary: editValues.anniversary,
//           numberOfChildren: editValues.children,
//           mobilePhone: editValues.contact,
//         },
//         nationalID: {
//           pan: editValues.pan,
//           aadhar: editValues.aadhaar,
//           passport: editValues.passport,
//           passportValid: editValues.passportValid,
//         },
//         handicappedInfo: {
//           handicapped: editValues.handicapped,
//           from: editValues.hDate,
//         },
//         emergencyContact: {
//           name: editValues.e_name,
//           mobilePhone: editValues.e_mobile,
//           homePhone: editValues.e_alternate,
//         },
//         permanentAddress: {
//           address: editValues.address,
//         },
//       };

//       const res = await apiClient.put(ENDPOINT.LEAVE.UPDATEEMPLOYEE(empId), payload);

//       if (res.data.status === 'success') {
//         Alert.alert('Success', 'Employee updated successfully');
//         setIsEditing(false);

//         // 👇 अगर redux update करना हो
//         // dispatch(updateEmployeeData(res.data.data));
//       } else {
//         Alert.alert('Failed', res.data.message || 'Something went wrong');
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Failed to update employee');
//     }
//   };

//   // 🔹 Field renderer
//   const renderField = (label, key) => (
//     <View style={styles.fieldContainer} key={key}>
//       <View style={styles.labelRow}>
//         <View style={styles.iconWrapper}>
//           <Ionicons name="ribbon-outline" size={18} color="#4A4A4A" />
//         </View>
//         <Text style={styles.label}>
//           {label}:{' '}
//           {isEditing ? null : <Text style={styles.fieldValue}>{editValues[key]}</Text>}
//         </Text>
//       </View>
//       {isEditing && (
//         <TextInput
//           style={styles.input}
//           value={editValues[key]}
//           onChangeText={(text) => setEditValues({ ...editValues, [key]: text })}
//           placeholder={`Enter ${label}`}
//           placeholderTextColor="#aaa"
//           autoCapitalize="words"
//         />
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={22} color="#5B3A3A" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Personal Info</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.card}>
//           <View style={styles.sectionHeader}>
//             {!isEditing && (
//               <TouchableOpacity
//                 style={styles.updateBtn}
//                 onPress={() => setIsEditing(true)}
//               >
//                 <Text style={styles.updateText}>Update Profile</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Family */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Family Details</Text>
//             {renderField('Spouse Name', 'spouseName')}
//             {renderField("Spouse's Contact", 'contact')}
//             {renderField('Marital Status', 'status')}
//             {renderField('Anniversary', 'anniversary')}
//             {renderField('Number Of Children', 'children')}
//           </View>

//           <View style={styles.divider} />

//           {/* National ID */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>National ID</Text>
//             {renderField('PAN', 'pan')}
//             {renderField('Aadhaar No', 'aadhaar')}
//             {renderField('Passport No', 'passport')}
//             {renderField('Passport Valid up to', 'passportValid')}
//           </View>

//           <View style={styles.divider} />

//           {/* Demographics */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Demographics</Text>
//             {renderField('Nationality', 'nationality')}
//             {renderField('Religion', 'religion')}
//             {renderField('Qualification', 'qualification')}
//           </View>

//           <View style={styles.divider} />

//           {/* Handicapped */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Handicapped Information</Text>
//             {renderField('Handicapped', 'handicapped')}
//             {renderField('From Date', 'hDate')}
//           </View>

//           <View style={styles.divider} />

//           {/* Emergency */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Emergency Contact</Text>
//             {renderField('Name', 'e_name')}
//             {renderField('Mobile Phone', 'e_mobile')}
//             {renderField('Alternate Phone', 'e_alternate')}
//           </View>

//           <View style={styles.divider} />

//           {/* Address */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Address</Text>
//             {renderField('Permanent Address', 'address')}
//           </View>

//           {isEditing && (
//             <TouchableOpacity
//               style={[styles.updateBtn, { alignSelf: 'flex-end', marginTop: 10 }]}
//               onPress={handleSave}
//             >
//               <Text style={styles.updateText}>Save Changes</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default PersonalInfoScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFE1CF' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 45,
//     paddingBottom: 15,
//     paddingHorizontal: 16,
//     backgroundColor: '#FFDAC6',
//     borderBottomWidth: 1,
//   },
//   headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 12, color: '#5B3A3A' },
//   scrollContainer: { padding: 16, backgroundColor: '#FDF2E0' },
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     padding: 20,
//     elevation: 3,
//     shadowColor: '#000',
//   },
//   sectionHeader: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 },
//   section: { marginBottom: 16 },
//   sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#000' },
//   updateBtn: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#5B3A3A',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//     marginBottom: 12,
//   },
//   updateText: { color: '#fff', fontSize: 12 },
//   fieldContainer: { marginBottom: 10 },
//   labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
//   iconWrapper: {
//     backgroundColor: '#F1EEFF',
//     padding: 6,
//     borderRadius: 8,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   label: { fontSize: 14, color: '#1C1C1E', flex: 1 },
//   fieldValue: { fontWeight: '600', color: '#5B3A3A' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     fontSize: 14,
//     color: '#1C1C1E',
//     marginTop: 4,
//   },
//   divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 16 },
// });





import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';
import { ENDPOINT } from '../api/endpoint';

const { width } = Dimensions.get('window');

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const employee = useSelector((state) => state.employee.employeeData);

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [empId, setEmpId] = useState(null);

  useEffect(() => {
    const getEmpId = async () => {
      const storedEmpId = await AsyncStorage.getItem('empId');
      if (storedEmpId) {
        setEmpId(storedEmpId);
      }
    };
    getEmpId();
  }, []);

  useEffect(() => {
    if (employee) {
      const address = [
        employee?.permanentAddress?.street,
        employee?.permanentAddress?.address,
        employee?.permanentAddress?.city,
        employee?.permanentAddress?.country,
        employee?.permanentAddress?.state,
        employee?.permanentAddress?.zip,
      ]
        .filter(Boolean)
        .join(', ');

      setEditValues({
        spouseName: employee.maritalInfo?.spouseName || '',
        contact: employee.maritalInfo?.mobilePhone || '',
        status: employee.maritalInfo?.status || '',
        anniversary: employee.maritalInfo?.anniversary || '',
        children: employee.maritalInfo?.numberOfChildren?.toString() || '',
        pan: employee.nationalID?.pan || '',
        aadhaar: employee.nationalID?.aadhar || '',
        passport: employee.nationalID?.passport || '',
        passportValid: employee.nationalID?.passportValid || '',
        nationality: employee.demographics?.nationality || '',
        religion: employee.demographics?.religion || '',
        qualification: employee.demographics?.qualification || '',
        handicapped: employee.handicappedInfo?.handicapped || '',
        hDate: employee.handicappedInfo?.from || '',
        e_name: employee.emergencyContact?.name || '',
        e_mobile: employee.emergencyContact?.mobilePhone || '',
        e_alternate: employee.emergencyContact?.homePhone || '',
        address: address || '',
      });
    }
  }, [employee]);

  const handleSave = async () => {
    try {
      if (!empId) {
        Alert.alert('Error', 'Employee ID not found in storage');
        return;
      }

      const payload = {
        demographics: {
          nationality: editValues.nationality,
          religion: editValues.religion,
          qualification: editValues.qualification,
        },
        maritalInfo: {
          spouseName: editValues.spouseName,
          status: editValues.status,
          anniversary: editValues.anniversary,
          numberOfChildren: editValues.children,
          mobilePhone: editValues.contact,
        },
        nationalID: {
          pan: editValues.pan,
          aadhar: editValues.aadhaar,
          passport: editValues.passport,
          passportValid: editValues.passportValid,
        },
        handicappedInfo: {
          handicapped: editValues.handicapped,
          from: editValues.hDate,
        },
        emergencyContact: {
          name: editValues.e_name,
          mobilePhone: editValues.e_mobile,
          homePhone: editValues.e_alternate,
        },
        permanentAddress: {
          address: editValues.address,
        },
      };

      const res = await apiClient.put(ENDPOINT.LEAVE.UPDATEEMPLOYEE(empId), payload);

      if (res.data.status === 'success') {
        Alert.alert('Success', 'Employee updated successfully');
        setIsEditing(false);
      } else {
        Alert.alert('Failed', res.data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update employee');
    }
  };

  // 🔹 Field renderer with autoCapitalize rules
  const renderField = (label, key) => {
    let autoCap = 'none';

    if (
      key === 'spouseName' ||
      key === 'e_name' ||
      key === 'nationality' ||
      key === 'religion' ||
      key === 'qualification' ||
      key === 'address'
    ) {
      autoCap = 'words';
    } else if (key === 'pan' || key === 'aadhaar' || key === 'passport') {
      autoCap = 'characters';
    } else if (key === 'contact' || key === 'e_mobile' || key === 'e_alternate') {
      autoCap = 'none';
    }

    return (
      <View style={styles.fieldContainer} key={key}>
        <View style={styles.labelRow}>
          <View style={styles.iconWrapper}>
            <Ionicons name="ribbon-outline" size={18} color="#4A4A4A" />
          </View>
          <Text style={styles.label}>
            {label}:{' '}
            {isEditing ? null : <Text style={styles.fieldValue}>{editValues[key]}</Text>}
          </Text>
        </View>
        {isEditing && (
          <TextInput
            style={styles.input}
            value={editValues[key]}
            onChangeText={(text) => setEditValues({ ...editValues, [key]: text })}
            placeholder={`Enter ${label}`}
            placeholderTextColor="#aaa"
            autoCapitalize={autoCap} // ✅ Correct capitalization applied
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#5B3A3A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            {!isEditing && (
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.updateText}>Update Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Family */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family Details</Text>
            {renderField('Spouse Name', 'spouseName')}
            {renderField("Spouse's Contact", 'contact')}
            {renderField('Marital Status', 'status')}
            {renderField('Anniversary', 'anniversary')}
            {renderField('Number Of Children', 'children')}
          </View>

          <View style={styles.divider} />

          {/* National ID */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>National ID</Text>
            {renderField('PAN', 'pan')}
            {renderField('Aadhaar No', 'aadhaar')}
            {renderField('Passport No', 'passport')}
            {renderField('Passport Valid up to', 'passportValid')}
          </View>

          <View style={styles.divider} />

          {/* Demographics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Demographics</Text>
            {renderField('Nationality', 'nationality')}
            {renderField('Religion', 'religion')}
            {renderField('Qualification', 'qualification')}
          </View>

          <View style={styles.divider} />

          {/* Handicapped */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Handicapped Information</Text>
            {renderField('Handicapped', 'handicapped')}
            {renderField('From Date', 'hDate')}
          </View>

          <View style={styles.divider} />

          {/* Emergency */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            {renderField('Name', 'e_name')}
            {renderField('Mobile Phone', 'e_mobile')}
            {renderField('Alternate Phone', 'e_alternate')}
          </View>

          <View style={styles.divider} />

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            {renderField('Permanent Address', 'address')}
          </View>

          {isEditing && (
            <TouchableOpacity
              style={[styles.updateBtn, { alignSelf: 'flex-end', marginTop: 10 }]}
              onPress={handleSave}
            >
              <Text style={styles.updateText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PersonalInfoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFE1CF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: '#FFDAC6',
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 12, color: '#5B3A3A' },
  scrollContainer: { padding: 16, backgroundColor: '#FDF2E0' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#000' },
  updateBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#5B3A3A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  updateText: { color: '#fff', fontSize: 12 },
  fieldContainer: { marginBottom: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  iconWrapper: {
    backgroundColor: '#F1EEFF',
    padding: 6,
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { fontSize: 14, color: '#1C1C1E', flex: 1 },
  fieldValue: { fontWeight: '600', color: '#5B3A3A' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: '#1C1C1E',
    marginTop: 4,
  },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 16 },
});
