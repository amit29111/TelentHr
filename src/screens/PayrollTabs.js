import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const PayrollTabs = ({navigation, activeTab}) => {
  const tabs = [
    {
      label: 'Salary',
      screen: 'PayrollSalary',
    },
    {
      label: 'Taxation',
      screen: 'PayrollTaxation',
    },
    {
      label: 'Claims',
      screen: 'PayrollClaims',
    },
    {
      label: 'Requests',
      screen: 'PayrollRequests',
    },
  ];

  return (
    <View style={styles.tabsContainer}>
      {tabs.map((item, index) => {
        const active = activeTab === item.label;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              active && styles.activeTabButton,
            ]}
            onPress={() => navigation.navigate(item.screen)}>
            <Text
              style={[
                styles.tabText,
                active && styles.activeTabText,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PayrollTabs;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1EAEA',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 30,
    padding: 4,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 24,
  },

  activeTabButton: {
    backgroundColor: '#4A2C2A',
  },

  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },

  activeTabText: {
    color: '#fff',
  },
});