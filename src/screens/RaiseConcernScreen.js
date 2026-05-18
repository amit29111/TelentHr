import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {TextInput} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerIOS,
} from '@react-native-community/datetimepicker';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllConcerns, submitConcern} from '../redux/slice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RaiseConcernScreen = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [showRaiseConcern, setShowRaiseConcern] = useState(false);

  // Form States
  const [openConcernType, setOpenConcernType] = useState(false);
  const [concernType, setConcernType] = useState([]);
  const [openMode, setOpenMode] = useState(false);
  const [mode, setMode] = useState(null);
  const [openContact, setOpenContact] = useState(false);
  const [contact, setContact] = useState(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showIOSPicker, setShowIOSPicker] = useState(false);

  const dispatch = useDispatch();
  const {concerns, isLoading} = useSelector(state => state.auth);

  const [showViewConcern, setShowViewConcern] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState(null);

  // Accordion states
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [showFollowBack, setShowFollowBack] = useState(false);

  const handleViewConcern = item => {
    setSelectedConcern(item);
    setShowViewConcern(true);
  };

  useEffect(() => {
    dispatch(fetchAllConcerns());
  }, [dispatch]);

  // --- Filtering Logic Based on resolutionStatus ---
  const filteredData = Array.isArray(concerns.data)
    ? concerns.data.filter(item => {
        console.log('Item Status:', item.resolutionStatus);
        if (activeTab === 'open') {
          return item.resolutionStatus === 'Pending';
        } else {
          return item.resolutionStatus !== 'Pending';
        }
      })
    : [];

  const handleSubmit = async () => {
    try {
      const empId = await AsyncStorage.getItem('empId');

      if (!empId) {
        alert('Employee ID not found!');
        return;
      }

      // API Response ke parameters ke mutabiq payload
      const payload = {
        employeeId: empId,
        concernType: concernType, // ["Workload"] array format
        description: description,
        preferredModeOfDiscussion: mode,
        suggestedMeetingDate: moment(date).toISOString(), // standard ISO format
      };

      // Dispatching the action
      dispatch(submitConcern(payload)).then(res => {
        // res.meta.requestStatus === 'fulfilled' check karna behtar hai
        if (!res.error) {
          alert('Concern Raised Successfully!');

          // Modal close aur Form reset karein
          setShowRaiseConcern(false);
          setConcernType([]);
          setDescription('');
          setMode(null);
          setContact(null);

          // SABSE IMPORTANT: Data submit hone ke baad list ko refresh karein
          dispatch(fetchAllConcerns(empId));
        } else {
          alert('Error: ' + (res.payload?.message || 'Something went wrong'));
        }
      });
    } catch (error) {
      console.error('Submit Error:', error);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'datetime',
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
          }
        },
      });
    } else {
      setShowIOSPicker(true);
    }
  };
  const closeAllDropdowns = () => {
    setOpenConcernType(false);
    setOpenMode(false);
    setOpenContact(false);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.tabRowInline}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'open' && styles.activeTab]}
            onPress={() => setActiveTab('open')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'open' && styles.activeTabText,
              ]}>
              Open Concern
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'past' && styles.activeTabText,
              ]}>
              Past Concern
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.raiseBtn}
          onPress={() => setShowRaiseConcern(true)}>
          <Text style={styles.raiseText}>Raise Concern</Text>
        </TouchableOpacity>
      </View>

      {/* DATA LIST OR EMPTY STATE */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#8b1c1c"
          style={{marginTop: 50}}
        />
      ) : (
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
          {filteredData.length > 0 ? (
            filteredData.map(item => (
              <TouchableOpacity
                key={item._id}
                style={styles.concernCard}
                onPress={() => handleViewConcern(item)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTypeText}>
                    {item.concernType?.join(', ')}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.resolutionStatus === 'Pending'
                            ? '#FFF3E0'
                            : '#E8F5E9',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            item.resolutionStatus === 'Pending'
                              ? '#EF6C00'
                              : '#2E7D32',
                        },
                      ]}>
                      {item.resolutionStatus}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description || 'No description provided'}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.dateInfo}>
                    Meeting:{' '}
                    {moment(item.suggestedMeetingDate).format(
                      'DD MMM, YYYY | hh:mm A',
                    )}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.cardTitle}>
                No {activeTab === 'open' ? 'Open' : 'Past'} Concerns
              </Text>
              <Text style={styles.cardDescText}>
                You are a valuable part of our team! If you have any concerns,
                feel free to reach out.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* MODAL FOR RAISING CONCERN */}
      <Modal visible={showRaiseConcern} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Raise a Concern</Text>
                <TouchableOpacity onPress={() => setShowRaiseConcern(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  closeAllDropdowns();
                  Keyboard.dismiss();
                }}>
                <View style={{flex: 1}}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 20}}
                    onStartShouldSetResponder={() => {
                      closeAllDropdowns();
                      return false;
                    }}>
                    <View
                      style={styles.formContainer}
                      onStartShouldSetResponder={() => {
                        closeAllDropdowns();
                        return false;
                      }}>
                      <Text style={styles.label}>Concern Type</Text>
                      <DropDownPicker
                        listMode="SCROLLVIEW"
                        open={openConcernType}
                        value={concernType}
                        setOpen={val => {
                          closeAllDropdowns();
                          setOpenConcernType(val);
                        }}
                        setValue={setConcernType}
                        multiple
                        mode="BADGE"
                        placeholder="Select concern type"
                        items={[
                          {label: 'Workload', value: 'Workload'},
                          {label: 'Compensation', value: 'Compensation'},
                          {
                            label: 'Work Environment',
                            value: 'Work Environment',
                          },
                          {label: 'Harassment', value: 'Harassment'},
                          {
                            label: 'Managerial Issues',
                            value: 'Managerial Issues',
                          },
                          {label: 'Growth', value: 'Growth'},
                          {label: 'Personal', value: 'Personal'},
                          {label: 'Others', value: 'Others'},
                        ]}
                        style={styles.dropdown}
                        containerStyle={{zIndex: 5000}} // Sabse upar
                        dropDownContainerStyle={{zIndex: 5000}}
                      />

                      <Text style={styles.label}>Description</Text>
                      <TextInput
                        mode="outlined"
                        placeholder="Briefly describe your concern"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        style={styles.textArea}
                        outlineColor="#ccc"
                        activeOutlineColor="#8b1c1c"
                      />

                      <View
                        style={[
                          styles.row,
                          {zIndex: openMode || openContact ? 5000 : 1},
                        ]}>
                        <View style={styles.half}>
                          <Text style={styles.label}>Discussion Mode</Text>
                          <DropDownPicker
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                              nestedScrollEnabled: true, // Scroll enable karne ke liye
                            }}
                            open={openMode}
                            value={mode}
                            setOpen={val => {
                              closeAllDropdowns();
                              setOpenMode(val);
                            }}
                            setValue={setMode}
                            placeholder="Select"
                            items={[
                              {label: 'Virtual', value: 'Virtual'},
                              {label: 'In-person', value: 'In-person'},
                              {label: 'Email', value: 'Email'},
                            ]}
                            style={styles.dropdown}
                            containerStyle={{zIndex: 5000}}
                            dropDownContainerStyle={{zIndex: 5000}}
                          />
                        </View>

                        <View style={styles.half}>
                          <Text style={styles.label}>Contact With</Text>
                          <DropDownPicker
                            listMode="SCROLLVIEW"
                            open={openContact}
                            value={contact}
                            setOpen={val => {
                              closeAllDropdowns();
                              setOpenContact(val);
                            }}
                            setValue={setContact}
                            placeholder="Select"
                            items={[
                              {
                                label: 'Reporting Manager',
                                value: 'Reporting Manager',
                              },
                              {label: 'Admin', value: 'Admin'},
                            ]}
                            style={styles.dropdown}
                            containerStyle={{zIndex: 4000}}
                            dropDownContainerStyle={{zIndex: 4000}}
                          />
                        </View>
                      </View>

                      <Text style={styles.label}>Preferred Date & Time</Text>
                      <TouchableOpacity onPress={openDatePicker}>
                        <View style={styles.dateInputWrapper}>
                          <TextInput
                            mode="outlined"
                            value={moment(date).format('DD/MM/YYYY, HH:mm')}
                            editable={false}
                            style={{flex: 1}}
                          />
                          <View style={styles.calendarIcon}>
                            <Image
                              source={require('../assets/calenderslide.png')}
                              style={{width: 20, height: 20}}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowRaiseConcern(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL FOR VIEWING CONCERN DETAILS */}
      <Modal visible={showViewConcern} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Concern Details</Text>
                <TouchableOpacity onPress={() => setShowViewConcern(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{padding: 20}}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>
                      {selectedConcern?.employeeId?.firstName}{' '}
                      {selectedConcern?.employeeId?.lastName}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Concern Type:</Text>
                    <Text style={styles.detailValue}>
                      {selectedConcern?.concernType?.join(', ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailValue}>
                      {selectedConcern?.description}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>
                      Suggested Meeting Date:
                    </Text>
                    <Text style={styles.detailValue}>
                      {moment(selectedConcern?.suggestedMeetingDate).format(
                        'DD-MM-YYYY (h:mm A)',
                      )}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Mode of Discussion:</Text>
                    <Text style={styles.detailValue}>
                      {selectedConcern?.preferredModeOfDiscussion}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {color: '#EF6C00', fontWeight: 'bold'},
                      ]}>
                      {selectedConcern?.resolutionStatus}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.detailLabel, {marginTop: 10}]}>
                  Next Step:
                </Text>
                <Text style={styles.detailValue}>--</Text>

                {/* ACCORDION SECTIONS */}
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => setShowMeetingDetails(!showMeetingDetails)}>
                  <Text style={styles.accordionTitle}>Meeting Details</Text>
                  <Text style={styles.accordionIcon}>
                    {showMeetingDetails ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>
                {showMeetingDetails && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.emptyText}>
                      No meeting details available
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => setShowFollowBack(!showFollowBack)}>
                  <Text style={styles.accordionTitle}>
                    Follow-back Messages
                  </Text>
                  <Text style={styles.accordionIcon}>
                    {showFollowBack ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>
                {showFollowBack && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.emptyText}>
                      No follow-back messages
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RaiseConcernScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FDF7F2'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 60,
  },
  tabRowInline: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 4,
  },
  tabBtn: {paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6},
  activeTab: {backgroundColor: '#fff'},
  tabText: {fontSize: 13, color: '#666'},
  activeTabText: {color: '#8b1c1c', fontWeight: 'bold'},
  raiseBtn: {
    backgroundColor: '#8b1c1c',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  raiseText: {color: '#fff', fontSize: 13, fontWeight: '600'},

  // Concern Card Styles
  concernCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTypeText: {fontSize: 15, fontWeight: 'bold', color: '#333'},
  statusBadge: {paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6},
  statusText: {fontSize: 11, fontWeight: 'bold'},
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  cardFooter: {borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 8},
  dateInfo: {fontSize: 11, color: '#999'},

  emptyCard: {
    backgroundColor: '#d9cfd3',
    margin: 20,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8b1c1c',
    marginBottom: 8,
  },
  cardDescText: {textAlign: 'center', color: '#555', lineHeight: 20},

  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 16},
  modalWrapper: {flex: 1, justifyContent: 'center'},
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '90%',
    // overflow: 'hidden',
    zIndex: 10,
    height: '65%',
  },
  modalHeader: {
    backgroundColor: '#f1e6e9',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderText: {fontSize: 16, fontWeight: '600', color: '#8b1c1c'},
  modalClose: {fontSize: 20, color: '#8b1c1c'},
  formContainer: {width: '90%', alignSelf: 'center'},
  label: {marginTop: 14, color: '#8b1c1c', fontSize: 13, fontWeight: '500'},
  dropdown: {marginTop: 6, borderColor: '#ccc', borderRadius: 6},
  textArea: {marginTop: 6, backgroundColor: '#fff'},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  half: {width: '48%'},
  dateInputWrapper: {position: 'relative', justifyContent: 'center'},
  calendarIcon: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{translateY: -5}],
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8b1c1c',
    marginRight: 12,
  },
  cancelText: {color: '#8b1c1c', fontWeight: '500'},
  submitBtn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#8b1c1c',
  },
  submitText: {color: '#fff', fontWeight: '600'},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8b1c1c', // Brownish color from your web screenshot
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  accordionHeader: {
    backgroundColor: '#b37a7a', // Matching web color
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  accordionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  accordionIcon: {
    color: '#fff',
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
  },
  emptyText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  }
});
