import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const formatRs = value => {
  const num = Number(value);
  if (Number.isNaN(num)) return 'Rs. 0';
  return `Rs. ${num.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
};

const formatGeneratedDate = value => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const toDisplayText = value => {
  if (value == null || value === '') return '—';
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'object') {
    const fullName = [value.firstName, value.lastName].filter(Boolean).join(' ');
    if (fullName) return fullName;
    return (
      value.name ||
      value.employeeName ||
      value.employeeId ||
      value.code ||
      value.email ||
      '—'
    );
  }
  return String(value);
};

const extractLineItems = (source, keys) => {
  if (!source) return [];
  if (Array.isArray(source)) {
    return source.map(row => ({
      label:
        row.name ||
        row.label ||
        row.componentName ||
        row.earningName ||
        row.deductionName ||
        row.title ||
        '—',
      amount:
        row.amount ??
        row.value ??
        row.total ??
        row.earningAmount ??
        row.deductionAmount ??
        0,
    }));
  }
  if (typeof source === 'object') {
    return Object.entries(source).map(([label, amount]) => ({
      label,
      amount: Number(amount) || 0,
    }));
  }
  return [];
};

export const buildPayslipDetail = raw => {
  if (!raw) return null;
  const employeeObj = raw.employee && typeof raw.employee === 'object' ? raw.employee : {};

  const earnings = extractLineItems(
    raw.earnings ||
      raw.earningComponents ||
      raw.earningBreakup ||
      raw.earningsList,
    [],
  );
  const deductions = extractLineItems(
    raw.deductions ||
      raw.deductionComponents ||
      raw.deductionBreakup ||
      raw.deductionsList,
    [],
  );

  const grossTotal =
    raw.grossIncomeTotal ??
    raw.grossTotal ??
    raw.grossPay ??
    raw.grossSalary ??
    earnings.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  const deductionTotal =
    raw.totalDeductions ??
    raw.totalDeduction ??
    raw.deduction ??
    deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0);

  const netSalary =
    raw.netSalary ?? raw.netPay ?? raw.net_pay ?? grossTotal - deductionTotal;

  if (!earnings.length && grossTotal) {
    earnings.push({label: 'Gross Salary', amount: grossTotal});
  }
  if (!deductions.length && deductionTotal) {
    deductions.push({label: 'Total Deductions', amount: deductionTotal});
  }

  const maxRows = Math.max(earnings.length, deductions.length, 1);
  const rows = [];
  for (let i = 0; i < maxRows; i++) {
    rows.push({
      earning: earnings[i]?.label || '',
      earningAmt: earnings[i] ? formatRs(earnings[i].amount) : '',
      deduction: deductions[i]?.label || '',
      deductionAmt: deductions[i] ? formatRs(deductions[i].amount) : '',
    });
  }

  return {
    companyName:
      raw.organizationName ||
      raw.companyName ||
      raw.orgName ||
      'Nagar Software Solution',
    companyAddress:
      raw.organizationAddress ||
      raw.companyAddress ||
      raw.orgAddress ||
      '',
    period:
      raw.period ||
      raw.payPeriod ||
      raw.monthYear ||
      raw.payMonth ||
      '—',
    employeeName: toDisplayText(
      raw.employeeName ||
        employeeObj.name ||
        [employeeObj.firstName, employeeObj.lastName].filter(Boolean).join(' ') ||
        raw.name,
    ),
    employeeId:
      toDisplayText(
        raw.employeeId ||
          raw.employeeCode ||
          raw.empId ||
          employeeObj.employeeId ||
          employeeObj._id,
      ),
    department:
      toDisplayText(
        raw.department ||
          raw.departmentName ||
          employeeObj.department?.name ||
          employeeObj.department,
      ),
    bankAccount:
      toDisplayText(
        raw.bankAccount ||
          raw.bankAccountNo ||
          raw.bankAcNo ||
          raw.accountNumber ||
          employeeObj.bankAccountNo,
      ),
    status: toDisplayText(raw.status || raw.paymentStatus || 'processed'),
    generated:
      formatGeneratedDate(
        raw.generatedDate || raw.generatedOn || raw.createdAt || raw.payDate,
      ),
    pan: toDisplayText(raw.pan || raw.panNumber || employeeObj.pan),
    bankName: toDisplayText(raw.bankName || raw.bank || employeeObj.bankName),
    rows,
    grossTotal: formatRs(grossTotal),
    deductionTotal: formatRs(deductionTotal),
    netSalary: formatRs(netSalary),
  };
};

const InfoCell = ({label, value}) => (
  <View style={styles.infoCell}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const PayslipDetailModal = ({visible, payslip, onClose}) => {
  const detail = buildPayslipDetail(payslip);

  if (!detail) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Salary Slip</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.companyCard}>
              <Text style={styles.companyLogo}>NS</Text>
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{detail.companyName}</Text>
                {detail.companyAddress ? (
                  <Text style={styles.companyAddress}>{detail.companyAddress}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <InfoCell label="Period" value={detail.period} />
                <InfoCell label="Employee Name" value={detail.employeeName} />
                <InfoCell label="Employee ID" value={detail.employeeId} />
                <InfoCell label="Department" value={detail.department} />
                <InfoCell label="Bank A/C No." value={detail.bankAccount} />
              </View>
              <View style={styles.infoCol}>
                <InfoCell label="Status" value={detail.status} />
                <InfoCell label="Generated" value={detail.generated} />
                <InfoCell label="PAN" value={detail.pan} />
                <InfoCell label="Bank Name" value={detail.bankName} />
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.th, styles.thEarning]}>Earning</Text>
                <Text style={[styles.th, styles.thAmt]}>Amount (INR)</Text>
                <Text style={[styles.th, styles.thEarning]}>Deductions</Text>
                <Text style={[styles.th, styles.thAmt]}>Amount (INR)</Text>
              </View>

              {detail.rows.map((row, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.td, styles.tdEarning]}>{row.earning}</Text>
                  <Text style={[styles.td, styles.tdAmt]}>{row.earningAmt}</Text>
                  <Text style={[styles.td, styles.tdEarning]}>{row.deduction}</Text>
                  <Text style={[styles.td, styles.tdAmt]}>{row.deductionAmt}</Text>
                </View>
              ))}

              <View style={styles.tableFooterRow}>
                <Text style={[styles.tdBold, styles.tdEarning]}>Gross Income Total</Text>
                <Text style={[styles.tdBold, styles.tdAmt]}>{detail.grossTotal}</Text>
                <Text style={[styles.tdBold, styles.tdEarning]}>Total Deductions</Text>
                <Text style={[styles.tdBold, styles.tdAmt]}>{detail.deductionTotal}</Text>
              </View>
            </View>

            <View style={styles.netRow}>
              <View style={styles.netLabelBox}>
                <Text style={styles.netLabel}>Net Salary</Text>
              </View>
              <View style={styles.netValueBox}>
                <Text style={styles.netValue}>{detail.netSalary}</Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.statusFooter}>Status: {detail.status}</Text>
              <Text style={styles.generatedFooter}>
                Computer generated salary slip
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PayslipDetailModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 12,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 20,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#1E3A5F',
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 44,
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  companyAddress: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  infoCol: {
    flex: 1,
    paddingRight: 6,
  },
  infoCell: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },
  table: {
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    borderBottomWidth: 1,
    borderBottomColor: '#93C5FD',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    minHeight: 32,
    alignItems: 'center',
  },
  tableFooterRow: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
  },
  th: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  td: {
    fontSize: 10,
    color: '#111',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tdBold: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  thEarning: {flex: 1.2},
  thAmt: {flex: 0.9, textAlign: 'right'},
  tdEarning: {flex: 1.2},
  tdAmt: {flex: 0.9, textAlign: 'right'},
  netRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  netLabelBox: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  netLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },
  netValueBox: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 100,
    alignItems: 'flex-end',
  },
  netValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusFooter: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  generatedFooter: {
    fontSize: 9,
    color: '#9CA3AF',
  },
});
