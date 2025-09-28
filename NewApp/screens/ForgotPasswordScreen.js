import React, { useState, useEffect } from 'react';
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

export default function ForgotPasswordScreen({ navigation, route }) {
  const Email = route?.params?.email;
  const [email, setEmail] = useState(Email || null);
  const { width } = useWindowDimensions();
  const cardMaxWidth = width < 600 ? '90%' : 480;

  useEffect(() => {
      setEmail(Email || null);
    }, []);

  const handleRequestReset = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      Alert.alert('Success', data.message);
    } catch (err) {
      Alert.alert('Error', 'Could not send reset link');
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
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          Enter your registered email and we'll send you a 6‑digit reset code.
        </Text>

        <TextInput
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleRequestReset}>
          <Text style={styles.primaryText}>Send Reset Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('ResetPassword', {email : email})}>
          <Text style={styles.linkText}>I already have a code</Text>
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
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#38a169',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 18,
    fontSize: 16,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#2f855a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
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
