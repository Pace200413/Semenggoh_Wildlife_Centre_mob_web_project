// Converted ActivityDetails React Native (with feedback & cancel modal) to ReactJS Web
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { IoHomeOutline, IoMapOutline, IoPersonOutline } from 'react-icons/io5';
import { FaLeaf } from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';

export default function ActivityDetailsWeb() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activity, role, userId } = location.state || {};

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const profilePicUri = activity?.guide_image
    ? `${API_URL}${activity.guide_image}`
    : activity?.gender === 'male'
    ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
    : 'https://cdn-icons-png.flaticon.com/512/147/147142.png';

  const handleCancelBooking = () => {
    const currentDate = new Date();
    const activityDate = new Date(activity.date);
    const timeDifference = (activityDate - currentDate) / (1000 * 60 * 60 * 24);
    if (timeDifference <= 2) {
      window.confirm("You will only receive 50% refund if cancelling within 2 days.") && setCancelVisible(true);
    } else {
      setCancelVisible(true);
    }
  };

  const confirmCancel = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${activity.booking_id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Booking successfully cancelled.");
        setCancelVisible(false);
      } else {
        alert(data.message || 'Cancel failed.');
      }
    } catch {
      alert('Error during cancellation.');
    }
  };

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.header}>Activity Details</h2>

        <div style={styles.card}>
          <h3 style={styles.label}>Guide Information</h3>
          <div style={styles.row}>
            <img src={profilePicUri} alt="Guide" style={styles.image} />
            <div>
              <p style={styles.name}>{activity?.guide_name}</p>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.label}>Trip Info</h3>
          <p style={styles.text}>Date: {activity?.booking_date}</p>
          <p style={styles.text}>Time: {activity?.booking_time}</p>
          <p style={styles.text}>Adults: {activity?.adult_count}</p>
          <p style={styles.text}>Children: {activity?.child_count}</p>
          <p style={styles.text}>Payment: {activity?.payment_method}</p>
          <p style={styles.text}>Price: ${activity?.price}</p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.label}>Emergency Contact</h3>
          <p style={styles.text}>Name: {activity?.emergency_contact_name}</p>
          <p style={styles.text}>Phone: {activity?.emergency_contact_no}</p>
        </div>

        {activity?.status === 'completed' && (
          <div style={styles.card}>
            <h3 style={styles.label}>Rate This Trip</h3>
            <button onClick={() => navigate('/Screen/FeedbackFormWeb')} style={styles.submitButton}>Leave Feedback</button>
          </div>
        )}

        {activity?.status === 'confirmed' && (
          <button style={{ ...styles.submitButton, backgroundColor: '#e53935' }} onClick={handleCancelBooking}>
            Cancel Booking
          </button>
        )}

        {cancelVisible && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Cancel Booking</h3>
              <select value={cancelReason} onChange={e => setCancelReason(e.target.value)} style={styles.input}>
                <option value="">Select a reason...</option>
                <option value="Change of plans">Change of plans</option>
                <option value="Weather issues">Weather issues</option>
                <option value="Health problems">Health problems</option>
              </select>
              <button disabled={!cancelReason} style={styles.submitButton} onClick={confirmCancel}>Confirm Cancel</button>
              <button style={{ ...styles.submitButton, backgroundColor: '#ccc' }} onClick={() => setCancelVisible(false)}>Close</button>
            </div>
          </div>
        )}

        {feedbackVisible && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>🌟 Trip Feedback</h3>
              <textarea placeholder="Write your feedback here..." rows={4} style={styles.input}></textarea>
              <button style={styles.submitButton} onClick={() => setFeedbackVisible(false)}>Submit</button>
            </div>
          </div>
        )}
      </div>

      {dropdownOpen && (
        <div style={styles.dropdownMenu}>
          {[
            ['Species', 'Species'],
            ['Totally-Protected', 'TotallyProtected'],
            ['Protected Wildlife', 'ProtectedWildlife'],
            ['Protected Plants', 'ProtectedPlants'],
            ['Identify Plant', 'PlantIdentification']
          ].map(([label, path]) => (
            <p key={path} style={styles.dropdownItem} onClick={() => navigate(`/${path}`)}>{label}</p>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    paddingBottom: '70px',
    background: 'linear-gradient(45deg, #f9f9f9, #e0f7fa)',
  },
  container: {
    padding: '20px',
  },
  header: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#fff',
    border: '2px solid gray',
    padding: '20px',
    borderRadius: '20px',
    marginBottom: '25px',
  },
  label: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    marginRight: '20px',
    border: '3px solid #ddd',
  },
  name: {
    fontSize: '22px',
    fontWeight: '700',
  },
  text: {
    fontSize: '16px',
    marginBottom: '6px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    marginTop: '10px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '6px'
  },
  dropdownMenu: {
    position: 'fixed',
    bottom: '70px',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: '10px 20px',
    borderTop: '1px solid #ccc',
    zIndex: 100,
  },
  dropdownItem: {
    fontSize: '16px',
    padding: '8px 0',
    color: '#276749',
    cursor: 'pointer',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: '10px 0',
    borderTop: '1px solid #eee',
    zIndex: 999,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  navText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
  }
};