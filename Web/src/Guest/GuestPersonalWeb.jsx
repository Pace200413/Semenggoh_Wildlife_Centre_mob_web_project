// Converted GuestPersonal.js to ReactJS Web
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function GuestPersonalWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const [profilePicUri, setProfilePicUri] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
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

    fetchUserProfile();
  }, [userId]);

  const fullName = userData.name || '';
  const email = userData.email || 'N/A';

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.leftSection}>
          <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
          <div>
            <h2 style={styles.title}>Semenggoh</h2>
            <h2 style={styles.title}>Wildlife Centre</h2>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.profileSection}>
          <img src={profilePicUri} alt="Profile" style={styles.profilePic} />
          <h3 style={styles.profileName}>{fullName}</h3>
          <p style={styles.profileEmail}>{email}</p>
        </div>

        <div style={styles.grid}>
          <div style={styles.button} onClick={() => navigate('/Guest/GuestProfileWeb', { state: { userId } })}>
            <span style={styles.icon}>👤</span>
            <span>Profile</span>
          </div>
          <div style={styles.button} onClick={() => navigate('/Screen/SPScreen', { state: { userId } })}>
            <span style={styles.icon}>🔒</span>
            <span>Security & Privacy</span>
          </div>
          <div style={styles.button} onClick={() => navigate('/Screen/Help', { state: { userId } })}>
            <span style={styles.icon}>❓</span>
            <span>Help</span>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e6fff0',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2f855a',
    color: 'white',
    padding: '10px 20px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    width: 60,
    height: 80,
    marginRight: 15
  },
  title: {
    margin: 0,
    fontSize: 20
  },
  main: {
    padding: 20,
    textAlign: 'center'
  },
  profileSection: {
    marginBottom: 30
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  profileName: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold'
  },
  profileEmail: {
    color: 'gray'
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20
  },
  button: {
    backgroundColor: 'white',
    width: 150,
    height: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  },
  icon: {
    fontSize: 28,
    marginBottom: 8
  }
};
