import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return 'All fields are required.';
    }
    if (newPassword.length < 6) {
      return 'New password must be at least 6 characters.';
    }
    if (newPassword !== confirmPassword) {
      return 'New password and confirmation do not match.';
    }
    return null;
  };

  const handleChangePassword = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Replace this with your real password change logic
    Alert.alert('Success', 'Password changed successfully.');
    navigation.goBack();
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Password</Text>
      <View style={styles.passwordInput}>
        <TextInput 
          style={styles.input}
          secureTextEntry={!showPassword}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity onPress={toggleShowPassword}>
          <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>New Password</Text>
      <View style={styles.passwordInput}>
        <TextInput 
          style={styles.input}
          secureTextEntry={!showPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={toggleShowPassword}>
          <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm New Password</Text>
      <View style={styles.passwordInput}>
        <TextInput 
          style={styles.input}
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={toggleShowPassword}>
          <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 , backgroundColor:'#ECF9F0' },
  label: { fontSize: 16, marginTop: 20 },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    backgroundColor:'#fff',
  },
  input: { flex: 1, paddingVertical: 10 },
  button: { marginTop: 30, backgroundColor: '#2f855a', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  error: { color: '#d9534f', marginTop: 10, textAlign: 'center' },
});