// Converted GuideLicensePage to ReactJS (preserving design)
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../config';

export default function GuideLicensePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId = 0, role = 'guide' } = location.state || {};

  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
  if (location.state?.fromRenew) {
    navigate('/Guide', { state: { userId, role }});
    }
  }, [location.state, navigate, role, userId]);



  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/license/by-guide/${userId}`);
        setLicenses(res.data);
      } catch (err) {
        console.error('Failed to fetch guide licenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, [userId]);

  const handleRenew = (licenseId) => {
    if (window.confirm('This will cost $10 to renew. Do you want to proceed?')) {
      navigate('/Guide/RenewLicensePage', { state: { licenseId, userId, role } });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.headerTitle}>🎫 My Licenses</h2>
      {loading ? (
        <p style={styles.loadingText}>Loading...</p>
      ) : licenses.length === 0 ? (
        <p style={styles.noDataText}>No license requests found.</p>
      ) : (
        licenses.map((lic, index) => (
          <div key={`${lic.licenseId}-${index}`} style={styles.card}>
            <div style={styles.row}>
              <span style={styles.docIcon}>📄</span>
              <span style={styles.cardTitle}>{lic.licenseName}</span>
            </div>
            <p style={styles.cardField}>🏞️ Park: <span style={styles.value}>{lic.park_name}</span></p>
            <p style={styles.cardField}>📌 Status: <span style={{ ...styles.value, ...styles.status(lic.status) }}>{lic.status}</span></p>
            <p style={styles.cardField}>📅 Requested: <span style={styles.value}>{moment(lic.requestedAt).format('LL')}</span></p>
            <p style={styles.cardField}>✅ Approved: <span style={styles.value}>{lic.approvedAt ? moment(lic.approvedAt).format('LL') : '-'}</span></p>
            <p style={styles.cardField}>📆 Expiry: <span style={styles.value}>{lic.expiry_date ? moment(lic.expiry_date).format('LL') : '-'}</span></p>

            {lic.status === 'earned' && (
              <button style={styles.renewButton} onClick={() => handleRenew(lic.licenseId)}>
                Renew for $10
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f855a',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
  docIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f855a',
  },
  cardField: {
    fontSize: 14,
    marginTop: 8,
    color: '#333',
  },
  value: {
    fontWeight: '600',
    color: '#444',
  },
  status: (status) => ({
    color:
      status === 'approved' ? '#2e7d32' :
      status === 'pending' ? '#ff9800' :
      status === 'rejected' ? '#c62828' :
      '#444',
    textTransform: 'capitalize',
  }),
  renewButton: {
    backgroundColor: '#4CAF50',
    padding: '12px 16px',
    borderRadius: 8,
    marginTop: 12,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
  },
};
