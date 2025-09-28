import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function PhoneEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);
  const { userId, phone: initialPhone = '', userType } = location.state || {};

  const [Phone, setPhone] = useState(initialPhone);

  const handleSave = async () => {
    if (!Phone.trim()) {
      alert('Phone number is required');
      return;
    }

    try {
      const response = await axios.patch(`${API_URL}/api/users/${userId}`, {
        phone_no: Phone.trim(),
      });

      if (response.status === 200) {
        alert('Phone number updated successfully');

        const destination = {
          Guide: 'GuideProfile',
          Guest: 'GuestPro',
          Admin: 'AdminPro',
        }[userType] || 'GuideProfile';

        navigate(`/${destination}`, {
          state: {
            phone: Phone.trim(),
            userType,
            updateSuccess: true,
          }
        });
      } else {
        throw new Error('Failed to update phone number');
      }
    } catch (err) {
      console.error(err);
      alert('Could not update phone number. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.editSection}>
        <label style={styles.label}>Phone*</label>
        <input
          type="tel"
          value={Phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter Phone number"
          maxLength={50}
          style={styles.input}
        />
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={() => navigate(-1)}
          style={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!Phone}
          style={{
            ...styles.saveButton,
            ...(!Phone ? styles.disabledButton : {})
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e6fff0',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  editSection: {
    marginBottom: '24px',
    marginTop:40,
  },
  label: {
    fontSize: '16px',
    color: '#5f6368',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    border: '1px solid #dadce0',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#fff',
    marginBottom: '16px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '16px',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#2f855a',
    fontSize: '16px',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#2f855a',
    color: '#fff',
    fontSize: '16px',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
    cursor: 'not-allowed',
  },
};
