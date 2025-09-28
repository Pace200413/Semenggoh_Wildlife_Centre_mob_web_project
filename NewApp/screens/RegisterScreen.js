import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  Alert,
  Platform,
  Pressable
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_URL } from '../config';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('male');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [role, setRole] = useState('visitor');

  // Gender options
  const genderOptions = ['male', 'female'];

  // Birth date formatting
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const { width } = useWindowDimensions();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^(\d{3}-?\d{7,8})$/;

    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid phone number (e.g., 0123456789 or 012-3456789), country code is not needed');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone_no: phone,
          password,
          gender,
          birth_date: birthDate.toISOString().split('T')[0],
          role
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Raw register response:', text);
        Alert.alert('Server Error', 'Unexpected server response.');
        return;
      }

      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Network Error', 'Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingHorizontal: width < 768 ? 20 : 80 }]}>
      <Image source={require('../assets/images/park_guide_logo.jpg')} style={styles.logo} />
      <Text style={styles.title}>Create Your Account</Text>

      <TextInput placeholder="Full Name" style={styles.input} onChangeText={setName} value={name} />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderContainer}>
        {genderOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => setGender(option.toLowerCase())}
            style={[
              styles.genderOption,
              gender === option.toLowerCase() && styles.genderSelected,
            ]}
          >
            <Text style={gender === option.toLowerCase() ? styles.genderTextSelected : styles.genderText}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Birth Date</Text>
      <Pressable style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#38a169" style={{ marginRight: 10 }} />
        <Text style={styles.datePickerText}>{formatDate(birthDate)}</Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setBirthDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Role</Text>
      <View style={styles.roleContainer}>
        {['visitor', 'guide'].map((option) => (
          <Pressable
            key={option}
            onPress={() => setRole(option)}
            style={[
              styles.roleOption,
              role === option && styles.roleSelected,
            ]}
          >
            <Text style={role === option ? styles.roleTextSelected : styles.roleText}>
              {option === 'visitor' ? 'Visitor' : 'Guide (requires approval)'}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Email</Text>
      <TextInput placeholder="Email Address" style={styles.input} onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" />
      
      <Text style={styles.label}>Phone Number</Text>
      <TextInput placeholder="Phone Number" style={styles.input} onChangeText={setPhone} value={phone} keyboardType="phone-pad" />
      
      <Text style={styles.label}>Password</Text>
      <TextInput placeholder="Password" style={styles.input} onChangeText={setPassword} value={password} secureTextEntry />
      
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput placeholder="Confirm Password" style={styles.input} onChangeText={setConfirmPassword} value={confirmPassword} secureTextEntry />

      

      <Button title="Register" color="#2f855a" onPress={handleRegister} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6fffa',
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#22543d',
  },
  input: {
    borderWidth: 1,
    borderColor: '#38a169',
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginTop: 10,
    color: '#22543d',
  },
  
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20, // Matches input padding
  },
  
  genderOption: {
    borderWidth: 1,
    borderColor: '#38a169',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  
  genderSelected: {
    backgroundColor: '#38a169',
  },
  
  genderText: {
    color: '#22543d',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  genderTextSelected: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38a169',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2, // for Android shadow
  },
  
  datePickerText: {
    color: '#22543d',
    fontSize: 16,
  },
  
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#38a169',
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  roleContainer: {
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  width: '100%',
  marginBottom: 20,
  paddingHorizontal: 20,
},

roleOption: {
  borderWidth: 1,
  borderColor: '#38a169',
  borderRadius: 20,
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: '#fff',
},

roleSelected: {
  backgroundColor: '#38a169',
},

roleText: {
  color: '#22543d',
  fontWeight: '500',
  textAlign: 'center',
},

roleTextSelected: {
  color: '#fff',
  fontWeight: '600',
  textAlign: 'center',
},
});