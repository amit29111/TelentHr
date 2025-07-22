import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const ApplyLeaveScreen = () => {
  const [leaveTypeOpen, setLeaveTypeOpen] = useState(false);
  const [leaveType, setLeaveType] = useState(null);
  const [leaveOptions, setLeaveOptions] = useState([
    { label: 'Casual Leave', value: 'casual' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Earned Leave', value: 'earned' },
    { label: 'Privilege Leave', value: 'privilege' },
  ]);

  const [duration, setDuration] = useState('full');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Apply For Leave</Text>
        <TouchableOpacity style={styles.balanceBtn}>
          <Text style={styles.balanceText}>Balance</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subText}>Reporting Manager: NA</Text>

      <Text style={styles.label}>Leave Duration</Text>
      <View style={styles.radioRow}>
        <RadioButton.Android
          value="full"
          status={duration === 'full' ? 'checked' : 'unchecked'}
          onPress={() => setDuration('full')}
          color="#660099"
        />
        <Text style={styles.radioLabel}>Full-Day</Text>

        <RadioButton.Android
          value="half"
          status={duration === 'half' ? 'checked' : 'unchecked'}
          onPress={() => setDuration('half')}
          color="#660099"
        />
        <Text style={styles.radioLabel}>Half-Day</Text>

        <RadioButton.Android
          value="cluster"
          status={duration === 'cluster' ? 'checked' : 'unchecked'}
          onPress={() => setDuration('cluster')}
          color="#660099"
        />
        <Text style={styles.radioLabel}>Cluster</Text>
      </View>

      {/* Dropdown */}
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
        dropDownContainerStyle={{ borderColor: '#ccc' }}
      />

      <Text style={styles.label}>Rejoining Date:</Text>
      <TextInput style={styles.input} placeholder="dd-mm-yyyy" />

      <Text style={styles.label}>From Date</Text>
      <TextInput style={styles.input} placeholder="dd-mm-yyyy" />

      <Text style={styles.label}>To Date</Text>
      <TextInput style={styles.input} placeholder="dd-mm-yyyy" />

      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
        placeholder="Reason"
      />

      {/* Table */}
      <Text style={styles.tableTitle}>Leave Balance</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>LEAVE NAME</Text>
        <Text style={styles.tableHeaderText}>CREDIT DAYS</Text>
        <Text style={styles.tableHeaderText}>USED DAYS</Text>
        <Text style={styles.tableHeaderText}>BALANCE</Text>
      </View>

      {[
        ['Casual Leave', 14, 14, 14],
        ['Sick Leave', 25, 25, 25],
        ['Earned Leave', 19, 19, 19],
        ['Privilege Leave', 22, 22, 22],
      ].map(([name, credit, used, balance], index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableText}>{name}</Text>
          <Text style={styles.tableText}>{credit}</Text>
          <Text style={styles.tableText}>{used}</Text>
          <Text style={styles.tableText}>{balance}</Text>
        </View>
      ))}

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ApplyLeaveScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceBtn: {
    backgroundColor: '#B48B9B',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  balanceText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  subText: {
    fontSize: 14,
    marginVertical: 8,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioLabel: {
    marginRight: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 4,
  },
  tableTitle: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EEF1F2',
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: '700',
    fontSize: 12,
    color: '#444',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  tableText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
  },
  submitBtn: {
    backgroundColor: '#8D6A9F',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#EB3E2D',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
