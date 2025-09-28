// BookScreen.js (ReactJS Web version with embedded styles)
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { API_URL } from '../config';

export default function BookScreen() {
  const location = useLocation();
  const { guide, userId } = location.state || {};

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [adultCount, setAdultCount] = useState(1);
  const [minorCount, setMinorCount] = useState(0);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [maxQuota, setMaxQuota] = useState(0);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [remark, setRemark] = useState('');
  const [availabilityCache, setAvailabilityCache] = useState({});
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const times = ['10:00am', '2:00pm'];

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(/(am|pm)/i);
    let [hours, minutes] = time.split(':');
    if (modifier.toLowerCase() === 'pm' && hours !== '12') hours = String(+hours + 12);
    if (modifier.toLowerCase() === 'am' && hours === '12') hours = '00';
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  useEffect(() => {
    setPrice(5 * adultCount + 2 * minorCount);
  }, [adultCount, minorCount]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || !selectedTime || !guide) return;

      const dateStr = selectedDate.toISOString().split('T')[0];
      const timeStr = convertTo24Hour(selectedTime);
      const cacheKey = `${dateStr}-${timeStr}`;

      if (availabilityCache[cacheKey]) {
        const cached = availabilityCache[cacheKey];
        setAvailableSlots(cached.available_slots);
        setMaxQuota(cached.max_group_size);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/api/guides?date=${dateStr}&time=${timeStr}`);
        const data = await res.json();

        const found = data.guides.find(g => g.guide_id === guide.guide_id);
        if (found) {
          setAvailabilityCache(prev => ({
            ...prev,
            [cacheKey]: {
              available_slots: found.available_slots,
              max_group_size: found.max_group_size
            }
          }));
          setAvailableSlots(found.available_slots);
          setMaxQuota(found.max_group_size);
        } else {
          setAvailableSlots(0);
          setMaxQuota(0);
          window.alert("This guide is not available for the selected date and time.");
        }
      } catch (e) {
        console.error(e);
        window.alert("Failed to connect to server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedTime, guide]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !emergencyName || !emergencyContact) return;

    const phoneRegex = /^\d{3}-?\d{7,8}$/;
    if (!phoneRegex.test(emergencyContact)) {
      window.alert('Invalid phone number');
      return;
    }

    const booking = {
      user_id: userId,
      guide_id: guide.guide_id,
      booking_date: selectedDate.toISOString().split('T')[0],
      booking_time: convertTo24Hour(selectedTime),
      adult_count: adultCount,
      child_count: minorCount,
      emergency_contact_name: emergencyName,
      emergency_contact_no: emergencyContact,
      remark,
      status: 'pending',
      payment_method: 'online',
      price
    };

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      if (response.ok) {
        window.alert("Booking successful! Pending approval.");
        setSelectedDate(null);
        setSelectedTime('');
        setAdultCount(1);
        setMinorCount(0);
        setEmergencyName('');
        setEmergencyContact('');
        setRemark('');
      } else {
        window.alert("Booking failed.");
      }
    } catch (e) {
      window.alert("Booking failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!guide) {
    return <p style={{ padding: 20, color: 'red' }}>Guide details not found. Please return to the previous page.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Book Guide: {guide.name}</h2>
      <p style={styles.subtext}>Phone: {guide.phone_no}</p>

      <h4 style={styles.sectionTitle}>Select Date</h4>
      <Calendar onChange={setSelectedDate} value={selectedDate} minDate={new Date()} />

      {selectedDate && (
        <>
          <h4 style={styles.sectionTitle}>Select Time</h4>
          <div style={styles.timeButtons}>
            {times.map(time => (
              <button
                key={time}
                style={selectedTime === time ? styles.selectedTimeButton : styles.timeButton}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}

      {isLoading && <p>Checking availability...</p>}

      {selectedDate && selectedTime && availableSlots > 0 && (
        <p style={styles.availabilityText}>{availableSlots} out of {maxQuota} slots available</p>
      )}

      <h4 style={styles.sectionTitle}>Guests</h4>
      <div style={styles.counterGroup}>
        Adults:
        <button onClick={() => setAdultCount(Math.max(0, adultCount - 1))}>-</button>
        {adultCount}
        <button onClick={() => setAdultCount(adultCount + 1)}>+</button>
      </div>
      <div style={styles.counterGroup}>
        Children:
        <button onClick={() => setMinorCount(Math.max(0, minorCount - 1))}>-</button>
        {minorCount}
        <button onClick={() => setMinorCount(minorCount + 1)}>+</button>
      </div>

      <h4 style={styles.sectionTitle}>Emergency Contact</h4>
      <input style={styles.input} placeholder="Name" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} />
      <input style={styles.input} placeholder="Phone" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} />

      <h4 style={styles.sectionTitle}>Remarks</h4>
      <textarea style={styles.textarea} value={remark} onChange={e => setRemark(e.target.value)} />

      <p>Payment: Online only</p>
      <p>Total Price: RM {price}</p>

      <button style={styles.bookButton} onClick={handleBooking} disabled={isLoading}>Book</button>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 600,
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10
  },
  subtext: {
    marginBottom: 20,
    color: '#555'
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10
  },
  timeButtons: {
    display: 'flex',
    gap: 10,
    marginBottom: 10
  },
  timeButton: {
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  selectedTimeButton: {
    padding: '8px 16px',
    border: '2px solid #276749',
    borderRadius: 8,
    backgroundColor: '#c6f6d5',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  availabilityText: {
    color: '#276749',
    marginBottom: 10
  },
  counterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: '1px solid #ccc'
  },
  textarea: {
    width: '100%',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    height: 100,
    marginBottom: 10
  },
  bookButton: {
    backgroundColor: '#276749',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    marginTop: 10
  }
};
