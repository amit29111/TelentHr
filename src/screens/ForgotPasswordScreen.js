import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';

const ForgotPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const strength = password.length >= 8 ? 'Strong' : 'Weak';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Close Button */}
        <TouchableOpacity style={styles.closeBtn}>
          <Image
            source={require('../assets/victorIconImage/Close.png')}
            style={styles.closeImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Top Image */}
        <Image
          source={require('../assets/ForgotPassword.png')}
          style={styles.topImage}
          resizeMode="contain"
        />

        {/* Header */}
        <Text style={styles.title}>Forgot your password</Text>
        <Text style={styles.subtitle}>
          Simplifying Workflows. Empowering Workforce.
        </Text>

        <Text style={styles.resetText}>Reset Password</Text>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Image
              source={require('../assets/victorIconImage/eye.png')}
              style={styles.eyeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Strength */}
        <View style={styles.strengthRow}>
          <Text style={styles.strengthLabel}>Password strength</Text>
          <Text style={styles.strengthValue}>{strength}</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        {/* Rules */}
        <View style={styles.rules}>
          <Text style={styles.rule}>• Must be at least 8 characters.</Text>
          <Text style={styles.rule}>• One uppercase and lowercase character</Text>
          <Text style={styles.rule}>• A number</Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

      </View>

      {/* Footer Logo */}
      <View style={styles.footer}>
        <Image
          source={require('../assets/TALENT_LOGO.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },

  /* Close Button */
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },

  closeImage: {
    width: 18,
    height: 18,
  },

  /* Top Image */
  topImage: {
    width: 160,
    height: 160,
    alignSelf: 'flex-start',
    marginTop: 40, // 👈 notch safe
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 20,
  },

  subtitle: {
    color: '#555',
    marginTop: 6,
  },

  resetText: {
    marginTop: 30,
    color: '#2E7D32',
    fontWeight: '600',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 12,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    height: 48,
  },

  eyeImage: {
    width: 22,
    height: 22,
  },

  strengthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  strengthLabel: {
    color: '#555',
  },

  strengthValue: {
    color: '#2E7D32',
    fontWeight: '600',
  },

  progressBar: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginTop: 6,
  },

  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },

  rules: {
    marginTop: 12,
  },

  rule: {
    color: '#555',
    fontSize: 13,
    marginVertical: 2,
  },

  button: {
    backgroundColor: '#051A09',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  /* Footer */
  footer: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    alignItems: 'center',
  },

  logo: {
    width: 140,
    height: 60,
  },
});
