import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  SafeAreaView,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const DeclareInvestments = ({navigation}) => {
  const [rentedHouse, setRentedHouse] = useState(false);
  const [homeLoan, setHomeLoan] = useState(false);
  const [letOutProperty, setLetOutProperty] = useState(false);
  const [b80c, setB80c] = useState(false);
  const [b80d, setB80d] = useState(false);
  const [otherInvestments, setOtherInvestments] = useState(false);
  const [otherIncomeExpanded, setOtherIncomeExpanded] = useState(true);

  const [letOutFields, setLetOutFields] = useState([{desc: '', amount: ''}]);
  const [b80cFields, setB80cFields] = useState([{desc: '', amount: ''}]);
  const [b80dFields, setB80dFields] = useState([{desc: '', amount: ''}]);
  const [otherInvFields, setOtherInvFields] = useState([
    {desc: '', amount: ''},
  ]);

  const [rentalFrom, setRentalFrom] = useState('');
  const [rentalTo, setRentalTo] = useState('');
  const [annualMonth, setAnnualMonth] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [address, setAddress] = useState('');
  const [urbanType, setUrbanType] = useState('');

  const [principalPaid, setPrincipalPaid] = useState('');
  const [interestPaid, setInterestPaid] = useState('');
  const [lenderName, setLenderName] = useState('');
  const [lenderPAN, setLenderPAN] = useState('');

  const otherIncomeItems = [
    'House rent allowance',
    'Interest income, savings income',
    'Income From Investment in equity savings scheme',
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.titleRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Investment Declaration</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}>
        {/* RENTED HOUSE */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Are you staying in a rented house?
            </Text>
            <Switch
              value={rentedHouse}
              onValueChange={setRentedHouse}
              trackColor={{false: '#D1D5DB', true: '#2563EB'}}
              thumbColor={'#fff'}
            />
          </View>

          {rentedHouse && (
            <View style={styles.cardBody}>
              <Text style={styles.fieldLabel}>House Rent Details</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, {flex: 1, marginRight: 8}]}
                  placeholder="From"
                  placeholderTextColor="#9CA3AF"
                  value={rentalFrom}
                  onChangeText={setRentalFrom}
                />
                <TextInput
                  style={[styles.input, {flex: 1}]}
                  placeholder="To"
                  placeholderTextColor="#9CA3AF"
                  value={rentalTo}
                  onChangeText={setRentalTo}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Annual/Month"
                placeholderTextColor="#9CA3AF"
                value={annualMonth}
                onChangeText={setAnnualMonth}
              />
              <TextInput
                style={[styles.input, {height: 70, textAlignVertical: 'top'}]}
                placeholder="Address"
                placeholderTextColor="#9CA3AF"
                multiline
                value={address}
                onChangeText={setAddress}
              />
              <TextInput
                style={styles.input}
                placeholder="Landlord Name"
                placeholderTextColor="#9CA3AF"
                value={landlordName}
                onChangeText={setLandlordName}
              />
              <TextInput
                style={styles.input}
                placeholder="Urbanization Type"
                placeholderTextColor="#9CA3AF"
                value={urbanType}
                onChangeText={setUrbanType}
              />
            </View>
          )}
        </View>

        {/* HOME LOAN */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Are you repaying home loan for a self-occupied house property?
            </Text>
            <Switch
              value={homeLoan}
              onValueChange={setHomeLoan}
              trackColor={{false: '#D1D5DB', true: '#2563EB'}}
              thumbColor={'#fff'}
            />
          </View>

          {homeLoan && (
            <View style={styles.cardBody}>
              <Text style={styles.fieldLabel}>Principal Paid on Home Loan</Text>
              <TextInput
                style={styles.input}
                placeholder="₹"
                placeholderTextColor="#9CA3AF"
                value={principalPaid}
                onChangeText={setPrincipalPaid}
                keyboardType="numeric"
              />
              <Text style={styles.fieldLabel}>Interest Paid on Home Loan</Text>
              <TextInput
                style={styles.input}
                placeholder="₹"
                placeholderTextColor="#9CA3AF"
                value={interestPaid}
                onChangeText={setInterestPaid}
                keyboardType="numeric"
              />
              <Text style={styles.fieldLabel}>Name of the Lender</Text>
              <TextInput
                style={styles.input}
                placeholder="Lender Name"
                placeholderTextColor="#9CA3AF"
                value={lenderName}
                onChangeText={setLenderName}
              />
              <Text style={styles.fieldLabel}>Lender PAN</Text>
              <TextInput
                style={styles.input}
                placeholder="ABCDE1234F"
                placeholderTextColor="#9CA3AF"
                value={lenderPAN}
                onChangeText={setLenderPAN}
              />
            </View>
          )}
        </View>

        {/* LET OUT PROPERTY - Yes/No style */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Do you have a let out property with or without rental income?
            </Text>
            <View style={styles.yesNoRow}>
              <TouchableOpacity
                style={[
                  styles.yesNoBtn,
                  letOutProperty && styles.yesNoBtnActive,
                ]}
                onPress={() => setLetOutProperty(true)}>
                <Text
                  style={[
                    styles.yesNoText,
                    letOutProperty && styles.yesNoTextActive,
                  ]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoBtn,
                  !letOutProperty && styles.yesNoBtnActive,
                ]}
                onPress={() => setLetOutProperty(false)}>
                <Text
                  style={[
                    styles.yesNoText,
                    !letOutProperty && styles.yesNoTextActive,
                  ]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {letOutProperty && (
            <View style={styles.cardBody}>
              {letOutFields.map((field, idx) => (
                <View key={idx} style={styles.row}>
                  <TextInput
                    style={[styles.input, {flex: 2, marginRight: 8}]}
                    placeholder="Description"
                    placeholderTextColor="#9CA3AF"
                    value={field.desc}
                    onChangeText={text => {
                      const arr = [...letOutFields];
                      arr[idx].desc = text;
                      setLetOutFields(arr);
                    }}
                  />
                  <TextInput
                    style={[styles.input, {flex: 1}]}
                    placeholder="₹"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={field.amount}
                    onChangeText={text => {
                      const arr = [...letOutFields];
                      arr[idx].amount = text;
                      setLetOutFields(arr);
                    }}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addLinkBtn}
                onPress={() =>
                  setLetOutFields([...letOutFields, {desc: '', amount: ''}])
                }>
                <Text style={styles.addLinkText}>+ Add Property</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 80C INVESTMENTS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitleUpper}>80C Investments</Text>
            <Switch
              value={b80c}
              onValueChange={setB80c}
              trackColor={{false: '#D1D5DB', true: '#2563EB'}}
              thumbColor={'#fff'}
            />
          </View>
          <Text style={styles.noteText}>
            Note: Declare investments such as LIC premiums, mutual funds and PPF
            under this section. The maximum tax saving investment you can make
            under 80C is ₹1,50,000.00
          </Text>

          {b80c && (
            <View style={styles.cardBody}>
              {b80cFields.map((field, idx) => (
                <View key={idx} style={styles.row}>
                  <TextInput
                    style={[styles.input, {flex: 2, marginRight: 8}]}
                    placeholder="Select an investment"
                    placeholderTextColor="#9CA3AF"
                    value={field.desc}
                    onChangeText={text => {
                      const arr = [...b80cFields];
                      arr[idx].desc = text;
                      setB80cFields(arr);
                    }}
                  />
                  <TextInput
                    style={[styles.input, {flex: 1}]}
                    placeholder="₹"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={field.amount}
                    onChangeText={text => {
                      const arr = [...b80cFields];
                      arr[idx].amount = text;
                      setB80cFields(arr);
                    }}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addLinkBtn}
                onPress={() =>
                  setB80cFields([...b80cFields, {desc: '', amount: ''}])
                }>
                <Text style={styles.addLinkText}>+ Add Investment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 80D INVESTMENTS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitleUpper}>80D Investments</Text>
            <Switch
              value={b80d}
              onValueChange={setB80d}
              trackColor={{false: '#D1D5DB', true: '#2563EB'}}
              thumbColor={'#fff'}
            />
          </View>
          <Text style={styles.noteText}>
            Note: Declare the mediclaim insurance policies for yourself, spouse,
            children and parents. The maximum tax saving investment you can make
            under 80D is ₹1,00,000.00
          </Text>

          {b80d && (
            <View style={styles.cardBody}>
              {b80dFields.map((field, idx) => (
                <View key={idx} style={styles.row}>
                  <TextInput
                    style={[styles.input, {flex: 2, marginRight: 8}]}
                    placeholder="Select an investment"
                    placeholderTextColor="#9CA3AF"
                    value={field.desc}
                    onChangeText={text => {
                      const arr = [...b80dFields];
                      arr[idx].desc = text;
                      setB80dFields(arr);
                    }}
                  />
                  <TextInput
                    style={[styles.input, {flex: 1}]}
                    placeholder="₹"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={field.amount}
                    onChangeText={text => {
                      const arr = [...b80dFields];
                      arr[idx].amount = text;
                      setB80dFields(arr);
                    }}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addLinkBtn}
                onPress={() =>
                  setB80dFields([...b80dFields, {desc: '', amount: ''}])
                }>
                <Text style={styles.addLinkText}>+ Add Investment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* OTHER INVESTMENTS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitleUpper}>
              Other Investments & Exemptions
            </Text>
            <Switch
              value={otherInvestments}
              onValueChange={setOtherInvestments}
              trackColor={{false: '#D1D5DB', true: '#2563EB'}}
              thumbColor={'#fff'}
            />
          </View>

          {otherInvestments && (
            <View style={styles.cardBody}>
              {otherInvFields.map((field, idx) => (
                <View key={idx} style={styles.row}>
                  <TextInput
                    style={[styles.input, {flex: 2, marginRight: 8}]}
                    placeholder="Investment Type"
                    placeholderTextColor="#9CA3AF"
                    value={field.desc}
                    onChangeText={text => {
                      const arr = [...otherInvFields];
                      arr[idx].desc = text;
                      setOtherInvFields(arr);
                    }}
                  />
                  <TextInput
                    style={[styles.input, {flex: 1}]}
                    placeholder="₹"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={field.amount}
                    onChangeText={text => {
                      const arr = [...otherInvFields];
                      arr[idx].amount = text;
                      setOtherInvFields(arr);
                    }}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addLinkBtn}
                onPress={() =>
                  setOtherInvFields([
                    ...otherInvFields,
                    {desc: '', amount: ''},
                  ])
                }>
                <Text style={styles.addLinkText}>+ Add Other Investment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* OTHER INCOME PROOFS  - expandable list */}
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.expandRow}
            onPress={() => setOtherIncomeExpanded(!otherIncomeExpanded)}>
            <Text style={styles.cardTitleUpper}>Other Income Proofs</Text>
            <Feather
              name={otherIncomeExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#111827"
            />
          </TouchableOpacity>

          {otherIncomeExpanded && (
            <View style={styles.subList}>
              {otherIncomeItems.map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.subListItem}>
                  <Text style={styles.subListText}>{item}</Text>
                  <Feather name="chevron-right" size={18} color="#6B7280" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveCompareBtn}>
          <Text style={styles.saveCompareBtnText}>SAVE & COMPARE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeclareInvestments;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F1F1',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#F5F1F1',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backBtn: {
    width: 24,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  scrollArea: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
    color: '#111827',
    textTransform: 'uppercase',
    flex: 1,
    marginRight: 10,
    letterSpacing: 0.3,
  },
  cardBody: {
    marginTop: 12,
  },
  noteText: {
    marginTop: 8,
    fontSize: 11.5,
    lineHeight: 17,
    color: '#6B7280',
  },

  fieldLabel: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 6,
    marginTop: 4,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
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

  yesNoRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    padding: 2,
  },
  yesNoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 5,
  },
  yesNoBtnActive: {
    backgroundColor: '#2952E3',
  },
  yesNoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  yesNoTextActive: {
    color: '#fff',
  },

  addLinkBtn: {
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  addLinkText: {
    color: '#2952E3',
    fontSize: 13,
    fontWeight: '600',
  },

  expandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  subListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subListText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
    marginRight: 10,
  },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  cancelBtnText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 12,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#2952E3',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginRight: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  saveCompareBtn: {
    flex: 1.4,
    backgroundColor: '#4A2C2A',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  saveCompareBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
