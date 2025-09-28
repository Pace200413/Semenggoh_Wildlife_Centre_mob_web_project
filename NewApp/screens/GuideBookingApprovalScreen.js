import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../config';

const GuideBookingApprovalScreen = ({ navigation, route }) => {
  const userId = route?.params?.userId;
  const [bookings, setBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedBookings, setSelectedBookings] = useState({});

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, selectedDate, selectedTime]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      if (selectedDate) params.append('date', selectedDate.toISOString().split('T')[0]);
      if (selectedTime) params.append('time', selectedTime);

      const res = await axios.get(`${API_URL}/api/bookings/get-booking/${userId}?${params.toString()}`);
      setBookings(res.data);

      // Default select all pending bookings
      const initSelected = {};
      res.data.forEach(b => {
        if (b.status === 'pending') {
          initSelected[b.booking_id] = true;
        }
      });
      setSelectedBookings(initSelected);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (key) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleBookingSelection = (bookingId) => {
    setSelectedBookings(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  const approveGroup = async (bookingIds) => {
    try {
      await axios.post(`${API_URL}/api/bookings/approve-slot-by-user`, {
        userId: userId,
        bookingIds: bookingIds,
      });
      Alert.alert('Success', 'Selected bookings approved.');
      fetchBookings();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to approve bookings');
    }
  };

  const groupBookings = () => {
    const groups = {};
    bookings.forEach(b => {
      const key = `${b.booking_date} ${b.booking_time}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(b);
    });
    return groups;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Requests</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text>
            {selectedDate
              ? `📅 ${selectedDate.toISOString().split('T')[0]}`
              : '📅 Pick a date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}

        <Picker
          selectedValue={selectedTime}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Time Slot --" value="" />
          <Picker.Item label="10:00" value="10:00:00" />
          <Picker.Item label="14:00" value="14:00:00" />
        </Picker>

        <Picker
          selectedValue={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
          style={styles.picker}
        >
          <Picker.Item label="All Statuses" value="" />
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Confirmed" value="confirmed" />
          <Picker.Item label="Cancelled" value="cancelled" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>

        <TouchableOpacity
          onPress={fetchBookings}
          style={styles.applyFilterButton}
        >
          <Text style={styles.buttonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          Object.entries(groupBookings()).map(([key, group]) => {
            const [date, time] = key.split(' ');
            const isExpanded = expandedGroups[key];

            const selectedIds = group
              .filter(b => b.status === 'pending' && selectedBookings[b.booking_id])
              .map(b => b.booking_id);

            return (
              <View key={key} style={styles.card}>
                <TouchableOpacity onPress={() => toggleGroup(key)} style={styles.groupHeader}>
                  <Text style={styles.groupTitle}>
                    📅 {new Date(date).toLocaleDateString()} 🕒 {time} ({group.length} bookings)
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <>
                    {group.map(b => (
                      <View key={b.booking_id} style={styles.bookingItem}>
                        <Text>👤 Emergency: {b.emergency_contact_name}</Text>
                        <Text>📞 Contact: {b.emergency_contact_no}</Text>
                        <Text>👨‍👩‍👧‍👦 Adults: {b.adult_count}, Children: {b.child_count || 0}</Text>
                        <Text>🗒️ Remark: {b.remark || '-'}</Text>
                        <Text>📌 Status: <Text style={{ fontWeight: 'bold' }}>{b.status}</Text></Text>

                        {b.status === 'pending' && (
                          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 5 }}>
                            <Text style={{ marginRight: 6 }}>Approve</Text>
                            <TouchableOpacity onPress={() => toggleBookingSelection(b.booking_id)}>
                                <Text style={{ fontSize: 18 }}>
                                {selectedBookings[b.booking_id] ? '☑️' : '⬜️'}
                                </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    ))}

                    {selectedIds.length > 0 && (
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => approveGroup(selectedIds)}
                      >
                        <Text style={styles.buttonText}>Approve All (Except Unchecked)</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default GuideBookingApprovalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7fafc',
  },
  filterContainer: {
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: '#edf2f7',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
  },
  applyFilterButton: {
    backgroundColor: '#2f855a',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  groupHeader: {
    paddingVertical: 10,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingItem: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginTop: 5,
  },
  approveButton: {
    backgroundColor: '#3182ce',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 10,
  },
});
