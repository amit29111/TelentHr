import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';

import PayrollTabs from './PayrollTabs';
import apiService from '../api/apiService';
import apiClient from '../api/apiClient';
import {ENDPOINT} from '../api/endpoint';

const EMPTY_ENTRY = {
  claimDate: '',
  billNo: '',
  headId: '',
  headName: '',
  claimedAmount: '',
  particulars: '',
  description: '',
  name: '',
  type: '',
  proofFileName: '',
  proofFile: null,
};

const extractArray = payload => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.claims)) return payload.claims;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.records)) return payload.records;
  if (Array.isArray(payload.list)) return payload.list;
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    if (Array.isArray(payload.data.data)) return payload.data.data;
    for (const key of [
      'claims',
      'claimList',
      'myClaims',
      'employeeClaims',
      'claimHistory',
      'submittedClaims',
      'reimbursementClaims',
      'claimDetails',
      'claimsSummary',
      'claimSummary',
      'claimsData',
      'reimbursementSummary',
      'reimbursements',
      'reimbursementHeads',
      'heads',
      'result',
      'records',
      'list',
    ]) {
      if (Array.isArray(payload.data[key])) {
        return payload.data[key];
      }
    }
  }
  return [];
};

const isClaimRecord = obj => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  if (Array.isArray(obj.items) && obj.items.length) return true;
  if (Array.isArray(obj.claimItems) && obj.claimItems.length) return true;

  const hasHead =
    obj.headName ||
    obj.head_name ||
    obj.reimbursementHead ||
    obj.reimbursementHeadName ||
    obj.headId ||
    obj.head_id;

  const hasAmount =
    obj.claimedAmount != null ||
    obj.claim_amount != null ||
    obj.claimed != null ||
    obj.totalClaimed != null ||
    obj.total_claimed != null ||
    obj.amount != null;

  if (hasHead && hasAmount) return true;

  return Boolean(
    obj.claimNo ||
      obj.claimNumber ||
      obj.claim_no ||
      obj.claim_date ||
      obj.claimDate ||
      obj.billNo ||
      obj.bill_no ||
      (obj.status && hasAmount),
  );
};

const flattenGroupedClaims = list => {
  if (!Array.isArray(list)) return [];
  const flat = [];
  list.forEach(entry => {
    if (!entry || typeof entry !== 'object') return;
    if (Array.isArray(entry.claims)) {
      flat.push(...entry.claims);
    } else if (Array.isArray(entry.claimList)) {
      flat.push(...entry.claimList);
    } else if (Array.isArray(entry.claimDetails)) {
      flat.push(...entry.claimDetails);
    } else if (isClaimRecord(entry)) {
      flat.push(entry);
    }
  });
  return flat.length ? flat : list;
};

const collectClaimArraysDeep = (node, depth = 0, found = []) => {
  if (!node || depth > 10) return found;

  if (Array.isArray(node)) {
    const flat = flattenGroupedClaims(node);
    if (flat.some(isClaimRecord)) {
      found.push(flat.filter(isClaimRecord));
    }
    node.forEach(child => collectClaimArraysDeep(child, depth + 1, found));
    return found;
  }

  if (typeof node === 'object') {
    Object.keys(node).forEach(key => {
      if (/claim|reimburse|submit/i.test(key) || key === 'data' || key === 'list') {
        collectClaimArraysDeep(node[key], depth + 1, found);
      }
    });
  }

  return found;
};

const findClaimsFromSummary = response => {
  if (!response) return [];

  const directSources = [
    response,
    response?.data,
    response?.data?.data,
    response?.data?.claims,
    response?.data?.claimList,
    response?.data?.myClaims,
    response?.data?.employeeClaims,
    response?.data?.claimHistory,
    response?.data?.submittedClaims,
    response?.data?.reimbursementClaims,
    response?.data?.claimDetails,
    response?.data?.claimsSummary,
    response?.data?.claimSummary,
    response?.data?.claimsData,
    response?.data?.reimbursementSummary,
    response?.data?.reimbursements,
    response?.data?.result,
    response?.claims,
    response?.claimList,
    response?.claimsSummary,
  ];

  for (const source of directSources) {
    const list = flattenGroupedClaims(extractArray(source));
    const claims = list.filter(isClaimRecord);
    if (claims.length) return claims;
  }

  const deepMatches = collectClaimArraysDeep(response);
  if (deepMatches.length) {
    return deepMatches.sort((a, b) => b.length - a.length)[0];
  }

  return [];
};

const extractSummary = payload => {
  if (!payload || typeof payload !== 'object') return {};
  const root = payload.data && !Array.isArray(payload.data) ? payload.data : payload;
  return (
    root.summary ||
    root.claimSummary ||
    root.balanceSummary ||
    root.totals ||
    root
  );
};

const formatCurrency = value => {
  const num = Number(value);
  if (Number.isNaN(num)) return value ? `₹${value}` : '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
};

const formatDate = value => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const toApiDate = input => {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const slashParts = trimmed.split('/');
  if (slashParts.length === 3) {
    let [day, month, year] = slashParts;
    if (year.length === 2) year = `20${year}`;
    const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    if (!Number.isNaN(new Date(iso).getTime())) return iso;
  }
  return trimmed;
};

const formatDisplayDate = isoDate => {
  if (!isoDate) return '';
  const d = new Date(toApiDate(isoDate));
  if (Number.isNaN(d.getTime())) return isoDate;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const mapClaimItem = (item, index) => {
  const lineItems = item.items || item.claimItems || [];
  const firstLine = lineItems[0] || {};

  const totalClaimed =
    item.claimedAmount ??
    item.claim_amount ??
    item.claimed ??
    item.totalClaimed ??
    item.total_claimed ??
    item.totalClaimedAmount ??
    item.total_claimed_amount ??
    item.amount ??
    lineItems.reduce(
      (sum, line) =>
        sum + (Number(line.claimedAmount ?? line.claim_amount ?? line.amount) || 0),
      0,
    );

  const totalApproved =
    item.approvedAmount ??
    item.approved_amount ??
    item.totalApprovedAmount ??
    item.total_approved_amount ??
    lineItems.reduce(
      (sum, line) =>
        sum +
        (Number(line.approvedAmount ?? line.approved_amount ?? 0) || 0),
      0,
    );

  const claimNo =
    item.claimNo ||
    item.claim_no ||
    item.claimNumber ||
    item.claim_number ||
    item.referenceNo ||
    item.reference_no ||
    item.headName ||
    item.head_name ||
    item.reimbursementHeadName ||
    item.reimbursementHead ||
    (item._id ? String(item._id).slice(-8).toUpperCase() : null) ||
    `CLM${String(index + 1).padStart(3, '0')}`;

  return {
    id: item._id || item.claimId || item.id || claimNo || String(index),
    claimNo,
    claimedAmount: formatCurrency(totalClaimed),
    status:
      item.status ||
      item.claimStatus ||
      item.claim_status ||
      item.approvalStatus ||
      'Pending',
    approvedAmount: formatCurrency(totalApproved),
    claimDate: formatDate(
      item.claimDate ||
        item.claim_date ||
        item.date ||
        firstLine.claimDate ||
        firstLine.claim_date ||
        item.submittedOn ||
        item.createdAt,
    ),
    importedOn: formatDate(
      item.importedOn ||
        item.imported_on ||
        item.importedDate ||
        item.imported_date ||
        item.updatedAt ||
        item.createdAt,
    ),
  };
};

const mapReimbursementHead = (head, index) => {
  const id = head._id || head.id || head.headId || String(index);
  const label =
    head.name ||
    head.headName ||
    head.reimbursementName ||
    head.label ||
    head.title ||
    `Head ${index + 1}`;
  return {label, value: id, raw: head};
};

const PayrollClaims = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [headPickerVisible, setHeadPickerVisible] = useState(false);
  const [headPickerIndex, setHeadPickerIndex] = useState(null);
  const [activeDateIndex, setActiveDateIndex] = useState(null);
  const [showIOSDatePicker, setShowIOSDatePicker] = useState(false);

  const [claimsList, setClaimsList] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [reimbursementHeads, setReimbursementHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [entries, setEntries] = useState([{...EMPTY_ENTRY}]);
  const [comments, setComments] = useState('');
  const [summaryPeriod, setSummaryPeriod] = useState('');
  const [summaryReimbursementId, setSummaryReimbursementId] = useState('');

  const loadClaimsData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [summaryResult, headsResult] = await Promise.allSettled([
        apiClient.get(ENDPOINT.PAYROLL.MY_CLAIMS_SUMMARY),
        apiService.getReimbursementHeads(),
      ]);

      if (summaryResult.status === 'fulfilled') {
        const summaryRes = summaryResult.value?.data ?? {};
        let claimsRaw = findClaimsFromSummary(summaryRes);

        if (!claimsRaw.length) {
          try {
            const claimsResponse = await apiClient.get(
              ENDPOINT.PAYROLL.MY_CLAIMS,
            );
            claimsRaw = findClaimsFromSummary(claimsResponse?.data ?? {});
          } catch {
            // optional endpoint
          }
        }

        const root = summaryRes?.data ?? summaryRes;
        if (
          claimsRaw.length === 0 &&
          root &&
          typeof root === 'object' &&
          !Array.isArray(root)
        ) {
          const objectValues = Object.values(root).filter(isClaimRecord);
          if (objectValues.length) claimsRaw = objectValues;
        }

        if (__DEV__ && claimsRaw.length === 0) {
          console.log(
            'myClaimsSummary response:',
            JSON.stringify(summaryRes)?.slice(0, 1200),
          );
        }

        const summaryObj = {
          ...(typeof root === 'object' && !Array.isArray(root) ? root : {}),
          ...extractSummary(summaryRes),
        };
        setSummaryData(summaryObj);
        setClaimsList(claimsRaw.map(mapClaimItem));
      } else {
        const err = summaryResult.reason;
        Alert.alert(
          'Error',
          err?.message || 'Failed to load claims. Please try again.',
        );
      }

      if (headsResult.status === 'fulfilled') {
        const heads = extractArray(headsResult.value).map(mapReimbursementHead);
        setReimbursementHeads(heads);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to load claims. Please try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadClaimsData();
  }, [loadClaimsData]);

  const summaryFields = {
    eligibility: summaryData.eligibility ?? summaryData.eligibleAmount,
    annual: summaryData.annual ?? summaryData.annualLimit,
    claimed: summaryData.claimed ?? summaryData.totalClaimed,
    paid: summaryData.paid ?? summaryData.totalPaid,
    pending: summaryData.pending ?? summaryData.totalPending,
    current: summaryData.current ?? summaryData.currentClaim,
    balance:
      summaryData.balance ??
      summaryData.availableBalance ??
      summaryData.balanceAvailable,
  };

  const addRow = () => {
    setEntries(prev => [...prev, {...EMPTY_ENTRY}]);
  };

  const removeRow = index => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated.length ? updated : [{...EMPTY_ENTRY}]);
  };

  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const selectHead = (index, head) => {
    const updated = [...entries];
    updated[index].headId = head.value;
    updated[index].headName = head.label;
    if (!updated[index].name) {
      updated[index].name = head.label;
    }
    if (!updated[index].type && head.raw?.type) {
      updated[index].type = head.raw.type;
    }
    setEntries(updated);
    setHeadPickerVisible(false);
    setHeadPickerIndex(null);
  };

  const openClaimDatePicker = index => {
    const current = entries[index]?.claimDate;
    const parsed = current ? new Date(toApiDate(current)) : new Date();
    const value = Number.isNaN(parsed.getTime()) ? new Date() : parsed;

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'date',
        onChange: (event, selected) => {
          if (event.type === 'set' && selected) {
            const iso = selected.toISOString().split('T')[0];
            updateField(index, 'claimDate', iso);
          }
        },
      });
    } else {
      setActiveDateIndex(index);
      setShowIOSDatePicker(true);
    }
  };

  const pickProofFile = index => {
    launchImageLibrary({mediaType: 'mixed', selectionLimit: 1}, response => {
      if (response.didCancel || response.errorMessage) return;
      const asset = response.assets?.[0];
      if (!asset) return;
      const updated = [...entries];
      updated[index].proofFile = asset;
      updated[index].proofFileName =
        asset.fileName || asset.uri?.split('/').pop() || 'File selected';
      setEntries(updated);
    });
  };

  const openNewRequest = () => {
    setEntries([{...EMPTY_ENTRY}]);
    setComments('');
    setModalVisible(true);
    loadClaimsData(true);
  };

  const validateEntries = () => {
    for (let i = 0; i < entries.length; i++) {
      const row = entries[i];
      if (!row.claimDate?.trim()) {
        return `Row ${i + 1}: Claim date is required.`;
      }
      if (!row.headId) {
        return `Row ${i + 1}: Please select a reimbursement head.`;
      }
      if (!row.claimedAmount || Number(row.claimedAmount) <= 0) {
        return `Row ${i + 1}: Enter a valid amount.`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateEntries();
    if (validationError) {
      Alert.alert('Validation', validationError);
      return;
    }

    const payload = {
      items: entries.map(row => ({
        claimDate: toApiDate(row.claimDate),
        billNo: row.billNo?.trim() || '',
        headId: row.headId,
        claimedAmount: Number(row.claimedAmount),
        particulars: row.particulars?.trim() || '',
        description: row.description?.trim() || row.particulars?.trim() || '',
        name: row.name?.trim() || row.headName || '',
        type: row.type?.trim() || '',
      })),
      comments: comments.trim(),
    };

    setSubmitting(true);
    try {
      const response = await apiService.submitClaim(payload);
      const submittedClaims = findClaimsFromSummary(response);
      if (submittedClaims.length) {
        setClaimsList(prev => [
          ...submittedClaims.map((item, idx) => mapClaimItem(item, idx)),
          ...prev,
        ]);
      }
      Alert.alert(
        'Success',
        response?.message || 'Claim submitted successfully.',
      );
      setModalVisible(false);
      setEntries([{...EMPTY_ENTRY}]);
      setComments('');
      await loadClaimsData(true);
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to submit claim. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = status => {
    const s = (status || '').toLowerCase();
    if (s.includes('approv')) return '#16A34A';
    if (s.includes('reject')) return '#EF4444';
    return '#F59E0B';
  };

  const selectedSummaryHead = reimbursementHeads.find(
    h => h.value === summaryReimbursementId,
  );

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadClaimsData(true)}
          />
        }>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Claims</Text>
          <View style={{width: 24}} />
        </View>

        <PayrollTabs navigation={navigation} activeTab="Claims" />

        <View style={styles.claimHeader}>
          <TouchableOpacity
            style={styles.summaryBtn}
            // onPress={() => setSummaryModalVisible(true)}
            >
            <Text style={styles.summaryBtnText}>Summary Report</Text>
          </TouchableOpacity>

          <View style={styles.headerBtnRow}>
            <TouchableOpacity
              style={styles.newRequestBtn}
              onPress={openNewRequest}>
              <Text style={styles.newRequestText}>+ New Request</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator
            size="large"
            color="#2952E3"
            style={{marginTop: 40}}
          />
        ) : (
          <View style={styles.claimsContainer}>
            {claimsList.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No claims found</Text>
                <Text style={styles.emptySubtext}>
                  Tap "+ New Request" to submit a reimbursement claim.
                </Text>
              </View>
            ) : (
              claimsList.map(item => (
                <View key={item.id} style={styles.claimCard}>
                  <View style={styles.row}>
                    <View style={styles.itemBox}>
                      <Text style={styles.label}>Claim No</Text>
                      <Text style={styles.value}>{item.claimNo}</Text>
                    </View>
                    <View style={styles.itemBox}>
                      <Text style={styles.label}>Claim Amount</Text>
                      <Text style={styles.value}>{item.claimedAmount}</Text>
                    </View>
                    <View style={styles.itemBox}>
                      <Text
                        style={[
                          styles.statusText,
                          {color: getStatusColor(item.status)},
                        ]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.row, {marginTop: 18}]}>
                    <View style={styles.itemBox}>
                      <Text style={styles.label}>Approved Amount</Text>
                      <Text style={styles.value}>{item.approvedAmount}</Text>
                    </View>
                    <View style={styles.itemBox}>
                      <Text style={styles.label}>Claim Date</Text>
                      <Text style={styles.value}>{item.claimDate}</Text>
                    </View>
                    <View style={styles.itemBox}>
                      <Text style={styles.label}>Imported On</Text>
                      <Text style={styles.value}>{item.importedOn}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.createClaimModal}>
          <View style={styles.createClaimHeader}>
            <Text style={styles.createClaimTitle}>Create Claim</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.createClaimBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.claimItemsHeader}>
              <Text style={styles.claimItemsTitle}>Claim Items</Text>
              <TouchableOpacity style={styles.insertRowBtn} onPress={addRow}>
                <Text style={styles.insertRowBtnText}>Insert Row</Text>
              </TouchableOpacity>
            </View>

            {entries.map((item, index) => (
              <View key={`claim-row-${index}`} style={styles.claimItemCard}>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.fieldLabel}>Claim Date</Text>
                    <TouchableOpacity
                      style={styles.fieldInput}
                      onPress={() => openClaimDatePicker(index)}>
                      <Text
                        style={
                          item.claimDate
                            ? styles.fieldInputText
                            : styles.fieldPlaceholder
                        }>
                        {item.claimDate
                          ? formatDisplayDate(item.claimDate)
                          : 'mm/dd/yyyy'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.fieldLabel}>Bill No</Text>
                    <TextInput
                      placeholder="Ex. B-001"
                      placeholderTextColor="#9CA3AF"
                      style={styles.fieldInput}
                      value={item.billNo}
                      onChangeText={text =>
                        updateField(index, 'billNo', text)
                      }
                    />
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Head</Text>
                <TouchableOpacity
                  style={[styles.fieldInput, styles.fieldInputRow]}
                  onPress={() => {
                    setHeadPickerIndex(index);
                    setHeadPickerVisible(true);
                  }}>
                  <Text
                    style={[
                      item.headName
                        ? styles.fieldInputText
                        : styles.fieldPlaceholder,
                      {flex: 1},
                    ]}>
                    {item.headName || 'Select Head'}
                  </Text>
                  <Text style={styles.fieldDropdownArrow}>▼</Text>
                </TouchableOpacity>

                <View style={styles.fieldRow}>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.fieldLabel}>Claimed Amount</Text>
                    <TextInput
                      placeholder="Ex. 1000"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      style={styles.fieldInput}
                      value={item.claimedAmount}
                      onChangeText={text =>
                        updateField(index, 'claimedAmount', text)
                      }
                    />
                  </View>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.fieldLabel}>Particulars</Text>
                    <TextInput
                      placeholder="Ex. Medical expenses"
                      placeholderTextColor="#9CA3AF"
                      style={styles.fieldInput}
                      value={item.particulars}
                      onChangeText={text =>
                        updateField(index, 'particulars', text)
                      }
                    />
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  placeholder="Ex. Consultation charges"
                  placeholderTextColor="#9CA3AF"
                  style={styles.fieldInput}
                  value={item.description}
                  onChangeText={text =>
                    updateField(index, 'description', text)
                  }
                />

                <View style={styles.fieldRow}>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.fieldLabel}>Name</Text>
                    <TextInput
                      placeholder="Ex. Fuel reimbursement"
                      placeholderTextColor="#9CA3AF"
                      style={styles.fieldInput}
                      value={item.name}
                      onChangeText={text => updateField(index, 'name', text)}
                    />
                  </View>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.fieldLabel}>Type</Text>
                    <TextInput
                      placeholder="Ex. FUEL"
                      placeholderTextColor="#9CA3AF"
                      style={styles.fieldInput}
                      value={item.type}
                      onChangeText={text => updateField(index, 'type', text)}
                    />
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Proof File</Text>
                <View style={styles.proofFileRow}>
                  <TouchableOpacity
                    style={styles.chooseFileBtn}
                    onPress={() => pickProofFile(index)}>
                    <Text style={styles.chooseFileBtnText}>Choose File</Text>
                  </TouchableOpacity>
                  <Text style={styles.proofFileName} numberOfLines={1}>
                    {item.proofFileName || 'No file chosen'}
                  </Text>
                </View>

                {entries.length > 1 && (
                  <TouchableOpacity
                    style={styles.rowDeleteBtn}
                    onPress={() => removeRow(index)}>
                    <Feather name="trash-2" size={20} color="#DC2626" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <Text style={styles.commentsSectionTitle}>Comments</Text>
            <TextInput
              placeholder="Ex. Please attach bill scan for claim review"
              placeholderTextColor="#9CA3AF"
              multiline
              style={styles.commentsInput}
              value={comments}
              onChangeText={setComments}
            />

            <View style={styles.bottomBtnRow}>
              <TouchableOpacity
                style={styles.draftBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.draftBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {showIOSDatePicker && activeDateIndex !== null && Platform.OS === 'ios' && (
            <DateTimePicker
              value={
                entries[activeDateIndex]?.claimDate
                  ? new Date(toApiDate(entries[activeDateIndex].claimDate))
                  : new Date()
              }
              mode="date"
              display="spinner"
              onChange={(event, selected) => {
                if (event.type === 'dismissed') {
                  setShowIOSDatePicker(false);
                  setActiveDateIndex(null);
                  return;
                }
                if (selected) {
                  const iso = selected.toISOString().split('T')[0];
                  updateField(activeDateIndex, 'claimDate', iso);
                }
                setShowIOSDatePicker(false);
                setActiveDateIndex(null);
              }}
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={summaryModalVisible}
        transparent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.summaryModalBox}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryHeading}>Claim Summary Report</Text>
              <TouchableOpacity
                onPress={() => setSummaryModalVisible(false)}
                style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Period</Text>
            <TextInput
              placeholder="e.g. Apr 2025 - Mar 2026"
              style={styles.popupInput}
              value={summaryPeriod}
              onChangeText={setSummaryPeriod}
            />

            <Text style={styles.inputLabel}>Reimbursement</Text>
            <TouchableOpacity
              style={styles.headSelect}
              onPress={() => setHeadPickerVisible(true)}>
              <Text
                style={
                  selectedSummaryHead
                    ? styles.headSelectText
                    : styles.headSelectPlaceholder
                }>
                {selectedSummaryHead?.label || 'Select Reimbursement'}
              </Text>
              <Text style={styles.headSelectArrow}>▼</Text>
            </TouchableOpacity>

            <View style={styles.summaryPreviewBox}>
              <Text style={styles.summaryPreviewTitle}>Summary</Text>
              <View style={styles.summaryPreviewRow}>
                <Text style={styles.summaryPreviewLabel}>Claimed</Text>
                <Text style={styles.summaryPreviewValue}>
                  {formatCurrency(summaryFields.claimed)}
                </Text>
              </View>
              <View style={styles.summaryPreviewRow}>
                <Text style={styles.summaryPreviewLabel}>Paid</Text>
                <Text style={styles.summaryPreviewValue}>
                  {formatCurrency(summaryFields.paid)}
                </Text>
              </View>
              <View style={styles.summaryPreviewRow}>
                <Text style={styles.summaryPreviewLabel}>Pending</Text>
                <Text style={styles.summaryPreviewValue}>
                  {formatCurrency(summaryFields.pending)}
                </Text>
              </View>
              <View style={styles.summaryPreviewRow}>
                <Text style={styles.summaryPreviewLabel}>Balance</Text>
                <Text style={styles.summaryPreviewValue}>
                  {formatCurrency(summaryFields.balance)}
                </Text>
              </View>
              {summaryPeriod ? (
                <Text style={styles.summaryPeriodText}>
                  Period: {summaryPeriod}
                </Text>
              ) : null}
              {selectedSummaryHead ? (
                <Text style={styles.summaryPeriodText}>
                  Head: {selectedSummaryHead.label}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.previewBtn}
              onPress={() => setSummaryModalVisible(false)}>
              <Text style={styles.previewBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={headPickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.headPickerBox}>
            <Text style={styles.headPickerTitle}>Select Reimbursement Head</Text>
            <ScrollView style={{maxHeight: 320}}>
              {reimbursementHeads.length === 0 ? (
                <Text style={styles.emptySubtext}>
                  No reimbursement heads available
                </Text>
              ) : (
                reimbursementHeads.map(head => (
                  <TouchableOpacity
                    key={head.value}
                    style={styles.headPickerItem}
                    onPress={() => {
                      if (headPickerIndex !== null) {
                        selectHead(headPickerIndex, head);
                      } else {
                        setSummaryReimbursementId(head.value);
                        setHeadPickerVisible(false);
                      }
                    }}>
                    <Text style={styles.headPickerItemText}>{head.label}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.previewBtn}
              onPress={() => {
                setHeadPickerVisible(false);
                setHeadPickerIndex(null);
              }}>
              <Text style={styles.previewBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PayrollClaims;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1F1',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F1F1',
    paddingBottom: 40,
  },

  createClaimModal: {
    flex: 1,
    backgroundColor: '#F5F1F1',
  },

  createClaimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#EDE8E8',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  createClaimTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  createClaimBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },

  claimItemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  claimItemsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  insertRowBtn: {
    backgroundColor: '#2952E3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  insertRowBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  claimItemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
    position: 'relative',
  },

  fieldRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  fieldHalf: {
    flex: 1,
    marginRight: 10,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  fieldInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#111',
    marginBottom: 12,
    justifyContent: 'center',
  },

  fieldInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  fieldInputText: {
    fontSize: 14,
    color: '#111',
  },

  fieldPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  fieldDropdownArrow: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 8,
  },

  proofFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  chooseFileBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  chooseFileBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  proofFileName: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
  },

  rowDeleteBtn: {
    alignSelf: 'flex-end',
    padding: 6,
    marginTop: 4,
  },

  commentsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
    marginTop: 4,
  },

  commentsInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    color: '#111',
    textAlignVertical: 'top',
    marginBottom: 24,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    marginBottom: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    marginBottom: 20,
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

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },

  claimHeader: {
    marginTop: 18,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },

  newRequestBtn: {
    backgroundColor: '#2952E3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  summaryBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  newRequestText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  claimsContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 30,
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },

  emptySubtext: {
    marginTop: 8,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },

  claimCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  itemBox: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    color: '#777',
    marginBottom: 4,
  },

  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },

  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginHorizontal: 16,
    marginBottom: 14,
    marginTop: 18,
  },

  inputLabel: {
    marginHorizontal: 16,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  input: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 14,
  },

  headSelect: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headSelectText: {
    fontSize: 14,
    color: '#111',
    flex: 1,
  },

  headSelectPlaceholder: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },

  headSelectArrow: {
    fontSize: 12,
    color: '#555',
  },

  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  summaryBox: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  balanceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },

  balanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
  },

  entryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 14,
  },

  insertBtn: {
    backgroundColor: '#2952E3',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  insertBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  totalCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
  },

  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  commentInput: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 30,
  },

  bottomBtnRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 40,
  },

  draftBtn: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },

  draftBtnText: {
    fontWeight: '700',
    color: '#111',
  },

  submitBtn: {
    flex: 1,
    backgroundColor: '#2952E3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
  },

  submitDisabled: {
    opacity: 0.7,
  },

  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  deleteBtn: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },

  deleteBtnText: {
    color: '#DC2626',
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  summaryModalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
  },

  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  summaryHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  popupInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
    fontSize: 14,
  },

  summaryPreviewBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  summaryPreviewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },

  summaryPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  summaryPreviewLabel: {
    fontSize: 13,
    color: '#666',
  },

  summaryPreviewValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },

  summaryPeriodText: {
    marginTop: 6,
    fontSize: 12,
    color: '#555',
  },

  previewBtn: {
    backgroundColor: '#2952E3',
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },

  previewBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  headPickerBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    maxHeight: '70%',
  },

  headPickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },

  headPickerItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },

  headPickerItemText: {
    fontSize: 14,
    color: '#111',
  },
});
