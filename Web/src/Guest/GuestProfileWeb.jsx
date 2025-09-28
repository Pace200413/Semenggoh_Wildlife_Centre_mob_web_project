// Converted GuestProfile.js to ReactJS Web
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function GuestProfileWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const [profilePicUri, setProfilePicUri] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${userId}`);
      const user = response.data;
      setUserData(user);

      if (user.profile_image_url) {
        setProfilePicUri(`${API_URL}${user.profile_image_url}`);
      } else {
        const defaultImg = user.gender === 'male'
          ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
          : 'https://cdn-icons-png.flaticon.com/512/147/147142.png';
        setProfilePicUri(defaultImg);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  const renderInfoRow = (label, value, onClick) => (
    <div
      style={styles.infoRow}
      onClick={onClick}
      className={onClick ? 'clickable' : ''}
    >
      <div>
        <div style={styles.label}>{label}</div>
        <div style={styles.infoText}>{value}</div>
      </div>
      {onClick && <span style={styles.arrow}>➔</span>}
    </div>
  );

  const fullName = userData.name || '';
  const birthday = userData.birth_date || 'N/A';
  const gender = userData.gender || 'N/A';
  const email = userData.email || 'N/A';
  const phone = userData.phone_no || 'N/A';

  return (
    <div style={styles.container}>
      <header style={styles.header}>
              <div style={styles.leftSection}>
                <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
                <div>
                  <div style={styles.title}>Semenggoh</div>
                  <div style={styles.title}>Wildlife</div>
                  <div style={styles.title}>Centre</div>
                </div>
              </div>
            </header>

      <main style={styles.content}>
        <div style={styles.profileSection}>
          <img src={profilePicUri} alt="Profile" style={styles.profilePic} />
          <h2>{fullName}</h2>
          <p style={{ color: 'gray' }}>{email}</p>
        </div>

        <div style={styles.card}>
          <h3>Your profile info in Park Guide System</h3>
          <p>Personal info and options to manage it. You can make some of this info visible to others.</p>

          {renderInfoRow('NAME', fullName, () => navigate('../Screen/NameEdit', { state: { userId, fullName, userType: 'Guest' } }))}
          {renderInfoRow('BIRTHDAY', birthday, () => navigate('../Screen/BirthdayEdit', { state: { userId, birthday, userType: 'Guest' } }))}
          {renderInfoRow('GENDER', gender)}

          <hr style={styles.divider} />

          <h4 style={{ marginBottom: 10 }}>Contact Info</h4>
          {renderInfoRow('EMAIL', email, () => navigate('../Screen/EmailEdit', { state: { userId, email, userType: 'Guest' } }))}
          {renderInfoRow('PHONE', phone, () => navigate('../Screen/PhoneEdit', { state: { userId, phone, userType: 'Guest' } }))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e6fff0',
    fontFamily: 'Segoe UI, sans-serif',
    minHeight: '100vh'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2f855a', padding: '10px 20px',
  },
  leftSection: { display: 'flex', alignItems: 'center' },
  rightSection: { display: 'flex', alignItems: 'center' },
  logo: { width: 60, height: 80, marginRight: 10 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: {
    padding: 20
  },
  profileSection: {
    textAlign: 'center',
    marginBottom: 30
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer'
  },
  label: {
    fontSize: 12,
    color: 'gray'
  },
  infoText: {
    fontSize: 16
  },
  arrow: {
    fontSize: 18,
    color: '#2f855a'
  },
  divider: {
    margin: '20px 0'
  }
};
