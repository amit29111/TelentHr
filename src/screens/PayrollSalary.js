import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PayrollTabs from './PayrollTabs';

const PayrollSalary = ({navigation}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Salary</Text>

        <View style={{width: 24}} />
      </View>

      <PayrollTabs navigation={navigation} activeTab="Salary" />

      {[1, 2, 3].map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.label}>Pay Period</Text>
              <Text style={styles.value}>Sept 7 - Oct 30, 2025</Text>
            </View>

            <View>
              <Text style={styles.label}>Pay Date</Text>
              <Text style={styles.value}>Oct 7, 2025</Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>Paid</Text>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.smallLabel}>Hours</Text>
              <Text style={styles.smallValue}>80</Text>
            </View>

            <View>
              <Text style={styles.smallLabel}>Gross Pay</Text>
              <Text style={styles.smallValue}>₹5,585</Text>
            </View>

            <View>
              <Text style={styles.smallLabel}>Deduction</Text>
              <Text style={styles.smallValue}>-₹5,585</Text>
            </View>

            <View>
              <Text style={styles.smallLabel}>Net Pay</Text>
              <Text style={styles.smallValue}>₹4286</Text>
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.title}>Annual Salary Statement</Text>

      {[1, 2].map((item, index) => (
        <View key={index} style={styles.statementCard}>
          <Text style={styles.statementText}>FY 2024-2025</Text>

          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default PayrollSalary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1F1',
    padding: 16,
    marginTop: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
    color: '#111',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  label: {
    fontSize: 10,
    color: '#777',
  },

  value: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
    color: '#111',
  },

  badge: {
    borderWidth: 1,
    borderColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '600',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  smallLabel: {
    fontSize: 10,
    color: '#888',
  },

  smallValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111',
    marginTop: 2,
  },

  statementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statementText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111',
  },

  viewBtn: {
    backgroundColor: '#2952E3',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
  },

  viewBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  backIcon: {
    fontSize: 24,
    color: '#111',
    width: 24,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
});
