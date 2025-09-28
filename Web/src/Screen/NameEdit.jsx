import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function NameEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);
  const { userType, firstName: initialFirstName = '', lastName: initialLastName = '', nickname = '', userId } = location.state || {};

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('First name and last name are required');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    try {
      await axios.patch(`${API_URL}/api/users/${userId}`, {
        name: fullName,
      });

      alert('Name updated successfully');

      const destination = {
        Guide: 'GuideProfile',
        Guest: 'GuestPro',
        Admin: 'AdminPro',
      }[userType] || 'GuideProfile';

      navigate(`/${destination}`, {
        state: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name: fullName,
          userType,
          fullName,
          updateSuccess: true,
        }
      });
    } catch (err) {
      console.error(err);
      alert('Could not update name');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.editSection}>
        <label style={styles.label}>First Name*</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter first name"
          maxLength={50}
          style={styles.input}
        />

        <label style={styles.label}>Last Name*</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter last name"
          maxLength={50}
          style={styles.input}
        />
      </div>

      <div style={styles.privacySection}>
        <h4 style={styles.privacyTitle}>Who can see your name</h4>
        <p style={styles.privacyText}>
          Anyone can see this info when they communicate with you or view content you create in Park Guide services.
        </p>
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={() => navigate(-1)} style={styles.cancelButton}>Cancel</button>
        <button
          onClick={handleSave}
          disabled={!firstName || !lastName}
          style={{
            ...styles.saveButton,
            ...(!firstName || !lastName ? styles.disabledButton : {})
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
  privacySection: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e0e0e0',
  },
  privacyTitle: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  privacyText: {
    fontSize: '14px',
    color: '#5f6368',
    lineHeight: '20px',
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
    color: 'white',
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
