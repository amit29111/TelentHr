import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';

import PayrollTabs from './PayrollTabs';
import apiService from '../api/apiService';

const extractArray = payload => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  if (payload.data && typeof payload.data === 'object') {
    for (const key of ['list', 'records', 'items', 'requests', 'vpfRequests']) {
      if (Array.isArray(payload.data[key])) return payload.data[key];
    }
  }
  for (const key of ['list', 'records', 'items', 'requests']) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
};

const extractObject = payload => {
  if (!payload) return null;
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data;
  }
  if (typeof payload === 'object' && !Array.isArray(payload)) return payload;
  return null;
};

const formatDate = value => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'});
};

const formatDateTime = value => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const PayrollRequests = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [contributionType, setContributionType] = useState('percentage');
  const [percentageValue, setPercentageValue] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [requestData, setRequestData] = useState([]);

  const loadVpfData = useCallback(async () => {
    setLoading(true);
    try {
      const [currentRes, allRes] = await Promise.allSettled([
        apiService.getMyVpfConfig(),
        apiService.getAllVpfRequests(),
      ]);

      setCurrentConfig(
        currentRes.status === 'fulfilled' ? extractObject(currentRes.value) : null,
      );
      setRequestData(
        allRes.status === 'fulfilled' ? extractArray(allRes.value) : [],
      );
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to load VPF data.');
      setCurrentConfig(null);
      setRequestData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVpfData();
  }, [loadVpfData]);

  const openRequestModal = () => {
    setContributionType('percentage');
    setPercentageValue('');
    setFixedAmount('');
    setAcknowledged(false);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    const value = contributionType === 'percentage' ? percentageValue : fixedAmount;
    const numericValue = Number(value);

    if (!value || Number.isNaN(numericValue) || numericValue <= 0) {
      Alert.alert('Validation', 'Please enter a valid contribution value.');
      return;
    }
    if (!acknowledged) {
      Alert.alert('Validation', 'Please acknowledge before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.startVpfRequest({
        contributionType,
        contributionValue: numericValue,
        acknowledged: true,
      });
      Alert.alert('Success', 'VPF request submitted successfully.');
      setModalVisible(false);
      loadVpfData();
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to submit VPF request.');
    } finally {
      setSubmitting(false);
    }
  };

  const vpfConfig = currentConfig?.vpf || currentConfig || null;
  const vpfBasicSalary = currentConfig?.basicSalary ?? vpfConfig?.basicSalary ?? 0;
  const vpfContributionType = vpfConfig?.contributionType || vpfConfig?.type || '—';
  const vpfContributionValue =
    vpfContributionType === 'percentage'
      ? vpfConfig?.percentage ?? vpfConfig?.contributionValue ?? 0
      : vpfConfig?.fixedAmount ?? vpfConfig?.contributionValue ?? 0;
  const vpfEstimatedMonthly =
    currentConfig?.estimatedMonthlyVpf ??
    vpfConfig?.estimatedMonthlyVpf ??
    vpfConfig?.fixedAmount ??
    0;

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Requests</Text>
          <View style={{width: 24}} />
        </View>

        <PayrollTabs navigation={navigation} activeTab="Requests" />

        <View style={styles.content}>
          <TouchableOpacity style={styles.requestBtn} onPress={openRequestModal}>
            <Text style={styles.requestBtnText}>+ New Request</Text>
          </TouchableOpacity>
          <Text style={styles.description}>
            Submit VPF request and track your contribution configuration details.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2952E3" style={{marginTop: 24}} />
        ) : (
          <>
            {vpfConfig ? (
              <View style={styles.configCard}>
                <View style={styles.configHeaderRow}>
                  <View>
                    <Text style={styles.configTitle}>Current VPF Configuration</Text>
                    <Text style={styles.configSubTitle}>
                      Voluntary Provident Fund contribution details
                    </Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>
                      {(vpfConfig.status || 'ACTIVE').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Contribution Type</Text>
                    <Text style={styles.metricValue}>
                      {vpfContributionType}
                    </Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Basic Salary</Text>
                    <Text style={styles.metricValue}>₹{vpfBasicSalary}</Text>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Monthly Contribution</Text>
                    <Text style={styles.metricValue}>
                      {vpfContributionType === 'percentage'
                        ? `${vpfContributionValue}%`
                        : `₹${vpfContributionValue}`}
                    </Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Estimated Monthly VPF</Text>
                    <Text style={styles.metricValue}>₹{vpfEstimatedMonthly}</Text>
                  </View>
                </View>

                
              </View>
            ) : null}

            <View style={styles.cardContainer}>
                <View style={styles.card}>
                  <View style={styles.infoRow}>
                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>Effective From</Text>
                    <Text style={styles.infoValue}>{formatDate(vpfConfig.effectiveFrom)}</Text>
                  </View>
                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>Requested At</Text>
                    <Text style={styles.infoValue}>
                      {formatDateTime(vpfConfig.requestedAt || vpfConfig.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>Employee Acknowledgement</Text>
                    <View
                      style={[
                        styles.ackBadge,
                        vpfConfig.acknowledged ? styles.ackBadgeYes : styles.ackBadgeNo,
                      ]}>
                      <Text
                        style={[
                          styles.ackBadgeText,
                          vpfConfig.acknowledged ? styles.ackTextYes : styles.ackTextNo,
                        ]}>
                        {vpfConfig.acknowledged ? 'Acknowledged' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                </View>
                </View>
              {/* {requestData.length === 0 ? (
                <View style={styles.card}>
                  <Text style={styles.emptyText}>No VPF requests found.</Text>
                </View>
              ) : null} */}
            </View>
          </>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>VPF Request</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setContributionType('percentage')}>
              <View style={styles.radioOuter}>
                {contributionType === 'percentage' ? <View style={styles.radioInner} /> : null}
              </View>
              <View style={{flex: 1}}>
                <View style={styles.inlineRow}>
                  <Text style={styles.radioTextInline}>I would like to contribute</Text>
                  <TextInput
                    style={styles.inlineInput}
                    value={percentageValue}
                    onChangeText={setPercentageValue}
                    keyboardType="numeric"
                    placeholder="%"
                  />
                  <Text style={styles.radioTextInline}>of my basic salary per month</Text>
                </View>
                <Text style={styles.radioText}>towards Voluntary Provident Fund</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioRow} onPress={() => setContributionType('fixed')}>
              <View style={styles.radioOuter}>
                {contributionType === 'fixed' ? <View style={styles.radioInner} /> : null}
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.radioTextInline}>
                  I would like to contribute a fixed amount of Rs.
                </Text>
                <View style={[styles.inlineRow, {marginTop: 6}]}>
                  <TextInput
                    style={styles.inlineInputWide}
                    value={fixedAmount}
                    onChangeText={setFixedAmount}
                    keyboardType="numeric"
                    placeholder="Amount"
                  />
                  <Text style={styles.radioTextInline}>per month towards VPF</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAcknowledged(!acknowledged)}>
              <View style={styles.checkboxOuter}>
                {acknowledged ? <View style={styles.checkboxInner} /> : null}
              </View>
              <Text style={styles.radioText}>
                I understand that this instruction will be processed in next processing cycle
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>SUBMIT</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PayrollRequests;

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
  content: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  requestBtn: {
    backgroundColor: '#2952E3',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  requestBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
  },
  configCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#EFFBFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8F0F8',
    padding: 14,
  },
  configHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  configSubTitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  activeBadge: {
    backgroundColor: '#E8F7EC',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeBadgeText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  infoBlock: {
    flex: 1,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  ackBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 2,
  },
  ackBadgeYes: {
    backgroundColor: '#E8F7EC',
  },
  ackBadgeNo: {
    backgroundColor: '#FEF3C7',
  },
  ackBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  ackTextYes: {
    color: '#15803D',
  },
  ackTextNo: {
    color: '#B45309',
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 30,
  },
  card: {
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
    marginBottom: 6,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  emptyText: {
    fontSize: 13,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#2952E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2952E3',
  },
  radioText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: '#333',
  },
  radioTextInline: {
    fontSize: 14,
    color: '#333',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  inlineInput: {
    width: 70,
    height: 34,
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 6,
    marginHorizontal: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  inlineInputWide: {
    width: 120,
    height: 34,
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#6B7280',
    borderRadius: 4,
    marginTop: 2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#2952E3',
  },
  bottomBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  cancelBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2952E3',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelBtnText: {
    color: '#2952E3',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#2952E3',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 98,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
