import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config';

export default function LoginScreen({ navigation, route }) {
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState(route?.params?.email||null);
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    setEmail();
    setPassword();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setEmail();
      setPassword();
    }, [])
  );

  const onLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/jwt-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Raw server response:', text);
        throw new Error('Server returned invalid JSON');
      }
  
      console.log('Login response:', data);
  
      if (response.ok) {
        const { user, accessToken, refreshToken } = data;
  
        // ✅ Save tokens and user data
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
  
        // Navigate based on role
        if (user.role === 'visitor') {
          console.log(user.user_id);
          navigation.navigate('GuestHome', { userId: user.id, role: user.role });
        } else if (user.role === 'guide') {
          if (user.approved) {
            navigation.navigate('GuideHome', { userId: user.id, role: user.role });
          } else {
            Alert.alert('Pending Approval', 'Your guide registration is still pending approval.');
          }
        } else if (user.role === 'admin') {
          navigation.navigate('AdminHomePage', { userId: user.id, role: user.role });
        } else {
          navigation.navigate('Home'); // fallback
        }
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  const containerMaxWidth = width < 600 ? '90%' : 500;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.formCard, { maxWidth: containerMaxWidth }]}>
        <Image
          source={require('../assets/images/logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome to Park Guide System</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword', {email: email})}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
          Don&apos;t have an account? <Text style={{ color: '#2f855a' }}>Register</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECF9F0',
    paddingVertical: 50,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: '#276749',
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#38a169',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  roleContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: 10,
  },
  roleLabel: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#2f855a',
  },
  roleButton: {
    backgroundColor: '#CBD5E0',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginTop: 4,
  },
  roleButtonActive: {
    backgroundColor: '#2f855a',
  },
  roleText: {
    color: '#1a202c',
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#2f855a',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerText: {
    marginTop: 15,
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
  },
  forgotText: {
    color: '#2b6cb0',      // same blue as other links
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});
