// Converted CertificateView to ReactJS (preserving design)
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

export default function CertificateView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId = 0, role = 'guide' } = location.state || {};

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/training_course/certificates?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((cert, idx) => ({
          id: cert.certificateId || idx,
          courseTitle: cert.courseTitle,
          dateEarned: cert.earnedAt,
          certificateImage: '/images/Cert1.png', // static image for now
        }));
        setCertificates(mapped);
      })
      .catch(err => {
        console.error('Error fetching certificates:', err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div style={{ ...styles.container, textAlign: 'center' }}><p>Loading...</p></div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📄 My Certificates</h2>
      {certificates.length > 0 ? (
        <div style={styles.list}>
          {certificates.map((item) => (
            <div key={item.id} style={styles.card}>
              <p style={styles.courseTitle}>{item.courseTitle}</p>
              <p style={styles.dateEarned}>🎓 Earned on {item.dateEarned}</p>
              <img src={item.certificateImage} alt="Certificate" style={styles.image} />
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noCertificates}>No certificates earned yet.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f3f7f0',
    padding: 16,
    minHeight: '100vh',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 30,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1B5E20',
  },
  dateEarned: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    objectFit: 'contain',
    borderRadius: 8,
  },
  noCertificates: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
};
