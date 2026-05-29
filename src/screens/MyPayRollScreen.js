import React, {useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const MyPayRollScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const tabNavigation = navigation.getParent?.();
    if (tabNavigation?.navigate) {
      tabNavigation.navigate('Payroll', {screen: 'PayrollDashboard'});
      return;
    }
    navigation.navigate('Payroll', {screen: 'PayrollDashboard'});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#402530" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyPayRollScreen;
