import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const teamData = [
  { id: '1', name: 'Olivia Smith', role: 'Frontend Developer', department: 'IT Department', image: require('../../src/assets/first.png') },
  { id: '2', name: 'Neha', role: 'QA Engineer', department: 'IT Department', image: require('../../src/assets/second.png') },
  { id: '3', name: 'Rahul Verma', role: 'Backend Developer', department: 'IT Department', image: require('../../src/assets/third.png') },
  { id: '4', name: 'Sneha Reddy', role: 'UI/UX Designer', department: 'IT Department', image: require('../../src/assets/first.png') },
  { id: '5', name: 'Karan Mehta', role: 'Project Manager', department: 'IT Department', image: require('../../src/assets/second.png') },
  { id: '6', name: 'Sneha Reddy', role: 'Project Manager', department: 'IT Department', image: require('../../src/assets/third.png') },
];

const leaveData = [
  { id: '1', name: 'Aimee Liu', role: 'Designer' },
  { id: '2', name: 'Faisal Malik', role: 'Developer' },
  { id: '3', name: 'Debra Guo', role: 'Tester' },
  { id: '4', name: 'Aimee Liu', role: 'HR' },
  { id: '5', name: 'Faisal Malik', role: 'Designer' },
  { id: '6', name: 'Debra Guo', role: 'HR' },
];

const MyTeamScreen = () => {
  const navigation = useNavigation();

  const renderLeaveItem = ({ item }) => (
    <View style={styles.leaveItem}>
      <Image source={require('../../src/assets/amit.jpeg')} style={styles.leaveAvatar} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.role}>{item.role}</Text>
    </View>
  );

  const renderTeamItem = ({ item }) => (
    <View style={styles.memberRow}>
      <Image source={item.image} style={styles.avatar} />
      <View style={styles.memberDetails}>
        <View style={styles.nameDeptRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.departmentInline}>{item.department}</Text>
        </View>
        <Text style={styles.role}>{item.role}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Team</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Who is on leave <Text style={styles.redText}>(10)</Text>
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard', { screen: 'leaveRequestView' })}
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={leaveData}
            renderItem={renderLeaveItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Leave Request <Text style={styles.redText}>(09)</Text>
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard', { screen: 'leaveRequestView' })}
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.requestCard}>
            <View style={styles.actionButtonsLeft}>
              <TouchableOpacity style={styles.approveBtnSmall}>
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtnSmall}>
                <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Reject</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.requestContent}>
              <Image source={require('../../src/assets/first.png')} style={styles.requestAvatarLeft} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.tag}>Human Resources</Text>
                <Text style={styles.requestName}>Olivia Smith</Text>
                <Text style={styles.requestRole}>HR Manager</Text>

                <View style={styles.requestDetails}>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Leave Type</Text>
                    <Text style={styles.detailValue}>Sick Leave</Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Start Date</Text>
                    <Text style={styles.detailValue}>21/05/2025</Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>End Date</Text>
                    <Text style={styles.detailValue}>25/05/2025</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.sectionTitle}>Team Members</Text>
          </View>

          <View style={styles.teamCard}>
            <View style={styles.leftSection}>
              <View style={styles.circleWrapper}>
                <View style={styles.outerCircle}>
                  <View style={styles.innerCircle}>
                    <Text style={styles.count}>10</Text>
                    <Text style={styles.label}>Total Members</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.rightSection}>
              <FlatList
                data={teamData}
                keyExtractor={(item) => item.id}
                renderItem={renderTeamItem}
                scrollEnabled={false}
                contentContainerStyle={{ paddingVertical: 2 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF7F2' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A1F28',
    padding: 16,
    width: 415,
    height: 64,
    left: -5,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 500, marginLeft: 16, fontFamily: 'poppins' },
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontFamily: 'poppins', marginBottom: 10 },
  redText: { color: 'red', fontSize: 13 },
  viewAll: { color: 'red', fontSize: 10 },
  leaveItem: { alignItems: 'center', marginRight: 15 },
  leaveAvatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 4 },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  nameDeptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 6,
    color: '#000000',
  },
  departmentInline: {
    fontSize: 7,
    color: '#000000',
    marginLeft: 12,
  },
  role: {
    fontSize: 8,
    color: '#000000',
  },
  teamCard: {
    backgroundColor: '#FFF4F0',
    borderRadius: 16,
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftSection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  separator: {
    width: 1,
    backgroundColor: '#CCC',
    height: '100%',
    marginHorizontal: 24,
  },
  rightSection: {
    flex: 2,
  },
  circleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 132,
    height: 132,
    borderRadius: 70,
    borderWidth: 20,
    borderColor: '#D9AAA9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 93,
    height: 93,
    borderRadius: 45,
    backgroundColor: '#FBEFED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0C0D19',
  },
  label: {
    fontSize: 10,
    color: '#6D6E75',
    marginTop: 4,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberDetails: {
    marginLeft: 10,
    flex: 1,
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
    fontFamily: 'Libre Franklin',
  },
  requestContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestAvatarLeft: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    marginTop: 12,
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

export default MyTeamScreen;