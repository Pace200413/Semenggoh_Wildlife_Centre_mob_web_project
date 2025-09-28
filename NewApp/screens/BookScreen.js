import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { Calendar } from "react-native-calendars";
import { API_URL } from '../config';

export default function BookScreen({ route }) {
  const { guide } = route.params;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [minorCount, setMinorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [maxQuota, setMaxQuota] = useState(0);
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [remark, setRemark] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [availabilityCache, setAvailabilityCache] = useState({});
  const [price, setPrice] = useState(0);

  const times = ["10:00am", "2:00pm"];

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const today = getToday();
    const initialMarkedDates = {
      [today]: { disabled: false, dotColor: '#4CAF50' }
    };
    setMarkedDates(initialMarkedDates);
  }, []);

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(/(am|pm)/i);
    let [hours, minutes] = time.split(':');
    if (modifier.toLowerCase() === 'pm' && hours !== '12') hours = String(+hours + 12);
    if (modifier.toLowerCase() === 'am' && hours === '12') hours = '00';
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };

  useEffect(() => {
    let newPrice = 5 * adultCount + 2 * minorCount;
    setPrice(newPrice);
  }, [adultCount, minorCount]);


  useEffect(() => {
    const fetchGuideAvailability = async () => {
      if (selectedDate && selectedTime) {
        const cacheKey = `${selectedDate}-${convertTo24Hour(selectedTime)}`;
        if (availabilityCache[cacheKey]) {
          const cachedData = availabilityCache[cacheKey];
          setAvailableSlots(cachedData.available_slots);
          setMaxQuota(cachedData.max_group_size);
          return;
        }

        setIsLoading(true);
        try {
          const response = await fetch(
            `${API_URL}/api/guides?date=${selectedDate}&time=${convertTo24Hour(selectedTime)}`
          );
          const data = await response.json();

          if (response.ok) {
            const guideAvailability = data.guides.find(g => g.guide_id === guide.guide_id);

            if (guideAvailability) {
              setAvailabilityCache(prev => ({
                ...prev,
                [cacheKey]: {
                  available_slots: guideAvailability.available_slots,
                  max_group_size: guideAvailability.max_group_size
                }
              }));

              setAvailableSlots(guideAvailability.available_slots);
              setMaxQuota(guideAvailability.max_group_size);
            } else {
              setAvailableSlots(0);
              setMaxQuota(0);
              Alert.alert(
                "No Availability",
                "This guide is not available for the selected date and time.",
                [{ text: "OK" }]
              );
            }
          } else {
            setAvailableSlots(0);
            setMaxQuota(0);
            Alert.alert(
              "Error",
              data.error || "Failed to check availability",
              [{ text: "OK" }]
            );
          }
        } catch (error) {
          console.error('Error fetching availability:', error);
          setAvailableSlots(0);
          setMaxQuota(0);
          Alert.alert(
            "Error",
            "Failed to connect to the server. Please check your connection.",
            [{ text: "OK" }]
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchGuideAvailability();
  }, [selectedDate, selectedTime, guide.guide_id]);

  const handleAdultChange = (change) => {
    const newCount = adultCount + change;
    if (newCount < 0) return;
    if (newCount + minorCount > availableSlots) return;
    setAdultCount(newCount);
  };

  const handleMinorChange = (change) => {
    const newCount = minorCount + change;
    if (newCount < 0) return;
    if (newCount + adultCount > availableSlots) return;
    setMinorCount(newCount);
  };


  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !emergencyName || !emergencyContact) {
      return;
    }

    const phoneRegex = /^(\d{3}-?\d{7,8})$/;

    if (!phoneRegex.test(emergencyContact)) {
      alert('Please enter a valid phone number (e.g., 0123456789 or 012-3456789), country code is not needed');
      return;
    }

    if (adultCount + minorCount > availableSlots) {
      return;
    }

    const booking = {
      user_id: route?.params?.userId,
      guide_id: guide.guide_id,
      booking_date: selectedDate,
      booking_time: convertTo24Hour(selectedTime),
      adult_count: adultCount,
      child_count: minorCount,
      emergency_contact_name: emergencyName,
      emergency_contact_no: emergencyContact,
      remark: remark,
      status: "pending",
      payment_method: "online",
      price: price
    };

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });

      if (response.ok) {
        // 🔁 Notify guide availability update
        await fetch(`${API_URL}/api/guides/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guide_id: guide.guide_id,
            date: selectedDate,
            time: convertTo24Hour(selectedTime),
            visitor_count: adultCount + minorCount,
          }),
        });

        const cacheKey = `${selectedDate}-${convertTo24Hour(selectedTime)}`;
        setAvailabilityCache(prev => {
          const newCache = { ...prev };
          delete newCache[cacheKey];
          return newCache;
        });

        Alert.alert(
          "Booking Successful",
          "Your booking is pending approval. You will be notified once it's confirmed.",
          [
            {
              text: "OK",
              onPress: () => {
                setSelectedDate("");
                setSelectedTime("");
                setAdultCount(1);
                setMinorCount(0);
                setEmergencyName("");
                setEmergencyContact("");
                setAvailableSlots(0);
                setMaxQuota(0);
                setRemark("");
                setIsLoading(false);
                setPrice(0);
              }
            }
          ]
        );
      } else {
        Alert.alert(
          "Booking Failed",
          "There was an error processing your booking. Please try again.",
          [{ text: "OK" }]
        );
        setIsLoading(false);
      }
    } catch (error) {
      Alert.alert(
        "Booking Failed",
        "There was an error processing your booking. Please try again.",
        [{ text: "OK" }]
      );
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={require('../assets/images/app.png')} 
          style={styles.image} 
        />
        <View style={styles.info}>
          <Text style={styles.name}>Name: {guide.name}</Text>
          <Text style={styles.text}>Phone: {guide.phone_no}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.header}>Select a Date & Time</Text>

        <Calendar
          onDayPress={(day) => {
            const today = getToday();
            if (day.dateString >= today) {
              setSelectedDate(day.dateString);
              setSelectedTime("");
              setAvailableSlots(0);
              setMaxQuota(0);
            }
          }}
          markedDates={{
            ...markedDates,
            [selectedDate]: { selected: true, selectedColor: "#4CAF50" }
          }}
          minDate={getToday()}
          style={styles.calendar}
        />

        {selectedDate && (
          <View style={styles.timeContainer}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.timeSlot, selectedTime === time && styles.selectedTime]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={styles.timeText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Checking availability...</Text>
          </View>
        )}
      </View>

      {selectedDate && selectedTime && availableSlots > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Available Slots</Text>
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityText}>
              {availableSlots} out of {maxQuota} slots available
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Guests</Text>

        <View style={styles.guestRow}>
          <Text style={styles.guestLabel}>Adults</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => handleAdultChange(-1)}
            >
              <Text style={styles.counterText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>{adultCount}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => handleAdultChange(1)}
            >
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.guestRow}>
          <Text style={styles.guestLabel}>Children</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => handleMinorChange(-1)}
            >
              <Text style={styles.counterText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>{minorCount}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => handleMinorChange(1)}
            >
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Emergency Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact Name"
          value={emergencyName}
          onChangeText={setEmergencyName}
        />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact Number"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.remarkInput]}
          multiline
          numberOfLines={4}
          placeholder="Any special requests or notes"
          value={remark}
          onChangeText={setRemark}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Payment Method:</Text>
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityText}>
            Only Online transaction accepted
          </Text>
        </View>
        <Text style={styles.label}>Total Price for Booking:</Text>
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityText}>
            RM {price}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, (isLoading || !emergencyName || !emergencyContact) && styles.disabledButton]} 
        onPress={handleBooking}
        disabled={isLoading || !emergencyName || !emergencyContact}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Processing...' : 'Book'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  card: { flexDirection: 'row', padding: 10, backgroundColor: '#4CAF50', borderRadius: 10 },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  text: { color: 'white' },
  section: { marginTop: 20 },
  label: { fontSize: 18, fontWeight: 'bold' },
  header: { fontSize: 16, marginVertical: 10 },
  button: { backgroundColor: '#4CAF50', padding: 15, marginTop: 20, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  calendar: { borderRadius: 10, elevation: 4, backgroundColor: "#fff" },
  timeContainer: { marginTop: 20 },
  timeSlot: { padding: 15, backgroundColor: "#f0f0f0", marginVertical: 5, borderRadius: 8 },
  selectedTime: { backgroundColor: "#4CAF50" },
  timeText: { textAlign: "center", color: "#000" },
  guestRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  guestLabel: { fontSize: 16, fontWeight: "bold" },
  counterContainer: { flexDirection: "row", alignItems: "center" },
  counterButton: { width: 40, height: 40, backgroundColor: "#4CAF50", justifyContent: "center", alignItems: "center", borderRadius: 5 },
  counterText: { fontSize: 20, color: "white", fontWeight: "bold" },
  countText: { fontSize: 18, marginHorizontal: 15 },
  loadingContainer: { alignItems: 'center', marginVertical: 20 },
  loadingText: { marginTop: 10, color: '#4CAF50', fontSize: 16 },
  disabledButton: { backgroundColor: '#cccccc' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: 'white' },
  remarkInput: { height: 100, textAlignVertical: 'top' },
  availabilityContainer: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 20 },
  availabilityText: { fontSize: 16, fontWeight: 'bold' }
});
