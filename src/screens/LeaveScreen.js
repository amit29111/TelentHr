//   import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
//   Dimensions,
//   Modal,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import ApplyLeaveScreen from './ApplyLeaveScreen'; // Make sure path is correct
// import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// const leaves = [
//   { type: 'Casual Leave', days: 14, status: 'Approved' },
//   { type: 'Sick Leave', days: 25, status: 'Approved' },
//   { type: 'Casual Leave', days: 16, status: 'Rejected' },
//   { type: 'Casual Leave', days: 19, status: 'Pending' },
//   { type: 'Sick Leave', days: 22, status: 'Pending' },
//   { type: 'Casual Leave', days: 17, status: 'Pending' },
//   { type: 'Sick Leave', days: 20, status: 'Pending' },
//   { type: 'Casual Leave', days: 26, status: 'Pending' },
//   { type: 'Sick Leave', days: 27, status: 'Pending' },
// ];

// const statusColor = {
//   Approved: '#23B480',
//   Pending: '#E59A26',
//   Rejected: '#D93D3D',
// };

// const LeaveScreen = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       {/* Header with Back Button and Title */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Text style={styles.backArrow}>←</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Leave Request</Text>
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        

//         {/* Cards */}
//         <View style={styles.leaveCounters}>
//           <LeaveCard label="Annual Leaves" count="4/15" color="#D9C6E6" />
//           <LeaveCard label="Medical Leaves" count="3/6" color="#D7D5D2" />
//           <LeaveCard label="Casual Leaves" count="2/6" color="#F4D0D0" />
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity style={styles.tabActive}>
//             <Text style={styles.tabTextActive}>My Leave Request</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.tabInactive}>
//             <Text style={styles.tabTextInactive}>Leave Balance</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Leave Info Header */}
//         <View style={styles.leaveInfoHeader}>
//           <Text style={styles.infoTitle}>Leave Request Info</Text>
//           <TouchableOpacity style={styles.dropdown}>
//             <Text style={styles.dropdownText}>This Month ▼</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Table Header */}
//         <View style={styles.tableHeader}>
//           <Text style={styles.columnHeader}>TYPE</Text>
//           <Text style={styles.columnHeader}>DAYS</Text>
//           <Text style={styles.columnHeader}>STATUS</Text>
//         </View>

//         <FlatList
//           data={leaves}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.tableRow}>
//               <Text style={styles.rowText}>{item.type}</Text>
//               <Text style={styles.rowText}>{item.days}</Text>
//               <Text style={[styles.rowText, { color: statusColor[item.status] }]}>{item.status}</Text>
//             </View>
//           )}
//         />

//         {/* APPLY BUTTON */}
//         <TouchableOpacity
//           style={styles.applyButton}
//           onPress={() => setModalVisible(true)}
//         >
//           <Text style={styles.applyButtonText}>APPLY FOR LEAVE</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* BOTTOM MODAL */}
//       <Modal animationType="slide" transparent={true} visible={modalVisible}>
//         <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//           <View style={styles.modalOverlay}>
//             <TouchableWithoutFeedback onPress={() => {}}>
//               <View style={styles.modalContainer}>
//                 {/* Close Button */}
//                 <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
//                   <Text style={{ fontSize: 18, color: '#333', textAlign: 'right' }}>✕</Text>
//                 </TouchableOpacity>

//                 {/* Apply Leave Form */}
//                 <ScrollView>
//                   <ApplyLeaveScreen />
//                 </ScrollView>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };

// const LeaveCard = ({ label, count, color }) => (
//   <View style={[styles.leaveCard, { backgroundColor: color }]}>
//     <Text style={styles.leaveCardLabel}>{label}</Text>
//     <Text style={styles.leaveCardCount}>{count}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },

//   header: {
//     height: 60,
//     backgroundColor: '#4A2C2A',
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },
//   backButton: {
//     marginRight: 10,
//   },
//   backArrow: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },

//   title: { fontSize: 20, fontWeight: 'bold', margin: 16, textAlign: 'center', color: '#4A2C2A' },
//   leaveCounters: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
//   leaveCard: { width: width / 3.2, padding: 10, borderRadius: 12, alignItems: 'center' },
//   leaveCardLabel: { fontSize: 12, color: '#333' },
//   leaveCardCount: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 4 },
//   tabContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
//   tabActive: { backgroundColor: '#4A2C2A', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
//   tabInactive: { backgroundColor: '#F0E6E6', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
//   tabTextActive: { color: '#fff', fontWeight: '600' },
//   tabTextInactive: { color: '#4A2C2A', fontWeight: '600' },
//   leaveInfoHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, alignItems: 'center', marginBottom: 6 },
//   infoTitle: { fontSize: 14, fontWeight: 'bold' },
//   dropdown: { padding: 4 },
//   dropdownText: { fontSize: 12, color: '#333' },
//   tableHeader: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F2F2F2', paddingHorizontal: 16, paddingVertical: 8 },
//   columnHeader: { fontWeight: 'bold', fontSize: 12, color: '#333' },
//   tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
//   rowText: { fontSize: 12, color: '#333' },
//   applyButton: { backgroundColor: '#4A2C2A', margin: 20, padding: 14, borderRadius: 24, alignItems: 'center' },
//   applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   modalContainer: {
//     height: height * 0.57,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     padding: 10,
//   },
//   modalClose: {
//     alignSelf: 'flex-end',
//     marginRight: 10,
//     padding: 5,
//   },
// });

// export default LeaveScreen;


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const { width } = Dimensions.get('window');

// const leaveBalanceData = [
//   { name: 'Casual Leave', credit: 14, used: 0, balance: 14 },
//   { name: 'Sick Leave', credit: 25, used: 0, balance: 25 },
//   { name: 'Casual Leave', credit: 16, used: 0, balance: 16 },
//   { name: 'Casual Leave', credit: 19, used: 0, balance: 19 },
//   { name: 'Sick Leave', credit: 22, used: 0, balance: 22 },
//   { name: 'Sick Leave', credit: 11, used: 0, balance: 11 },
//   { name: 'Casual Leave', credit: 17, used: 0, balance: 17 },
//   { name: 'Sick Leave', credit: 20, used: 0, balance: 20 },
//   { name: 'Casual Leave', credit: 26, used: 0, balance: 26 },
//   { name: 'Sick Leave', credit: 27, used: 0, balance: 27 },
// ];

// const LeaveBalanceScreen = () => {
//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState('balance');

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backArrow}>←</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Leave Request</Text>
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
//         {/* Leave Cards */}
//         <View style={styles.cardRow}>
//           <LeaveCard label="Annual Leaves" count="4/15" bg="#E8DFF0" />
//           <LeaveCard label="Medical Leaves" count="3/6" bg="#ECEAE8" />
//           <LeaveCard label="Casual Leaves" count="2/6" bg="#F9DCDC" />
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabs}>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === 'request' && styles.activeTab]}
//             onPress={() => setActiveTab('request')}>
//             <Text style={[styles.tabText, activeTab === 'request' && styles.activeTabText]}>
//               My Leave Request
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === 'balance' && styles.activeTab]}
//             onPress={() => setActiveTab('balance')}>
//             <Text style={[styles.tabText, activeTab === 'balance' && styles.activeTabText]}>
//               Leave Balance
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Leave Balance Table */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Leave Balance</Text>
//           <TouchableOpacity>
//             <Text style={styles.dropdownText}>This Month ▼</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.tableHeader}>
//           <Text style={styles.colHeader}>LEAVE NAME</Text>
//           <Text style={styles.colHeader}>CREDIT DAYS</Text>
//           <Text style={styles.colHeader}>USED DAYS</Text>
//           <Text style={styles.colHeader}>BALANCE</Text>
//         </View>

//         {leaveBalanceData.map((item, index) => (
//           <View key={index} style={styles.tableRow}>
//             <Text style={styles.cell}>{item.name}</Text>
//             <Text style={styles.cell}>{item.credit}</Text>
//             <Text style={styles.cell}>{item.used}</Text>
//             <Text style={styles.cell}>{item.balance}</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const LeaveCard = ({ label, count, bg }) => (
//   <View style={[styles.card, { backgroundColor: bg }]}>
//     <Text style={styles.cardLabel}>{label}</Text>
//     <Text style={styles.cardCount}>{count}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4A2C2A',
//     paddingHorizontal: 16,
//     height: 60,
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//   },
//   backArrow: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginRight: 10,
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },

//   cardRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 16,
//     marginBottom: 10,
//   },
//   card: {
//     width: width / 3.4,
//     padding: 10,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   cardLabel: {
//     fontSize: 12,
//     color: '#4A2C2A',
//   },
//   cardCount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 4,
//     color: '#4A2C2A',
//   },

//   tabs: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 10,
//   },
//   tab: {
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     backgroundColor: '#F0E6E6',
//   },
//   activeTab: {
//     backgroundColor: '#4A2C2A',
//   },
//   tabText: {
//     fontSize: 12,
//     color: '#4A2C2A',
//     fontWeight: '600',
//   },
//   activeTabText: {
//     color: '#fff',
//   },

//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     marginTop: 10,
//     marginBottom: 4,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   dropdownText: {
//     fontSize: 12,
//     color: '#333',
//   },

//   tableHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backgroundColor: '#EFEFEF',
//   },
//   colHeader: {
//     flex: 1,
//     fontSize: 11,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#333',
//   },

//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderBottomWidth: 0.5,
//     borderColor: '#eee',
//   },
//   cell: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 12,
//     color: '#333',
//   },
// });

// export default LeaveBalanceScreen;


import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApplyLeaveScreen from './ApplyLeaveScreen'; // Make sure path is correct

const { width, height } = Dimensions.get('window');

const leaves = [
  { type: 'Casual Leave', days: 14, status: 'Approved' },
  { type: 'Sick Leave', days: 25, status: 'Approved' },
  { type: 'Casual Leave', days: 16, status: 'Rejected' },
  { type: 'Casual Leave', days: 19, status: 'Pending' },
  { type: 'Sick Leave', days: 22, status: 'Pending' },
  { type: 'Casual Leave', days: 17, status: 'Pending' },
  { type: 'Sick Leave', days: 20, status: 'Pending' },
  { type: 'Casual Leave', days: 26, status: 'Pending' },
  { type: 'Sick Leave', days: 27, status: 'Pending' },
];

const leaveBalanceData = [
  { name: 'Casual Leave', credit: 14, used: 0, balance: 14 },
  { name: 'Sick Leave', credit: 25, used: 0, balance: 25 },
  { name: 'Casual Leave', credit: 16, used: 0, balance: 16 },
  { name: 'Casual Leave', credit: 19, used: 0, balance: 19 },
  { name: 'Sick Leave', credit: 22, used: 0, balance: 22 },
  { name: 'Sick Leave', credit: 11, used: 0, balance: 11 },
  { name: 'Casual Leave', credit: 17, used: 0, balance: 17 },
  { name: 'Sick Leave', credit: 20, used: 0, balance: 20 },
  { name: 'Casual Leave', credit: 26, used: 0, balance: 26 },
  { name: 'Sick Leave', credit: 27, used: 0, balance: 27 },
];

const statusColor = {
  Approved: '#23B480',
  Pending: '#E59A26',
  Rejected: '#D93D3D',
};

const LeaveScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('request'); // 'request' or 'balance'

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Request</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Cards */}
        <View style={styles.leaveCounters}>
          <LeaveCard label="Annual Leaves" count="4/15" color="#D9C6E6" />
          <LeaveCard label="Medical Leaves" count="3/6" color="#D7D5D2" />
          <LeaveCard label="Casual Leaves" count="2/6" color="#F4D0D0" />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={activeTab === 'request' ? styles.tabActive : styles.tabInactive}
            onPress={() => setActiveTab('request')}>
            <Text style={activeTab === 'request' ? styles.tabTextActive : styles.tabTextInactive}>
              My Leave Request
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={activeTab === 'balance' ? styles.tabActive : styles.tabInactive}
            onPress={() => setActiveTab('balance')}>
            <Text style={activeTab === 'balance' ? styles.tabTextActive : styles.tabTextInactive}>
              Leave Balance
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ternary View Rendering */}
        {activeTab === 'request' ? (
          <>
            {/* Leave Info Header */}
            <View style={styles.leaveInfoHeader}>
              <Text style={styles.infoTitle}>Leave Request Info</Text>
              <TouchableOpacity style={styles.dropdown}>
                <Text style={styles.dropdownText}>This Month ▼</Text>
              </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.columnHeader}>TYPE</Text>
              <Text style={styles.columnHeader}>DAYS</Text>
              <Text style={styles.columnHeader}>STATUS</Text>
            </View>

            <FlatList
              data={leaves}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.rowText}>{item.type}</Text>
                  <Text style={styles.rowText}>{item.days}</Text>
                  <Text style={[styles.rowText, { color: statusColor[item.status] }]}>{item.status}</Text>
                </View>
              )}
            />

            {/* Apply Button */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.applyButtonText}>APPLY FOR LEAVE</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Leave Balance Info */}
            <View style={styles.leaveInfoHeader}>
              <Text style={styles.infoTitle}>Leave Balance</Text>
              <TouchableOpacity style={styles.dropdown}>
                <Text style={styles.dropdownText}>This Month ▼</Text>
              </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.colHeader}>LEAVE NAME</Text>
              <Text style={styles.colHeader}>CREDIT DAYS</Text>
              <Text style={styles.colHeader}>USED DAYS</Text>
              <Text style={styles.colHeader}>BALANCE</Text>
            </View>

            {leaveBalanceData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.credit}</Text>
                <Text style={styles.cell}>{item.used}</Text>
                <Text style={styles.cell}>{item.balance}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Bottom Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalClose}>
                  <Text style={{ fontSize: 18, color: '#333', textAlign: 'right' }}>✕</Text>
                </TouchableOpacity>
                <ScrollView>
                  <ApplyLeaveScreen />
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const LeaveCard = ({ label, count, color }) => (
  <View style={[styles.leaveCard, { backgroundColor: color }]}>
    <Text style={styles.leaveCardLabel}>{label}</Text>
    <Text style={styles.leaveCardCount}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 60,
    backgroundColor: '#4A2C2A',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 10 },
  backArrow: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

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
  leaveCardLabel: { fontSize: 12, color: '#333' },
  leaveCardCount: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 4 },

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
  tabTextActive: { color: '#fff', fontWeight: '600' },
  tabTextInactive: { color: '#4A2C2A', fontWeight: '600' },

  leaveInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 4,
  },
  infoTitle: { fontSize: 14, fontWeight: 'bold' },
  dropdown: { padding: 4 },
  dropdownText: { fontSize: 12, color: '#333' },

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
    height: height * 0.57,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
  },
  modalClose: {
    alignSelf: 'flex-end',
    marginRight: 10,
    padding: 5,
  },
});

export default LeaveScreen;
