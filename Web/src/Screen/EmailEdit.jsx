import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function EmailEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, Email: initialEmail = '', EmergeEmail: initialEmergeEmail = '', userId } = location.state || {};

  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);
  const [Email, setEmail] = useState(initialEmail);
  const [EmergeEmail, setEmergeEmail] = useState(initialEmergeEmail);

  const handleSave = async () => {
    if (!Email.trim()) {
      alert('Email is required');
      return;
    }

    try {
      await axios.patch(`${API_URL}/api/users/${userId}`, {
        email: Email.trim(),
      });

      alert('Email updated successfully');

      const destination = {
        Guide: 'GuideProfile',
        Guest: 'GuestPro',
        Admin: 'AdminPro',
      }[userType] || 'GuideProfile';

      navigate(`/${destination}`, {
        state: {
          Email: Email.trim(),
          EmergeEmail: EmergeEmail.trim(),
          userType,
          updateSuccess: true
        }
      });

    } catch (err) {
      console.error(err);
      alert('Could not update email');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.editSection}>
        <label style={styles.label}>Email*</label>
        <input
          type="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
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
          disabled={!Email}
          style={{
            ...styles.saveButton,
            ...(!Email ? styles.disabledButton : {})
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
    padding: '20px',
    minHeight: '100vh',
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
