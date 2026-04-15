import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const JobDetails = () => {
  const navigation = useNavigation();
  const employee = useSelector((state) => state.employee.employeeData);
  console.log(employee.categoryId.name,'1111111111111')
// console.log("===================".employee.probationTime.startDate)
console.log('Probation Time:', employee.probationTime);
  console.log('Probation Start Date:', employee.probationTime.startDate);
  console.log('Probation End Date:', employee.probationTime.endDate);
  console.log('Probation Completed:', employee.probationTime.completed);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
                     source={require('../assets/victorIconImage/arrowLeft.png')}
                     style={[styles.eyeImage, {opacity: secureText ? 0.6 : 1}]}
                     resizeMode="contain"
                   />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <InfoSection title="Employment Type">
          <InfoRow label="Category" name={employee.categoryName}/>
          <InfoRow label="Work Shift" name={employee.shiftId.name}/>
          <InfoRow label="Work Mode" name={employee.employeeType}/>
        </InfoSection>

        <InfoSection title="Job Role & Department">
          <InfoRow label="Date Of Joining" name={'N/A'} />
          <InfoRow label="Job Title" name={employee.jobTitle} />
          <InfoRow label="Department" name={employee.departmentId.name} />
          <InfoRow label="Reporting Manager" name={''} />
        </InfoSection>

        <InfoSection title="Office Details">
          <InfoRow label="Office Location" name={''} />
          <InfoRow label="Company Email ID" name={''}/>
          <InfoRow label="Employee ID" name={employee.customId}/>
        </InfoSection>

        <InfoSection title="Employee Status">
          <InfoRow label="Status" name={employee.status}/>
          <InfoRow label="Probation Time" name={employee.probationTime.endDate}/>

          
          <InfoRow label="Terminated" name={''}/>
          <InfoRow label="Inactive" name={''}/>
        </InfoSection>
      </ScrollView>
    </View>
  );
};

const InfoSection = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.divider} />
    {children}
  </View>
);

const InfoRow = ({ label, name }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{name || '---'}</Text>
  </View>
);

export default JobDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE1CF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: '#FFDAC6',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#5B3A3A',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B3A3A',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
  },
});

