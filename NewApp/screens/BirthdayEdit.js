import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '../config';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

export default function BirthdayEdit({ navigation, route }) {
  const { userId, birthday, userType } = route.params || {};

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [originalDate, setOriginalDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBirthday = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/${userId}`);
        const birthDate = res.data.birth_date; // Expecting 'YYYY-MM-DD'
        setOriginalDate(birthDate);

        if (birthDate) {
          const [year, month, day] = birthDate.split('-');
          setOriginalDate(`${months[parseInt(month, 10) - 1]} ${parseInt(day)}, ${year}`);
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Could not load birthday");
      } finally {
        setLoading(false);
      }
    };
    fetchBirthday();
  }, [userId]);

  const handleSave = async () => {
    if (!selectedMonth || !selectedDay || !selectedYear) {
      Alert.alert('Validation Error', 'Please select a complete date');
      return;
    }

    const monthIndex = months.indexOf(selectedMonth) + 1;
    const formattedMonth = monthIndex.toString().padStart(2, '0');
    const formattedDay = selectedDay.padStart(2, '0');
    const formattedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`; // MySQL format

    try {
      await axios.patch(`${API_URL}/api/users/${userId}`, {
        birth_date: formattedDate
      });
      // Navigate back to the profile screen with success flag
      navigation.navigate({
        name: userType === 'Guide' ? 'GuideProfile' : 
              userType === 'Guest' ? 'GuestPro' : 'AdminPro',
        params: {
          updateSuccess: true,  // Set success flag
          birthday: formattedDate,
          userId,
          userType,
        },
        merge: true, // Merge with existing params
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not update birthday");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 30 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.sectionContainer, styles.monthSection]}>
          <Text style={styles.sectionLabel}>Month</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}
              style={styles.picker}
              dropdownIconColor="#7B68EE"
            >
              <Picker.Item label={selectedMonth || "Select month"} value="" enabled={false} />
              {months.map(month => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={[styles.sectionContainer, styles.daySection]}>
          <Text style={styles.sectionLabel}>Day</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedDay}
              onValueChange={setSelectedDay}
              style={styles.picker}
              dropdownIconColor="#FF6347"
            >
              <Picker.Item label={selectedDay || "Select day"} value="" enabled={false} />
              {days.map(day => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={[styles.sectionContainer, styles.yearSection]}>
          <Text style={styles.sectionLabel}>Year</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={setSelectedYear}
              style={styles.picker}
              dropdownIconColor="#20B2AA"
            >
              <Picker.Item label={selectedYear || "Select year"} value="" enabled={false} />
              {years.map(year => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.placeholder}>Original: {originalDate || 'N/A'}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!selectedMonth || !selectedDay || !selectedYear) && styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={!selectedMonth || !selectedDay || !selectedYear}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6fff0' },
  content: { padding: 16 },
  sectionContainer: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthSection: { backgroundColor: '#bacfc2' },
  daySection: { backgroundColor: '#bacfc2' },
  yearSection: { backgroundColor: '#bacfc2' },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
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
  placeholder: {
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
  },
});
