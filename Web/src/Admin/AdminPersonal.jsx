// Converted AdminPersonal (React Native to ReactJS with preserved design)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';
import axios from 'axios';

export default function AdminPersonal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, role } = location.state || {};

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
  const email = userData.email || 'N/A';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.leftSection}>
          <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
          <div>
            <h2 style={styles.title}>Semenggoh</h2>
            <h2 style={styles.title}>Wildlife</h2>
            <h2 style={styles.title}>Centre</h2>
          </div>
        </div>
      </div>

      <div style={styles.scrollArea}>
        {/* Profile Info */}
        <div style={styles.profileSection}>
          <div style={styles.imageWrapper}>
            {profilePicUri && <img src={profilePicUri} alt="Profile" style={styles.logo1} />}
          </div>
          <p style={styles.profileName}>{fullName}</p>
          <p style={styles.profileEmail}>{email}</p>
        </div>

        {/* Grid Buttons */}
        <div style={styles.grid}>
          <button style={styles.button} onClick={() => navigate('/Admin/AdminProfile', { state: { userId, role } })}>
            <span style={styles.icon}>👤</span>
            <p style={styles.buttonText}>Profile</p>
          </button>

          <button style={styles.button} onClick={() => navigate('../Screen/SPScreen')}>
            <span style={styles.icon}>🔒</span>
            <p style={styles.buttonText}>Security & Privacy</p>
          </button>

          <button style={styles.button} onClick={() => navigate('/Admin/GuideListPage', { state: { userId, role } })}>
            <span style={styles.icon}>✅</span>
            <p style={styles.buttonText}>Guide</p>
          </button>

          <button style={styles.button} onClick={() => navigate('/Admin/GuideListPage', { state: { setSelectedTab: 'course', userId, role } })}>
            <span style={styles.icon}>📘</span>
            <p style={styles.buttonText}>Course</p>
          </button>

          <button style={styles.button} onClick={() => navigate('../Screen/Help', { state: { userId, role } })}>
            <span style={styles.icon}>❓</span>
            <p style={styles.buttonText}>Help</p>
          </button>
        </div>

        <div style={styles.divider}></div>
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
    color: '#fff',
    margin: 0,
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
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  button: {
    backgroundColor: '#fff',
    width: '30%',
    height: 110,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    padding: 10,
  },
  icon: {
    fontSize: 24,
    color: '#2f855a',
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: '#A9A9A9',
    margin: '20px 0',
  },
  imageWrapper: {
    position: 'relative',
  },
};
