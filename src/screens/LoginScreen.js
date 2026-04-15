// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Pressable,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   ActivityIndicator,
//   Linking,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { userLogin } from '../redux/slice';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const COLORS = {
//   primary: '#DAA3A3',
//   background: '#FDF7F2',
//   dark: '#4A2C3E',
//   text: '#333',
//   muted: '#666',
//   link: '#6A5ACD',
//   pink: '#F2A7A7',
// };

// const LoginScreen = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   const employeeState = useSelector(state => state.employee || {});
//   const { isLoading, error } = employeeState;

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [secureText, setSecureText] = useState(true);
//   const [rememberMe, setRememberMe] = useState(false);

//   const emailInputRef = useRef(null);
//   const passwordInputRef = useRef(null);

//   useEffect(() => {
//     const loadCredentials = async () => {
//       try {
//         const savedEmail = await AsyncStorage.getItem('email');
//         const savedPassword = await AsyncStorage.getItem('password');
//         if (savedEmail && savedPassword) {
//           setEmail(savedEmail);
//           setPassword(savedPassword);
//           setRememberMe(true);
//         }
//       } catch (err) {
//         console.log('Credential load error:', err);
//       }
//     };
//     loadCredentials();
//   }, []);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please enter both email and password');
//       return;
//     }

//     try {
//       await dispatch(userLogin({ email, password })).unwrap();

//       if (rememberMe) {
//         await AsyncStorage.setItem('email', email);
//         await AsyncStorage.setItem('password', password);
//       } else {
//         await AsyncStorage.removeItem('email');
//         await AsyncStorage.removeItem('password');
//       }

//       navigation.navigate('MainApp');
//     } catch (err) {
//       Alert.alert('Login Failed', err || 'Something went wrong');
//     }
//   };

//   return (
//     <LinearGradient
//       colors={['#402530', '#DAA3A3']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.container}>

//       <View style={styles.circle} />

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}>

//         <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

//           <View style={styles.logoContainer}>
//             <Image
//               source={require('../assets/finalezlogonewHrms.png')}
//               style={styles.logo}
//             />
//             <Text style={styles.logoText}>
//               HRMS <Text style={styles.logoSubText}>Lite...</Text>
//             </Text>
//           </View>

//           <View style={styles.formContainer}>
//             <Text style={styles.welcomeText}>Welcome Back!</Text>
//             <Text style={styles.subText}>
//               Log in to enjoy your treats and rewards
//             </Text>

//             {error && <Text style={styles.errorText}>{error}</Text>}

//             <Text style={styles.label}>Email</Text>
//             <TextInput
//               ref={emailInputRef}
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               placeholder="Enter your email"
//               placeholderTextColor="gray"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               returnKeyType="next"
//               onSubmitEditing={() => passwordInputRef.current?.focus()}
//             />

//             <Text style={styles.label}>Password</Text>
//             <View style={styles.passwordContainer}>
//               <TextInput
//                 ref={passwordInputRef}
//                 style={[styles.input, { flex: 1 }]}
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={secureText}
//                 placeholder="Enter your password"
//                 placeholderTextColor="gray"
//                 returnKeyType="done"
//                 onSubmitEditing={handleLogin}
//               />

//               {/* 👁️ Eye PNG */}
//               <Pressable
//                 onPress={() => setSecureText(!secureText)}
//                 style={styles.eyeIcon}>
//                 <Image
//                   source={require('../assets/loginScreenIcon/eye.png')}
//                   style={[
//                     styles.eyeImage,
//                     { opacity: secureText ? 0.6 : 1 },
//                   ]}
//                   resizeMode="contain"
//                 />
//               </Pressable>
//             </View>

//             <View style={styles.optionsRow}>
//               <Pressable
//                 style={styles.checkboxContainer}
//                 onPress={() => setRememberMe(!rememberMe)}>
//                 <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
//                   {rememberMe && <Text>✓</Text>}
//                 </View>
//                 <Text style={styles.optionText}>Remember Me</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
//                 <Text style={styles.optionText}>Forgot Password?</Text>
//               </Pressable>
//             </View>

//             <TouchableOpacity
//               style={[styles.submitButton, isLoading && styles.disabledButton]}
//               onPress={handleLogin}
//               disabled={isLoading}>
//               {isLoading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               )}
//             </TouchableOpacity>

//             <View style={styles.dividerContainer}>
//               <View style={styles.dividerLine} />
//               <Text style={styles.dividerText}>or login with</Text>
//               <View style={styles.dividerLine} />
//             </View>

//             <View style={styles.buttonRow}>
//               <TouchableOpacity
//                 style={styles.secondaryButton}
//                 onPress={() => Linking.openURL('https://ezcompliance.in/')}>
//                 <Text style={styles.secondaryButtonText}>Guest Login</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.secondaryButton}
//                 onPress={() => Linking.openURL('https://ezcompliance.in/')}>
//                 <Text style={styles.secondaryButtonText}>Schedule a Demo</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.registerContainer}>
//               <Text style={styles.registerText}>Don't have an account? </Text>
//               <Pressable onPress={() => navigation.navigate('Registration')}>
//                 <Text style={styles.registerLink}>Registration</Text>
//               </Pressable>
//             </View>

//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   circle: {
//     position: 'absolute',
//     top: -50,
//     right: -50,
//     width: 125,
//     height: 125,
//     backgroundColor: COLORS.pink,
//     borderRadius: 100,
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 50,
//   },
//   logo: { width: 90, height: 95 },
//   logoText: {
//     fontSize: 44,
//     color: '#fff',
//     marginLeft: -30,
//     marginBottom: 38,
//   },
//   logoSubText: { fontSize: 24, color: '#fff' },
//   formContainer: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//     borderRadius: 30,
//     padding: 20,
//     margin: 15,
//   },
//   welcomeText: { fontSize: 28, textAlign: 'center' },
//   subText: { fontSize: 12, textAlign: 'center', marginVertical: 10 },
//   errorText: { color: 'red', textAlign: 'center' },
//   label: { fontSize: 12, marginTop: 10 },
//   input: {
//     borderWidth: 1,
//     borderRadius: 25,
//     padding: 12,
//     marginTop: 6,
//   },
//   passwordContainer: { flexDirection: 'row', alignItems: 'center' },
//   eyeIcon: { position: 'absolute', right: 15 },
//   eyeImage: { width: 20, height: 20 },
//   optionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 },
//   checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
//   checkbox: {
//     width: 16,
//     height: 16,
//     borderWidth: 1,
//     marginRight: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxChecked: { backgroundColor: '#fff' },
//   optionText: { fontSize: 10 },
//   submitButton: {
//     backgroundColor: '#DAA3A3',
//     borderRadius: 30,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   disabledButton: { opacity: 0.6 },
//   submitButtonText: { color: '#fff', fontSize: 16 },
//   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
//   dividerLine: { flex: 1, height: 1, backgroundColor: '#ccc' },
//   dividerText: { marginHorizontal: 10, fontSize: 10 },
//   buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   secondaryButton: {
//     flex: 1,
//     borderWidth: 1,
//     borderRadius: 25,
//     padding: 12,
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   secondaryButtonText: { fontSize: 14 },
//   registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
//   registerText: { fontSize: 10 },
//   registerLink: { fontSize: 10, color: '#530EC3' },
// });

// export default LoginScreen;


  import React, { useState, useRef, useEffect } from 'react';
  import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Linking,
  } from 'react-native';
  import LinearGradient from 'react-native-linear-gradient';

  import { useNavigation } from '@react-navigation/native';
  import { useDispatch, useSelector } from 'react-redux';
  import { userLogin } from '../redux/slice';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const COLORS = {
    primary: '#DAA3A3',
    background: '#FDF7F2',
    dark: '#4A2C3E',
    text: '#333',
    muted: '#666',
    link: '#6A5ACD',
    pink: '#F2A7A7',
  };

  const LoginScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const employeeState = useSelector(state => state.employee || {});
    const { isLoading, error } = employeeState;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    // ✅ Load saved credentials if Remember Me was checked
    useEffect(() => {
      const loadCredentials = async () => {
        try {
          const savedEmail = await AsyncStorage.getItem('email');
          const savedPassword = await AsyncStorage.getItem('password');
          if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
          }
        } catch (err) {
          console.log('Error loading saved credentials:', err);
        }
      };
      loadCredentials();
    }, []);

    const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }
      try {
        await dispatch(userLogin({ email, password })).unwrap();

        // ✅ Save credentials only if Remember Me is checked
        if (rememberMe) {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
        } else {
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('password');
        }

        navigation.navigate('MainApp');
      } catch (err) {
        Alert.alert('Login Failed', err || 'An error occurred during login');
      }
    };

    return (
      <LinearGradient
        colors={['#402530', '#DAA3A3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>
        <View style={styles.circle} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/finalezlogonewHrms.png')}
                style={styles.logo}
              />
              <Text style={styles.logoText}>
    HRMS <Text style={styles.logoSubText}>Lite...</Text>
  </Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.subText}>
                Log in to enjoy your treats and rewards
              </Text>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Text style={styles.label}>Email</Text>
              <TextInput
                ref={emailInputRef}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="gray"
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={passwordInputRef}
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureText}
                  placeholder="Enter your password"
                  placeholderTextColor="gray"
                  textContentType="password"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                    {/* 👁️ Eye PNG */}
                <Pressable
                  onPress={() => setSecureText(!secureText)}
                  style={styles.eyeIcon}>
                  <Image
                    source={require('../assets/victorIconImage/eye.png')}
                    style={[
                      styles.eyeImage,
                      { opacity: secureText ? 0.6 : 1 },
                    ]}
                    resizeMode="contain"
                  />
                </Pressable>
              
              </View>

              {/* ✅ Remember Me + Forgot Password */}
              <View style={styles.optionsRow}>
                <Pressable
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && (
            <Image 
              source={require('../assets/checkSign.png')} // Aapki downloaded image ka path
              style={styles.checkImage}
            />
          )}
                  </View>
                  <Text style={styles.optionText}>Remember Me</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                  <Text style={styles.optionText}>Forgot Password?</Text>
                </Pressable>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.disabledButton]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or login with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => Linking.openURL('https://ezcompliance.in/')}
                  activeOpacity={0.8}>
                  <Text style={styles.secondaryButtonText}>Guest Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => Linking.openURL('https://ezcompliance.in/')}
                  activeOpacity={0.8}>
                  <Text style={styles.secondaryButtonText}>Schedule a Demo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <Pressable onPress={() => navigation.navigate('Registration')}>
                  <Text style={styles.registerLink}>Registration</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    circle: {
      position: 'absolute',
      top: -50,
      right: -50,
      width: 125,
      height: 125,
      backgroundColor: COLORS.pink,
      borderRadius: 100,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginTop: 50,
    },
    logo: { width: 90, height: 95 },
    logoText: {
      fontSize: 44,
      fontFamily: 'CormorantGaramond-Bold',
      color: '#fff',
      marginLeft: -30,
      marginBottom: 38,
      letterSpacing: 0.46,
    },
    logoSubText: {
    fontSize: 24, // 👈 chhota size
    fontFamily: 'CormorantGaramond-Bold',
    color: '#fff',
  },
    formContainer: {
      flex: 1,
      backgroundColor: COLORS.background,
      borderRadius: 30,
      paddingHorizontal: 10,
      paddingVertical: 20,
      marginTop: 10,
      marginBottom: 120,
      marginLeft: 15,
      marginRight: 15,
    },
    welcomeText: {
      fontSize: 28,
      fontFamily: 'CormorantGaramond-Bold',
      textAlign: 'center',
      color: COLORS.text,
    },
    subText: {
      fontSize: 12,
      textAlign: 'center',
      fontFamily: 'Inter-Regular',
      color: '#404040',
      marginVertical: 10,
    },
    errorText: {
      fontSize: 12,
      color: 'red',
      textAlign: 'center',
      marginVertical: 10,
    },
    label: {
      marginLeft: 10,
      fontSize: 12,
      color: '#121212',
      marginTop: 8,
      marginBottom: 4,
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#E0D7D7',
      backgroundColor: '#fff',
      borderRadius: 25,
      paddingHorizontal: 8,
      paddingVertical: 10,
      fontSize: 12,
      marginTop: 12,
      color: 'black',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      
    },
    // eyeIcon: {
    //   position: 'absolute',u
    //   right: 15,
    //   paddingTop: 13,
    // },
    eyeIcon: { position: 'absolute', right: 15 },
    eyeImage: { width: 20, height: 20 },
    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 15,
      
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: COLORS.muted,
    borderRadius: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // 👈 IMPORTANT (image bahar na jaye)
  },
  checkImage: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },

    checkboxChecked: {
      backgroundColor: '#FFFFFF',
      borderColor: '#858585',
    },
    optionText: {
      fontSize: 10,
      color: '#121212',
      fontFamily: 'Inter',
    },
    submitButton: {
      backgroundColor: '#DAA3A3',
      borderRadius: 32,
      alignItems: 'center',
      marginVertical: 5,
      marginTop: 27,
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      width: '100%',
      height: 56,
      paddingVertical: 16,
    },
    disabledButton: {
      backgroundColor: '#cccccc',
      opacity: 0.6,
    },
    submitButtonText: {
      fontSize: 15,
      lineHeight: 18,
      letterSpacing: 0.15,
      textAlign: 'center',
      color: '#FFFFFF',
      fontFamily: 'Poppins-SemiBold',
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#ccc',
    },
    dividerText: {
      marginHorizontal: 10,
      color: '#121212',
      fontSize: 10,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    secondaryButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      backgroundColor: '#F2F2F2',
      borderRadius: 25,
      paddingVertical: 12,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    secondaryButtonText: {
      fontSize: 14,
      color: COLORS.text,
      fontFamily: 'Inter',
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    registerText: {
      fontSize: 10,
      color: COLORS.muted,
    },
    registerLink: {
      fontSize: 10,
      color: '#530EC3',
      fontFamily: 'Inter',
    },
  });

  export default LoginScreen;
