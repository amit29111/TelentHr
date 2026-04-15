import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const JobDetialScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});

  // Static employee data for testing
  useEffect(() => {
    const employee = {
      category: 'Full-Time',
      workShift: 'Morning Shift',
      workMode: 'On-site',
      doj: '2022-06-15',
      jobTitle: 'React Native Developer',
      department: 'Mobile Team',
      reportingManager: 'Suresh Kumar',
      officeLocation: 'Bangalore HQ',
      companyEmail: 'john.doe@company.com',
      empID: 'EMP-1007',
      active: 'Yes',
      probationTime: '3 Months',
      terminated: 'No',
      inactive: 'No',
    };

    setEditValues(employee);
  }, []);

  const renderField = (label, key) => (
    <View style={styles.fieldRow} key={key}>
      {/* <Image
        source={require('../assets/Icon/Vector.png')}
        style={{ width: 20, height: 20, marginRight: 10 }}
      /> */}
      {isEditing ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <TextInput
            style={styles.input}
            value={editValues[key]}
            onChangeText={(text) => setEditValues({ ...editValues, [key]: text })}
            placeholder={`Enter ${label}`}
            placeholderTextColor="#aaa"
          />
        </View>
      ) : (
        <Text style={styles.fieldLabel}>
          {label}{' '}
          <Text style={styles.fieldValue}>{editValues[key]}</Text>
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Image
            source={require('../assets/ArrowLeftBrown.png')}
            style={styles.arrowLeft}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {/* Employment Type */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Employment Type</Text>
              {!isEditing && (
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.updateText}>Update Profile</Text>
                </TouchableOpacity>
              )}
            </View>
            {renderField('Category:', 'category')}
            {renderField('Work Shift', 'workShift')}
            {renderField('Work Mode', 'workMode')}
          </View>

          <View style={styles.divider} />

          {/* Job Role */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Role & Department</Text>
            {renderField('Date Of Joining:', 'doj')}
            {renderField('Job Title', 'jobTitle')}
            {renderField('Department', 'department')}
            {renderField('Reporting Manager', 'reportingManager')}
          </View>

          <View style={styles.divider} />

          {/* Office Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Office Details</Text>
            {renderField('Office Location:', 'officeLocation')}
            {renderField('Company Email ID:', 'companyEmail')}
            {renderField('Employee ID:', 'empID')}
          </View>

          {/* Employment Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employee Status</Text>
            {renderField('Active', 'active')}
            {renderField('Probation Time', 'probationTime')}
            {renderField('Terminated', 'terminated')}
            {renderField('Inactive', 'inactive')}
          </View>

          {isEditing && (
            <TouchableOpacity
              style={[styles.updateButton, { alignSelf: 'flex-end', marginTop: 10 }]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.updateText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default JobDetialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBEFE8',
  },
  header: {
    backgroundColor: '#FBEFE8',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C3C45',
    fontFamily: 'Lato',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 3,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Lato',
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#5A2A55',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  updateText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Lato',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Lato',
    flex: 1,
    flexWrap: 'wrap',
  },
  fieldValue: {
    fontWeight: '600',
    color: '#5A2A55',
    fontFamily: 'Lato',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    fontFamily: 'Lato',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 12,
  },
   arrowLeft: {width: 25,color: '#5C3C45', height: 25},
});