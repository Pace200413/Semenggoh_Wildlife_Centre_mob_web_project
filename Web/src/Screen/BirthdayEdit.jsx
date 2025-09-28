import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

export default function BirthdayEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, birthday, userType } = location.state || {};
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [originalDate, setOriginalDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBirthday = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/${userId}`);
        const birthDate = res.data.birth_date;
        if (birthDate) {
          const [year, month, day] = birthDate.split('-');
          setOriginalDate(`${months[parseInt(month, 10) - 1]} ${parseInt(day)}, ${year}`);
        }
      } catch (err) {
        console.error(err);
        alert('Could not load birthday');
      } finally {
        setLoading(false);
      }
    };
    fetchBirthday();
  }, [userId]);

  const handleSave = async () => {
    if (!selectedMonth || !selectedDay || !selectedYear) {
      alert('Please select a complete date');
      return;
    }

    const monthIndex = months.indexOf(selectedMonth) + 1;
    const formattedMonth = monthIndex.toString().padStart(2, '0');
    const formattedDay = selectedDay.padStart(2, '0');
    const formattedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;

    try {
      await axios.patch(`${API_URL}/api/users/${userId}`, {
        birth_date: formattedDate
      });

      navigate(`/${userType === 'Guide' ? 'GuideProfile' : userType === 'Guest' ? 'GuestPro' : 'AdminPro'}`, {
        state: {
          updateSuccess: true,
          birthday: formattedDate,
          userId,
          userType
        }
      });
    } catch (err) {
      console.error(err);
      alert('Could not update birthday');
    }
  };

  if (loading) {
    return <div style={styles.container}><p style={{ textAlign: 'center', marginTop: 30 }}>Loading...</p></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={{ ...styles.section, backgroundColor: '#bacfc2' }}>
          <label style={styles.label}>Month</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={styles.select}>
            <option value="" disabled>Select month</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div style={{ ...styles.section, backgroundColor: '#bacfc2' }}>
          <label style={styles.label}>Day</label>
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={styles.select}>
            <option value="" disabled>Select day</option>
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div style={{ ...styles.section, backgroundColor: '#bacfc2' }}>
          <label style={styles.label}>Year</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={styles.select}>
            <option value="" disabled>Select year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <p style={styles.original}>Original: {originalDate || 'N/A'}</p>

        <div style={styles.buttons}>
          <button onClick={() => navigate(-1)} style={styles.cancelButton}>Cancel</button>
          <button
            onClick={handleSave}
            style={{
              ...styles.saveButton,
              ...(selectedMonth && selectedDay && selectedYear ? {} : styles.disabledButton)
            }}
            disabled={!selectedMonth || !selectedDay || !selectedYear}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e6fff0',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  content: {
    maxWidth: '500px',
    margin: '0 auto'
  },
  section: {
    marginBottom: '20px',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginTop:40,
  },
  label: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
    display: 'block'
  },
  select: {
    width: '100%',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    padding: '8px',
    fontSize: '16px'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
  cancelButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#2f855a',
    fontSize: '16px',
    padding: '10px 20px',
    cursor: 'pointer'
  },
  saveButton: {
    backgroundColor: '#2f855a',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
    cursor: 'not-allowed'
  },
  original: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '10px',
    color: '#666'
  }
};
