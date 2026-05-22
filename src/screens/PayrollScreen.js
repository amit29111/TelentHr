import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import PayrollDashboard from './PayrollDashboard';

const PayrollScreen = ({navigation}) => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payroll</Text>
      </View>

      {/* TOP TABS */}

      <View style={styles.tabs}>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('PayrollSalary')}>
          <Text style={styles.tabText}>Salary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('PayrollTaxation')}>
          <Text style={styles.tabText}>Taxation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('PayrollClaims')}>
          <Text style={styles.tabText}>Claims</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('PayrollRequests')}>
          <Text style={styles.tabText}>Requests</Text>
        </TouchableOpacity>

      </View>

      {/* PAYROLL DASHBOARD */}

      <PayrollDashboard />

    </ScrollView>
  );
};

export default PayrollScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1F1',
  },

  header: {
    backgroundColor: '#4A2C2A',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3ECEC',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 30,
    padding: 4,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 24,
  },

  tabText: {
    color: '#555',
    fontSize: 12,
    fontWeight: '600',
  },
});