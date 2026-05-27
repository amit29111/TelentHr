import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

import PayrollTabs from './PayrollTabs';

const PayrollTaxation = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Investment Declaration');

  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025-2026');

  const taxationTabs = [
    'Investment Declaration',
    'Proof of Investment',
    'Tax Report',
    'Form 16',
  ];

  const financialYears = [
    '2020-2021',
    '2021-2022',
    '2022-2023',
    '2023-2024',
    '2024-2025',
    '2025-2026',
  ];

  const showActionButton =
    activeTab === 'Investment Declaration' ||
    activeTab === 'Proof of Investment';

  const handleActionPress = () => {
    if (activeTab === 'Investment Declaration') {
      navigation.navigate('DeclareInvestments');
    } else if (activeTab === 'Proof of Investment') {
      navigation.navigate('ProofOfInvestments');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Taxation</Text>
        <View style={{width: 24}} />
      </View>

      {/* PAYROLL TABS */}
      <PayrollTabs navigation={navigation} activeTab="Taxation" />

      {/* HORIZONTAL TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}>
        {taxationTabs.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.customTab}
            onPress={() => setActiveTab(item)}>
            <Text
              style={[
                styles.customTabText,
                activeTab === item && styles.customTabTextActive,
              ]}>
              {item}
            </Text>
            {activeTab === item && <View style={styles.activeBorder} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* YEAR + ACTION BUTTON */}
      <View style={styles.yearContainer}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.yearDropdown}
            onPress={() => setShowYearDropdown(!showYearDropdown)}>
            <Text style={styles.yearText}>
              Financial Year : {selectedYear}
            </Text>
            <Text style={styles.arrow}>
              {showYearDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {showYearDropdown && (
            <View style={styles.dropdownBox}>
              {financialYears.map((year, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedYear(year);
                    setShowYearDropdown(false);
                  }}>
                  <Text style={styles.dropdownText}>{year}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {showActionButton && (
          <TouchableOpacity
            style={styles.declareBtn}
            onPress={handleActionPress}>
            <Text style={styles.declareBtnText}>
              {activeTab === 'Investment Declaration'
                ? 'Declare Investments'
                : 'Submit Proof'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CONTENT */}
      <View style={styles.contentBox}>
        {activeTab === 'Investment Declaration' ? (
          <View style={styles.emptyState}>
            <Feather name="file-text" size={40} color="#C8A8A8" />
            <Text style={styles.emptyTitle}>No Declaration Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap "Declare Investments" above to start your investment
              declaration for the selected financial year.
            </Text>
          </View>
        ) : activeTab === 'Proof of Investment' ? (
          <View style={styles.emptyState}>
            <Feather name="upload-cloud" size={40} color="#C8A8A8" />
            <Text style={styles.emptyTitle}>No Proof Submitted</Text>
            <Text style={styles.emptySubtitle}>
              Tap "Submit Proof" above to upload and review your proof of
              investments.
            </Text>
          </View>
        ) : activeTab === 'Tax Report' ? (
          <>
            <Text style={styles.heading}>Tax Report</Text>
            <Text style={styles.description}>
              This is the Tax Report section content.
            </Text>
          </>
        ) : activeTab === 'Form 16' ? (
          <>
            <Text style={styles.heading}>Form 16</Text>
            <Text style={styles.description}>
              This is the Form 16 section content.
            </Text>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default PayrollTaxation;

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

  tabsContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    paddingBottom: 10,
  },

  customTab: {
    marginRight: 24,
    alignItems: 'center',
    paddingBottom: 8,
  },

  customTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },

  customTabTextActive: {
    color: '#111',
    fontWeight: '700',
  },

  activeBorder: {
    height: 3,
    backgroundColor: '#2952E3',
    width: '100%',
    marginTop: 8,
    borderRadius: 10,
  },

  yearContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 6,
    zIndex: 999,
  },

  yearDropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  yearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },

  arrow: {
    fontSize: 12,
    color: '#555',
    marginLeft: 8,
  },

  dropdownBox: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 10,
    zIndex: 9999,
    paddingVertical: 6,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },

  dropdownText: {
    fontSize: 13,
    color: '#111',
    fontWeight: '500',
  },

  declareBtn: {
    backgroundColor: '#2952E3',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 10,
  },

  declareBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  contentBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    padding: 20,
    minHeight: 200,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 12.5,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});
