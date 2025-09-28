import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function RenewLicensePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { licenseId, userId, role } = location.state || {};

  const [licenseData, setLicenseData] = useState(null);

  useEffect(() => {
    if (!licenseId || !userId || !role) return;

    axios.post(`${API_URL}/api/license/retake-courses/${userId}/${licenseId}`)
      .then((response) => {
        setLicenseData(response.data);
        const courses = response.data.coursesToRetake || [];

        if (courses.length > 0) {
          const coursesList = courses.map(course => course.courseTitle).join(', ');
          alert(`Your rating is too low and you are considered inexperienced. You need to retake the following courses: ${coursesList}`);
        }
      })
      .catch((error) => {
        console.error('Error fetching license data:', error);
      });
  }, [licenseId, userId, role]);

  if (!licenseId || !userId || !role) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Error: Missing necessary parameters (licenseId, userId, role)</p>
      </div>
    );
  }

  if (!licenseData) {
    return (
      <div style={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  const { licenseDetails, message } = licenseData;

  const handleRenew = () => {
    axios.post(`${API_URL}/api/license/renew`, { userId, licenseId })
      .then(() => {
        alert('License renewed for 2 more years.');
        // First, replace with home to remove RenewLicensePage
        navigate('/Guide', { state: { userId, role }, replace: true });

        // Then push LicensePage cleanly
        setTimeout(() => {
          navigate('/Guide/GuideLicensePage', { state: { userId, role } });
        }, 0);





      })
      .catch((err) => {
        console.error('Error renewing license:', err);
        alert('Failed to renew license.');
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>License Details</h2>
      <p style={styles.info}>License ID: {licenseDetails.licenseId}</p>
      <p style={styles.info}>Expiry Date: {new Date(licenseDetails.expiry_date).toLocaleDateString()}</p>
      <p style={styles.warning}>{message}</p>
      <button onClick={handleRenew} style={styles.renewButton}>Renew License</button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  info: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  warning: {
    fontSize: '18px',
    color: 'red',
    marginTop: '20px',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  renewButton: {
    backgroundColor: '#2f855a',
    color: 'white',
    padding: '10px 16px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
