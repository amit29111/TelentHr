import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
// import { MaterialIcons, Feather } from '@expo/vector-icons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';


import { Image } from 'react-native';

import PayrollTabs from './PayrollTabs';

const PayrollTaxation = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(
    'Investment Declaration',
  );

  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const [selectedYear, setSelectedYear] = useState(
    '2025-2026',
  );

  // State for toggles
  const [rentedHouse, setRentedHouse] = useState(false);
  const [homeLoan, setHomeLoan] = useState(false);
  const [letOutProperty, setLetOutProperty] = useState(false);
  const [b80c, setB80c] = useState(false);
  const [b80d, setB80d] = useState(false);
  const [otherInvestments, setOtherInvestments] = useState(false);
  // Add missing state for Other Income Proofs toggle and fields
  const [otherIncomeExpanded, setOtherIncomeExpanded] = useState(false);
  const [letOutFields, setLetOutFields] = useState([{desc: '', amount: ''}]);
  const [b80cFields, setB80cFields] = useState([{desc: '', amount: ''}]);
  const [b80dFields, setB80dFields] = useState([{desc: '', amount: ''}]);
  const [otherInvFields, setOtherInvFields] = useState([{desc: '', amount: ''}]);
  const [otherIncomeFields, setOtherIncomeFields] = useState([{desc: '', amount: ''}]);

  // State for form fields
  const [rentalPeriodFrom, setRentalPeriodFrom] = useState('');
  const [rentalPeriodTo, setRentalPeriodTo] = useState('');
  const [annualMonth, setAnnualMonth] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [address, setAddress] = useState('');
  const [urbanType, setUrbanType] = useState('');

  const [principalPaid, setPrincipalPaid] = useState('');
  const [interestPaid, setInterestPaid] = useState('');
  const [lenderName, setLenderName] = useState('');
  const [lenderPAN, setLenderPAN] = useState('');

  const [proofStatus, setProofStatus] = useState('success'); // success | info | awaiting
  const [proofBadge, setProofBadge] = useState('AWAITING APPROVAL'); // or ''
  const proofData = {
    year: selectedYear,
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

  const taxationTabs = [
    'Investment Declaration',
    'Proof of Investment',
    'Tax Report',
    'Form 16',
  ];

  const financialYears = [
    '2020-2021',
    '2021-2022',
    '2022-2023',
    '2023-2024',
    '2024-2025',
    '2025-2026',
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>

      {/* HEADER */}

      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Taxation</Text>

        <View style={{width: 24}} />
      </View>

      {/* PAYROLL TABS */}

      <PayrollTabs
        navigation={navigation}
        activeTab="Taxation"
      />

      {/* HORIZONTAL TABS */}

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
                activeTab === item &&
                  styles.customTabTextActive,
              ]}>
              {item}
            </Text>

            {activeTab === item && (
              <View style={styles.activeBorder} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* YEAR + BUTTON */}

      <View style={styles.yearContainer}>

        <View style={{flex: 1}}>

          <TouchableOpacity
            style={styles.yearDropdown}
            onPress={() =>
              setShowYearDropdown(!showYearDropdown)
            }>

            <Text style={styles.yearText}>
              Financial Year : {selectedYear}
            </Text>

            <Text style={styles.arrow}>
              {showYearDropdown ? '▲' : '▼'}
            </Text>

          </TouchableOpacity>

          {/* DROPDOWN */}

          {showYearDropdown && (
            <View style={styles.dropdownBox}>

              {financialYears.map((year, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedYear(year);
                    setShowYearDropdown(false);
                  }}>

                  <Text style={styles.dropdownText}>
                    {year}
                  </Text>

                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.declareBtn}>
          <Text style={styles.declareBtnText}>
            Declare Investments
          </Text>
        </TouchableOpacity>

      </View>

      {/* CONTENT */}

      <View style={styles.contentBox}>
        {activeTab === 'Investment Declaration' ? (
          <>
            <View style={{marginBottom: 16}}>
              <View style={styles.rowBetween}>
                <Text style={styles.headingOption}>Are you staying in a rented house?</Text>
                <Switch value={rentedHouse} onValueChange={setRentedHouse} />
              </View>
              {rentedHouse && (
                <View style={styles.formSection}>
                  <Text style={styles.label}>House Rent Details</Text>
                  <View style={styles.rowBetween}>
                    <TextInput
                      style={styles.input}
                      placeholder="From"
                      value={rentalPeriodFrom}
                      onChangeText={setRentalPeriodFrom}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="To"
                      value={rentalPeriodTo}
                      onChangeText={setRentalPeriodTo}
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Annual/Month"
                    value={annualMonth}
                    onChangeText={setAnnualMonth}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Landlord Name"
                    value={landlordName}
                    onChangeText={setLandlordName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Urbanization Type"
                    value={urbanType}
                    onChangeText={setUrbanType}
                  />
                  <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+ Add Rented House</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={{marginBottom: 16}}>
              <View style={styles.rowBetween}>
                <Text style={styles.headingOption}>Are you repaying home loan for a self-occupied house property?</Text>
                <Switch value={homeLoan} onValueChange={setHomeLoan} />
              </View>
              {homeLoan && (
                <View style={styles.formSection}>
                  <Text style={styles.label}>Principal Paid on Home Loan</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Principal Paid"
                    value={principalPaid}
                    onChangeText={setPrincipalPaid}
                  />
                  <Text style={styles.label}>Interest Paid on Home Loan</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Interest Paid"
                    value={interestPaid}
                    onChangeText={setInterestPaid}
                  />
                  <Text style={styles.label}>Name of the Lender</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Lender Name"
                    value={lenderName}
                    onChangeText={setLenderName}
                  />
                  <Text style={styles.label}>Lender PAN</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Lender PAN"
                    value={lenderPAN}
                    onChangeText={setLenderPAN}
                  />
                </View>
              )}
            </View>
            {/* Let Out Property Section */}
            <View style={{marginBottom: 16}}>
              <View style={styles.rowBetween}>
                <Text style={styles.headingOption}>Do you have a let out property with or without rental income?</Text>
                <Switch value={letOutProperty} onValueChange={setLetOutProperty} />
              </View>
              {letOutProperty && (
                <View style={styles.formSection}>
                  <Text style={styles.label}>Note: Enter details of your let out property, including rental income and address.</Text>
                  {letOutFields.map((field, idx) => (
                    <View key={idx} style={{flexDirection: 'row', gap: 8, marginBottom: 8}}>
                      <TextInput
                        style={[styles.input, {flex: 2}]}
                        placeholder="Description"
                        value={field.desc}
                        onChangeText={text => {
                          const arr = [...letOutFields];
                          arr[idx].desc = text;
                          setLetOutFields(arr);
                        }}
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Amount"
                        value={field.amount}
                        keyboardType="numeric"
                        onChangeText={text => {
                          const arr = [...letOutFields];
                          arr[idx].amount = text;
                          setLetOutFields(arr);
                        }}
                      />
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addBtn} onPress={() => setLetOutFields([...letOutFields, {desc: '', amount: ''}])}>
                    <Text style={styles.addBtnText}>+ Add Property</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {/* ===================== 80C INVESTMENTS ===================== */}

<View style={styles.investmentCard}>

  <View style={styles.topRow}>
    <Text style={styles.cardTitle}>80C Investments</Text>

    <Switch
      value={b80c}
      onValueChange={setB80c}
      trackColor={{false: '#D1D5DB', true: '#2563EB'}}
      thumbColor={'#fff'}
    />
  </View>

  {b80c && (
    <>
      <Text style={styles.noteText}>
        Note: Declare investments such as LIC premiums,
        mutual funds and PPF under this section.
        The maximum tax saving investment you can make
        under 80C is ₹1,50,000.00
      </Text>

      {b80cFields.map((field, idx) => (
        <View key={idx} style={styles.inputRow}>

          {/* SELECT BOX */}

          <View style={[styles.inputBox, {flex: 2}]}>
            <TextInput
              placeholder="Select an investment"
              placeholderTextColor="#9CA3AF"
              value={field.desc}
              onChangeText={text => {
                const arr = [...b80cFields];
                arr[idx].desc = text;
                setB80cFields(arr);
              }}
              style={styles.input}
            />
          </View>

          {/* AMOUNT BOX */}

          <View style={[styles.inputBox, {flex: 1}]}>
            <TextInput
              placeholder="₹"
              placeholderTextColor="#9CA3AF"
              value={field.amount}
              keyboardType="numeric"
              onChangeText={text => {
                const arr = [...b80cFields];
                arr[idx].amount = text;
                setB80cFields(arr);
              }}
              style={styles.input}
            />
          </View>

        </View>
      ))}

      <TouchableOpacity
        style={styles.addInvestmentBtn}
        onPress={() =>
          setB80cFields([
            ...b80cFields,
            {desc: '', amount: ''},
          ])
        }>

        <Text style={styles.addInvestmentText}>
          Add Investment
        </Text>

      </TouchableOpacity>
    </>
  )}
</View>

{/* ===================== 80D INVESTMENTS ===================== */}

<View style={styles.investmentCard}>

  <View style={styles.topRow}>
    <Text style={styles.cardTitle}>80D Investments</Text>

    <Switch
      value={b80d}
      onValueChange={setB80d}
      trackColor={{false: '#D1D5DB', true: '#2563EB'}}
      thumbColor={'#fff'}
    />
  </View>

  {b80d && (
    <>
      <Text style={styles.noteText}>
        Note: Declare the mediclaim insurance policies
        for yourself, spouse, children and parents.
        The maximum tax saving investment you can make
        under 80D is ₹1,00,000.00
      </Text>

      {b80dFields.map((field, idx) => (
        <View key={idx} style={styles.inputRow}>

          {/* SELECT BOX */}

          <View style={[styles.inputBox, {flex: 2}]}>
            <TextInput
              placeholder="Select an investment"
              placeholderTextColor="#9CA3AF"
              value={field.desc}
              onChangeText={text => {
                const arr = [...b80dFields];
                arr[idx].desc = text;
                setB80dFields(arr);
              }}
              style={styles.input}
            />
          </View>

          {/* AMOUNT */}

          <View style={[styles.inputBox, {flex: 1}]}>
            <TextInput
              placeholder="₹"
              placeholderTextColor="#9CA3AF"
              value={field.amount}
              keyboardType="numeric"
              onChangeText={text => {
                const arr = [...b80dFields];
                arr[idx].amount = text;
                setB80dFields(arr);
              }}
              style={styles.input}
            />
          </View>

        </View>
      ))}

      <TouchableOpacity
        style={styles.addInvestmentBtn}
        onPress={() =>
          setB80dFields([
            ...b80dFields,
            {desc: '', amount: ''},
          ])
        }>

        <Text style={styles.addInvestmentText}>
          Add Investment
        </Text>

      </TouchableOpacity>
    </>
  )}
</View>
            {/* Other Investments & Exemptions Section */}
            <View style={{marginBottom: 16}}>
              <View style={styles.rowBetween}>
                <Text style={styles.headingOption}>Other Investments & Exemptions</Text>
                <Switch value={otherInvestments} onValueChange={setOtherInvestments} />
              </View>
              {otherInvestments && (
                <View style={styles.formSection}>
                  <Text style={styles.label}>Note: Enter details of other investments and exemptions. Only eligible investments will be considered.</Text>
                  {otherInvFields.map((field, idx) => (
                    <View key={idx} style={{flexDirection: 'row', gap: 8, marginBottom: 8}}>
                      <TextInput
                        style={[styles.input, {flex: 2}]}
                        placeholder="Investment Type"
                        value={field.desc}
                        onChangeText={text => {
                          const arr = [...otherInvFields];
                          arr[idx].desc = text;
                          setOtherInvFields(arr);
                        }}
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Amount"
                        value={field.amount}
                        keyboardType="numeric"
                        onChangeText={text => {
                          const arr = [...otherInvFields];
                          arr[idx].amount = text;
                          setOtherInvFields(arr);
                        }}
                      />
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addBtn} onPress={() => setOtherInvFields([...otherInvFields, {desc: '', amount: ''}])}>
                    <Text style={styles.addBtnText}>+ Add Other Investment</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {/* Other Income Proofs Section */}
            <View style={{marginBottom: 16}}>
              <View style={styles.rowBetween}>
                <Text style={styles.headingOption}>Other income proofs</Text>
                <Switch value={otherIncomeExpanded} onValueChange={setOtherIncomeExpanded} />
              </View>
              {otherIncomeExpanded && (
                <View style={styles.formSection}>
                  <Text style={styles.label}>Note: Enter details of other sources of income, such as interest income, rental income, etc.</Text>
                  {otherIncomeFields.map((field, idx) => (
                    <View key={idx} style={{flexDirection: 'row', gap: 8, marginBottom: 8}}>
                      <TextInput
                        style={[styles.input, {flex: 2}]}
                        placeholder="Proof Type"
                        value={field.desc}
                        onChangeText={text => {
                          const arr = [...otherIncomeFields];
                          arr[idx].desc = text;
                          setOtherIncomeFields(arr);
                        }}
                      />
                      <TextInput
                        style={[styles.input, {flex: 1}]}
                        placeholder="Amount"
                        value={field.amount}
                        keyboardType="numeric"
                        onChangeText={text => {
                          const arr = [...otherIncomeFields];
                          arr[idx].amount = text;
                          setOtherIncomeFields(arr);
                        }}
                      />
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addBtn} onPress={() => setOtherIncomeFields([...otherIncomeFields, {desc: '', amount: ''}])}>
                    <Text style={styles.addBtnText}>+ Add Income Proof</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn}><Text style={styles.cancelBtnText}>CANCEL</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn}><Text style={styles.saveBtnText}>SAVE</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveCompareBtn}><Text style={styles.saveCompareBtnText}>SAVE & COMPARE</Text></TouchableOpacity>
            </View>
          </>
        ) : activeTab === 'Proof of Investment' ? (
          <>
            {/* Info Box */}
            <View style={[styles.infoBox, proofStatus === 'success' ? styles.infoBoxSuccess : styles.infoBoxInfo]}>
              {proofStatus === 'success' ? (
                <MaterialIcons name="check-circle" size={28} color="#23B480" style={{marginRight: 8}} />
              ) : (
                <Feather name="info" size={24} color="#FFA500" style={{marginRight: 8}} />
              )}
              <View style={{flex: 1}}>
                <Text style={styles.infoBoxText}>
                  {proofStatus === 'success'
                    ? 'Your Proof of investment details have been saved successfully.'
                    : 'You submitted your IT Declaration to your payroll admin. However, if you need to, you can still make changes to the IT Declaration and submit it for review.'}
                </Text>
              </View>
              {proofBadge ? (
                <View style={styles.badge}><Text style={styles.badgeText}>{proofBadge}</Text></View>
              ) : null}
            </View>
            {/* Financial Summary */}
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
            {/* Investment Sections */}
            {proofData.details.map((item, idx) => (
              <View key={idx} style={styles.investmentCard}>
                <View style={styles.investmentHeader}>
                  <Text style={styles.investmentTitle}>{item.title}</Text>
                  <TouchableOpacity><Feather name="edit" size={18} color="#452300" /></TouchableOpacity>
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
                  <TouchableOpacity style={styles.attachBtn}><Feather name="paperclip" size={18} color="#452300" /></TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.heading}>{activeTab}</Text>
            <Text style={styles.description}>
              This is the {activeTab} section content.
            </Text>
          </>
        )}
      </View>

    </ScrollView>
  );
};

export default PayrollTaxation;

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

  tabsContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    paddingBottom: 10,
  },

  customTab: {
    marginRight: 24,
    alignItems: 'center',
    paddingBottom: 8,
  },

  customTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },

  customTabTextActive: {
    color: '#111',
    fontWeight: '700',
  },

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

  dropdownText: {
    fontSize: 13,
    color: '#111',
    fontWeight: '500',
  },

  declareBtn: {
    backgroundColor: '#2952E3',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 10,
  },

  declareBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  contentBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  headingOption: {
    fontSize: 15,
    color: '#222',
    flex: 1,
    marginRight: 10,
  },

  formSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    marginBottom: 8,
    fontSize: 13,
  },

  addBtn: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 6,
  },

  addBtnText: {
    color: '#333',
    fontSize: 13,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  cancelBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  cancelBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },

  saveBtn: {
    backgroundColor: '#2952E3',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginLeft: 8,
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  saveCompareBtn: {
    backgroundColor: '#452300',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginLeft: 8,
  },

  saveCompareBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  infoBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, marginBottom: 14 },
  infoBoxSuccess: { backgroundColor: '#E8F8F2' },
  infoBoxInfo: { backgroundColor: '#FFF8E1' },
  infoBoxText: { color: '#222', fontSize: 13, flex: 1 },
  badge: { backgroundColor: '#FFA500', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  summaryBox: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  summaryLabel: { color: '#555', fontSize: 13 },
  summaryValue: { color: '#222', fontWeight: 'bold', fontSize: 13 },
  investmentCard: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, elevation: 1 },
  investmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  investmentTitle: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  investmentPeriod: { color: '#888', fontSize: 12, marginBottom: 6 },
  investmentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  investmentCol: { flex: 1 },
  investmentLabel: { color: '#888', fontSize: 12 },
  investmentValue: { color: '#222', fontWeight: 'bold', fontSize: 14 },
  attachBtn: { padding: 6 },
  investmentCard: {
  backgroundColor: '#FFF',
  borderRadius: 10,
  padding: 14,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

topRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

cardTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: '#111827',
  textTransform: 'uppercase',
},

noteText: {
  marginTop: 10,
  fontSize: 11,
  lineHeight: 18,
  color: '#6B7280',
},

inputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 12,
  gap: 10,
},

inputBox: {
  borderWidth: 1,
  borderColor: '#D1D5DB',
  borderRadius: 4,
  height: 42,
  justifyContent: 'center',
  backgroundColor: '#fff',
},

input: {
  paddingHorizontal: 10,
  fontSize: 13,
  color: '#111827',
},

addInvestmentBtn: {
  marginTop: 10,
  flexDirection: 'row',
  alignItems: 'center',
},

addInvestmentText: {
  color: '#374151',
  fontSize: 13,
  fontWeight: '500',
},
});