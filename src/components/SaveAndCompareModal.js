import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const money = value =>
  `₹${Number(value || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}`;

const CompareRow = ({label, oldValue, newValue, highlight, subLabel}) => (
  <View style={[styles.row, highlight && styles.rowHighlight]}>
    <Text style={[styles.rowLabel, highlight && styles.rowLabelBold]} numberOfLines={3}>
      {label}
      {subLabel ? (
        <Text style={styles.subLabel}>{'\n'}{subLabel}</Text>
      ) : null}
    </Text>
    <Text style={[styles.colValue, highlight && styles.colValueBold]}>
      {oldValue}
    </Text>
    <Text style={[styles.colValue, highlight && styles.colValueBold]}>
      {newValue}
    </Text>
  </View>
);

const SaveAndCompareModal = ({
  visible,
  data,
  selectedTaxRegime = 'new',
  onTaxRegimeChange,
  onClose,
  onSubmit,
  submitting = false,
}) => {
  if (!data) return null;

  const earnings = data.earnings || {};
  const oldR = data.oldRegime || {};
  const newR = data.newRegime || {};
  const oldEx = oldR.exemptionsBasedOnDeclaration || {};
  const recommended = data.recommendedRegime === 'new' ? 'new' : 'old';
  const fy = data.financialYear || '';
  const regime = selectedTaxRegime === 'old' ? 'old' : 'new';

  const oldTaxAfterRebate =
    (Number(oldR.taxOnTotalTaxableIncome) || 0) -
    (Number(oldR.rebateUnderSection87A) || 0);
  const newTaxAfterRebate =
    (Number(newR.taxOnTotalTaxableIncome) || 0) -
    (Number(newR.rebateUnderSection87A) || 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Save & Compare</Text>
            <Text style={styles.headerFy}>FY {fy}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {data.taxSavingAmount > 0 && recommended === 'new' ? (
            <View style={styles.savingBanner}>
              <Text style={styles.savingBannerText}>
                Recommended: New Tax Regime — save {money(data.taxSavingAmount)} vs Old
              </Text>
            </View>
          ) : data.taxSavingAmount > 0 && recommended === 'old' ? (
            <View style={[styles.savingBanner, styles.savingBannerOld]}>
              <Text style={styles.savingBannerText}>
                Recommended: Old Tax Regime — save {money(data.taxSavingAmount)} vs New
              </Text>
            </View>
          ) : null}

          <View style={styles.regimePickerBox}>
            <Text style={styles.regimePickerTitle}>Select Tax Regime to Submit</Text>
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => onTaxRegimeChange?.('old')}
              activeOpacity={0.8}>
              <View
                style={[
                  styles.radioOuter,
                  regime === 'old' && styles.radioOuterSelected,
                ]}>
                {regime === 'old' ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.radioLabel}>Old Tax Regime</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => onTaxRegimeChange?.('new')}
              activeOpacity={0.8}>
              <View
                style={[
                  styles.radioOuter,
                  regime === 'new' && styles.radioOuterSelected,
                ]}>
                {regime === 'new' ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.radioLabel}>New Tax Regime</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.columnsHeader}>
              <Text style={styles.colHeaderLabel} />
              <Text
                style={[
                  styles.colHeader,
                  regime === 'old' && styles.colHeaderSelected,
                ]}>
                Old Tax{'\n'}Regime
              </Text>
              <Text
                style={[
                  styles.colHeader,
                  regime === 'new' && styles.colHeaderSelected,
                ]}>
                New Tax{'\n'}Regime
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Earnings</Text>
            <CompareRow
              label="Gross Salary"
              oldValue={money(earnings.grossSalary)}
              newValue={money(earnings.grossSalary)}
            />
            <CompareRow
              label="Income from Other Sources"
              oldValue={money(earnings.incomeFromOtherSources)}
              newValue={money(earnings.incomeFromOtherSources)}
            />
            <CompareRow
              label="Gross Total Income"
              oldValue={money(earnings.grossTotalIncome)}
              newValue={money(earnings.grossTotalIncome)}
              highlight
            />

            <Text style={styles.sectionTitle}>Exemptions Based on your Declaration</Text>
            <CompareRow
              label="Allowance Exemptions"
              oldValue={money(oldEx.allowanceExemptions)}
              newValue="—"
            />
            <CompareRow
              label="Under Section 16"
              oldValue={money(oldEx.underSection16)}
              newValue="—"
            />
            <CompareRow
              label="80C Investments"
              subLabel={
                oldEx.investments80CMaxLimit
                  ? `(Max Limit: ${Number(oldEx.investments80CMaxLimit).toLocaleString('en-IN')})`
                  : '(Max Limit: 150000)'
              }
              oldValue={money(oldEx.investments80C)}
              newValue="—"
            />
            <CompareRow
              label="80D Investments"
              oldValue={money(oldEx.investments80D)}
              newValue="—"
            />
            <CompareRow
              label="Other Investment & Exemption"
              oldValue={money(oldEx.otherInvestmentAndExemption)}
              newValue="—"
            />
            <CompareRow
              label="Total Exemptions"
              oldValue={money(oldEx.totalExemptions ?? oldR.totalExemptions)}
              newValue={money(newR.totalExemptions)}
              highlight
            />

            <CompareRow
              label="Total Taxable Income"
              oldValue={money(oldR.totalTaxableIncome)}
              newValue={money(newR.totalTaxableIncome)}
              highlight
            />

            <Text style={styles.sectionTitle}>Tax Details</Text>
            <CompareRow
              label="Tax on total taxable income"
              oldValue={money(oldR.taxOnTotalTaxableIncome)}
              newValue={money(newR.taxOnTotalTaxableIncome)}
            />
            <CompareRow
              label="Less: Rebate Under Section 87A"
              oldValue={money(oldR.rebateUnderSection87A)}
              newValue={money(newR.rebateUnderSection87A)}
            />
            <CompareRow
              label="Tax on total taxable income (after rebate)"
              oldValue={money(oldTaxAfterRebate)}
              newValue={money(newTaxAfterRebate)}
            />
            <CompareRow
              label={`Education Cess 4% of ${money(oldTaxAfterRebate)}`}
              oldValue={money(oldR.educationCess4Percent)}
              newValue={money(newR.educationCess4Percent)}
            />
            <CompareRow
              label="Total Tax Payable"
              oldValue={money(oldR.totalTaxPayable)}
              newValue={money(newR.totalTaxPayable)}
              highlight
            />

            <View style={styles.liabilityBox}>
              <Text style={styles.liabilityTitle}>Total Tax Liability</Text>
              <View style={styles.liabilityRow}>
                <View
                  style={[
                    styles.liabilityCol,
                    regime === 'old' && styles.liabilityColSelected,
                  ]}>
                  <Text style={styles.liabilityLabel}>Old Regime</Text>
                  <Text style={styles.liabilityAmount}>
                    {money(oldR.totalTaxPayable)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.liabilityCol,
                    regime === 'new' && styles.liabilityColSelected,
                  ]}>
                  <Text style={styles.liabilityLabel}>New Regime</Text>
                  <Text style={styles.liabilityAmount}>
                    {money(newR.totalTaxPayable)}
                  </Text>
                </View>
              </View>
              <Text style={styles.liabilityNote}>
                POI will also be processed based on the{' '}
                {regime === 'old' ? 'Old' : 'New'} Tax Regime
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerCancel} onPress={onClose}>
              <Text style={styles.footerCancelText}>CLOSE</Text>
            </TouchableOpacity>
            {onSubmit ? (
              <TouchableOpacity
                style={styles.footerEdit}
                onPress={onSubmit}
                disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.footerEditText}>SUBMIT</Text>
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  headerFy: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  closeBtnText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
  },
  savingBanner: {
    backgroundColor: '#DCFCE7',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
  },
  savingBannerOld: {
    backgroundColor: '#DBEAFE',
  },
  savingBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
    textAlign: 'center',
  },
  regimePickerBox: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  regimePickerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: '#2952E3',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2952E3',
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  scroll: {flexGrow: 0},
  scrollContent: {paddingHorizontal: 12, paddingBottom: 16},
  columnsHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 4,
  },
  colHeaderLabel: {flex: 1.4},
  colHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'right',
    lineHeight: 15,
  },
  colHeaderRecommended: {
    color: '#16A34A',
  },
  colHeaderSelected: {
    color: '#2952E3',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
    marginTop: 14,
    marginBottom: 6,
    paddingLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  rowHighlight: {
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginVertical: 2,
  },
  rowLabel: {
    flex: 1.4,
    fontSize: 11,
    color: '#374151',
    paddingRight: 6,
  },
  rowLabelBold: {
    fontWeight: '700',
    color: '#111',
  },
  subLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '400',
  },
  colValue: {
    flex: 1,
    fontSize: 11,
    color: '#111',
    textAlign: 'right',
    fontWeight: '500',
  },
  colValueBold: {
    fontWeight: '700',
  },
  liabilityBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  liabilityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },
  liabilityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  liabilityCol: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  liabilityColRecommended: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  liabilityColSelected: {
    borderColor: '#2952E3',
    backgroundColor: '#EFF6FF',
  },
  liabilityLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  liabilityAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  liabilityNote: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 10,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  footerCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  footerCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  footerEdit: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2952E3',
    alignItems: 'center',
  },
  footerEditText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});

export default SaveAndCompareModal;

export const extractSaveAndCompare = payload => {
  if (!payload) return null;
  const root = payload.data ?? payload;
  return root?.saveAndCompare ?? payload.saveAndCompare ?? null;
};
