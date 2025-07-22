// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// // import ok from '../assets/ok'


// const WelcomeScreen = () => {
//   const navigation = useNavigation();
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar hidden={true} />
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
//         {/* Logo */}
//         <Image
//           source={require('../../src/assets/TALENT_LOGO.png')}
         
//           style={styles.logo}
//           resizeMode="contain"
//         />

//         {/* Illustration */}
//         <Image
//           source={require('../../src/assets/Illustration.png')}
//           style={styles.illustration}
//           resizeMode="contain"
//         />

//         {/* Welcome Text */}
//         <Text style={styles.heading}>Welcome</Text>
//         <Text style={styles.subText}>
//           Stay informed with real-time updates, schedule reminders, and important alerts by enabling notifications.
//         </Text>

//         {/* Sign Up Button */}
//         <TouchableOpacity
//           style={[styles.button, { backgroundColor: '#d1c4b6' }]}
//           onPress={() => navigation.navigate('LoginScreen')}
//         >
//           <Text style={styles.buttonText}>Sign in</Text>
//         </TouchableOpacity>

//         {/* Fingerprint Button */}
//         <TouchableOpacity style={styles.button}>
//           <View style={styles.buttonContent}>
//             <Text style={styles.buttonText}>Finger Print</Text>
//             <Image
//               source={require('../../src/assets/Biometric_id.png')}
//               style={styles.biometric}
//             />
//           </View>
//         </TouchableOpacity>
        
//         {/* Face ID Button */}
//         <TouchableOpacity style={styles.button}>
//           <View style={styles.buttonContent}>
//             <Text style={styles.buttonText}>Face ID</Text>
//             <Image
//               source={require('../../src/assets/face_recognition.png')}
//               style={styles.face_recognition}
//             />
//           </View>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default WelcomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FDF7F2',
//   },
//   scrollContent: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//      paddingVertical: 10,
//   },
//   logo: {
//     width: 201,   // increased width
//     height: 201,  // increased height
//     marginBottom: 4,
//     marginTop:-36
//   },
//   illustration: {
//     width: 300,   // increased width
//     height: 300,  // increased height
//     marginBottom: 16,
//     marginTop:-36
//   },
//   heading: {
//     fontSize: 28,
//     fontFamily:'Poppins-Medium',
//     color: '#051A09',
//     marginBottom: 8,
//   },
//   subText: {
//     fontSize: 14,
//     color: '#626160',
//     textAlign: 'center',
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     fontFamily:'Poppins-Medium',
//     width:330,
//     height: 60,
//     lineHeight:'20',
   
//   },
//   button: {
//     width: '100%',
//     height:56,
//     backgroundColor: '#e0d5cc',
//     paddingVertical: 15,
//     borderRadius: 32,
//     marginBottom: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
  
//     // iOS shadow
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
  
//     // Android shadow
     
//   },
//   buttonText: {
//     fontSize: 16,
//     fontFamily:'Poppins-Bold',
//     color: '#402530',
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   biometric: {
//     width: 26,
//     height: 26,
//     marginLeft: 5,
//   },
//   face_recognition: {
//     width: 26,
//     height: 26,
//     marginLeft: 5,
//   },
// });

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReactNativeBiometrics from 'react-native-biometrics';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleBiometricAuth = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      Alert.alert('Not Supported', 'Biometric authentication is not available on this device.');
      return;
    }

    rnBiometrics
      .simplePrompt({ promptMessage: 'Login using biometrics' })
      .then(resultObject => {
        const { success } = resultObject;
        if (success) {
          Alert.alert('Success', 'Authenticated successfully!');
          navigation.navigate('LoginScreen');
        } else {
          Alert.alert('Cancelled', 'Authentication cancelled by user.');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Biometric authentication failed.');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Logo */}
        <Image
          source={require('../../src/assets/TALENT_LOGO.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Illustration */}
        <Image
          source={require('../../src/assets/Illustration.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Welcome Text */}
        <Text style={styles.heading}>Welcome</Text>
        <Text style={styles.subText}>
          Stay informed with real-time updates, schedule reminders, and important alerts by enabling notifications.
        </Text>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#d1c4b6' }]}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        {/* Fingerprint Button (same function) */}
        <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Finger Print</Text>
            <Image
              source={require('../../src/assets/Biometric_id.png')}
              style={styles.biometric}
            />
          </View>
        </TouchableOpacity>
        
        {/* Face ID Button (same function) */}
        <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Face ID</Text>
            <Image
              source={require('../../src/assets/face_recognition.png')}
              style={styles.face_recognition}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F2',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  logo: {
    width: 201,
    height: 201,
    marginBottom: 4,
    marginTop: -36,
  },
  illustration: {
    width: 300,
    height: 300,
    marginBottom: 16,
    marginTop: -36,
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Poppins-Medium',
    color: '#051A09',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#626160',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Medium',
    width: 330,
    height: 60,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#e0d5cc',
    paddingVertical: 15,
    borderRadius: 32,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#402530',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  biometric: {
    width: 26,
    height: 26,
    marginLeft: 5,
  },
  face_recognition: {
    width: 26,
    height: 26,
    marginLeft: 5,
  },
});
