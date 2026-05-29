import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import apiService from '../api/apiService';

const INVESTMENT_80C_OPTIONS = [
  'PPF',
  'LIC Premium',
  'ELSS Mutual Fund',
  'NSC',
  'Tax Saver FD',
  'EPF',
  'ULIP',
  'Other',
];
const INVESTMENT_80D_OPTIONS = [
  'Self',
  'Spouse',
  'Children',
  'Parents',
  'Senior Citizen Parents',
  'Other',
];
const OTHER_INVESTMENT_OPTIONS = [
  'Voluntary NPS',
  'Education Loan Interest',
  'Medical Expenditure',
  'Other',
];
const URBANIZATION_OPTIONS = ['Metro', 'Non-Metro'];

/** API uses full year e.g. 2026-2027 (same as web) */
const toApiFinancialYear = fy => {
  if (!fy) return '';
  const full = fy.match(/^(\d{4})-(\d{4})$/);
  if (full) return fy;
  const short = fy.match(/^(\d{4})-(\d{2})$/);
  if (short) {
    const end =
      Number(short[2]) < 50 ? 2000 + Number(short[2]) : 1900 + Number(short[2]);
    return `${short[1]}-${end}`;
  }
  return fy;
};

const toShortFinancialYear = fy => {
  const full = toApiFinancialYear(fy);
  const m = full.match(/^(\d{4})-(\d{4})$/);
  if (m) return `${m[1]}-${m[2].slice(-2)}`;
  return fy;
};

const toDisplayFinancialYear = fy => toApiFinancialYear(fy) || fy;

const financialYearQueryVariants = fy => {
  const full = toApiFinancialYear(fy);
  const short = toShortFinancialYear(fy);
  return [...new Set([full, short, fy].filter(Boolean))];
};

const extractDeclaration = payload => {
  if (!payload) return null;
  const unwrap = node => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return null;
    if (node.investments80C || node.itDeclaration || node._id) return node;
    if (node.declaration) return node.declaration;
    if (node.investmentDeclaration) return node.investmentDeclaration;
    return null;
  };
  const fromData = unwrap(payload.data);
  if (fromData) return fromData;
  if (payload.data?.data) {
    const nested = unwrap(payload.data.data);
    if (nested) return nested;
  }
  return unwrap(payload);
};

const hasRentEntryData = entry =>
  Boolean(
    entry?.rentMonthly ||
      entry?.rentAnnual ||
      entry?.address ||
      entry?.landlordName ||
      entry?.fromDate,
  );

function sumAmounts(rows) {
  return (rows || []).reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
}

const declarationHasContent = d => {
  if (!d || typeof d !== 'object') return false;
  if (d._id) return true;
  if (sumAmounts(d.investments80C) > 0 || sumAmounts(d.investments80D) > 0) {
    return true;
  }
  const it = d.itDeclaration || {};
  if (it.stayingInRentedHouse) return true;
  if ((it.rentEntries || []).some(hasRentEntryData)) return true;
  if (it.homeLoanSelfOccupied?.enabled) return true;
  if (it.letOutPropertyEnabled) return true;
  if (sumAmounts(it.investmentsOther) > 0) return true;
  const income = it.otherIncomeBreakdown || {};
  return Boolean(
    Number(income.incomeFromOtherSources) ||
      Number(income.interestSavings) ||
      Number(income.interestFD) ||
      Number(income.interestNSC),
  );
};

const fetchTdsDeclaration = async (empId, displayYear) => {
  const variants = financialYearQueryVariants(displayYear);
  let fallback = null;
  for (const fy of variants) {
    try {
      const response = await apiService.getInvestmentDeclaration(empId, fy);
      const d = extractDeclaration(response);
      const hasResponse =
        response?.success === true ||
        response?.status === true ||
        response?.status === 'true' ||
        d?._id;
      if (!hasResponse && !d) continue;

      const result = {response, financialYear: d?.financialYear || fy};
      if (declarationHasContent(d)) return result;
      if (!fallback) fallback = result;
    } catch {
      // try next financial year format
    }
  }
  if (fallback) return fallback;
  throw new Error('Unable to load TDS declaration');
};

const toApiDate = input => {
  if (!input) return '';
  const trimmed = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const slashParts = trimmed.split('/');
  if (slashParts.length === 3) {
    let [month, day, year] = slashParts;
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }
  return trimmed;
};

const formatDisplayDate = isoDate => {
  if (!isoDate) return '';
  const d = new Date(toApiDate(isoDate));
  if (Number.isNaN(d.getTime())) return isoDate;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${d.getFullYear()}`;
};

const fileNameFromUrl = url => {
  if (!url) return '';
  try {
    return decodeURIComponent(String(url).split('/').pop() || 'Uploaded file');
  } catch {
    return 'Uploaded file';
  }
};

const resolveUploadUrl = res => {
  const data = res?.data || res;
  return (
    data?.url ||
    data?.fileUrl ||
    data?.location ||
    data?.path ||
    (typeof data === 'string' ? data : '')
  );
};

const defaultRentEntry = () => ({
  fromDate: '',
  toDate: '',
  rentMonthly: '',
  rentAnnual: '',
  address: '',
  landlordName: '',
  urbanizationType: 'Non-Metro',
  urbanizationType2: '',
  attachment: '',
  attachmentFileName: '',
});

const defaultInvestmentRow = () => ({
  investmentType: '',
  amount: '',
  attachment: '',
  attachmentFileName: '',
});

const defaultForm = apiFy => ({
  financialYear: apiFy || '',
  investments80C: [defaultInvestmentRow()],
  investments80D: [defaultInvestmentRow()],
  itDeclaration: {
    stayingInRentedHouse: false,
    rentEntries: [defaultRentEntry()],
    homeLoanSelfOccupied: {
      enabled: false,
      principalPaid: '',
      interestPaid: '',
      lenderName: '',
      lenderPAN: '',
      attachment: '',
      attachmentFileName: '',
    },
    letOutPropertyEnabled: false,
    letOutPropertyAttachment: '',
    letOutPropertyFileName: '',
    investmentsOther: [defaultInvestmentRow()],
    otherIncomeBreakdown: {
      incomeFromOtherSources: '',
      interestSavings: '',
      interestFD: '',
      interestNSC: '',
      attachment: '',
      attachmentFileName: '',
    },
    toggles: {
      section80C: false,
      section80D: false,
      otherInvestments: false,
    },
  },
  declaredDeductions: {
    section80E: '',
    section80G: '',
    professionalTax: '',
  },
});

const mapInvestmentRows = rows => {
  const list = Array.isArray(rows) && rows.length ? rows : [defaultInvestmentRow()];
  return list.map(r => ({
    investmentType: r.investmentType || '',
    amount: r.amount != null ? String(r.amount) : '',
    attachment: r.attachment || '',
    attachmentFileName: r.attachment ? fileNameFromUrl(r.attachment) : '',
  }));
};

const mapFromApi = (raw, apiFy) => {
  const d = extractDeclaration(raw) || {};
  const it = d.itDeclaration || {};
  const rentList =
    Array.isArray(it.rentEntries) && it.rentEntries.length
      ? it.rentEntries
      : [defaultRentEntry()];
  const home = it.homeLoanSelfOccupied || {};
  const hasRentData = rentList.some(hasRentEntryData);
  const investments80C = mapInvestmentRows(d.investments80C);
  const investments80D = mapInvestmentRows(d.investments80D);
  const investmentsOther = mapInvestmentRows(it.investmentsOther);
  const has80CData = investments80C.some(
    r => r.investmentType || Number(r.amount) || r.attachment,
  );
  const has80DData = investments80D.some(
    r => r.investmentType || Number(r.amount) || r.attachment,
  );
  const hasOtherData = investmentsOther.some(
    r => r.investmentType || Number(r.amount) || r.attachment,
  );
  const hasHomeLoanData = Boolean(
    home.enabled ||
      Number(home.principalPaid) ||
      Number(home.interestPaid) ||
      home.lenderName ||
      home.attachment,
  );
  const income = it.otherIncomeBreakdown || {};
  const hasOtherIncomeData = Boolean(
    Number(income.incomeFromOtherSources) ||
      Number(income.interestSavings) ||
      Number(income.interestFD) ||
      Number(income.interestNSC) ||
      income.attachment,
  );

  return {
    financialYear: d.financialYear || toApiFinancialYear(apiFy) || '',
    investments80C,
    investments80D,
    itDeclaration: {
      stayingInRentedHouse: Boolean(it.stayingInRentedHouse) || hasRentData,
      rentEntries: rentList.map(r => ({
        fromDate: r.fromDate || '',
        toDate: r.toDate || '',
        rentMonthly: r.rentMonthly != null ? String(r.rentMonthly) : '',
        rentAnnual: r.rentAnnual != null ? String(r.rentAnnual) : '',
        address: r.address || '',
        landlordName: r.landlordName || '',
        urbanizationType: r.urbanizationType || 'Non-Metro',
        urbanizationType2: r.urbanizationType2 || '',
        attachment: r.attachment || '',
        attachmentFileName: r.attachment ? fileNameFromUrl(r.attachment) : '',
      })),
      homeLoanSelfOccupied: {
        enabled: hasHomeLoanData,
        principalPaid: home.principalPaid != null ? String(home.principalPaid) : '',
        interestPaid: home.interestPaid != null ? String(home.interestPaid) : '',
        lenderName: home.lenderName || '',
        lenderPAN: home.lenderPAN || '',
        attachment: home.attachment || '',
        attachmentFileName: home.attachment ? fileNameFromUrl(home.attachment) : '',
      },
      letOutPropertyEnabled:
        Boolean(it.letOutPropertyEnabled) || Boolean(it.letOutPropertyAttachment),
      letOutPropertyAttachment: it.letOutPropertyAttachment || '',
      letOutPropertyFileName: it.letOutPropertyAttachment
        ? String(it.letOutPropertyAttachment).split('/').pop()
        : '',
      investmentsOther,
      otherIncomeBreakdown: {
        incomeFromOtherSources:
          income.incomeFromOtherSources != null
            ? String(income.incomeFromOtherSources)
            : '',
        interestSavings:
          income.interestSavings != null ? String(income.interestSavings) : '',
        interestFD: income.interestFD != null ? String(income.interestFD) : '',
        interestNSC: income.interestNSC != null ? String(income.interestNSC) : '',
        attachment: income.attachment || '',
        attachmentFileName: income.attachment ? fileNameFromUrl(income.attachment) : '',
      },
      toggles: {
        section80C: Boolean(it.toggles?.section80C) || has80CData,
        section80D: Boolean(it.toggles?.section80D) || has80DData,
        otherInvestments: Boolean(it.toggles?.otherInvestments) || hasOtherData,
      },
    },
    declaredDeductions: {
      section80E:
        d.declaredDeductions?.section80E != null
          ? String(d.declaredDeductions.section80E)
          : '',
      section80G:
        d.declaredDeductions?.section80G != null
          ? String(d.declaredDeductions.section80G)
          : '',
      professionalTax:
        d.declaredDeductions?.professionalTax != null
          ? String(d.declaredDeductions.professionalTax)
          : '2400',
    },
  };
};

const buildPayload = form => {
  const it = form.itDeclaration;
  const home = it.homeLoanSelfOccupied;
  return {
    financialYear: toShortFinancialYear(form.financialYear) || form.financialYear,
    investments80C: form.investments80C.map(i => ({
      investmentType: i.investmentType || '',
      amount: Number(i.amount) || 0,
      attachment: i.attachment || '',
    })),
    investments80D: form.investments80D.map(i => ({
      investmentType: i.investmentType || '',
      amount: Number(i.amount) || 0,
      attachment: i.attachment || '',
    })),
    itDeclaration: {
      stayingInRentedHouse: it.stayingInRentedHouse,
      rentEntries: it.rentEntries.map(r => ({
        fromDate: toApiDate(r.fromDate),
        toDate: toApiDate(r.toDate),
        rentMonthly: Number(r.rentMonthly) || 0,
        rentAnnual: Number(r.rentAnnual) || 0,
        address: r.address || '',
        landlordName: r.landlordName || '',
        urbanizationType: r.urbanizationType || '',
        urbanizationType2: r.urbanizationType2 || '',
        isMetroCity: r.urbanizationType === 'Metro',
        attachment: r.attachment || '',
      })),
      homeLoanSelfOccupied: {
        enabled: home.enabled,
        principalPaid: Number(home.principalPaid) || 0,
        interestPaid: Number(home.interestPaid) || 0,
        lenderName: home.lenderName || '',
        lenderPAN: home.lenderPAN || '',
        attachment: home.attachment || '',
      },
      letOutPropertyEnabled: it.letOutPropertyEnabled,
      letOutPropertyAttachment: it.letOutPropertyAttachment || '',
      investmentsOther: it.investmentsOther.map(i => ({
        investmentType: i.investmentType || '',
        amount: Number(i.amount) || 0,
        attachment: i.attachment || '',
      })),
      otherIncomeBreakdown: {
        incomeFromOtherSources:
          Number(it.otherIncomeBreakdown.incomeFromOtherSources) || 0,
        interestSavings: Number(it.otherIncomeBreakdown.interestSavings) || 0,
        interestFD: Number(it.otherIncomeBreakdown.interestFD) || 0,
        interestNSC: Number(it.otherIncomeBreakdown.interestNSC) || 0,
        attachment: it.otherIncomeBreakdown.attachment || '',
      },
      toggles: {...it.toggles},
    },
    declaredDeductions: {
      section80E: Number(form.declaredDeductions.section80E) || 0,
      section80G: Number(form.declaredDeductions.section80G) || 0,
      professionalTax: Number(form.declaredDeductions.professionalTax) || 0,
    },
  };
};

const DeclareInvestments = ({navigation, route}) => {
  const isProof = route?.params?.mode === 'proof';
  const displayYear =
    route?.params?.displayYear || toDisplayFinancialYear('2026-2027');
  const apiFinancialYear =
    route?.params?.financialYear || toApiFinancialYear(displayYear);

  const [form, setForm] = useState(() => defaultForm(apiFinancialYear));
  const [proofMeta, setProofMeta] = useState({proofStatus: '', proofRemarks: ''});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expanded80C, setExpanded80C] = useState(true);
  const [expanded80D, setExpanded80D] = useState(true);
  const [expandedOther, setExpandedOther] = useState(true);
  const [expandedIncome, setExpandedIncome] = useState(true);
  const [picker, setPicker] = useState({visible: false, options: [], onSelect: null, title: ''});
  const [iosDate, setIosDate] = useState({visible: false, rentIdx: 0, field: 'fromDate', value: new Date()});

  const loadDeclaration = useCallback(async () => {
    setLoading(true);
    try {
      const empId = await AsyncStorage.getItem('empId');
      if (!empId) {
        setForm(defaultForm(apiFinancialYear));
        return;
      }
      const {response, financialYear} = await fetchTdsDeclaration(
        empId,
        displayYear,
      );
      const mapped = mapFromApi(response, financialYear || apiFinancialYear);
      const d = extractDeclaration(response);
      setProofMeta({
        proofStatus: d?.proofStatus || '',
        proofRemarks: d?.proofRemarks || '',
      });
      setForm({
        ...mapped,
        financialYear: mapped.financialYear || financialYear || apiFinancialYear,
      });
      if (isProof) {
        setExpanded80C(true);
        setExpanded80D(true);
        setExpandedOther(true);
        setExpandedIncome(true);
      }
    } catch (error) {
      if (!isProof) {
        setForm(defaultForm(apiFinancialYear));
      }
      console.warn('TDS load failed:', error?.message || error);
    } finally {
      setLoading(false);
    }
  }, [apiFinancialYear, displayYear, isProof]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      loadDeclaration();
    });
    return unsub;
  }, [navigation, loadDeclaration]);

  const updateForm = patch => setForm(prev => ({...prev, ...patch}));
  const updateIt = patch =>
    setForm(prev => ({
      ...prev,
      itDeclaration: {...prev.itDeclaration, ...patch},
    }));

  const openPicker = (options, onSelect, title) =>
    setPicker({visible: true, options, onSelect, title});

  const openDatePicker = (rentIdx, field) => {
    const current = form.itDeclaration.rentEntries[rentIdx]?.[field];
    const initial = current ? new Date(toApiDate(current)) : new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initial,
        mode: 'date',
        onChange: (event, selected) => {
          if (event.type !== 'set' || !selected) return;
          const entries = [...form.itDeclaration.rentEntries];
          entries[rentIdx] = {
            ...entries[rentIdx],
            [field]: selected.toISOString().slice(0, 10),
          };
          updateIt({rentEntries: entries});
        },
      });
      return;
    }
    setIosDate({visible: true, rentIdx, field, value: initial});
  };

  const pickAttachment = onUploaded => {
    launchImageLibrary({mediaType: 'mixed', selectionLimit: 1}, async response => {
      if (response.didCancel || !response.assets?.length) return;
      const asset = response.assets[0];
      setUploading(true);
      try {
        const res = await apiService.uploadFile(asset);
        const url = resolveUploadUrl(res);
        if (!url) {
          Alert.alert('Upload failed', 'Could not get file URL from server.');
          return;
        }
        onUploaded(url, asset.fileName || fileNameFromUrl(url));
      } catch (error) {
        Alert.alert('Upload failed', error?.message || 'Please try again.');
      } finally {
        setUploading(false);
      }
    });
  };

  const pickLetOutFile = () => {
    pickAttachment((url, name) => {
      updateIt({
        letOutPropertyAttachment: url,
        letOutPropertyFileName: name,
      });
    });
  };

  const AttachmentField = ({label, fileName, onPick}) => (
    <View style={styles.uploadBlock}>
      <Text style={styles.fieldLabel}>{label || 'Upload Supporting Document'}</Text>
      <TouchableOpacity
        style={styles.fileBox}
        onPress={onPick}
        disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color="#2952E3" />
        ) : (
          <>
            <Feather name="upload-cloud" size={20} color="#6B7280" />
            <Text style={styles.fileBoxText} numberOfLines={2}>
              {fileName || 'Choose File'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = buildPayload({
        ...form,
        financialYear: form.financialYear || apiFinancialYear,
      });
      const response = await apiService.putInvestmentDeclaration(payload);
      Alert.alert(
        'Success',
        response?.message ||
          (isProof
            ? 'Proof of investment saved successfully.'
            : 'Declaration saved successfully.'),
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to save declaration.');
    } finally {
      setSaving(false);
    }
  };

  const renderInvestmentSection = (
    title,
    note,
    rows,
    setRows,
    toggleKey,
    expanded,
    setExpanded,
    options,
  ) => {
    const enabled = form.itDeclaration.toggles[toggleKey];
    const hasRowData = rows.some(
      r => r.investmentType || String(r.amount) || r.attachment,
    );
    const showBody = expanded && (enabled || hasRowData);
    const mergedOptions = [
      ...new Set([
        ...options,
        ...rows.map(r => r.investmentType).filter(Boolean),
      ]),
    ];
    return (
      <View style={styles.card}>
        <View style={styles.investmentHeader}>
          {/* <TouchableOpacity
            style={styles.collapseBtn}
            onPress={() => setExpanded(!expanded)}>
            <Text style={styles.collapseIcon}>{expanded ? '−' : '+'}</Text>
          </TouchableOpacity> */}
          <Text style={styles.investmentTitle}>{title}</Text>
          <View style={styles.toggleWrap}>
            {/* <Text style={[styles.toggleLabel, enabled && styles.toggleLabelOn]}>
              {enabled ? 'ON' : 'OFF'}
            </Text> */}
            <Switch
              value={enabled}
              onValueChange={val =>
                setForm(prev => ({
                  ...prev,
                  itDeclaration: {
                    ...prev.itDeclaration,
                    toggles: {...prev.itDeclaration.toggles, [toggleKey]: val},
                  },
                }))
              }
              trackColor={{false: '#D1D5DB', true: '#2563EB'}}
              thumbColor="#fff"
            />
          </View>
        </View>
        {expanded && <Text style={styles.noteText}>{note}</Text>}
        {showBody && (
          <View style={styles.cardBody}>
            {rows.map((row, idx) => (
              <View key={`${title}-${idx}`} style={styles.investmentBlock}>
                <View style={styles.investmentRow}>
                  <TouchableOpacity
                    style={[styles.input, styles.selectInput, {flex: 2, marginRight: 8}]}
                    onPress={() =>
                      openPicker(mergedOptions, val => {
                        const next = [...rows];
                        next[idx] = {...next[idx], investmentType: val};
                        setRows(next);
                      }, 'Select Investment')
                    }>
                    <Text
                      style={
                        row.investmentType
                          ? styles.selectText
                          : styles.selectPlaceholder
                      }
                      numberOfLines={1}>
                      {row.investmentType || 'Select an Investment'}
                    </Text>
                    <Feather name="chevron-down" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <View style={[styles.input, styles.amountInput, {flex: 1}]}>
                    <Text style={styles.rupee}>₹</Text>
                    <TextInput
                      style={styles.amountField}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={row.amount}
                      onChangeText={text => {
                        const next = [...rows];
                        next[idx] = {...next[idx], amount: text};
                        setRows(next);
                      }}
                    />
                  </View>
                  {rows.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeRowBtn}
                      onPress={() => setRows(rows.filter((_, i) => i !== idx))}>
                      <Feather name="trash-2" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  )}
                </View>
                {isProof && (
                  <AttachmentField
                    label="Upload Proof"
                    fileName={
                      row.attachmentFileName ||
                      (row.attachment ? fileNameFromUrl(row.attachment) : '')
                    }
                    onPick={() =>
                      pickAttachment((url, name) => {
                        const next = [...rows];
                        next[idx] = {
                          ...next[idx],
                          attachment: url,
                          attachmentFileName: name,
                        };
                        setRows(next);
                      })
                    }
                  />
                )}
              </View>
            ))}
            <TouchableOpacity
              style={styles.addLinkBtn}
              onPress={() => setRows([...rows, defaultInvestmentRow()])}>
              <Text style={styles.addLinkText}>+ Add Investment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#2952E3" />
          <Text style={styles.loadingText}>
            {isProof ? 'Loading proof of investment...' : 'Loading declaration...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const it = form.itDeclaration;
  const proofStatusStyle = (() => {
    const s = String(proofMeta.proofStatus || '').toLowerCase();
    if (s === 'approved' || s === 'verified') {
      return {text: 'APPROVED', bg: '#E8F8F2', color: '#16A34A'};
    }
    if (s === 'rejected') {
      return {text: 'REJECTED', bg: '#FEE2E2', color: '#DC2626'};
    }
    if (s && s !== 'pending') {
      return {text: s.toUpperCase(), bg: '#FFF8E1', color: '#D97706'};
    }
    return null;
  })();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.titleRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <View style={styles.titleCenter}>
          <Text style={styles.title}>
            {isProof ? 'Proof of Investment' : 'Investment Declaration'}
          </Text>
          <Text style={styles.subtitle}>
            FY {toDisplayFinancialYear(form.financialYear || apiFinancialYear)}
          </Text>
        </View>
        <View style={{width: 24}} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}>
        {isProof && proofStatusStyle && (
          <View style={[styles.proofBanner, {backgroundColor: proofStatusStyle.bg}]}>
            <Feather name="info" size={18} color={proofStatusStyle.color} />
            <View style={{flex: 1, marginLeft: 8}}>
              <Text style={styles.proofBannerText}>
                Status: {proofMeta.proofStatus}
                {proofMeta.proofRemarks
                  ? `\nRemarks: ${proofMeta.proofRemarks}`
                  : ''}
              </Text>
            </View>
            <View style={[styles.proofBadge, {backgroundColor: proofStatusStyle.color}]}>
              <Text style={styles.proofBadgeText}>{proofStatusStyle.text}</Text>
            </View>
          </View>
        )}
        {/* RENTED HOUSE */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Are you staying in a rented house?</Text>
            <Switch
              value={it.stayingInRentedHouse}
              onValueChange={val => updateIt({stayingInRentedHouse: val})}
              trackColor={{false: '#D1D5DB', true: '#2563EB'}}
              thumbColor="#fff"
            />
          </View>
          {it.stayingInRentedHouse &&
            it.rentEntries.map((rent, idx) => (
              <View key={`rent-${idx}`} style={styles.nestedBox}>
                <Text style={styles.nestedTitle}>House Rent Details {idx + 1}</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.input, {flex: 1, marginRight: 8}]}
                    onPress={() => openDatePicker(idx, 'fromDate')}>
                    <Text style={rent.fromDate ? styles.inputText : styles.placeholder}>
                      {formatDisplayDate(rent.fromDate) || 'mm/dd/yyyy'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.input, {flex: 1}]}
                    onPress={() => openDatePicker(idx, 'toDate')}>
                    <Text style={rent.toDate ? styles.inputText : styles.placeholder}>
                      {formatDisplayDate(rent.toDate) || 'mm/dd/yyyy'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.row}>
                  <View style={[styles.input, styles.amountInput, {flex: 1, marginRight: 8}]}>
                    <Text style={styles.rupee}>₹</Text>
                    <TextInput
                      style={styles.amountField}
                      placeholder="Monthly"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={rent.rentMonthly}
                      onChangeText={text => {
                        const entries = [...it.rentEntries];
                        entries[idx] = {...entries[idx], rentMonthly: text};
                        updateIt({rentEntries: entries});
                      }}
                    />
                  </View>
                  <View style={[styles.input, styles.amountInput, {flex: 1}]}>
                    <Text style={styles.rupee}>₹</Text>
                    <TextInput
                      style={styles.amountField}
                      placeholder="Annual"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={rent.rentAnnual}
                      onChangeText={text => {
                        const entries = [...it.rentEntries];
                        entries[idx] = {...entries[idx], rentAnnual: text};
                        updateIt({rentEntries: entries});
                      }}
                    />
                  </View>
                </View>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Address"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  value={rent.address}
                  onChangeText={text => {
                    const entries = [...it.rentEntries];
                    entries[idx] = {...entries[idx], address: text};
                    updateIt({rentEntries: entries});
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Landlord Name"
                  placeholderTextColor="#9CA3AF"
                  value={rent.landlordName}
                  onChangeText={text => {
                    const entries = [...it.rentEntries];
                    entries[idx] = {...entries[idx], landlordName: text};
                    updateIt({rentEntries: entries});
                  }}
                />
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.input, styles.selectInput, {flex: 1, marginRight: 8}]}
                    onPress={() => {
                      openPicker(
                        URBANIZATION_OPTIONS,
                        val => {
                          const entries = [...it.rentEntries];
                          entries[idx] = {...entries[idx], urbanizationType: val};
                          updateIt({rentEntries: entries});
                        },
                        'Urbanization Type',
                      );
                    }}>
                    <Text style={styles.selectText}>{rent.urbanizationType}</Text>
                    <Feather name="chevron-down" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, {flex: 1}]}
                    placeholder="Urbanization Detail"
                    placeholderTextColor="#9CA3AF"
                    value={rent.urbanizationType2}
                    onChangeText={text => {
                      const entries = [...it.rentEntries];
                      entries[idx] = {...entries[idx], urbanizationType2: text};
                      updateIt({rentEntries: entries});
                    }}
                  />
                </View>
                {isProof && (
                  <AttachmentField
                    fileName={
                      rent.attachmentFileName ||
                      (rent.attachment ? fileNameFromUrl(rent.attachment) : '')
                    }
                    onPick={() =>
                      pickAttachment((url, name) => {
                        const entries = [...it.rentEntries];
                        entries[idx] = {
                          ...entries[idx],
                          attachment: url,
                          attachmentFileName: name,
                        };
                        updateIt({rentEntries: entries});
                      })
                    }
                  />
                )}
                {it.rentEntries.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeEntryBtn}
                    onPress={() =>
                      updateIt({
                        rentEntries: it.rentEntries.filter((_, i) => i !== idx),
                      })
                    }>
                    <Text style={styles.removeEntryText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          {it.stayingInRentedHouse && (
            <TouchableOpacity
              style={styles.addLinkBtn}
              onPress={() =>
                updateIt({rentEntries: [...it.rentEntries, defaultRentEntry()]})
              }>
              <Text style={styles.addLinkText}>+ Add Rented House</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* HOME LOAN */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Are you repaying home loan for a self-occupied house property?
            </Text>
            <Switch
              value={it.homeLoanSelfOccupied.enabled}
              onValueChange={val =>
                updateIt({
                  homeLoanSelfOccupied: {...it.homeLoanSelfOccupied, enabled: val},
                })
              }
              trackColor={{false: '#D1D5DB', true: '#2563EB'}}
              thumbColor="#fff"
            />
          </View>
          {it.homeLoanSelfOccupied.enabled && (
            <View style={styles.cardBody}>
              <View style={styles.labelRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.fieldLabel}>Principal Paid on Home Loan</Text>
                  <Text style={styles.hintText}>
                    Automatically included in the 80C section
                  </Text>
                </View>
                <View style={[styles.input, styles.amountInput, styles.inlineAmount]}>
                  <Text style={styles.rupee}>₹</Text>
                  <TextInput
                    style={styles.amountField}
                    keyboardType="numeric"
                    value={it.homeLoanSelfOccupied.principalPaid}
                    onChangeText={text =>
                      updateIt({
                        homeLoanSelfOccupied: {
                          ...it.homeLoanSelfOccupied,
                          principalPaid: text,
                        },
                      })
                    }
                  />
                </View>
              </View>
              <View style={styles.labelRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.fieldLabel}>Interest Paid on Home Loan</Text>
                  <Text style={styles.hintText}>
                    Automatically included in Section 24
                  </Text>
                </View>
                <View style={[styles.input, styles.amountInput, styles.inlineAmount]}>
                  <Text style={styles.rupee}>₹</Text>
                  <TextInput
                    style={styles.amountField}
                    keyboardType="numeric"
                    value={it.homeLoanSelfOccupied.interestPaid}
                    onChangeText={text =>
                      updateIt({
                        homeLoanSelfOccupied: {
                          ...it.homeLoanSelfOccupied,
                          interestPaid: text,
                        },
                      })
                    }
                  />
                </View>
              </View>
              <Text style={styles.fieldLabel}>Name of the Lender</Text>
              <TextInput
                style={styles.input}
                value={it.homeLoanSelfOccupied.lenderName}
                onChangeText={text =>
                  updateIt({
                    homeLoanSelfOccupied: {...it.homeLoanSelfOccupied, lenderName: text},
                  })
                }
              />
              <Text style={styles.fieldLabel}>Lender PAN</Text>
              <TextInput
                style={styles.input}
                value={it.homeLoanSelfOccupied.lenderPAN}
                onChangeText={text =>
                  updateIt({
                    homeLoanSelfOccupied: {...it.homeLoanSelfOccupied, lenderPAN: text},
                  })
                }
              />
              {isProof && (
                <AttachmentField
                  fileName={
                    it.homeLoanSelfOccupied.attachmentFileName ||
                    (it.homeLoanSelfOccupied.attachment
                      ? fileNameFromUrl(it.homeLoanSelfOccupied.attachment)
                      : '')
                  }
                  onPick={() =>
                    pickAttachment((url, name) => {
                      updateIt({
                        homeLoanSelfOccupied: {
                          ...it.homeLoanSelfOccupied,
                          attachment: url,
                          attachmentFileName: name,
                        },
                      });
                    })
                  }
                />
              )}
            </View>
          )}
        </View>

        {/* LET OUT PROPERTY */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Do you have a let out property with or without rental income?
            </Text>
            <Switch
              value={it.letOutPropertyEnabled}
              onValueChange={val => updateIt({letOutPropertyEnabled: val})}
              trackColor={{false: '#D1D5DB', true: '#2563EB'}}
              thumbColor="#fff"
            />
          </View>
          {it.letOutPropertyEnabled && (
            <View style={styles.cardBody}>
              <AttachmentField
                fileName={it.letOutPropertyFileName || 'Choose File'}
                onPick={pickLetOutFile}
              />
            </View>
          )}
        </View>

        {/* 80C */}
        {renderInvestmentSection(
          '80C Investments',
          'Note: Declare investments such as LIC premiums, mutual funds and PPF under this section. The maximum tax saving investment under 80C is ₹1,50,000.00',
          form.investments80C,
          rows => updateForm({investments80C: rows}),
          'section80C',
          expanded80C,
          setExpanded80C,
          INVESTMENT_80C_OPTIONS,
        )}

        {/* 80D */}
        {renderInvestmentSection(
          '80D Investments',
          'Note: Declare mediclaim insurance policies for yourself, spouse, children and parents. The maximum tax saving under 80D is ₹1,00,000.00',
          form.investments80D,
          rows => updateForm({investments80D: rows}),
          'section80D',
          expanded80D,
          setExpanded80D,
          INVESTMENT_80D_OPTIONS,
        )}

        {/* OTHER INVESTMENTS */}
        {renderInvestmentSection(
          'Other Investments & Exemptions',
          'Note: Declare other investments & exemptions such as Voluntary NPS, Interest Paid on Education Loan and Medical Expenditures.',
          it.investmentsOther,
          rows => updateIt({investmentsOther: rows}),
          'otherInvestments',
          expandedOther,
          setExpandedOther,
          OTHER_INVESTMENT_OPTIONS,
        )}

        {/* OTHER SOURCES OF INCOME */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setExpandedIncome(!expandedIncome)}>
            {/* <View style={styles.collapseBtn}>
              <Text style={styles.collapseIcon}>{expandedIncome ? '−' : '+'}</Text>
            </View> */}
            <Text style={[styles.cardTitleUpper, {flex: 1}]}>Other Sources of Income</Text>
            <Feather
              name={expandedIncome ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#111827"
            />
          </TouchableOpacity>
          {expandedIncome && (
            <View style={styles.cardBody}>
              {[
                ['Income from other sources', 'incomeFromOtherSources'],
                ['Interest Earned from Savings Deposit', 'interestSavings'],
                ['Interest Earned from Fixed Deposit', 'interestFD'],
                ['Interest Earned from National Savings Certificates', 'interestNSC'],
              ].map(([label, key]) => (
                <View key={key} style={styles.labelRow}>
                  <Text style={[styles.fieldLabel, {flex: 1}]}>{label}</Text>
                  <View style={[styles.input, styles.amountInput, styles.inlineAmount]}>
                    <Text style={styles.rupee}>₹</Text>
                    <TextInput
                      style={styles.amountField}
                      keyboardType="numeric"
                      value={it.otherIncomeBreakdown[key]}
                      onChangeText={text =>
                        updateIt({
                          otherIncomeBreakdown: {
                            ...it.otherIncomeBreakdown,
                            [key]: text,
                          },
                        })
                      }
                    />
                  </View>
                </View>
              ))}
              {isProof && (
                <AttachmentField
                  fileName={
                    it.otherIncomeBreakdown.attachmentFileName ||
                    (it.otherIncomeBreakdown.attachment
                      ? fileNameFromUrl(it.otherIncomeBreakdown.attachment)
                      : '')
                  }
                  onPick={() =>
                    pickAttachment((url, name) => {
                      updateIt({
                        otherIncomeBreakdown: {
                          ...it.otherIncomeBreakdown,
                          attachment: url,
                          attachmentFileName: name,
                        },
                      });
                    })
                  }
                />
              )}
            </View>
          )}
        </View>

        {/* DECLARED DEDUCTIONS */}
        {/* <View style={styles.card}>
          <Text style={styles.cardTitleUpper}>Declared Deductions</Text>
          <View style={styles.cardBody}>
            {[
              ['Section 80E', 'section80E'],
              ['Section 80G', 'section80G'],
              ['Professional Tax', 'professionalTax'],
            ].map(([label, key]) => (
              <View key={key} style={styles.labelRow}>
                <Text style={[styles.fieldLabel, {flex: 1}]}>{label}</Text>
                <View style={[styles.input, styles.amountInput, styles.inlineAmount]}>
                  <Text style={styles.rupee}>₹</Text>
                  <TextInput
                    style={styles.amountField}
                    keyboardType="numeric"
                    value={form.declaredDeductions[key]}
                    onChangeText={text =>
                      updateForm({
                        declaredDeductions: {...form.declaredDeductions, [key]: text},
                      })
                    }
                  />
                </View>
              </View>
            ))}
          </View>
        </View> */}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>
              {isProof ? 'SUBMIT PROOF' : 'SAVE'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={picker.visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPicker(p => ({...p, visible: false}))}>
          <View style={styles.pickerSheet}>
            <Text style={styles.pickerTitle}>{picker.title}</Text>
            {picker.options.map(opt => (
              <TouchableOpacity
                key={opt}
                style={styles.pickerItem}
                onPress={() => {
                  picker.onSelect?.(opt);
                  setPicker(p => ({...p, visible: false}));
                }}>
                <Text style={styles.pickerItemText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {iosDate.visible && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide">
          <View style={styles.dateModal}>
            <View style={styles.dateModalBar}>
              <TouchableOpacity onPress={() => setIosDate(p => ({...p, visible: false}))}>
                <Text style={styles.dateDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={iosDate.value}
              mode="date"
              display="spinner"
              onChange={(_, selected) => {
                if (selected) setIosDate(p => ({...p, value: selected}));
              }}
            />
            <TouchableOpacity
              style={styles.dateConfirmBtn}
              onPress={() => {
                const entries = [...form.itDeclaration.rentEntries];
                entries[iosDate.rentIdx] = {
                  ...entries[iosDate.rentIdx],
                  [iosDate.field]: iosDate.value.toISOString().slice(0, 10),
                };
                updateIt({rentEntries: entries});
                setIosDate(p => ({...p, visible: false}));
              }}>
              <Text style={styles.dateConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default DeclareInvestments;
export {
  toApiFinancialYear,
  toShortFinancialYear,
  toDisplayFinancialYear,
  extractDeclaration,
  sumAmounts,
  declarationHasContent,
  fetchTdsDeclaration,
  mapFromApi,
  formatDisplayDate,
  buildPayload,
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F5F1F1'},
  loadingWrap: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingText: {marginTop: 10, color: '#666', fontSize: 13},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backBtn: {width: 24},
  titleCenter: {alignItems: 'center'},
  title: {fontSize: 16, fontWeight: '700', color: '#111'},
  subtitle: {fontSize: 11, color: '#6B7280', marginTop: 2},
  scrollArea: {flex: 1, paddingHorizontal: 14, paddingTop: 14},
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  investmentTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
    marginRight: 8,
  },
  toggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  toggleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginRight: 6,
  },
  toggleLabelOn: {color: '#2563EB'},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapseBtn: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  collapseIcon: {fontSize: 14, fontWeight: '700', color: '#374151', lineHeight: 16},
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 10,
    lineHeight: 19,
  },
  cardTitleUpper: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
    flex: 1,
    marginRight: 10,
    letterSpacing: 0.2,
  },
  cardBody: {marginTop: 12},
  noteText: {marginTop: 8, fontSize: 11.5, lineHeight: 17, color: '#6B7280'},
  nestedBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  nestedTitle: {fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 10},
  fieldLabel: {fontSize: 12, color: '#374151', fontWeight: '500'},
  hintText: {fontSize: 10.5, color: '#9CA3AF', marginTop: 2},
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 4},
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 10,
    fontSize: 13,
    color: '#111827',
  },
  textArea: {height: 70, textAlignVertical: 'top'},
  inputText: {fontSize: 13, color: '#111827'},
  placeholder: {fontSize: 13, color: '#9CA3AF'},
  selectInput: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  selectText: {fontSize: 13, color: '#111827', flex: 1},
  selectPlaceholder: {fontSize: 13, color: '#9CA3AF', flex: 1},
  amountInput: {flexDirection: 'row', alignItems: 'center', paddingVertical: 0},
  inlineAmount: {width: 110, marginBottom: 0},
  rupee: {paddingLeft: 8, color: '#6B7280', fontSize: 13},
  amountField: {flex: 1, paddingVertical: 9, paddingHorizontal: 6, fontSize: 13, color: '#111827'},
  investmentBlock: {marginBottom: 4},
  investmentRow: {flexDirection: 'row', alignItems: 'center'},
  removeRowBtn: {marginLeft: 6, marginBottom: 10, padding: 6},
  removeEntryBtn: {alignSelf: 'flex-start', marginTop: 4},
  removeEntryText: {color: '#DC2626', fontSize: 12, fontWeight: '600'},
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fileBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    gap: 6,
  },
  fileBoxText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  uploadBlock: {marginTop: 4, marginBottom: 8},
  proofBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  proofBannerText: {fontSize: 12, color: '#333', lineHeight: 17},
  proofBadge: {borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8},
  proofBadgeText: {color: '#fff', fontSize: 10, fontWeight: '700'},
  addLinkBtn: {paddingVertical: 6, alignSelf: 'flex-start'},
  addLinkText: {color: '#2952E3', fontSize: 13, fontWeight: '600'},
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 11,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtnText: {color: '#374151', fontWeight: '700', fontSize: 12},
  saveBtn: {
    flex: 1,
    backgroundColor: '#2952E3',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  saveBtnText: {color: '#fff', fontWeight: '700', fontSize: 12},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: '50%',
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: '700',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    color: '#111',
  },
  pickerItem: {paddingVertical: 14, paddingHorizontal: 16},
  pickerItemText: {fontSize: 14, color: '#111'},
  dateModal: {flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)'},
  dateModalBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dateDone: {color: '#2952E3', fontWeight: '700'},
  dateConfirmBtn: {backgroundColor: '#fff', padding: 14, alignItems: 'center'},
  dateConfirmText: {color: '#2952E3', fontWeight: '700'},
});
