import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const LeaveRequestView = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Olivia Smith',
      role: 'HR Manager',
      leaveType: 'Sick Leave',
      startDate: '21/05/2025',
      endDate: '25/05/2025',
    },
    {
      id: 2,
      name: 'John Doe',
      role: 'Software Engineer',
      leaveType: 'Vacation',
      startDate: '10/06/2025',
      endDate: '15/06/2025',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Project Manager',
      leaveType: 'Maternity Leave',
      startDate: '01/07/2025',
      endDate: '30/09/2025',
    },
    {
      id: 4,
      name: 'Michael Brown',
      role: 'Designer',
      leaveType: 'Personal Leave',
      startDate: '05/08/2025',
      endDate: '07/08/2025',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      <View style={styles.requestCard}>
        <View style={styles.actionButtonsLeft}>
          <TouchableOpacity
            style={styles.approveBtnSmall}
            accessibilityRole="button"
            accessibilityLabel="Approve leave request"
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectBtnSmall}
            accessibilityRole="button"
            accessibilityLabel="Reject leave request"
          >
            <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Reject</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.requestContent}>
          <Image
            source={require('../../src/assets/first.png')} // Update path as needed
            style={styles.requestAvatarLeft}
            defaultSource={require('../../src/assets/first.png')} // Add fallback image
          />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.tag}>Human Resources</Text>
            <Text style={styles.requestName}>{item.name}</Text>
            <Text style={styles.requestRole}>{item.role}</Text>
            <View style={styles.requestDetails}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Leave Type</Text>
                <Text style={styles.detailValue}>{item.leaveType}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Start Date</Text>
                <Text style={styles.detailValue}>{item.startDate}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>End Date</Text>
                <Text style={styles.detailValue}>{item.endDate}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Team</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#888"
        accessibilityLabel="Search team members"
      />
      <FlatList
        data={teamMembers}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.section}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A1F28',
    padding: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 16,
    // Ensure fonts are linked or remove fontFamily
    // fontFamily: 'poppins',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: '#452300',
  },
  section: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 3,
    borderColor: '#DBC2CE',
    height:168,
  },
  actionButtonsLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  approveBtnSmall: {
    backgroundColor: '#ADCFFF',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 8,
  },
  rejectBtnSmall: {
    backgroundColor: '#1F74EC',
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  btnText: {
    color: '#17243E',
    fontWeight: 'bold',
    fontSize: 10,
    // Ensure fonts are linked or remove fontFamily
    // fontFamily: 'Libre Franklin',
  },
  requestContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestAvatarLeft: {
    width: width * 0.15, // Responsive size
    height: width * 0.15,
    borderRadius: width * 0.075,
  },
  tag: {
    fontSize: 12,
    backgroundColor: '#F0F0F0',
    color: '#6D6E75',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  requestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  requestRole: {
    fontSize: 11,
    color: '#6D6E75',
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailBox: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6D6E75',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default LeaveRequestView;