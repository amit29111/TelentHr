import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';

import PayrollTabs from './PayrollTabs';

const claimsData = [
  {
    claimNo: 'CLM001',
    claimedAmount: '₹5,000',
    status: 'Approved',
    approvedAmount: '₹4,500',
    claimDate: '12 Feb 2026',
    importedOn: '14 Feb 2026',
  },
  {
    claimNo: 'CLM002',
    claimedAmount: '₹3,200',
    status: 'Pending',
    approvedAmount: '₹0',
    claimDate: '18 Feb 2026',
    importedOn: '19 Feb 2026',
  },
];

const PayrollClaims = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);

  const [entries, setEntries] = useState([
    {
      date: '',
      billNo: '',
      particulars: '',
      head: '',
      amount: '',
    },
  ]);

  const addRow = () => {
    setEntries([
      ...entries,
      {
        date: '',
        billNo: '',
        particulars: '',
        head: '',
        amount: '',
      },
    ]);
  };

  const removeRow = index => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}

        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Claims</Text>

          <View style={{width: 24}} />
        </View>

        {/* PAYROLL TABS */}

        <PayrollTabs navigation={navigation} activeTab="Claims" />

        {/* CLAIM HEADER */}

        {/* CLAIM HEADER */}

        <View style={styles.claimHeader}>
           <TouchableOpacity
              style={styles.summaryBtn}
              onPress={() => setSummaryModalVisible(true)}>
              <Text style={styles.summaryBtnText}>Summary Report</Text>
            </TouchableOpacity>

          <View style={styles.headerBtnRow}>
            {/* CLAIM SUMMARY POPUP BUTTON */}

           

            {/* NEW REQUEST BUTTON */}

            <TouchableOpacity
              style={styles.newRequestBtn}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.newRequestText}>+ New Request</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CLAIMS LIST */}

        <View style={styles.claimsContainer}>
          {claimsData.map((item, index) => (
            <View key={index} style={styles.claimCard}>
              {/* FIRST ROW */}

              <View style={styles.row}>
                <View style={styles.itemBox}>
                  <Text style={styles.label}>Claim No</Text>
                  <Text style={styles.value}>{item.claimNo}</Text>
                </View>

                <View style={styles.itemBox}>
                  <Text style={styles.label}>Claim Amount</Text>
                  <Text style={styles.value}>{item.claimedAmount}</Text>
                </View>

                <View style={styles.itemBox}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.status === 'Approved' ? '#16A34A' : '#F59E0B',
                      },
                    ]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* SECOND ROW */}

              <View style={[styles.row, {marginTop: 18}]}>
                <View style={styles.itemBox}>
                  <Text style={styles.label}>Approved Amount</Text>
                  <Text style={styles.value}>{item.approvedAmount}</Text>
                </View>

                <View style={styles.itemBox}>
                  <Text style={styles.label}>Claim Date</Text>
                  <Text style={styles.value}>{item.claimDate}</Text>
                </View>

                <View style={styles.itemBox}>
                  <Text style={styles.label}>Imported On</Text>
                  <Text style={styles.value}>{item.importedOn}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FULL SCREEN MODAL */}

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView
          style={styles.modalContainer}
          showsVerticalScrollIndicator={false}>
          {/* MODAL HEADER */}

          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Claims</Text>

            <View style={{width: 24}} />
          </View>

          {/* BASIC INFO */}

          <Text style={styles.sectionTitle}>Basic Information</Text>

          <Text style={styles.inputLabel}>Claim No</Text>

          <TextInput placeholder="Enter Claim No" style={styles.input} />

          <Text style={styles.inputLabel}>Employee No</Text>

          <TextInput placeholder="Enter Employee No" style={styles.input} />

          <Text style={styles.inputLabel}>Claim Date</Text>

          <TextInput placeholder="DD/MM/YYYY" style={styles.input} />

          <Text style={styles.inputLabel}>Name</Text>

          <TextInput placeholder="Enter Name" style={styles.input} />

          {/* SUMMARY */}

          <Text style={styles.sectionTitle}>Summary</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Eligibility</Text>
              <Text style={styles.summaryValue}>₹20,000</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Annual</Text>
              <Text style={styles.summaryValue}>₹50,000</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Claimed</Text>
              <Text style={styles.summaryValue}>₹10,000</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Paid</Text>
              <Text style={styles.summaryValue}>₹8,000</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryValue}>₹2,000</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Current</Text>
              <Text style={styles.summaryValue}>₹1,500</Text>
            </View>
          </View>

          {/* BALANCE */}

          <Text style={styles.sectionTitle}>Balance</Text>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceText}>Available Balance : ₹12,000</Text>
          </View>

          {/* CLAIM ENTRIES */}

          <View style={styles.entriesHeader}>
            <Text style={styles.sectionTitle}>Claim Entries</Text>

            <TouchableOpacity>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>

          {entries.map((item, index) => (
            <View key={index} style={styles.entryCard}>
              <Text style={styles.inputLabel}>Date (DD/MM/YY)</Text>

              <TextInput
                placeholder="DD/MM/YY"
                style={styles.input}
                value={item.date}
                onChangeText={text => updateField(index, 'date', text)}
              />

              <Text style={styles.inputLabel}>Bill No</Text>

              <TextInput
                placeholder="Enter Bill No"
                style={styles.input}
                value={item.billNo}
                onChangeText={text => updateField(index, 'billNo', text)}
              />

              <Text style={styles.inputLabel}>Particulars</Text>

              <TextInput
                placeholder="Enter Particulars"
                style={styles.input}
                value={item.particulars}
                onChangeText={text => updateField(index, 'particulars', text)}
              />

              <Text style={styles.inputLabel}>Head</Text>

              <TextInput
                placeholder="Enter Head"
                style={styles.input}
                value={item.head}
                onChangeText={text => updateField(index, 'head', text)}
              />

              <Text style={styles.inputLabel}>Amount</Text>

              <TextInput
                placeholder="Enter Amount"
                style={styles.input}
                value={item.amount}
                onChangeText={text => updateField(index, 'amount', text)}
              />

              {entries.length > 1 && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeRow(index)}>
                  <Text style={styles.deleteBtnText}>Remove Row</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* INSERT ROW */}

          <TouchableOpacity style={styles.insertBtn} onPress={addRow}>
            <Text style={styles.insertBtnText}>+ Insert Row</Text>
          </TouchableOpacity>

          {/* TOTAL */}

          <View style={styles.totalCard}>
            <Text style={styles.totalText}>Total Amount : ₹0</Text>
          </View>

          {/* ATTACHMENT */}

          <Text style={styles.sectionTitle}>Attachment</Text>

          <View style={styles.uploadRow}>
            <TouchableOpacity style={styles.uploadBtn}>
              <Text style={styles.uploadBtnText}>Select File</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadBtn}>
              <Text style={styles.uploadBtnText}>Upload</Text>
            </TouchableOpacity>
          </View>

          {/* COMMENTS */}

          <Text style={styles.sectionTitle}>Comments</Text>

          <TextInput
            placeholder="Write comments..."
            multiline
            style={styles.commentInput}
          />

          {/* BUTTONS */}

          <View style={styles.bottomBtnRow}>
            <TouchableOpacity style={styles.draftBtn}>
              <Text style={styles.draftBtnText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
      {/* CLAIM SUMMARY REPORT MODAL */}

     {/* CLAIM SUMMARY REPORT MODAL */}

<Modal
  visible={summaryModalVisible}
  transparent={true}
  animationType="fade">

  <View style={styles.modalOverlay}>

    <View style={styles.summaryModalBox}>

      {/* HEADER */}

      <View style={styles.summaryHeader}>

        <Text style={styles.summaryHeading}>
          Claim Summary Report
        </Text>

        <TouchableOpacity
          onPress={() => setSummaryModalVisible(false)}
          style={styles.closeBtn}>

          <Text style={styles.closeText}>✕</Text>

        </TouchableOpacity>

      </View>

      {/* PERIOD */}

      <Text style={styles.inputLabel}>
        Period
      </Text>

      <TextInput
        placeholder="Enter Period"
        style={styles.popupInput}
      />

      {/* REIMBURSEMENT */}

      <Text style={styles.inputLabel}>
        Reimbursement
      </Text>

      <TextInput
        placeholder="Enter Reimbursement"
        style={styles.popupInput}
      />

      {/* PREVIEW BUTTON */}

      <TouchableOpacity style={styles.previewBtn}>
        <Text style={styles.previewBtnText}>
          Preview
        </Text>
      </TouchableOpacity>

    </View>

  </View>

</Modal>
    </>
  );
};

export default PayrollClaims;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1F1',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F1F1',
    paddingBottom: 40,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    marginBottom: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    marginBottom: 20,
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

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    textAlign: 'start',
  },

  claimHeader: {
    marginTop: 18,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  claimSummaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  newRequestBtn: {
    backgroundColor: '#2952E3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  summaryBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  newRequestText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  claimsContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 30,
  },

  claimCard: {
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
    marginBottom: 4,
  },

  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },

  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginHorizontal: 16,
    marginBottom: 14,
    marginTop: 18,
  },

  inputLabel: {
    marginHorizontal: 16,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  input: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 14,
  },

  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  summaryBox: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  balanceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },

  balanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
  },

  removeText: {
    color: '#EF4444',
    fontWeight: '700',
  },

  entryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 14,
  },

  insertBtn: {
    backgroundColor: '#2952E3',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  insertBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  totalCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
  },

  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  uploadRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },

  uploadBtn: {
    backgroundColor: '#2952E3',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },

  uploadBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  commentInput: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 30,
  },

  bottomBtnRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 40,
  },

  draftBtn: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },

  draftBtnText: {
    fontWeight: '700',
    color: '#111',
  },

  submitBtn: {
    flex: 1,
    backgroundColor: '#2952E3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
  },

  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  deleteBtn: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },

  deleteBtnText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},

summaryModalBox: {
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 20,
},

summaryHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},

summaryHeading: {
  fontSize: 18,
  fontWeight: '700',
  color: '#111',
},

closeBtn: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#F3F4F6',
  justifyContent: 'center',
  alignItems: 'center',
},

closeText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#111',
},

popupInput: {
  backgroundColor: '#F9FAFB',
  borderRadius: 10,
  paddingHorizontal: 14,
  height: 50,
  marginBottom: 16,
  fontSize: 14,
},

previewBtn: {
  backgroundColor: '#2952E3',
  marginTop: 10,
  borderRadius: 10,
  paddingVertical: 14,
  alignItems: 'center',
},

previewBtnText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 14,
},
});
