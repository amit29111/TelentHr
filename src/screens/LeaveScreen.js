import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars'; // Import Calendar
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';
import {RadioButton} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

import {ENDPOINT} from '../api/endpoint';

const {width, height} = Dimensions.get('window');

const statusColor = {
  Approved: '#23B480',
  Pending: '#E59A26',
  Rejected: '#D93D3D',
};

const LeaveScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('request');
  const [leaveData, setLeaveData] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [isLoadingIn, setIsLoadingIn] = useState(false);

  const page = 1;
  const limit = 10;

  useEffect(() => {
    const showLeave = async () => {
      setIsLoadingIn(true);
      try {
        const empId = await AsyncStorage.getItem('empId');
        if (!empId) {
          Alert.alert('Error', 'Employee ID not found.');
          return;
        }

        const url = ENDPOINT.LEAVE.LEAVESHOW(empId, page, limit);
        // console.log('111112222222', url);
        const response = await apiClient.get(url);
        // console.log('111112222222', response);
        if (response.status === 200 || response.status === 201) {
          const data = response.data.data;
          // console.log('111112222222', data);
          const transformedLeaves = data.map(item => ({
            type: item.leaveTypeId?.leaveName || 'N/A',
            days: item.leaveDays || 0,
            status: item.status || 'Pending',
          }));
          // console.log('111112222222', transformedLeaves);
          setLeaveData(transformedLeaves);
        } else {
          Alert.alert(
            'Error',
            response.data.message || 'Failed to fetch leave data.',
          );
        }
      } catch (error) {
        // console.error('Leave fetch error:', error);
        setLeaveData([]);
      } finally {
        setIsLoadingIn(false);
      }
    };

    showLeave();
  }, []);

  useEffect(() => {
    const showLeaveBalance = async () => {
      setIsLoadingIn(true);
      try {
        const empId = await AsyncStorage.getItem('empId');
        if (!empId) {
          Alert.alert('Error', 'Employee ID not found.');
          return;
        }

        const url = ENDPOINT.LEAVE.LEAVEBALANCE(empId);
        const response = await apiClient.get(url);
        // console.log('111112222222333333', response.data.data);
        if (response.status === 200 || response.status === 201) {
          setLeaveBalance(response.data.data);
        } else {
          Alert.alert(
            'Error',
            response.data.message || 'Failed to fetch leave balance.',
          );
        }
      } catch (error) {
        console.error('Leave balance fetch error:', error);
        setLeaveBalance([]);
        // Alert.alert('Error', 'An error occurred while fetching leave balance.');
      } finally {
        setIsLoadingIn(false);
      }
    };

    showLeaveBalance();
  }, []);

  const colors = ["#D9C6E6", "#D7D5D2", "#F4D0D0"]; // First 3 fixed colors

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Request</Text>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        {/* Cards */}
        {/* <View style={styles.leaveCounters}>
          <LeaveCard label="Annual Leaves" count="4/15" color="#D9C6E6" />
          <LeaveCard label="Medical Leaves" count="3/6" color="#D7D5D2" />
          <LeaveCard label="Casual Leaves" count="2/6" color="#F4D0D0" />
        </View> */}
        

{/* <View style={styles.leaveCounters}>
  {leaveBalance.map((item, index) => (
    <LeaveCard
      key={index}
      label={item?.leaveTypeId?.leaveName || 'N/A'}
      count={`${item?.balanceDays || 0}/${item?.leaveTypeId?.creditDays || 0}`}
      color={colors[index % colors.length]} // Repeat colors dynamically
    />
  ))}
</View> */}
<View style={styles.leaveCounters}>
<ScrollView
  horizontal
  style={{ maxHeight: 150 }} // Adjust card height
  contentContainerStyle={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap:6
  }}
  showsHorizontalScrollIndicator={false}
>
  {leaveBalance.map((item, index) => (
    <LeaveCard
      key={index}
      label={item?.leaveTypeId?.leaveName || 'N/A'}
      count={`${item?.balanceDays || 0}/${item?.leaveTypeId?.creditDays || 0}`}
      color={colors[index % colors.length]}
    />
  ))}
</ScrollView>
</View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={
              activeTab === 'request' ? styles.tabActive : styles.tabInactive
            }
            onPress={() => setActiveTab('request')}>
            <Text
              style={
                activeTab === 'request'
                  ? styles.tabTextActive
                  : styles.tabTextInactive
              }>
              My Leave Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              activeTab === 'balance' ? styles.tabActive : styles.tabInactive
            }
            onPress={() => setActiveTab('balance')}>
            <Text
              style={
                activeTab === 'balance'
                  ? styles.tabTextActive
                  : styles.tabTextInactive
              }>
              Leave Balance
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ternary View Rendering */}
        {activeTab === 'request' ? (
          <>
            <View style={styles.leaveInfoHeader}>
              <Text style={styles.infoTitle}>Leave Request Info</Text>
              <TouchableOpacity style={styles.dropdown}>
                <Text style={styles.dropdownText}>This Month ▼</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.columnHeader}>TYPE</Text>
              <Text style={styles.columnHeader}>DAYS</Text>
              <Text style={styles.columnHeader}>STATUS</Text>
            </View>

            <FlatList
              data={leaveData}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.tableRow}>
                  <Text style={styles.rowText}>{item.type}</Text>
                  <Text style={styles.rowText}>{item.days}</Text>
                  <Text
                    style={[styles.rowText, {color: statusColor[item.status]}]}>
                    {item.status}
                  </Text>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.applyButtonText}>APPLY FOR LEAVE</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.leaveInfoHeader}>
              <Text style={styles.infoTitle}>Leave Balance</Text>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.colHeader}>LEAVE NAME</Text>
              <Text style={styles.colHeader}>CREDIT DAYS</Text>
              <Text style={styles.colHeader}>USED DAYS</Text>
              <Text style={styles.colHeader}>BALANCE</Text>
            </View>

            {leaveBalance.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cell}>
                  {item?.leaveTypeId?.leaveName || 'N/A'}
                </Text>
                <Text style={styles.cell}>
                  {item?.leaveTypeId?.creditDays || 0}
                </Text>
                <Text style={styles.cell}>{item?.usedDays || 0}</Text>
                <Text style={styles.cell}>{item?.balanceDays || 0}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Bottom Modal for Apply Leave */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalClose}>
                  <Text
                    style={{fontSize: 18, color: '#333', textAlign: 'right'}}>
                    ✕
                  </Text>
                </TouchableOpacity>
                <ScrollView>
                  <ApplyLeaveScreen setModalVisible={setModalVisible} />
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const ApplyLeaveScreen = ({setModalVisible}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectingStartDate, setSelectingStartDate] = useState(true);
  const [duration, setDuration] = useState('full');

  const [leaveTypeOpen, setLeaveTypeOpen] = useState(false);
  const [leaveType, setLeaveType] = useState(null);
  const [leaveOptions, setLeaveOptions] = useState([]);
  const [halfDaySession, setHalfDaySession] = useState(null);
  const [halfDayOpen, setHalfDayOpen] = useState(false);
  const [halfDayOptions] = useState([
    {label: 'Morning', value: 'Morning'},
    {label: 'Evening', value: 'Evening'},
  ]);

  const [clusterModalVisible, setClusterModalVisible] = useState(false);
  const [clusterDates, setClusterDates] = useState([]);
  const [clusterMarked, setClusterMarked] = useState({});

  useEffect(() => {
    const GetLeaveStatus = async () => {
      try {
        const empId = await AsyncStorage.getItem('empId');
        if (!empId) return Alert.alert('Error', 'Employee ID not found.');
        const url = ENDPOINT.LEAVE.GETLEAVETYPE(empId);
        const response = await apiClient.get(url);
        if (response.status === 200 || response.status === 201) {
          const data = response.data.data;
          const mappedOptions = data.map(item => ({
            label: item.leaveTypeId.leaveName,
            value: item.leaveTypeId._id,
            leaveBalanceId: item._id,
          }));
          setLeaveOptions(mappedOptions);
        } else {
          Alert.alert('Error', response.data.message || 'Failed to fetch leave data.');
        }
      } catch (error) {
        console.error('Leave fetch error:', error);
      }
    };
    GetLeaveStatus();
  }, []);

  const handleDayPress = day => {
    const selectedDate = day.dateString;
    if (selectingStartDate) {
      setStartDate(selectedDate);
      setEndDate(null);
      setMarkedDates({
        [selectedDate]: {
          startingDay: true,
          color: '#4A2C2A',
          textColor: '#fff',
        },
      });
      setSelectingStartDate(false);
    } else if (selectedDate >= startDate) {
      setEndDate(selectedDate);
      const newMarked = {};
      let curr = new Date(startDate);
      const end = new Date(selectedDate);
      while (curr <= end) {
        const str = curr.toISOString().split('T')[0];
        newMarked[str] = {
          color: '#F0E6E6',
          textColor: '#333',
          ...(str === startDate && {startingDay: true, color: '#4A2C2A', textColor: '#fff'}),
          ...(str === selectedDate && {endingDay: true, color: '#4A2C2A', textColor: '#fff'}),
        };
        curr.setDate(curr.getDate() + 1);
      }
      setMarkedDates(newMarked);
      setCalendarVisible(false);
      setSelectingStartDate(true);
    } else {
      setStartDate(selectedDate);
      setEndDate(null);
      setMarkedDates({
        [selectedDate]: {
          startingDay: true,
          color: '#4A2C2A',
          textColor: '#fff',
        },
      });
      setSelectingStartDate(false);
    }
  };

  const handleClusterDateToggle = date => {
    if (!startDate || !endDate) return;
    const isInRange = date >= startDate && date <= endDate;
    if (!isInRange) return;
    let updated = [...clusterDates];
    let newMarked = {...clusterMarked};

    if (clusterDates.includes(date)) {
      updated = updated.filter(d => d !== date);
      delete newMarked[date];
    } else {
      updated.push(date);
      newMarked[date] = {
        selected: true,
        selectedColor: '#4A2C2A',
        selectedTextColor: '#fff',
      };
    }

    setClusterDates(updated);
    setClusterMarked(newMarked);
  };

  const handleSubmit = async () => {
    if (!leaveType || !startDate || !duration) {
      return Alert.alert('Error', 'Please fill all required fields.');
    }

    if (duration === 'half' && !halfDaySession) {
      return Alert.alert('Error', 'Please select half-day session.');
    }

    if ((duration === 'full' || duration === 'cluster') && !endDate) {
      return Alert.alert('Error', 'Please select a valid end date.');
    }

    const selectedLeave = leaveOptions.find(item => item.value === leaveType);
    try {
      const empId = await AsyncStorage.getItem('empId');
      if (!empId) return Alert.alert('Error', 'Employee ID not found.');

      const leaveData = {
        employeeId: empId,
        leaveTypeId: selectedLeave.value,
        leaveBalanceId: selectedLeave.leaveBalanceId,
        leaveReason: reason,
        startDate: startDate,
        endDate: duration === 'half' ? startDate : endDate,
        sandwich: false,
        leaveDurationType:
          duration === 'full'
            ? 'Full-Day'
            : duration === 'half'
            ? 'Half-Day'
            : 'Cluster',
       lastDay: duration === 'half' ? 'Half-Day' : 'Full-Day',
        halfDaySession: duration === 'half' ? halfDaySession : null,
       clusterDates:
          duration === 'cluster'
            ? clusterDates.map(date =>
                new Date(date).toISOString().split('.')[0] + 'Z'
              )
            : [],
        approvedBy: '',
        comments: '',
        rejectionReason: '',
      };
      const response = await apiClient.post(ENDPOINT.LEAVE.LEAVE, leaveData);
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Leave application submitted.');
        setModalVisible(false);
      } else {
        Alert.alert('Error', response.data.message || 'Submit failed.');
      }
    } catch (error) {
      console.log(error.response.data.message,'wwwwwwwwwwwwwwwww');
      Alert.alert('Error', error.response.data.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.applyLeaveContainer}>
      <Text style={styles.applyLeaveTitle}>Apply for Leave</Text>

      <Text style={styles.label}>Leave Duration</Text>
      <View style={styles.radioRow}>
        {['full', 'half', 'cluster'].map(type => (
          <View key={type} style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton.Android
              value={type}
              status={duration === type ? 'checked' : 'unchecked'}
              onPress={() => {
                setDuration(type);
                if (type !== 'cluster') {
                  setClusterDates([]);
                  setClusterMarked({});
                }
              }}
              color="#660099"
            />
            <Text>{type.charAt(0).toUpperCase() + type.slice(1)}-Day</Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Leave Type</Text>
      <DropDownPicker
        open={leaveTypeOpen}
        value={leaveType}
        items={leaveOptions}
        setOpen={setLeaveTypeOpen}
        setValue={setLeaveType}
        setItems={setLeaveOptions}
        placeholder="Select Leave Type"
        style={styles.dropdown}
      />

      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          setCalendarVisible(true);
          setSelectingStartDate(true);
        }}>
        <Text>{startDate || 'Select start date'}</Text>
      </TouchableOpacity>

      {(duration !== 'half') && (
        <>
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              if (startDate) {
                setCalendarVisible(true);
                setSelectingStartDate(false);
              } else {
                Alert.alert('Error', 'Select start date first');
              }
            }}>
            <Text>{endDate || 'Select end date'}</Text>
          </TouchableOpacity>
        </>
      )}

      {duration === 'half' && (
        <>
          <Text style={styles.label}>Half-Day Session</Text>
          <DropDownPicker
            open={halfDayOpen}
            value={halfDaySession}
            items={halfDayOptions}
            setOpen={setHalfDayOpen}
            setValue={setHalfDaySession}
            setItems={() => {}}
            placeholder="Select session"
            style={styles.dropdown}
          />
        </>
      )}

      {duration === 'cluster' && startDate && endDate && (
        <>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setClusterModalVisible(true)}>
            <Text style={styles.submitButtonText}>Add Cluster Date</Text>
          </TouchableOpacity>

          {clusterDates.length > 0 && (
            <View style={{marginTop: 10}}>
              <Text style={styles.label}>Selected Cluster Dates:</Text>
              {clusterDates.map(date => (
                <Text key={date} style={{marginLeft: 8}}>• {date}</Text>
              ))}
            </View>
          )}
        </>
      )}

      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
        value={reason}
        onChangeText={setReason}
        placeholder="Enter reason"
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Leave Request</Text>
      </TouchableOpacity>

      {/* Start/End Date Calendar Modal */}
      <Modal visible={calendarVisible} transparent animationType="fade">
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalContainer}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              markingType={'period'}
              minDate={new Date().toISOString().split('T')[0]}
            />
            <TouchableOpacity onPress={() => setCalendarVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cluster Calendar Modal */}
      <Modal visible={clusterModalVisible} transparent animationType="fade">
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalContainer}>
            <Calendar
              onDayPress={day => handleClusterDateToggle(day.dateString)}
              markedDates={clusterMarked}
              minDate={startDate}
              maxDate={endDate}
            />
            <TouchableOpacity onPress={() => setClusterModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


const LeaveCard = ({label, count, color}) => (
  <View style={[styles.leaveCard, {backgroundColor: color}]}>
    <Text style={styles.leaveCardLabel}>{label}</Text>
    <Text style={styles.leaveCardCount}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    height: 60,
    backgroundColor: '#4A2C2A',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {marginRight: 10},
  backArrow: {color: '#fff', fontSize: 22, fontWeight: 'bold'},
  headerTitle: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  leaveCounters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  leaveCard: {
    width: width / 3.2,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  leaveCardLabel: {fontSize: 12, color: '#333'},
  leaveCardCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabActive: {
    backgroundColor: '#4A2C2A',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabInactive: {
    backgroundColor: '#F0E6E6',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabTextActive: {color: '#fff', fontWeight: '600'},
  tabTextInactive: {color: '#4A2C2A', fontWeight: '600'},
  leaveInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 4,
  },
  infoTitle: {fontSize: 14, fontWeight: 'bold'},
  dropdown: {padding: 4},
  dropdownText: {fontSize: 12, color: '#333'},
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  columnHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  colHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  rowText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: '#4A2C2A',
    margin: 20,
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    height: height * 0.75,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  modalClose: {
    alignSelf: 'flex-end',
    marginRight: 10,
    padding: 5,
  },
  applyLeaveContainer: {
    paddingHorizontal: 16,
  },
  applyLeaveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 14,
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  calendarModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  calendarModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: width * 0.9,
  },
  calendar: {
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F0E6E6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioLabel: {
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#4A2C2A',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4A2C2A',
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LeaveScreen;
