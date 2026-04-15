import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const InternetGuard = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected =
        state.isConnected && state.isInternetReachable !== false;

      if (!connected) {
        setIsConnected(false);

        if (!alertShown) {
          setAlertShown(true);
          Alert.alert(
            'No Internet Connection',
            'Internet is required to use this app.',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        }
      } else {
        setIsConnected(true);
        setAlertShown(false);
      }
    });

    return () => unsubscribe();
  }, [alertShown]);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Internet</Text>
        <Text style={styles.subtitle}>
          Please check your network connection
        </Text>
      </View>
    );
  }

  return children;
};

export default InternetGuard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});

