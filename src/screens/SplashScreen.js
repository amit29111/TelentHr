// import React, { useEffect } from 'react';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';

// const SplashScreen = () => {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem('authToken');
//         const expiry = await AsyncStorage.getItem('tokenExpiry'); // stored as timestamp

//         const isTokenValid =
//           token && expiry && new Date().getTime() < parseInt(expiry);

//         if (isTokenValid) {
//           navigation.replace('Dashboard');
//         } else {
//           navigation.replace('Welcome');
//         }
//       } catch (e) {
//         navigation.replace('Welcome');
//       }
//     };

//     checkAuth();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color="#DAA3A3" />
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FDF7F2',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const expiresAt = await AsyncStorage.getItem('tokenExpiresAt');

        const isTokenValid =
          token && expiresAt && Date.now() < parseInt(expiresAt, 10);

        if (isTokenValid) {
          navigation.replace('Dashboard'); // ✅ Navigate to Dashboard if token is valid
        } else {
          navigation.replace('WelcomeScreen'); // ❌ Expired or missing → Welcome
        }
      } catch (e) {
        navigation.replace('WelcomeScreen');
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#DAA3A3" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
