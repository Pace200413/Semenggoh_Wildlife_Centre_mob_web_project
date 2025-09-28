// Activities Web version (Converted from React Native)
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { IoHomeOutline, IoMapOutline, IoPersonOutline } from 'react-icons/io5';
import { FaLeaf } from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';

export default function ActivitiesWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, role } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [userId]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/guides/booking-history/${userId}`);
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError('Error fetching your booking history.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return {
      pending: '#FFA726',
      confirmed: '#90EE90',
      completed: '#66BB6A',
      cancelled: '#9E9E9E',
      commented: '#002D04',
    }[status] || '#CCC';
  };

  const renderActivity = (item) => {
    const profilePic = item.guide_image
      ? `${API_URL}${item.guide_image}`
      : item.gender === 'male'
      ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
      : 'https://cdn-icons-png.flaticon.com/512/147/147142.png';

    return (
      <div
        key={item.booking_id}
        style={{ ...styles.card, cursor: 'pointer' }}
        onClick={() => navigate('/Guest/ActivityDetailsWeb', { state: { activity: item, userId, role } })}
      >
        <img src={profilePic} alt="Guide" style={styles.image} />
        <div style={styles.info}>
          <h4 style={styles.name}>{item.guide_name}</h4>
          <p style={styles.time}>{item.booking_date}</p>
          <p style={styles.time}>{item.booking_time}</p>
        </div>
        <div style={{ ...styles.statusContainer, backgroundColor: getStatusColor(item.status) }}>
          <span style={styles.status}>{item.status}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Activities</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={styles.errorText}>{error}</p>}
      {!loading && !error && activities.length === 0 && <p style={styles.errorText}>You have no booking history.</p>}
      {!loading && !error && activities.map(renderActivity)}

      {dropdownOpen && (
        <div style={styles.dropdownMenu}>
          {[
            ['Species', 'Species'],
            ['Totally-Protected', 'TotallyProtected'],
            ['Protected Wildlife', 'ProtectedWildlife'],
            ['Protected Plants', 'ProtectedPlants'],
            ['Identify Plant', 'PlantIdentification'],
          ].map(([label, path]) => (
            <button key={path} style={styles.dropdownItem} onClick={() => { setDropdownOpen(false); navigate(`/${path}`); }}>{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#F0F2F5',
    minHeight: '100vh',
    paddingBottom: 80,
  },
  header: {
    fontSize: 24,
    fontWeight: 600,
    color: '#1C1C1E',
    marginBottom: 15
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    marginRight: 12
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 4
  },
  time: {
    fontSize: 13,
    color: '#6D6D72'
  },
  statusContainer: {
    padding: '4px 10px',
    borderRadius: 12,
    color: '#fff'
  },
  status: {
    fontSize: 12,
    fontWeight: 600
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    zIndex: 999
  },
  dropdownMenu: {
    position: 'fixed',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000
  },
  dropdownItem: {
    fontSize: 16,
    padding: '8px 0',
    background: 'none',
    border: 'none',
    color: '#276749',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer'
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer'
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  }
};
