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
  PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const scale = width / 375;

const normalize = size =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const teamData = [
  {
    id: '1',
    name: 'Olivia Smith',
    role: 'Frontend Developer',
    department: 'IT Department',
    image: require('../../src/assets/first.png'),
  },
  {
    id: '2',
    name: 'Neha',
    role: 'QA Engineer',
    department: 'IT Department',
    image: require('../../src/assets/second.png'),
  },
  {
    id: '3',
    name: 'Rahul Verma',
    role: 'Backend Developer',
    department: 'IT Department',
    image: require('../../src/assets/third.png'),
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    role: 'UI/UX Designer',
    department: 'IT Department',
    image: require('../../src/assets/first.png'),
  },
  {
    id: '5',
    name: 'Karan Mehta',
    role: 'Project Manager',
    department: 'IT Department',
    image: require('../../src/assets/second.png'),
  },
  {
    id: '6',
    name: 'Sneha Reddy',
    role: 'Project Manager',
    department: 'IT Department',
    image: require('../../src/assets/third.png'),
  },
];

const leaveData = [
  {id: '1', name: 'Aimee Liu', role: 'Designer'},
  {id: '2', name: 'Faisal Malik', role: 'Developer'},
  {id: '3', name: 'Debra Guo', role: 'Tester'},
  {id: '4', name: 'Aimee Liu', role: 'HR'},
  {id: '5', name: 'Faisal Malik', role: 'Designer'},
  {id: '6', name: 'Debra Guo', role: 'HR'},
];

const MyTeamScreen = () => {
  const navigation = useNavigation();
const handleBackPress = () => {
    try {
      // Navigate to the Dashboard tab and specify DashboardScreen
      navigation.navigate('Dashboard', { screen: 'DashboardScreen' });
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.goBack(); // Fallback to previous screen
    }
  };
  const renderLeaveItem = ({item}) => (
    <View style={styles.leaveItem}>
      <Image
        source={require('../../src/assets/amit.jpeg')}
        style={styles.leaveAvatar}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.role}>{item.role}</Text>
    </View>
  );

  const renderTeamItem = ({item}) => (
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
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={normalize(24)} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Team</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Who is on leave <Text style={styles.redText}>(10)</Text>
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Dashboard', {screen: 'leaveRequestView'})
              }>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={leaveData}
            renderItem={renderLeaveItem}
            keyExtractor={item => item.id}
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
              onPress={() =>
                navigation.navigate('Dashboard', {screen: 'leaveRequestView'})
              }>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.requestCard}>
            <View style={styles.actionButtonsLeft}>
              <TouchableOpacity style={styles.approveBtnSmall}>
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtnSmall}>
                <Text style={[styles.btnText, {color: '#FFFFFF'}]}>Reject</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.requestContent}>
              <Image
                source={require('../../src/assets/first.png')}
                style={styles.requestAvatarLeft}
              />
              <View style={{flex: 1, marginLeft: normalize(16)}}>
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
          <View style={{alignItems: 'center', marginBottom: normalize(8)}}>
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
                keyExtractor={item => item.id}
                renderItem={renderTeamItem}
                scrollEnabled={false}
                contentContainerStyle={{paddingVertical: normalize(2)}}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FDF7F2'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A1F28',
    padding: normalize(16),
    width: '100%',
    height: normalize(64),
  },
  headerTitle: {
    color: '#fff',
    fontSize: normalize(20),
    fontWeight: '500',
    marginLeft: normalize(16),
    fontFamily: 'poppins',
  },
  section: {padding: normalize(16)},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  sectionTitle: {
    fontSize: normalize(13),
    fontFamily: 'poppins',
    marginBottom: normalize(10),
  },
  redText: {color: 'red', fontSize: normalize(13)},
  viewAll: {color: 'red', fontSize: normalize(10)},
  leaveItem: {alignItems: 'center', marginRight: normalize(15)},
  leaveAvatar: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    marginBottom: normalize(4),
  },
  avatar: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    marginRight: normalize(6),
  },
  nameDeptRow: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'},
  name: {
    fontSize: normalize(10),
    fontWeight: 'bold',
    marginRight: normalize(6),
    color: '#000000',
  },
  departmentInline: {
    fontSize: normalize(7),
    color: '#000000',
    marginLeft: normalize(12),
  },
  role: {fontSize: normalize(8), color: '#000000'},
  teamCard: {
    backgroundColor: '#FFF4F0',
    borderRadius: normalize(16),
    flexDirection: 'row',
    paddingVertical: normalize(24),
    paddingHorizontal: normalize(16),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftSection: {justifyContent: 'center', alignItems: 'center', flex: 1},
  separator: {
    width: 1,
    backgroundColor: '#CCC',
    height: '100%',
    marginHorizontal: normalize(24),
    marginLeft:25
  },
  rightSection: {flex: 2},
  circleWrapper: {justifyContent: 'center', alignItems: 'center'},
  outerCircle: {
    width: normalize(110),
    height: normalize(110),
    borderRadius: normalize(70),
    borderWidth: normalize(60),
    borderColor: '#D9AAA9',
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight:15,
     marginLeft:10,
  },
  innerCircle: {
    width: normalize(93),
    height: normalize(93),
    borderRadius: normalize(45),
    backgroundColor: '#FBEFED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {fontSize: normalize(20), fontWeight: 'bold', color: '#0C0D19'},
  label: {fontSize: normalize(10), color: '#6D6E75', marginTop: normalize(4)},
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  memberDetails: {marginLeft: normalize(10), flex: 1},
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: normalize(14),
    padding: normalize(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: normalize(3),
    borderColor: '#DBC2CE',
  },
  actionButtonsLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: normalize(12),
  },
  approveBtnSmall: {
    backgroundColor: '#ADCFFF',
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(20),
    marginRight: normalize(8),
  },
  rejectBtnSmall: {
    backgroundColor: '#1F74EC',
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(22),
    borderRadius: normalize(20),
  },
  btnText: {
    color: '#17243E',
    fontWeight: 'bold',
    fontSize: normalize(10),
    fontFamily: 'Libre Franklin',
  },
  requestContent: {flexDirection: 'row', alignItems: 'center'},
  requestAvatarLeft: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
  },
  tag: {
    fontSize: normalize(12),
    backgroundColor: '#F0F0F0',
    color: '#6D6E75',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(2),
    borderRadius: normalize(20),
    marginBottom: normalize(4),
    alignSelf: 'flex-start',
  },
  requestName: {fontSize: normalize(16), fontWeight: 'bold', color: '#333'},
  requestRole: {fontSize: normalize(11), color: '#6D6E75'},
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(12),
  },
  detailBox: {alignItems: 'center', flex: 1},
  detailLabel: {
    fontSize: normalize(12),
    color: '#6D6E75',
    marginBottom: normalize(2),
  },
  detailValue: {fontSize: normalize(10), fontWeight: 'bold', color: '#333'},
});

export default MyTeamScreen;
