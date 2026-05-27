import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const ProofOfInvestments = ({navigation, route}) => {
  const proofStatus = 'success';
  const proofBadge = 'AWAITING APPROVAL';

  const proofData = {
    year: '2025-2026',
    regime: 'Old Tax Regime',
    netTaxable: '₹26,01,230.00',
    totalTax: '₹2,16,599.00',
    taxToBePaid: '₹2,16,599.00',
    details: [
      {
        title: 'House Rent Details',
        period: 'Apr 2020–Mar 2021 (₹8,200.00 / Month)',
        declared: '80,000',
        actual: '80,000',
      },
      {
        title: '80C Investments',
        period: '(Max Limit: ₹1,50,000.00)',
        declared: '80,000',
        actual: '80,000',
      },
      {
        title: '80D Investments',
        period: '(Max Limit: ₹1,00,000.00)',
        declared: '80,000',
        actual: '80,000',
      },
      {
        title: 'Net income/ Loss from House Property',
        period: 'Total Income/ Loss from House Property',
        declared: '80,000',
        actual: '80,000',
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.titleRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Proof of Investment</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{paddingBottom: 30}}
        showsVerticalScrollIndicator={false}>
        {/* INFO BOX */}
        <View
          style={[
            styles.infoBox,
            proofStatus === 'success'
              ? styles.infoBoxSuccess
              : styles.infoBoxInfo,
          ]}>
          {proofStatus === 'success' ? (
            <MaterialIcons
              name="check-circle"
              size={24}
              color="#23B480"
              style={{marginRight: 8}}
            />
          ) : (
            <Feather
              name="info"
              size={22}
              color="#FFA500"
              style={{marginRight: 8}}
            />
          )}
          <View style={{flex: 1}}>
            <Text style={styles.infoBoxText}>
              {proofStatus === 'success'
                ? 'Your Proof of investment details have been saved successfully.'
                : 'You submitted your IT Declaration to your payroll admin.'}
            </Text>
          </View>
          {proofBadge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{proofBadge}</Text>
            </View>
          ) : null}
        </View>

        {/* FINANCIAL SUMMARY */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Financial Year :</Text>
            <Text style={styles.summaryValue}>{proofData.year}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax Regime :</Text>
            <Text style={styles.summaryValue}>{proofData.regime}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Net Taxable Income :</Text>
            <Text style={styles.summaryValue}>{proofData.netTaxable}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Tax :</Text>
            <Text style={styles.summaryValue}>{proofData.totalTax}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax to be Paid :</Text>
            <Text style={styles.summaryValue}>{proofData.taxToBePaid}</Text>
          </View>
        </View>

        {/* DETAILS CARDS */}
        {proofData.details.map((item, idx) => (
          <View key={idx} style={styles.investmentCard}>
            <View style={styles.investmentHeader}>
              <Text style={styles.investmentTitle}>{item.title}</Text>
              <TouchableOpacity>
                <Feather name="edit" size={16} color="#452300" />
              </TouchableOpacity>
            </View>
            <Text style={styles.investmentPeriod}>{item.period}</Text>
            <View style={styles.investmentRow}>
              <View style={styles.investmentCol}>
                <Text style={styles.investmentLabel}>Declared</Text>
                <Text style={styles.investmentValue}>{item.declared}</Text>
              </View>
              <View style={styles.investmentCol}>
                <Text style={styles.investmentLabel}>Actual</Text>
                <Text style={styles.investmentValue}>{item.actual}</Text>
              </View>
              <TouchableOpacity style={styles.attachBtn}>
                <Feather name="paperclip" size={16} color="#452300" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProofOfInvestments;

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F5F1F1'},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#F5F1F1',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backBtn: {width: 24, alignItems: 'flex-start'},
  title: {fontSize: 16, fontWeight: '700', color: '#111'},
  scrollArea: {flex: 1, paddingHorizontal: 14, paddingTop: 14},
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  infoBoxSuccess: {backgroundColor: '#E8F8F2'},
  infoBoxInfo: {backgroundColor: '#FFF8E1'},
  infoBoxText: {color: '#222', fontSize: 12.5, flex: 1, lineHeight: 17},
  badge: {
    backgroundColor: '#FFA500',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  badgeText: {color: '#fff', fontSize: 10, fontWeight: 'bold'},
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {color: '#555', fontSize: 13},
  summaryValue: {color: '#111', fontWeight: '700', fontSize: 13},
  investmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  investmentTitle: {color: '#111', fontWeight: '700', fontSize: 14},
  investmentPeriod: {color: '#888', fontSize: 11.5, marginBottom: 10},
  investmentRow: {flexDirection: 'row', alignItems: 'center'},
  investmentCol: {flex: 1},
  investmentLabel: {color: '#888', fontSize: 11.5, marginBottom: 2},
  investmentValue: {color: '#111', fontWeight: '700', fontSize: 14},
  attachBtn: {padding: 6},
});
