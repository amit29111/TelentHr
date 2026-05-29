import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Share,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Feather from 'react-native-vector-icons/Feather';

import PayrollTabs from './PayrollTabs';
import apiService from '../api/apiService';
import {ENDPOINT} from '../api/endpoint';
import {
  toApiFinancialYear,
  toShortFinancialYear,
  toDisplayFinancialYear,
  extractDeclaration,
  sumAmounts,
  declarationHasContent,
  fetchTdsDeclaration,
} from './DeclareInvestments';

const BASE_URL = 'https://uat-backend-hrms.ezcompliance.in/';

const extractTaxReport = payload => payload?.data || payload;
const extractForm16 = payload => payload?.data || payload;

const fyVariants = year =>
  [
    toShortFinancialYear(toApiFinancialYear(year)),
    toApiFinancialYear(year),
    year,
  ].filter((v, i, arr) => v && arr.indexOf(v) === i);

const formatGeneratedOn = value => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const downloadTaxReportFile = async financialYear => {
  const authToken = await AsyncStorage.getItem('authToken');
  const orgId = await AsyncStorage.getItem('orgId');
  if (!authToken) throw new Error('Please login again.');

  const fileName = `tax_report_${financialYear}_${Date.now()}.pdf`;
  const destPath =
    Platform.OS === 'ios'
      ? `${RNFS.DocumentDirectoryPath}/${fileName}`
      : `${RNFS.DownloadDirectoryPath}/${fileName}`;

  const result = await RNFS.downloadFile({
    fromUrl: `${BASE_URL}${ENDPOINT.PAYROLL.TDS_TAX_REPORT_DOWNLOAD(financialYear)}`,
    toFile: destPath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...(orgId ? {org_uuid: orgId} : {}),
    },
  }).promise;

  if (result.statusCode !== 200) throw new Error('Download failed.');
  const fileUrl = Platform.OS === 'android' ? `file://${destPath}` : destPath;
  await Share.share({url: fileUrl, title: 'Tax Report'});
};

const downloadForm16File = async financialYear => {
  const authToken = await AsyncStorage.getItem('authToken');
  const orgId = await AsyncStorage.getItem('orgId');
  if (!authToken) throw new Error('Please login again.');

  const fileName = `form16_${financialYear}_${Date.now()}.pdf`;
  const destPath =
    Platform.OS === 'ios'
      ? `${RNFS.DocumentDirectoryPath}/${fileName}`
      : `${RNFS.DownloadDirectoryPath}/${fileName}`;

  const result = await RNFS.downloadFile({
    fromUrl: `${BASE_URL}${ENDPOINT.PAYROLL.FORM16_DOWNLOAD(financialYear)}`,
    toFile: destPath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...(orgId ? {org_uuid: orgId} : {}),
    },
  }).promise;

  if (result.statusCode !== 200) throw new Error('Download failed.');
  const fileUrl = Platform.OS === 'android' ? `file://${destPath}` : destPath;
  await Share.share({url: fileUrl, title: 'Form 16'});
};

const taxationTabs = [
  'Investment Declaration',
  'Proof of Investment',
  'Tax Report',
  'Form 16',
];

const financialYears = [
  '2022-2023',
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
];

const hasDeclarationData = data => declarationHasContent(extractDeclaration(data));

const PayrollTaxation = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Investment Declaration');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2026-2027');
  const [declaration, setDeclaration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [taxReport, setTaxReport] = useState(null);
  const [taxReportLoading, setTaxReportLoading] = useState(false);
  const [taxReportRefreshing, setTaxReportRefreshing] = useState(false);
  const [downloadingTaxReport, setDownloadingTaxReport] = useState(false);
  const [form16, setForm16] = useState(null);
  const [form16Loading, setForm16Loading] = useState(false);
  const [form16Refreshing, setForm16Refreshing] = useState(false);
  const [downloadingForm16, setDownloadingForm16] = useState(false);

  const showActionButton =
    activeTab === 'Investment Declaration' ||
    activeTab === 'Proof of Investment';

  const loadDeclaration = useCallback(async (year, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const empId = await AsyncStorage.getItem('empId');
      if (!empId) {
        setDeclaration(null);
        return;
      }
      const {response} = await fetchTdsDeclaration(empId, year);
      setDeclaration(response);
    } catch {
      setDeclaration(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadTaxReport = useCallback(async (year, silent = false) => {
    if (!silent) setTaxReportLoading(true);
    try {
      let report = null;
      for (const fy of fyVariants(year)) {
        try {
          const response = await apiService.getTaxReport(fy);
          const data = extractTaxReport(response);
          if (data?.employee || data?.financialYear) {
            report = data;
            break;
          }
        } catch {
          // try next format
        }
      }
      setTaxReport(report);
    } catch {
      setTaxReport(null);
    } finally {
      setTaxReportLoading(false);
      setTaxReportRefreshing(false);
    }
  }, []);

  const loadForm16 = useCallback(async (year, silent = false) => {
    if (!silent) setForm16Loading(true);
    try {
      let data = null;
      for (const fy of fyVariants(year)) {
        try {
          const response = await apiService.getForm16(fy);
          const parsed = extractForm16(response);
          if (parsed?.employeeDetails || parsed?.financialYear) {
            data = parsed;
            break;
          }
        } catch {
          // try next format
        }
      }
      setForm16(data);
    } catch {
      setForm16(null);
    } finally {
      setForm16Loading(false);
      setForm16Refreshing(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'Investment Declaration') {
      loadDeclaration(selectedYear);
    } else if (activeTab === 'Tax Report') {
      loadTaxReport(selectedYear);
    } else if (activeTab === 'Form 16') {
      loadForm16(selectedYear);
    }
  }, [selectedYear, activeTab, loadDeclaration, loadTaxReport, loadForm16]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      if (activeTab === 'Investment Declaration') {
        loadDeclaration(selectedYear, true);
      } else if (activeTab === 'Tax Report') {
        loadTaxReport(selectedYear, true);
      } else if (activeTab === 'Form 16') {
        loadForm16(selectedYear, true);
      }
    });
    return unsub;
  }, [
    navigation,
    selectedYear,
    activeTab,
    loadDeclaration,
    loadTaxReport,
    loadForm16,
  ]);

  const handleYearSelect = year => {
    setSelectedYear(year);
    setShowYearDropdown(false);
  };

  const openDeclareScreen = () => {
    navigation.navigate('DeclareInvestments', {
      financialYear: toApiFinancialYear(selectedYear),
      displayYear: toApiFinancialYear(selectedYear),
    });
  };

  const handleActionPress = () => {
    if (activeTab === 'Investment Declaration') {
      openDeclareScreen();
    } else if (activeTab === 'Proof of Investment') {
      navigation.navigate('ProofOfInvestments', {
        mode: 'proof',
        financialYear: toApiFinancialYear(selectedYear),
        displayYear: toApiFinancialYear(selectedYear),
      });
    }
  };

  const onRefresh = () => {
    if (activeTab === 'Tax Report') {
      setTaxReportRefreshing(true);
      loadTaxReport(selectedYear, true);
      return;
    }
    if (activeTab === 'Form 16') {
      setForm16Refreshing(true);
      loadForm16(selectedYear, true);
      return;
    }
    setRefreshing(true);
    loadDeclaration(selectedYear, true);
  };

  const handleTaxReportDownload = async () => {
    setDownloadingTaxReport(true);
    try {
      const fy = toShortFinancialYear(toApiFinancialYear(selectedYear));
      await downloadTaxReportFile(fy);
    } catch (error) {
      Alert.alert('Download failed', error?.message || 'Could not download tax report.');
    } finally {
      setDownloadingTaxReport(false);
    }
  };

  const handleForm16Download = async () => {
    setDownloadingForm16(true);
    try {
      const fy = toShortFinancialYear(toApiFinancialYear(selectedYear));
      await downloadForm16File(fy);
    } catch (error) {
      Alert.alert('Download failed', error?.message || 'Could not download Form 16.');
    } finally {
      setDownloadingForm16(false);
    }
  };

  const decl = extractDeclaration(declaration);
  const it = decl?.itDeclaration || {};
  const total80C = sumAmounts(decl?.investments80C);
  const total80D = sumAmounts(decl?.investments80D);
  const declared = hasDeclarationData(declaration);

  const renderInvestmentSummary = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#2952E3" />
        </View>
      );
    }

    if (!declared) {
      return (
        <View style={styles.emptyState}>
          <Feather name="file-text" size={40} color="#C8A8A8" />
          <Text style={styles.emptyTitle}>No Declaration Yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap "Declare Investments" above to start your investment declaration
            for FY {selectedYear}.
          </Text>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.summaryHeader}>
          <Feather name="check-circle" size={18} color="#16A34A" />
          <Text style={styles.summaryTitle}>Declaration Submitted</Text>
        </View>
        <Text style={styles.summaryFy}>
          Financial Year: {toDisplayFinancialYear(decl?.financialYear) || selectedYear}
        </Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>80C Total</Text>
            <Text style={styles.summaryValue}>₹{total80C.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>80D Total</Text>
            <Text style={styles.summaryValue}>₹{total80D.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Rented House</Text>
            <Text style={styles.summaryValue}>
              {it.stayingInRentedHouse ? 'Yes' : 'No'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Home Loan</Text>
            <Text style={styles.summaryValue}>
              {it.homeLoanSelfOccupied?.enabled ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editLink} onPress={openDeclareScreen}>
          <Text style={styles.editLinkText}>Edit Declaration →</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTaxReport = () => {
    if (taxReportLoading && !taxReportRefreshing) {
      return (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#2952E3" />
        </View>
      );
    }

    if (!taxReport?.employee) {
      return (
        <View style={styles.emptyState}>
          <Feather name="file-text" size={40} color="#C8A8A8" />
          <Text style={styles.emptyTitle}>No Tax Report</Text>
          <Text style={styles.emptySubtitle}>
            Tax report for FY {selectedYear} is not available yet.
          </Text>
        </View>
      );
    }

    const emp = taxReport.employee;
    const isGenerated = Boolean(taxReport.tdsCalculated || taxReport.generatedOn);
    const statusText = isGenerated ? 'Generated' : 'Pending';
    const fyLabel =
      taxReport.financialYearLabel ||
      taxReport.financialYear ||
      toDisplayFinancialYear(selectedYear);

    return (
      <View>
        <Text style={styles.taxReportHeading}>Tax Report</Text>
        <Text style={styles.taxReportSubheading}>
          View and download generated tax report documents
        </Text>

        <View style={styles.taxReportCard}>
          <View style={styles.taxReportCardHeader}>
            <Text style={styles.taxColLabel}>EMPLOYEE</Text>
            <Text style={styles.taxColLabel}>FINANCIAL YEAR</Text>
          </View>
          <View style={styles.taxReportRow}>
            <View style={styles.taxEmployeeCol}>
              <Text style={styles.taxEmployeeName}>
                {emp.employeeName || '—'}
              </Text>
              <Text style={styles.taxEmployeeRole}>
                {emp.designation || emp.employeeCode || ''}
              </Text>
            </View>
            <Text style={styles.taxFyValue}>{fyLabel}</Text>
          </View>

          <View style={styles.taxDivider} />

          <View style={styles.taxMetaGrid}>
            <View style={styles.taxMetaItem}>
              <Text style={styles.taxMetaLabel}>ASSESSMENT YEAR</Text>
              <Text style={styles.taxMetaValue}>
                {taxReport.assessmentYear || '—'}
              </Text>
            </View>
            <View style={styles.taxMetaItem}>
              <Text style={styles.taxMetaLabel}>GENERATED ON</Text>
              <Text style={styles.taxMetaValue}>
                {formatGeneratedOn(taxReport.generatedOn)}
              </Text>
            </View>
          </View>

          <View style={styles.taxFooterRow}>
            <View>
              <Text style={styles.taxMetaLabel}>STATUS</Text>
              <View
                style={[
                  styles.statusBadge,
                  isGenerated ? styles.statusGenerated : styles.statusPending,
                ]}>
                <Text
                  style={[
                    styles.statusBadgeText,
                    isGenerated
                      ? styles.statusGeneratedText
                      : styles.statusPendingText,
                  ]}>
                  {statusText}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={handleTaxReportDownload}
              disabled={downloadingTaxReport}>
              {downloadingTaxReport ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Feather name="download" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {taxReport.summary ? (
            <View style={styles.taxSummaryBox}>
              <Text style={styles.taxSummaryTitle}>Summary</Text>
              <View style={styles.taxSummaryRow}>
                <Text style={styles.taxSummaryLabel}>Tax Regime</Text>
                <Text style={styles.taxSummaryValue}>
                  {taxReport.summary.taxRegimeLabel ||
                    taxReport.summary.taxRegime ||
                    '—'}
                </Text>
              </View>
              <View style={styles.taxSummaryRow}>
                <Text style={styles.taxSummaryLabel}>Taxable Income</Text>
                <Text style={styles.taxSummaryValue}>
                  ₹{Number(taxReport.summary.taxableIncome || 0).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.taxSummaryRow}>
                <Text style={styles.taxSummaryLabel}>Total Tax</Text>
                <Text style={styles.taxSummaryValue}>
                  ₹{Number(taxReport.summary.totalTax || 0).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const renderForm16 = () => {
    if (form16Loading && !form16Refreshing) {
      return (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#2952E3" />
        </View>
      );
    }

    if (!form16?.employeeDetails) {
      return (
        <View style={styles.emptyState}>
          <Feather name="file-text" size={40} color="#C8A8A8" />
          <Text style={styles.emptyTitle}>No Form 16</Text>
          <Text style={styles.emptySubtitle}>
            Form 16 for FY {selectedYear} is not available yet.
          </Text>
        </View>
      );
    }

    const emp = form16.employeeDetails;
    const isGenerated = Boolean(form16.generatedOn);
    const statusText = isGenerated ? 'Generated' : 'Pending';
    const fyLabel =
      form16.financialYearCanonical ||
      emp.period ||
      toDisplayFinancialYear(selectedYear);
    const parts = (form16.documentParts || []).join(' & ') || 'PART_A & PART_B';

    return (
      <View>
        <Text style={styles.taxReportHeading}>Form 16</Text>
        <Text style={styles.taxReportSubheading}>
          View and download your Form 16 documents
        </Text>

        <View style={styles.taxReportCard}>
          <View style={styles.taxReportCardHeader}>
            <Text style={styles.taxColLabel}>EMPLOYEE</Text>
            <Text style={styles.taxColLabel}>FINANCIAL YEAR</Text>
          </View>
          <View style={styles.taxReportRow}>
            <View style={styles.taxEmployeeCol}>
              <Text style={styles.taxEmployeeName}>
                {emp.employeeName || '—'}
              </Text>
              <Text style={styles.taxEmployeeRole}>
                {emp.designation || emp.employeeCode || ''}
              </Text>
            </View>
            <Text style={styles.taxFyValue}>{fyLabel}</Text>
          </View>

          <View style={styles.taxDivider} />

          <View style={styles.taxMetaGrid}>
            <View style={styles.taxMetaItem}>
              <Text style={styles.taxMetaLabel}>ASSESSMENT YEAR</Text>
              <Text style={styles.taxMetaValue}>
                {form16.assessmentYear || '—'}
              </Text>
            </View>
            <View style={styles.taxMetaItem}>
              <Text style={styles.taxMetaLabel}>GENERATED ON</Text>
              <Text style={styles.taxMetaValue}>
                {formatGeneratedOn(form16.generatedOn)}
              </Text>
            </View>
          </View>

          <View style={styles.taxFooterRow}>
            <View>
              <Text style={styles.taxMetaLabel}>STATUS</Text>
              <View
                style={[
                  styles.statusBadge,
                  isGenerated ? styles.statusGenerated : styles.statusPending,
                ]}>
                <Text
                  style={[
                    styles.statusBadgeText,
                    isGenerated
                      ? styles.statusGeneratedText
                      : styles.statusPendingText,
                  ]}>
                  {statusText}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={handleForm16Download}
              disabled={downloadingForm16}>
              {downloadingForm16 ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Feather name="download" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.taxSummaryBox}>
            <Text style={styles.taxSummaryTitle}>Document Details</Text>
            <View style={styles.taxSummaryRow}>
              <Text style={styles.taxSummaryLabel}>Parts Available</Text>
              <Text style={styles.taxSummaryValue}>{parts}</Text>
            </View>
            {form16.employerDetails?.name ? (
              <View style={styles.taxSummaryRow}>
                <Text style={styles.taxSummaryLabel}>Employer</Text>
                <Text style={styles.taxSummaryValue} numberOfLines={2}>
                  {form16.employerDetails.name}
                </Text>
              </View>
            ) : null}
            <View style={styles.taxSummaryRow}>
              <Text style={styles.taxSummaryLabel}>Total TDS Deducted</Text>
              <Text style={styles.taxSummaryValue}>
                ₹{Number(form16.totalTDSDeducted || 0).toLocaleString('en-IN')}
              </Text>
            </View>
            {form16.partD ? (
              <View style={styles.taxSummaryRow}>
                <Text style={styles.taxSummaryLabel}>Net Tax</Text>
                <Text style={styles.taxSummaryValue}>
                  ₹{Number(form16.partD.netTax || 0).toLocaleString('en-IN')}
                </Text>
              </View>
            ) : null}
            {form16.periodDescription ? (
              <View style={styles.taxSummaryRow}>
                <Text style={styles.taxSummaryLabel}>Period</Text>
                <Text style={styles.taxSummaryValue}>
                  {form16.periodDescription}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        activeTab === 'Investment Declaration' ||
        activeTab === 'Tax Report' ||
        activeTab === 'Form 16' ? (
          <RefreshControl
            refreshing={
              activeTab === 'Tax Report'
                ? taxReportRefreshing
                : activeTab === 'Form 16'
                  ? form16Refreshing
                  : refreshing
            }
            onRefresh={onRefresh}
          />
        ) : undefined
      }>
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Taxation</Text>
        <View style={{width: 24}} />
      </View>

      <PayrollTabs navigation={navigation} activeTab="Taxation" />

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

      <View style={styles.yearContainer}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.yearDropdown}
            onPress={() => setShowYearDropdown(!showYearDropdown)}>
            <Text style={styles.yearText}>Financial Year : {selectedYear}</Text>
            <Text style={styles.arrow}>{showYearDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showYearDropdown && (
            <View style={styles.dropdownBox}>
              {financialYears.map((year, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleYearSelect(year)}>
                  <Text style={styles.dropdownText}>{year}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {showActionButton && (
          <TouchableOpacity style={styles.declareBtn} onPress={handleActionPress}>
            <Text style={styles.declareBtnText}>
              {activeTab === 'Investment Declaration'
                ? declared
                  ? 'Edit Investments'
                  : 'Declare Investments'
                : 'Submit Proof'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contentBox}>
        {activeTab === 'Investment Declaration' ? (
          renderInvestmentSummary()
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
          renderTaxReport()
        ) : activeTab === 'Form 16' ? (
          renderForm16()
        ) : null}
      </View>
    </ScrollView>
  );
};

export default PayrollTaxation;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F1F1'},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    marginBottom: 10,
  },
  backIcon: {fontSize: 24, color: '#111', width: 24},
  title: {fontSize: 18, fontWeight: '700', color: '#111'},
  tabsContainer: {paddingHorizontal: 16, marginTop: 10, paddingBottom: 10},
  customTab: {marginRight: 24, alignItems: 'center', paddingBottom: 8},
  customTabText: {fontSize: 14, fontWeight: '600', color: '#777'},
  customTabTextActive: {color: '#111', fontWeight: '700'},
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
  yearText: {fontSize: 13, fontWeight: '600', color: '#111'},
  arrow: {fontSize: 12, color: '#555', marginLeft: 8},
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
  dropdownText: {fontSize: 13, color: '#111', fontWeight: '500'},
  declareBtn: {
    backgroundColor: '#2952E3',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginLeft: 10,
    maxWidth: 150,
  },
  declareBtnText: {color: '#fff', fontSize: 11, fontWeight: '700', textAlign: 'center'},
  contentBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    padding: 20,
    minHeight: 200,
  },
  heading: {fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 10},
  description: {fontSize: 14, color: '#666', lineHeight: 22},
  loadingBox: {paddingVertical: 40, alignItems: 'center'},
  emptyState: {alignItems: 'center', justifyContent: 'center', paddingVertical: 30},
  emptyTitle: {marginTop: 14, fontSize: 15, fontWeight: '700', color: '#333'},
  emptySubtitle: {
    marginTop: 8,
    fontSize: 12.5,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  summaryHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  summaryTitle: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  summaryFy: {fontSize: 12, color: '#6B7280', marginBottom: 14},
  summaryGrid: {flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6},
  summaryItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  summaryLabel: {fontSize: 11, color: '#6B7280', marginBottom: 4},
  summaryValue: {fontSize: 14, fontWeight: '700', color: '#111'},
  editLink: {marginTop: 8, alignSelf: 'flex-start'},
  editLinkText: {color: '#2952E3', fontSize: 13, fontWeight: '600'},
  taxReportHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  taxReportSubheading: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  taxReportCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
  },
  taxReportCardHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  taxColLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.4,
  },
  taxReportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  taxEmployeeCol: {flex: 1, paddingRight: 8},
  taxEmployeeName: {fontSize: 15, fontWeight: '700', color: '#111'},
  taxEmployeeRole: {fontSize: 12, color: '#6B7280', marginTop: 2},
  taxFyValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    textAlign: 'right',
  },
  taxDivider: {height: 1, backgroundColor: '#E5E7EB'},
  taxMetaGrid: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  taxMetaItem: {flex: 1, marginRight: 8},
  taxMetaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  taxMetaValue: {fontSize: 13, fontWeight: '600', color: '#111'},
  taxFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  statusGenerated: {backgroundColor: '#DCFCE7'},
  statusPending: {backgroundColor: '#FEF3C7'},
  statusBadgeText: {fontSize: 12, fontWeight: '700'},
  statusGeneratedText: {color: '#16A34A'},
  statusPendingText: {color: '#D97706'},
  downloadBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#23B480',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taxSummaryBox: {
    margin: 14,
    marginTop: 0,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  taxSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  taxSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  taxSummaryLabel: {fontSize: 12, color: '#6B7280'},
  taxSummaryValue: {fontSize: 12, fontWeight: '600', color: '#111'},
});
