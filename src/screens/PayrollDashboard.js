import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

const PayrollDashboard = () => {
  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#F3F4F6'}}
      contentContainerStyle={{paddingBottom: 20}}>
      <View style={styles.salaryCard}>
        <Text style={styles.salaryMonth}>February 2026 Salary</Text>
        <Text style={styles.salaryAmount}>₹55,500</Text>
        <Text style={styles.salaryLabel}>Net Pay (Take Home)</Text>
        <View style={styles.salaryDetailsRow}>
          <View style={styles.salaryDetailBox}>
            <Text style={styles.salaryDetailLabel}>Gross Salary</Text>
            <Text style={styles.salaryDetailValue}>₹60,000</Text>
          </View>
          <View style={styles.salaryDetailBox}>
            <Text style={styles.salaryDetailLabel}>Total Deductions</Text>
            <Text style={styles.salaryDetailValue}>₹4,000</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.payslipBtn}>
          <Text style={styles.payslipBtnText}>View Current Payslip</Text>
        </TouchableOpacity>
      </View>
      {/* YTD Cards */}
      <View style={styles.ytdRow}>
        <View style={[styles.ytdCard, {backgroundColor: '#DAF5FF80'}]}>
          <Text style={[styles.ytdAmount, {color: '#1D4ED8'}]}>₹00</Text>
          <Text style={styles.ytdLabel}>YTD Net Pay (2026)</Text>
        </View>
        <View style={[styles.ytdCard, {backgroundColor: '#D0002817'}]}>
          <Text style={[styles.ytdAmount, {color: '#D00028'}]}>₹00</Text>
          <Text style={[styles.ytdLabel, {color: '#D00028'}]}>
            YTD Tax Paid
          </Text>
        </View>
        <View style={[styles.ytdCard, {backgroundColor: '#BF5AF221'}]}>
          <Text style={[styles.ytdAmount, {color: '#9207D8'}]}>₹00</Text>
          <Text style={[styles.ytdLabel, {color: '#9207D8'}]}>
            YTD PF Contribution
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Salary Breakdown</Text>

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.earningsTitle}>↗ Earnings</Text>
            <Text style={styles.earningsValue}>₹60,000 ⌄</Text>
          </View>

          <View style={styles.breakdownList}>
            <View style={styles.itemRow}>
              <Text style={styles.breakdownItem}>Basic Salary</Text>
              <Text style={styles.breakdownValue}>₹42,000</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.breakdownItem}>HRA</Text>
              <Text style={styles.breakdownValue}>₹12,000</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.breakdownItem}>Special Allowance</Text>
              <Text style={styles.breakdownValue}>₹5,000</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.breakdownItem}>Transport Allowance</Text>
              <Text style={styles.breakdownValue}>₹3,000</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.breakdownItem}>Performance Bonus</Text>
              <Text style={styles.breakdownValue}>₹8,000</Text>
            </View>
          </View>
        </View>

        {/* Deduction Card */}
        <View style={styles.deductionCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.deductionsTitle}>↘ Deductions</Text>
            <Text style={styles.deductionsValue}>-₹18,000 ⌄</Text>
          </View>
        </View>

        {/* Net Salary */}
        <View style={styles.netSalaryCard}>
          <Text style={styles.netSalaryTitle}>Net Salary</Text>
          <Text style={styles.netSalaryValue}>₹72,000</Text>
        </View>
      </View>

      {/* Earnings Distribution Pie Chart (placeholder image) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Earnings Distribution</Text>
        <Image
          source={require('../assets/Illustration.png')}
          style={{width: 200, height: 120, alignSelf: 'center'}}
          resizeMode="contain"
        />
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#2D3A8C'}]} />
            <Text>Basic Salary</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#A259FF'}]} />
            <Text>HRA</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#F4C542'}]} />
            <Text>Special Allowance</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#43B97F'}]} />
            <Text>Transport Allowance</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#F24E1E'}]} />
            <Text>Performance Bonus</Text>
          </View>
        </View>
      </View>

      {/* Salary Advance */}
      <View style={styles.sectionCard}>
        <Text style={styles.advTitle}>Active Loan</Text>
        <View style={styles.advRow}>
          <View>
            <Text style={styles.advLabel}>Salary Advance</Text>
            <Text style={styles.advValue}>Remaining Balance</Text>
            <Text style={styles.advAmount}>₹0.00</Text>
          </View>
          <View style={styles.advStatus}>
            <Text style={{color: '#43B97F'}}>On Track</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.advBtn}>
          <Text style={styles.advBtnText}>Apply for Loan or Advance</Text>
        </TouchableOpacity>
      </View>

      {/* Annual Salary Statement & Form 16 */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Annual Salary Statement</Text>
        <View style={styles.rowBetween}>
          <Text>FY 2025-2026</Text>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Form 16</Text>
        <View style={styles.rowBetween}>
          <Text>FY 2025-2026 PART B</Text>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowBetween}>
          <Text>FY 2025-2026 PART A</Text>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* My Claims & Reimbursements */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>My Claims & Reimbursements</Text>

        {/* Balance Card */}
        {/* <View style={styles.claimBalanceCard}>
    <Text style={styles.claimBalanceLabel}>Balance Available</Text>
    <Text style={styles.claimBalanceAmount}>₹28,658</Text>
  </View> */}

        {/* Reimbursement List */}
        <View style={styles.claimListCard}>
          {[
            {label: 'Balance Available', amount: '₹28,658'},
            {label: 'LTA Reimb', amount: '₹12,000'},
            {label: 'Other Reimb', amount: '₹15,220'},
            {label: 'Fuel Reimb', amount: '₹8,000'},
            {label: 'Broadband Reimb', amount: '₹11,658'},
            {label: 'News paper & Periodical', amount: '₹23,000'},
          ].map((item, index) => (
            <View key={index} style={styles.claimRow}>
              <Text style={styles.claimLabel}>{item.label}</Text>
              <Text style={styles.claimAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* CTC Claims */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            marginTop: 18,
            paddingTop: 18,
          }}>
          <Text style={styles.sectionTitle}>My CTC Claims</Text>
        </View>

        <View style={styles.claimTable}>
          <View style={styles.claimTableHeader}>
            <Text style={styles.claimHeaderText}>Claim Date</Text>
            <Text style={styles.claimHeaderText}>Status</Text>
            <Text style={styles.claimHeaderText}>Amount</Text>
          </View>

          {[1, 2, 3].map((item, idx) => (
            <View key={idx} style={styles.claimTableRow}>
              <Text style={styles.claimCell}>16 Feb 2026</Text>

              <Text style={[styles.claimCell, {color: '#16A34A'}]}>
                Approved
              </Text>

              <Text style={styles.claimCell}>₹3,000</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ytdCard: {
    background: 'linear-gradient(155.41deg, #1D4ED8 34.58%, #1B233B 106.73%)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    margin: 16,
  },
  ytdAmount: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#A259FF',
  },
  ytdLabel: {fontSize: 12, color: '#333', textAlign: 'center'},
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 14,
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  deductionCard: {
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
    // backgroundColor: '#EEF8F1',
  },

  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  earningsTitle: {
    color: '#2E9B4B',
    fontWeight: '600',
    fontSize: 13,
  },

  earningsValue: {
    color: '#2E9B4B',
    fontWeight: '700',
    fontSize: 13,
  },
  deductionsTitle: {
    // color: '#D64545',
    fontWeight: '600',
    fontSize: 13,
  },

  deductionsValue: {
    color: '#D64545',
    fontWeight: '700',
    fontSize: 13,
  },
  //   netSalaryTitle: {color: '#2D3A8C', fontWeight: 'bold'},
  netSalaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  breakdownList: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  breakdownItem: {color: '#333', fontSize: 14},
  breakdownValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  netSalaryCard: {
    backgroundColor: '#EAF6FB',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netSalaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  legendRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 10},
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 4,
  },
  legendDot: {width: 12, height: 12, borderRadius: 6, marginRight: 4},
  advTitle: {color: '#2D3A8C', fontWeight: 'bold', marginBottom: 4},
  advRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  advLabel: {color: '#333', fontWeight: 'bold'},
  advValue: {color: '#888', fontSize: 12},
  advAmount: {color: '#2D3A8C', fontWeight: 'bold', fontSize: 16},
  advStatus: {backgroundColor: '#eafaf1', borderRadius: 8, padding: 8},
  advBtn: {
    backgroundColor: '#fff',
    borderColor: '#2D3A8C',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  advBtnText: {color: '#2D3A8C', fontWeight: 'bold'},
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  viewBtn: {
    backgroundColor: '#2D3A8C',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  viewBtnText: {color: '#fff', fontWeight: 'bold'},
  ctcClaimsHeader: {flexDirection: 'row', marginTop: 10, marginBottom: 2},
  ctcClaimsRow: {flexDirection: 'row', marginBottom: 2},
  header: {
    padding: 20,
    backgroundColor: '#4A2C2A',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  headerSubtitle: {color: '#fff', fontSize: 12, marginTop: 4},
  salaryCard: {
    backgroundColor: '#2D3A8C',
    borderRadius: 16,
    margin: 16,
    padding: 20,
  },
  salaryMonth: {color: '#fff', fontSize: 14, marginBottom: 4},
  salaryAmount: {color: '#fff', fontSize: 28, fontWeight: 'bold'},
  salaryLabel: {color: '#fff', fontSize: 12, marginBottom: 12},
  salaryDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  salaryDetailBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  salaryDetailLabel: {color: '#fff', fontSize: 12},
  salaryDetailValue: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  payslipBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  payslipBtnText: {color: '#2D3A8C', fontWeight: 'bold', fontSize: 12},
  ytdRow: {
    marginHorizontal: 16,
    marginVertical: 10,
  },

  ytdCard: {
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  ytdAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },

  ytdLabel: {
    fontSize: 14,
    color: '#333',
  },
  claimBalanceCard: {
    backgroundColor: '#EEF8F1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },

  claimBalanceLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },

  claimBalanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16A34A',
  },

  claimListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  claimRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },

  claimLabel: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },

  claimAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },

  claimTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },

  claimTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  claimHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
  },

  claimTableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
  },

  claimCell: {
    flex: 1,
    fontSize: 13,
    color: '#111',
  },
});

export default PayrollDashboard;
