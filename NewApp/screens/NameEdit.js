import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config'; // Adjust this based on where your API URL is stored.

export default function NameEdit({ navigation, route }) {
  const { userType, firstName: initialFirstName = '', lastName: initialLastName = '', nickname: initialNickname = '', userId } = route.params || {};
  
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation Error', 'First name and last name are required');
      return;
    }

    // Combine first and last name to create the full name
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const profileParams = {
      firstName: firstName.trim(),
      lastName: lastName.trim(), 
      name: fullName,// Send the combined full name
      userType,
    };

    try {
      // Make an API call to update the user's name (first name, last name, nickname)
      await axios.patch(`${API_URL}/api/users/${userId}`, {
        name: fullName,
      });

      // Show success message
      Alert.alert('Success', 'Name updated successfully');

      // Navigate back to the appropriate profile screen
      const destination = {
        Guide: 'GuideProfile',
        Guest: 'GuestPro',
        Admin: 'AdminPro',
      }[userType] || 'GuideProfile';

      // Navigate back with success params
      navigation.navigate(destination, { 
        ...profileParams, 
        fullName: fullName,
        updateSuccess: true 
      });

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not update name");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.editSection}>
        <Text style={styles.label}>First Name*</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
          maxLength={50}
        />

        <Text style={styles.label}>Last Name*</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
          maxLength={50}
        />
      </View>

      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>Who can see your name</Text>
        <Text style={styles.privacyText}>
          Anyone can see this info when they communicate with you or view content you create in Park Guide services.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.saveButton, (!firstName || !lastName) && styles.disabledButton]}
          onPress={handleSave}
          disabled={!firstName || !lastName}
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
  privacySection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 8,
    lineHeight: 20,
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
