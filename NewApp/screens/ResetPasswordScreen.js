import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { API_URL } from '../config';

export default function ResetPasswordScreen({ navigation, route }) {
  const Email = route?.params?.email;
  const [email, setEmail] = useState(Email||null);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { width } = useWindowDimensions();
  const cardMaxWidth = width < 600 ? '90%' : 480;

  const handleResetPassword = async () => {
    if (!email || !token || !newPassword) {
      Alert.alert('Missing fields', 'Please fill out all inputs.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        Alert.alert('Error', 'Invalid response from server');
        return;
      }
      if (res.ok) {
        Alert.alert('Success', data.message, [
          { text: 'Go to Login', onPress: () => navigation.navigate('Login', {email:email}) },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Reset failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to reset password');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { maxWidth: cardMaxWidth }]}>
        <Image
          source={require('../assets/images/logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Reset your password</Text>

        <TextInput
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="6‑digit reset code"
          value={token}
          onChangeText={setToken}
          keyboardType="number-pad"
          style={styles.input}
        />
        <TextInput
          placeholder="New password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleResetPassword}>
          <Text style={styles.primaryText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('ForgotPassword', {email:email})}>
          <Text style={styles.linkText}>Need a new code?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 60,
    alignItems: 'center',
    backgroundColor: '#ECF9F0',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#22543d',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#38a169',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 14,
    fontSize: 16,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#2f855a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    marginTop: 14,
  },
  linkText: {
    color: '#2b6cb0',
    fontSize: 14,
  },
});
