import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config'; // Adjust this based on where your API URL is stored.

export default function PhoneEdit({ navigation, route }) {
  const { userId, phone: initialPhone = '',  userType } = route.params || {};

  const [Phone, setPhone] = useState(initialPhone);

  const handleSave = async () => {
    // Validation check for Phone number
    if (!Phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return;
    }

    const phoneParams = {
      phone: Phone.trim(),
      userType,
    };

    try {
      // Make an API call to update the phone numbers
      const response = await axios.patch(`${API_URL}/api/users/${userId}`, {
        phone_no: Phone.trim(),
      });

      if (response.status === 200) {
        // Show success message if the update is successful
        Alert.alert('Success', 'Phone numbers updated successfully');

        // Navigate back to the appropriate profile screen
        const destination = {
          Guide: 'GuideProfile',
          Guest: 'GuestPro',
          Admin: 'AdminPro',
        }[userType] || 'GuideProfile';

        // Pass updated phone numbers back to the profile screen
        navigation.navigate(destination, { 
          phone: Phone.trim(),
          userType,
          updateSuccess: true, // Flag indicating success
        });
      } else {
        throw new Error('Failed to update phone numbers');
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not update phone numbers. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.editSection}>
        <Text style={styles.label}>Phone*</Text>
        <TextInput
          style={styles.input}
          value={Phone}
          onChangeText={setPhone}
          placeholder="Enter Phone number"
          keyboardType="phone-pad" // Ensure phone keypad is used
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
          style={[styles.saveButton, (!Phone) && styles.disabledButton]} // Disable Save if Phone is empty
          onPress={handleSave}
          disabled={!Phone}
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
