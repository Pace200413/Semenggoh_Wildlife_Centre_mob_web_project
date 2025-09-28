import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function AdminProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId = 3 } = location.state || {};

  const [profilePicUri, setProfilePicUri] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

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

  const fullName = `${userData.name || ''}`;
  const birthday = userData.birth_date || 'N/A';
  const gender = userData.gender || 'N/A';
  const email = userData.email || 'N/A';
  const phone = userData.phone_no || 'N/A';

  const renderInfoRow = (label, value, path = null, fieldKey = null) => (
    <div
      style={{ ...styles.infoRow, cursor: path ? 'pointer' : 'default' }}
      onClick={() => {
        if (path) navigate(path, { state: { fieldKey, value, userId } });
      }}
    >
      <div>
        <p style={styles.label}>{label}</p>
        <p style={styles.infoText}>{value}</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.leftSection}>
          <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>Semenggoh Wildlife Centre</h2>
        </div>
      </div>

      <div style={styles.scrollArea}>
        <div style={styles.profileSection}>
          <div style={styles.imageWrapper}>
            {profilePicUri && <img src={profilePicUri} alt="Profile" style={styles.logo1} />}
          </div>
          <p style={styles.profileName}>{fullName}</p>
          <p style={styles.profileEmail}>{email}</p>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>Your profile info in Admin System</p>
          <p style={styles.cardText}>Personal info and options to manage it. You can make some of this info visible to others.</p>
          <hr style={styles.divider} />

          {renderInfoRow('NAME', fullName, '/Screen/NameEdit', 'name')}
          {renderInfoRow('BIRTHDAY', new Date(birthday).toLocaleDateString(), '/Screen/BirthdayEdit', 'birth_date')}
          {renderInfoRow('GENDER', gender)}

          <hr style={styles.divider} />
          <p style={styles.sectionTitle}>Contact Info</p>
          {renderInfoRow('EMAIL', email, '/Screen/EmailEdit', 'email')}
          {renderInfoRow('PHONE', phone, '/Screen/PhoneEdit', 'phone_no')}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e6fff0',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#2f855a',
    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    width: 60,
    height: 80,
  },
  logo1: {
    width: 100,
    height: 100,
    borderRadius: '50%',
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollArea: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileSection: {
    textAlign: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileEmail: {
    color: 'gray',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: 600,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    color: '#2f855a',
    marginTop: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#A9A9A9',
    margin: '20px 0',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: 'gray',
  },
  infoText: {
    fontSize: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
};
