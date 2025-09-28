import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function DeleteAccountScreen({ navigation }) {
  const handleDelete = () => {
    // Replace with actual account deletion logic
    Alert.alert('Account Deleted', 'Your account has been deleted.');
    navigation.navigate('Login'); // Or root screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>
        This will permanently delete your account and all associated data. This action cannot be undone.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleDelete}>
        <Text style={styles.buttonText}>Confirm Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#ECF9F0' },
  warning: {
    fontSize: 16,
    color: '#d9534f',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold', // ← Bold text
  },
  button: { backgroundColor: '#d9534f', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});