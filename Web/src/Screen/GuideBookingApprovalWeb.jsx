// Enhanced GuideBookingApprovalScreen for Web with Better Design
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';

export default function GuideBookingApprovalWeb() {
  const location = useLocation();
  const { userId, role } = location.state || {};
  const [bookings, setBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedBookings, setSelectedBookings] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, selectedDate, selectedTime]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      if (selectedDate) params.append('date', selectedDate);
      if (selectedTime) params.append('time', selectedTime);

      const res = await axios.get(`${API_URL}/api/bookings/get-booking/${userId}?${params.toString()}`);
      setBookings(res.data);

      const initSelected = {};
      res.data.forEach(b => {
        if (b.status === 'pending') {
          initSelected[b.booking_id] = true;
        }
      });
      setSelectedBookings(initSelected);
    } catch (error) {
      console.error(error);
      alert('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (key) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
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
        userId,
        bookingIds,
      });
      alert('Selected bookings approved.');
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert('Failed to approve bookings');
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

  const grouped = groupBookings();
  const hasBookings = Object.keys(grouped).length > 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📅 Booking Requests</h2>

      <div style={styles.filterBar}>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={styles.input} />

        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} style={styles.input}>
          <option value="">-- Time Slot --</option>
          <option value="10:00:00">10:00</option>
          <option value="14:00:00">14:00</option>
        </select>

        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={styles.input}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <button style={styles.filterButton} onClick={fetchBookings}>Apply Filters</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        hasBookings ? (
          Object.entries(grouped).map(([key, group]) => {
            const [date, time] = key.split(' ');
            const isExpanded = expandedGroups[key];
            const selectedIds = group.filter(b => b.status === 'pending' && selectedBookings[b.booking_id]).map(b => b.booking_id);

            return (
              <div key={key} style={styles.card}>
                <div onClick={() => toggleGroup(key)} style={styles.cardHeader}>
                  <strong>{new Date(date).toLocaleDateString()} @ {time} - {group.length} Booking(s)</strong>
                </div>

                {isExpanded && (
                  <div style={styles.cardBody}>
                    {group.map(b => (
                      <div key={b.booking_id} style={styles.bookingItem}>
                        <p><strong>Emergency Contact:</strong> {b.emergency_contact_name} 📞 {b.emergency_contact_no}</p>
                        <p><strong>Participants:</strong> {b.adult_count} Adult(s), {b.child_count || 0} Child(ren)</p>
                        <p><strong>Remark:</strong> {b.remark || '-'}</p>
                        <p><strong>Status:</strong> {b.status}</p>

                        {b.status === 'pending' && (
                          <label style={styles.checkboxLabel}>
                            <input type="checkbox" checked={selectedBookings[b.booking_id] || false} onChange={() => toggleBookingSelection(b.booking_id)} /> Approve
                          </label>
                        )}
                      </div>
                    ))}

                    {selectedIds.length > 0 && (
                      <button style={styles.approveButton} onClick={() => approveGroup(selectedIds)}>
                        ✅ Approve Selected
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No bookings available.</p>
        )
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f0fff4',
    minHeight: '100vh'
  },
  header: {
    fontSize: '24px',
    color: '#22543d',
    marginBottom: '20px'
  },
  filterBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '14px'
  },
  filterButton: {
    backgroundColor: '#2f855a',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  card: {
    border: '1px solid #cbd5e0',
    borderRadius: '10px',
    marginBottom: '15px',
    backgroundColor: '#ffffff'
  },
  cardHeader: {
    padding: '15px',
    cursor: 'pointer',
    backgroundColor: '#e6fffa',
    borderBottom: '1px solid #cbd5e0'
  },
  cardBody: {
    padding: '15px'
  },
  bookingItem: {
    backgroundColor: '#f7fafc',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px'
  },
  approveButton: {
    marginTop: '10px',
    padding: '10px 16px',
    backgroundColor: '#38a169',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
