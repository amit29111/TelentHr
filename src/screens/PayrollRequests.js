import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';

import PayrollTabs from './PayrollTabs';

const requestData = [
  {
    date: '12 Feb 2026',
    option: 'Salary Advance',
  },
  {
    date: '18 Feb 2026',
    option: 'Bonus Request',
  },
];

const PayrollRequests = ({navigation}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* HEADER ROW */}

        <View style={styles.titleRow}>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Requests</Text>

          <View style={{width: 24}} />

        </View>

        {/* PAYROLL TABS */}

        <PayrollTabs
          navigation={navigation}
          activeTab="Requests"
        />

        {/* NEW REQUEST BUTTON */}

        <View style={styles.content}>

          <TouchableOpacity
            style={styles.requestBtn}
            onPress={() => setModalVisible(true)}>

            <Text style={styles.requestBtnText}>
              + New Request
            </Text>

          </TouchableOpacity>

          <Text style={styles.description}>
            Submit payroll related requests such as salary advance,
            bonus request, reimbursement and more.
          </Text>

        </View>

        {/* REQUEST LIST */}

        <View style={styles.cardContainer}>

          {requestData.map((item, index) => (
            <View key={index} style={styles.card}>

              <View style={styles.row}>

                <View style={styles.itemBox}>
                  <Text style={styles.label}>
                    Date Submitted
                  </Text>

                  <Text style={styles.value}>
                    {item.date}
                  </Text>
                </View>

                <View style={styles.itemBox}>
                  <Text style={styles.label}>
                    Selected Option
                  </Text>

                  <Text style={styles.value}>
                    {item.option}
                  </Text>
                </View>

              </View>

            </View>
          ))}

        </View>

      </ScrollView>

      {/* POPUP MODAL */}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade">

        <View style={styles.modalOverlay}>

          <View style={styles.modalBox}>

            {/* HEADER */}

            <View style={styles.modalHeader}>

              <Text style={styles.modalTitle}>
                VPF Request
              </Text>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}>

                <Text style={styles.closeText}>✕</Text>

              </TouchableOpacity>

            </View>

            {/* RADIO BUTTON 1 */}

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setSelectedOption(1)}>

              <View style={styles.radioOuter}>
                {selectedOption === 1 && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Text style={styles.radioText}>
                I would like to contribute one time amount
                of Rs. towards Voluntary Provident Fund
              </Text>

            </TouchableOpacity>

            {/* RADIO BUTTON 2 */}

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setSelectedOption(2)}>

              <View style={styles.radioOuter}>
                {selectedOption === 2 && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Text style={styles.radioText}>
                I would like to stop my Voluntary
                contribution to provident fund (if any)
              </Text>

            </TouchableOpacity>

            {/* DESCRIPTION */}

            <Text style={styles.noteText}>
              No Approval is required. This instruction
              will be processed in next processing cycle.
            </Text>

            {/* BUTTONS */}

            <View style={styles.bottomBtnRow}>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}>

                <Text style={styles.cancelBtnText}>
                  Cancel
                </Text>

              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>
                  Submit
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>
    </>
  );
};

export default PayrollRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1F1',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    marginBottom: 10,
  },

  backIcon: {
    fontSize: 24,
    color: '#111',
    width: 24,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  content: {
    paddingHorizontal: 16,
    marginTop: 12,
  },

  requestBtn: {
    backgroundColor: '#2952E3',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  requestBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  description: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
  },

  cardContainer: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  itemBox: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    color: '#777',
    marginBottom: 6,
  },

  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#2952E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: 12,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2952E3',
  },

  radioText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },

  noteText: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
  },

  bottomBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
  },

  cancelBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
  },

  cancelBtnText: {
    color: '#111',
    fontWeight: '700',
  },

  submitBtn: {
    backgroundColor: '#2952E3',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },

  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});