import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

import PayrollTabs from './PayrollTabs';
import PayslipDetailModal from './PayslipDetailModal';
import apiClient from '../api/apiClient';
import {ENDPOINT} from '../api/endpoint';

const PAYSLIP_YEARS = ['2021', '2022', '2023', '2024', '2025', '2026'];
const FINANCIAL_YEARS = [
  '2021-2022',
  '2022-2023',
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
];

/** Calendar year dropdown → FY string for API e.g. 2026 → 2025-2026 */
const toFinancialYearParam = value => {
  if (!value) return '';
  if (String(value).includes('-')) return value;
  const y = Number(value);
  if (Number.isNaN(y)) return value;
  return `${y - 1}-${y}`;
};

const fyQueryVariants = value => {
  const full = toFinancialYearParam(value);
  const m = full.match(/^(\d{4})-(\d{4})$/);
  const short = m ? `${m[1]}-${m[2].slice(-2)}` : null;
  return [...new Set([full, short].filter(Boolean))];
};

/** Calendar year from payslip record (for client-side filter when API returns all rows) */
const getPayslipCalendarYear = item => {
  const date = getPayslipDate(item);
  if (date) {
    const d = new Date(date);
    if (!Number.isNaN(d.getTime())) return String(d.getFullYear());
  }
  if (item?.year != null && String(item.year) !== '—') {
    return String(item.year);
  }
  const period =
    item?.payPeriod ||
    item?.pay_period ||
    item?.period ||
    item?.monthYear ||
    item?.payMonth ||
    '';
  const fromPeriod = String(period).match(/\b(20\d{2})\b/);
  if (fromPeriod) return fromPeriod[1];
  return '';
};

const filterPayslipsByCalendarYear = (items, calendarYear) => {
  const target = String(calendarYear);
  return items.filter(item => getPayslipCalendarYear(item) === target);
};

const financialYearTokens = value => {
  const full = toFinancialYearParam(value);
  const m = full.match(/^(\d{4})-(\d{4})$/);
  const short = m ? `${m[1]}-${m[2].slice(-2)}` : full;
  return [...new Set([full, short, value].filter(Boolean))];
};

const filterAnnualByFinancialYear = (items, financialYear) => {
  if (!items.length) return [];
  const tokens = financialYearTokens(financialYear);
  const hasAnyFy = items.some(
    item => item?.financialYear || item?.financial_year || item?.fy,
  );
  if (!hasAnyFy) return items;
  return items.filter(item => {
    const itemFy = String(
      item?.financialYear || item?.financial_year || item?.fy || '',
    ).trim();
    if (!itemFy) return false;
    return tokens.some(t => itemFy === t || itemFy.includes(t));
  });
};

const getErrorMessage = error =>
  error?.response?.data?.message ||
  error?.message ||
  'Request failed. Please try again.';

const BASE_URL = 'https://uat-backend-hrms.ezcompliance.in/';

const getPayslipDate = item =>
  item?.payDate ||
  item?.pay_date ||
  item?.periodEnd ||
  item?.periodStart ||
  item?.period ||
  item?.paymentDate ||
  item?.monthYear ||
  item?.payMonth;

const isPayslipRecord = item => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
  return Boolean(
    item._id ||
      item.payslipId ||
      item.id ||
      item.payDate ||
      item.pay_date ||
      item.payPeriod ||
      item.period ||
      item.monthYear ||
      item.payMonth ||
      item.netPay != null ||
      item.netSalary != null ||
      item.grossPay != null ||
      item.grossSalary != null ||
      item.earnings ||
      item.deductions,
  );
};

const extractArray = payload => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  if (payload.data && typeof payload.data === 'object') {
    for (const key of [
      'payslips',
      'paySlips',
      'myPayslips',
      'list',
      'records',
      'items',
      'result',
      'annualStatements',
      'statements',
      'salaryStatements',
    ]) {
      if (Array.isArray(payload.data[key])) return payload.data[key];
    }
  }
  for (const key of ['payslips', 'paySlips', 'myPayslips', 'list', 'records']) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
};

const extractPayslipList = payload => {
  const list = extractArray(payload).filter(isPayslipRecord);
  if (list.length) return list;

  const root = payload?.data ?? payload;
  if (root && typeof root === 'object' && !Array.isArray(root)) {
    const values = Object.values(root).filter(isPayslipRecord);
    if (values.length) return values;
  }
  return [];
};

const extractAnnualStatements = payload => extractArray(payload).filter(item => item && typeof item === 'object');

const formatCurrency = value => {
  const num = Number(value);
  if (Number.isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
};

const formatDate = value => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const mapPayslip = (item, index) => {
  const date = getPayslipDate(item);
  const dateObj = date ? new Date(date) : null;
  const parsedYear = dateObj && !Number.isNaN(dateObj.getTime()) ? String(dateObj.getFullYear()) : '';
  const month =
    item.month ||
    item.monthName ||
    item.payMonth ||
    item.monthYear?.split(' ')[0] ||
    (dateObj && !Number.isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-IN', {month: 'short'})
      : '—');
  const year = String(item.year || parsedYear || '—');

  return {
    id: item._id || item.id || item.payslipId || String(index),
    payPeriod:
      item.payPeriod ||
      item.pay_period ||
      item.period ||
      item.monthYear ||
      `${month} ${year}`,
    month,
    year,
    grossPay: formatCurrency(
      item.grossPay ?? item.gross_pay ?? item.grossSalary ?? item.gross,
    ),
    grossEarnings: formatCurrency(
      item.grossPay ?? item.gross_pay ?? item.grossSalary ?? item.gross,
    ),
    deduction: formatCurrency(
      item.deduction ??
        item.totalDeduction ??
        item.totalDeductions ??
        item.deductions,
    ),
    totalDeductions: formatCurrency(
      item.deduction ??
        item.totalDeduction ??
        item.totalDeductions ??
        item.deductions,
    ),
    netPay: formatCurrency(
      item.netPay ?? item.net_pay ?? item.netSalary ?? item.net,
    ),
    workingDays: item.workingDays ?? item.totalWorkingDays ?? item.daysWorked ?? '—',
    status: item.status || item.paymentStatus || 'Paid',
    payDate: formatDate(date),
    raw: item,
  };
};

const mapAnnualStatement = (item, index, financialYear) => ({
  id: item._id || item.id || item.statementId || String(index),
  label:
    item.financialYear ||
    item.financial_year ||
    item.fy ||
    item.title ||
    `FY ${financialYear}`,
  raw: item,
});

const downloadSalaryPdf = async payslipId => {
  const authToken = await AsyncStorage.getItem('authToken');
  const orgId = await AsyncStorage.getItem('orgId');
  if (!authToken) {
    throw new Error('Please login again to download.');
  }

  const fileName = `salary_statement_${payslipId}.pdf`;
  const destPath =
    Platform.OS === 'ios'
      ? `${RNFS.DocumentDirectoryPath}/${fileName}`
      : `${RNFS.DownloadDirectoryPath}/${fileName}`;

  const url = `${BASE_URL}${ENDPOINT.PAYROLL.SALARY_PDF_DOWNLOAD(payslipId)}`;

  const result = await RNFS.downloadFile({
    fromUrl: url,
    toFile: destPath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...(orgId ? {org_uuid: orgId} : {}),
    },
  }).promise;

  if (result.statusCode !== 200) {
    throw new Error('Unable to download file.');
  }

  return destPath;
};

const PayrollSalary = ({navigation}) => {
  const [showPayslipYearDropdown, setShowPayslipYearDropdown] = useState(false);
  const [showAnnualYearDropdown, setShowAnnualYearDropdown] = useState(false);
  const [selectedPayslipYear, setSelectedPayslipYear] = useState('2026');
  const [selectedAnnualYear, setSelectedAnnualYear] = useState('2026-2027');
  const [loadedPayslipYear, setLoadedPayslipYear] = useState('');
  const [loadedAnnualYear, setLoadedAnnualYear] = useState('');
  const [payslips, setPayslips] = useState([]);
  const [annualStatements, setAnnualStatements] = useState([]);
  const [loadingPayslips, setLoadingPayslips] = useState(true);
  const [loadingAnnual, setLoadingAnnual] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [payslipModalVisible, setPayslipModalVisible] = useState(false);
  const [selectedPayslipRaw, setSelectedPayslipRaw] = useState(null);

  const fetchPayslips = useCallback(async (year, isRefresh = false) => {
    if (!year) return;
    if (isRefresh) setRefreshing(true);
    setLoadingPayslips(true);
    setLoadedPayslipYear('');
    setPayslips([]);
    let lastError = null;
    try {
      for (const fy of fyQueryVariants(year)) {
        try {
          const res = await apiClient.get(ENDPOINT.PAYROLL.MY_PAYSLIPS(fy));
          const rawList = extractPayslipList(res?.data ?? {});
          const list = filterPayslipsByCalendarYear(rawList, year);
          setPayslips(list.map(mapPayslip));
          setLoadedPayslipYear(year);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
        }
      }
      if (lastError) {
        setPayslips([]);
        setLoadedPayslipYear(year);
        Alert.alert('Error', getErrorMessage(lastError));
      }
    } finally {
      setLoadingPayslips(false);
      setRefreshing(false);
    }
  }, []);

  const fetchAnnualStatements = useCallback(async (financialYear, silent = false) => {
    if (!financialYear) return;
    setLoadingAnnual(true);
    setLoadedAnnualYear('');
    setAnnualStatements([]);
    let lastError = null;
    try {
      for (const fy of fyQueryVariants(financialYear)) {
        try {
          const res = await apiClient.get(
            ENDPOINT.PAYROLL.ANNUAL_SALARY_STATEMENT(fy),
          );
          const rawList = extractAnnualStatements(res?.data ?? {});
          const list = filterAnnualByFinancialYear(rawList, financialYear);
          setAnnualStatements(
            list.map((item, idx) => mapAnnualStatement(item, idx, financialYear)),
          );
          setLoadedAnnualYear(financialYear);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
        }
      }
      if (lastError) {
        setAnnualStatements([]);
        setLoadedAnnualYear(financialYear);
        if (!silent) {
          Alert.alert('Error', getErrorMessage(lastError));
        }
      }
    } finally {
      setLoadingAnnual(false);
    }
  }, []);

  const loadSalaryData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      await Promise.allSettled([
        fetchPayslips(selectedPayslipYear, isRefresh),
        fetchAnnualStatements(selectedAnnualYear, true),
      ]);
    },
    [
      selectedPayslipYear,
      selectedAnnualYear,
      fetchPayslips,
      fetchAnnualStatements,
    ],
  );

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      loadSalaryData();
    });
    return unsub;
  }, [navigation, loadSalaryData]);

  const handlePayslipYearSelect = year => {
    setSelectedPayslipYear(year);
    setShowPayslipYearDropdown(false);
    fetchPayslips(year);
  };

  const handleAnnualYearSelect = year => {
    setSelectedAnnualYear(year);
    setShowAnnualYearDropdown(false);
    fetchAnnualStatements(year);
  };

  const handleViewPayslip = payslip => {
    setSelectedPayslipRaw(payslip.raw);
    setPayslipModalVisible(true);
  };

  const handleDownloadAnnual = async statementId => {
    if (!statementId) {
      Alert.alert('Error', 'Statement ID not found.');
      return;
    }

    setDownloadingId(statementId);
    try {
      const filePath = await downloadSalaryPdf(statementId);
      const fileUrl = Platform.OS === 'android' ? `file://${filePath}` : filePath;

      try {
        await Share.share({
          url: fileUrl,
          title: 'Annual Salary Statement',
        });
      } catch {
        Alert.alert(
          'Downloaded',
          Platform.OS === 'android'
            ? `Saved to Downloads/${filePath.split('/').pop()}`
            : 'File saved successfully.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Download failed',
        error?.message || 'Could not download. Please try again.',
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusStyle = status => {
    const s = (status || '').toLowerCase();
    if (s.includes('paid') || s.includes('approv') || s.includes('process')) {
      return {borderColor: '#22C55E', color: '#22C55E'};
    }
    if (s.includes('pending')) {
      return {borderColor: '#F59E0B', color: '#F59E0B'};
    }
    return {borderColor: '#6B7280', color: '#6B7280'};
  };

  const showPayslipContent = !loadingPayslips && loadedPayslipYear === selectedPayslipYear;
  const showAnnualContent = !loadingAnnual && loadedAnnualYear === selectedAnnualYear;

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              fetchPayslips(selectedPayslipYear, true);
              fetchAnnualStatements(selectedAnnualYear);
            }}
          />
        }>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Salary</Text>
          <View style={{width: 24}} />
        </View>

        <PayrollTabs navigation={navigation} activeTab="Salary" />

        <View style={styles.yearContainer}>
          <TouchableOpacity
            style={styles.yearDropdown}
            onPress={() => setShowPayslipYearDropdown(!showPayslipYearDropdown)}>
            <Text style={styles.yearText}>Year : {selectedPayslipYear}</Text>
            <Text style={styles.arrow}>{showPayslipYearDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showPayslipYearDropdown && (
            <View style={styles.dropdownBox}>
              {PAYSLIP_YEARS.map(year => (
                <TouchableOpacity
                  key={year}
                  style={styles.dropdownItem}
                  onPress={() => handlePayslipYearSelect(year)}>
                  <Text style={styles.dropdownText}>{year}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {loadingPayslips && !refreshing ? (
          <ActivityIndicator
            size="large"
            color="#2952E3"
            style={{marginTop: 40, marginBottom: 40}}
          />
        ) : showPayslipContent ? (
          <View style={styles.contentSection}>
            {payslips.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No record found for year {selectedPayslipYear}
                </Text>
              </View>
            ) : (
              payslips.map((item, index) => {
                const statusStyle = getStatusStyle(item.status);
                return (
                  <View key={item.id || index} style={styles.card}>
                    <View style={styles.topRow}>
                      <View style={styles.topCol}>
                        <Text style={styles.label}>Pay Period</Text>
                        <Text style={styles.value}>{item.payPeriod}</Text>
                      </View>
                      <View style={styles.topCol}>
                        <Text style={styles.label}>Pay Date</Text>
                        <Text style={styles.value}>{item.payDate}</Text>
                      </View>
                      <View
                        style={[
                          styles.badge,
                          {borderColor: statusStyle.borderColor},
                        ]}>
                        <Text style={[styles.badgeText, {color: statusStyle.color}]}>
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bottomRow}>
                      <View>
                        <Text style={styles.smallLabel}>Hours</Text>
                        <Text style={styles.smallValue}>{item.workingDays}</Text>
                      </View>
                      <View>
                        <Text style={styles.smallLabel}>Gross Pay</Text>
                        <Text style={styles.smallValue}>{item.grossPay}</Text>
                      </View>
                      <View>
                        <Text style={styles.smallLabel}>Deduction</Text>
                        <Text style={styles.smallValue}>{item.deduction}</Text>
                      </View>
                      <View>
                        <Text style={styles.smallLabel}>Net Pay</Text>
                        <Text style={styles.smallValue}>{item.netPay}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.payslipViewBtn}
                      onPress={() => handleViewPayslip(item)}>
                      <Text style={styles.viewBtnText}>View</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}

            <Text style={styles.sectionTitle}>Annual Salary Statement</Text>
            <View style={styles.yearContainer}>
              <TouchableOpacity
                style={styles.yearDropdown}
                onPress={() => setShowAnnualYearDropdown(!showAnnualYearDropdown)}>
                <Text style={styles.yearText}>Financial Year : {selectedAnnualYear}</Text>
                <Text style={styles.arrow}>{showAnnualYearDropdown ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {showAnnualYearDropdown && (
                <View style={styles.dropdownBoxUp}>
                  {FINANCIAL_YEARS.map(year => (
                    <TouchableOpacity
                      key={year}
                      style={styles.dropdownItem}
                      onPress={() => handleAnnualYearSelect(year)}>
                      <Text style={styles.dropdownText}>{year}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {loadingAnnual ? (
              <ActivityIndicator size="small" color="#2952E3" style={{marginVertical: 10}} />
            ) : showAnnualContent && annualStatements.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No record found for financial year {selectedAnnualYear}
                </Text>
              </View>
            ) : showAnnualContent ? (
              annualStatements.map((item, index) => (
                <View key={item.id || index} style={styles.statementCard}>
                  <Text style={styles.statementText}>{item.label}</Text>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => handleDownloadAnnual(item.id)}
                    disabled={downloadingId === item.id}>
                    {downloadingId === item.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.viewBtnText}>Download</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <PayslipDetailModal
        visible={payslipModalVisible}
        payslip={selectedPayslipRaw}
        onClose={() => {
          setPayslipModalVisible(false);
          setSelectedPayslipRaw(null);
        }}
      />
    </>
  );
};

export default PayrollSalary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1F1',
  },
  scrollContent: {
    paddingBottom: 110,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  yearContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 16,
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
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 10,
    zIndex: 9999,
    paddingVertical: 6,
  },
  dropdownBoxUp: {
    position: 'absolute',
    bottom: 52,
    left: 16,
    right: 16,
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
  contentSection: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 14,
    color: '#111',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
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
  topCol: {
    flex: 1,
    marginRight: 6,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
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
    flex: 1,
    marginRight: 10,
  },
  viewBtn: {
    backgroundColor: '#2952E3',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  payslipViewBtn: {
    backgroundColor: '#2952E3',
    alignSelf: 'flex-end',
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
  },
});
