import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config'; // Adjust this based on where your API URL is stored.

export default function EmailEdit({ navigation, route }) {
  const { userType, Email: initialEmail = '', EmergeEmail: initialEmergeEmail = '', userId } = route.params || {};
  
  const [Email, setEmail] = useState(initialEmail);
  const [EmergeEmail, setEmergeEmail] = useState(initialEmergeEmail);

  const handleSave = async () => {
    if (!Email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return;
    }

    const profileParams = { 
      Email: Email.trim(),
      EmergeEmail: EmergeEmail.trim(),
      userType,
    };

    try {
      // Make an API call to update the email
      await axios.patch(`${API_URL}/api/users/${userId}`, {
        email: Email.trim(),
      });

      // Show success message
      Alert.alert('Success', 'Email updated successfully');

      // Navigate back to the appropriate profile screen
      const destination = {
        Guide: 'GuideProfile',
        Guest: 'GuestPro',
        Admin: 'AdminPro',
      }[userType] || 'GuideProfile';

      // Navigate back with success params
      navigation.navigate(destination, { 
        ...profileParams, 
        updateSuccess: true 
      });

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not update email");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.editSection}>
        <Text style={styles.label}>Email*</Text>
        <TextInput
          style={styles.input}
          value={Email}
          onChangeText={setEmail}
          placeholder="Enter Email"
          maxLength={50}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.saveButton, (!Email ) && styles.disabledButton]}
          onPress={handleSave}
          disabled={!Email }
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6fff0',
    padding: 16,
  },
  editSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#5f6368',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#2f855a',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2f855a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
