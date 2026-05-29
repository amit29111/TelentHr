import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DownloadIconButton from '../components/DownloadIconButton';
import ViewIconButton from '../components/ViewIconButton';
import apiClient from '../api/apiClient';
import {ENDPOINT} from '../api/endpoint';
import {downloadAuthenticatedFile} from '../utils/payrollDownload';
import {resolveAnnualStatementId} from '../utils/payrollAnnualStatement';

const money = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const downloadFromEndpoint = async (endpointPath, fileName) => {
  await downloadAuthenticatedFile({
    url: endpointPath,
    fileName,
  });
};

const PayrollDashboard = ({navigation}) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFY, setSelectedFY] = useState('2026-27');
  const [showFyDropdown, setShowFyDropdown] = useState(false);
  const [downloading, setDownloading] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(ENDPOINT.PAYROLL.DASHBOARD);
      const data = res?.data?.data || {};
      setDashboard(data);
      const firstFy = data?.annualSalaryStatements?.[0]?.financialYear;
      if (firstFy) setSelectedFY(firstFy);
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to load payroll dashboard.');
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const fyOptions = useMemo(
    () =>
      (dashboard?.annualSalaryStatements || []).map(i => ({
        key: i.financialYear,
        label: i.label || i.financialYear,
      })),
    [dashboard],
  );

  const current = dashboard?.currentPeriod || {};
  const ytd = dashboard?.yearToDate || {};
  const payStub = dashboard?.currentPayStub || {};
  const claims = dashboard?.claimsAndReimbursements || {};
  const recentPayslips = dashboard?.recentPayslips || [];
  const statements = dashboard?.annualSalaryStatements || [];

  const handleAnnualStatementView = async statement => {
    const fy = statement.financialYear;
    setDownloading(`ANNUAL_${fy}`);
    try {
      const statementId = await resolveAnnualStatementId(fy);
      if (!statementId) {
        if (navigation) {
          navigation.navigate('PayrollSalary', {
            initialAnnualYear: statement.label?.replace(/^FY\s*/i, '') || fy,
          });
          return;
        }
        Alert.alert(
          'Not available',
          'Annual salary statement is not available for this financial year.',
        );
        return;
      }
      await downloadAuthenticatedFile({
        url: ENDPOINT.PAYROLL.SALARY_PDF_DOWNLOAD(statementId),
        fileName: `annual_salary_${fy}.pdf`,
      });
    } catch (e) {
      Alert.alert(
        'Error',
        e?.message || 'Unable to open annual salary statement.',
      );
    } finally {
      setDownloading('');
    }
  };

  const handleForm16Download = async part => {
    const endpointPath =
      part === 'A'
        ? ENDPOINT.PAYROLL.FORM16_PART_A(selectedFY)
        : ENDPOINT.PAYROLL.FORM16_PART_B(selectedFY);
    setDownloading(`FORM16_${part}`);
    try {
      await downloadFromEndpoint(
        endpointPath,
        `form16_part_${part.toLowerCase()}_${selectedFY}.pdf`,
      );
    } catch (e) {
      Alert.alert('Download failed', e?.message || 'Unable to download Form 16.');
    } finally {
      setDownloading('');
    }
  };

  if (loading) {
    return (
      <View style={{padding: 20}}>
        <ActivityIndicator color="#2D3A8C" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.dashboardScroll}
      contentContainerStyle={styles.dashboardScrollContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
      <View style={styles.salaryCard}>
        <Text style={styles.salaryMonth}>{current.month || '—'} {current.year || ''} Salary</Text>
        <Text style={styles.salaryAmount}>{money(current.netPay)}</Text>
        <Text style={styles.salaryLabel}>Net Pay (Take Home)</Text>
        <View style={styles.salaryDetailsRow}>
          <View style={styles.salaryDetailBox}>
            <Text style={styles.salaryDetailLabel}>Gross Salary</Text>
            <Text style={styles.salaryDetailValue}>{money(current.grossEarnings)}</Text>
          </View>
          <View style={styles.salaryDetailBox}>
            <Text style={styles.salaryDetailLabel}>Total Deductions</Text>
            <Text style={styles.salaryDetailValue}>{money(current.totalDeductions)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.ytdRow}>
        <View style={[styles.ytdCard, {backgroundColor: '#DAF5FF80'}]}>
          <Text style={[styles.ytdAmount, {color: '#1D4ED8'}]}>{money(ytd.totalNetPay)}</Text>
          <Text style={styles.ytdLabel}>YTD Net Pay ({ytd.year || '—'})</Text>
        </View>
        <View style={[styles.ytdCard, {backgroundColor: '#D0002817'}]}>
          <Text style={[styles.ytdAmount, {color: '#D00028'}]}>{money(ytd.totalDeductions)}</Text>
          <Text style={[styles.ytdLabel, {color: '#D00028'}]}>YTD Deductions</Text>
        </View>
        <View style={[styles.ytdCard, {backgroundColor: '#BF5AF221'}]}>
          <Text style={[styles.ytdAmount, {color: '#9207D8'}]}>{money(ytd.totalGross)}</Text>
          <Text style={[styles.ytdLabel, {color: '#9207D8'}]}>YTD Gross</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Salary Breakdown</Text>
        <View style={styles.earningsCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.earningsTitle}>↗ Earnings</Text>
            <Text style={styles.earningsValue}>{money(payStub.grossPay)}</Text>
          </View>
          <View style={styles.breakdownList}>
            {(payStub.earnings || []).map((i, idx) => (
              <View style={styles.itemRow} key={`e-${idx}`}>
                <Text style={styles.breakdownItem}>{i.componentName}</Text>
                <Text style={styles.breakdownValue}>{money(i.amount)}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.deductionCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.deductionsTitle}>↘ Deductions</Text>
            <Text style={styles.deductionsValue}>{money(payStub.totalDeductions)}</Text>
          </View>
          {(payStub.deductions || []).map((i, idx) => (
            <View style={styles.itemRow} key={`d-${idx}`}>
              <Text style={styles.breakdownItem}>{i.componentName}</Text>
              <Text style={styles.breakdownValue}>{money(i.amount)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.netSalaryCard}>
          <Text style={styles.netSalaryTitle}>Net Salary</Text>
          <Text style={styles.netSalaryValue}>{money(payStub.netPay)}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Annual Salary Statement</Text>
        {statements.length === 0 ? (
          <Text style={styles.emptyHint}>No annual salary statement available.</Text>
        ) : (
          statements.map((s, idx) => (
            <View style={styles.rowBetween} key={`st-${idx}`}>
              <View style={styles.statementInfo}>
                <Text style={styles.statementLabel}>{s.label || s.financialYear}</Text>
                {s.totalNet != null ? (
                  <Text style={styles.statementMeta}>
                    Net: {money(s.totalNet)} · {s.payrollCount || 0} payslips
                  </Text>
                ) : null}
              </View>
              <ViewIconButton
                loading={downloading === `ANNUAL_${s.financialYear}`}
                onPress={() => handleAnnualStatementView(s)}
              />
            </View>
          ))
        )}

        <Text style={[styles.sectionTitle, {marginTop: 12}]}>Form 16</Text>
        <View style={styles.dropdownWrap}>
          <TouchableOpacity
            style={styles.fyPicker}
            onPress={() => setShowFyDropdown(!showFyDropdown)}>
            <Text style={styles.fyPickerText} numberOfLines={1}>
              FY : {selectedFY}
            </Text>
            <Text style={styles.fyArrow}>{showFyDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showFyDropdown && (
            <View style={styles.dropdown}>
              <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                {fyOptions.map(f => (
                  <TouchableOpacity
                    key={f.key}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedFY(f.key);
                      setShowFyDropdown(false);
                    }}>
                    <Text style={styles.dropdownItemText}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.partLabel}>Part B</Text>
          <DownloadIconButton
            loading={downloading === 'FORM16_B'}
            onPress={() => handleForm16Download('B')}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.partLabel}>Part A</Text>
          <DownloadIconButton
            loading={downloading === 'FORM16_A'}
            onPress={() => handleForm16Download('A')}
          />
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>My Claims & Reimbursements</Text>
        <View style={styles.claimListCard}>
          <View style={styles.claimRow}>
            <Text style={styles.claimLabel}>Balance Available</Text>
            <Text style={styles.claimAmount}>{money(claims.balanceAvailable)}</Text>
          </View>
          <View style={styles.claimRow}>
            <Text style={styles.claimLabel}>Monthly CTC</Text>
            <Text style={styles.claimAmount}>{money(claims.ctcBreakdown?.monthlyCTC)}</Text>
          </View>
          <View style={styles.claimRow}>
            <Text style={styles.claimLabel}>Annual CTC</Text>
            <Text style={styles.claimAmount}>{money(claims.ctcBreakdown?.annualCTC)}</Text>
          </View>
        </View>

        <View style={{borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 18, paddingTop: 18}}>
          <Text style={styles.sectionTitle}>Recent Payslips</Text>
        </View>
        <View style={styles.claimTable}>
          <View style={styles.claimTableHeader}>
            <Text style={styles.claimHeaderText}>Month</Text>
            <Text style={styles.claimHeaderText}>Status</Text>
            <Text style={styles.claimHeaderText}>Net Pay</Text>
          </View>
          {recentPayslips.map((p, idx) => (
            <View key={idx} style={styles.claimTableRow}>
              <Text style={styles.claimCell}>{p.month} {p.year}</Text>
              <Text style={[styles.claimCell, {color: '#16A34A'}]}>{p.payStatus}</Text>
              <Text style={styles.claimCell}>{money(p.netPay)}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dashboardScroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dashboardScrollContent: {
    paddingBottom: 20,
  },
  sectionCard: {backgroundColor: '#FFFFFF', borderRadius: 18, margin: 16, padding: 16},
  sectionTitle: {fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 14},
  salaryCard: {backgroundColor: '#2D3A8C', borderRadius: 16, margin: 16, padding: 20},
  salaryMonth: {color: '#fff', fontSize: 14, marginBottom: 4},
  salaryAmount: {color: '#fff', fontSize: 28, fontWeight: 'bold'},
  salaryLabel: {color: '#fff', fontSize: 12, marginBottom: 12},
  salaryDetailsRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16},
  salaryDetailBox: {backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 10, flex: 1, marginHorizontal: 4},
  salaryDetailLabel: {color: '#fff', fontSize: 12},
  salaryDetailValue: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  ytdRow: {marginHorizontal: 16, marginVertical: 10},
  ytdCard: {borderRadius: 14, paddingVertical: 18, paddingHorizontal: 16, marginBottom: 12},
  ytdAmount: {fontSize: 24, fontWeight: '700', marginBottom: 6},
  ytdLabel: {fontSize: 14, color: '#333'},
  earningsCard: {backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', marginBottom: 12},
  deductionCard: {backgroundColor: '#FDECEC', borderRadius: 12, padding: 14, marginBottom: 12},
  breakdownHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 4},
  earningsTitle: {color: '#2E9B4B', fontWeight: '600', fontSize: 13},
  earningsValue: {color: '#2E9B4B', fontWeight: '700', fontSize: 13},
  deductionsTitle: {fontWeight: '600', fontSize: 13},
  deductionsValue: {color: '#D64545', fontWeight: '700', fontSize: 13},
  breakdownList: {paddingHorizontal: 14, paddingVertical: 10},
  itemRow: {flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6},
  breakdownItem: {color: '#333', fontSize: 14},
  breakdownValue: {fontSize: 13, fontWeight: '600', color: '#111'},
  netSalaryCard: {backgroundColor: '#EAF6FB', borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  netSalaryTitle: {fontSize: 14, fontWeight: '600', color: '#111'},
  netSalaryValue: {fontSize: 16, fontWeight: '700', color: '#2563EB'},
  rowBetween: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 6},
  statementInfo: {flex: 1, paddingRight: 10},
  statementLabel: {fontSize: 13, fontWeight: '600', color: '#111'},
  statementMeta: {fontSize: 11, color: '#6B7280', marginTop: 2},
  emptyHint: {fontSize: 12, color: '#6B7280', marginBottom: 8},
  partLabel: {fontSize: 13, color: '#111'},
  dropdownWrap: {alignSelf: 'flex-start', maxWidth: '70%', marginBottom: 8, zIndex: 20},
  fyPicker: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 140,
  },
  fyPickerText: {fontSize: 12, fontWeight: '600', color: '#111', flex: 1, marginRight: 6},
  fyArrow: {fontSize: 10, color: '#666'},
  dropdown: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    elevation: 8,
    zIndex: 30,
  },
  dropdownScroll: {maxHeight: 120},
  dropdownItem: {paddingHorizontal: 10, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#EEE'},
  dropdownItemText: {fontSize: 12, color: '#111'},
  claimListCard: {backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10},
  claimRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB'},
  claimLabel: {fontSize: 13, color: '#555', flex: 1},
  claimAmount: {fontSize: 13, fontWeight: '600', color: '#111'},
  claimTable: {backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden'},
  claimTableHeader: {flexDirection: 'row', backgroundColor: '#F3F4F6', paddingVertical: 12, paddingHorizontal: 14},
  claimHeaderText: {flex: 1, fontSize: 12, fontWeight: '700', color: '#555'},
  claimTableRow: {flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 14, borderTopWidth: 0.5, borderTopColor: '#E5E7EB'},
  claimCell: {flex: 1, fontSize: 13, color: '#111'},
});

export default PayrollDashboard;
