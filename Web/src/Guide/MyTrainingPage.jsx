// Converted MyTraining.js to ReactJS Web
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';

export default function MyTrainingWeb() {
  const location = useLocation();
  const { userId } = location.state || {};

  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`${API_URL}/api/training_course/certificates?userId=${userId}`);
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };
    fetchCertificates();
  }, [userId]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🎓 My Certificates</h2>
      <div style={styles.certificatesList}>
        {certificates.map((certificate) => (
          <div key={certificate.certificateId} style={styles.certificateCard}>
            <h3 style={styles.certificateTitle}>{certificate.certificateName}</h3>
            <img
              src="/images/Cert1.png"
              alt="Certificate"
              style={styles.certificateImage}
            />
            <p style={styles.courseTitle}>Course: {certificate.courseTitle}</p>
          </div>
        ))}
        {certificates.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No certificates available yet.</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f3f7f0',
    padding: 20,
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif'
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 30,
  },
  certificatesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  certificateCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
    marginBottom: 10,
  },
  certificateImage: {
    width: '100%',
    height: 180,
    objectFit: 'contain',
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 16,
    color: '#555',
  }
};
