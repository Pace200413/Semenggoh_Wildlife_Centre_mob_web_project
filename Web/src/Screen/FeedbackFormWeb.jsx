// Converted FeedbackFormScreen (React Native) to ReactJS Web
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const StarRating = ({ rating, setRating }) => {
  return (
    <div style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => setRating(star)}
          style={{
            ...styles.star,
            color: star <= rating ? '#ffb400' : '#ccc',
            cursor: 'pointer'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function FeedbackFormWeb() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, activity, role, rating: initialRating = 3 } = location.state || {};

  const [name, setName] = useState('');
  const [bookingId, setBookingId] = useState(activity?.booking_id || '');
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !comment) {
      setError('Rating and comment are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const feedback = {
        user_id: userId,
        booking_id: bookingId,
        name,
        rating,
        comment
      };

      await fetch(`${API_URL}/api/bookings/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, activity })
      });

      setSuccess(true);
      setName('');
      setRating(initialRating);
      setComment('');

      setTimeout(() => {
        setSuccess(false);
        navigate('/ActivitiesWeb', { state: { userId, role } });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Share Your Feedback</h2>

      {success && <p style={styles.success}>✅ Thank you for your feedback! Redirecting...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.inputGroup}>
        <label style={styles.label}>Your Name</label>
        <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Rating</label>
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Your Comment</label>
        <textarea
          style={styles.textArea}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Tell us about your experience..."
          rows={5}
        />
      </div>

      <button
        style={{ ...styles.button, ...(loading ? styles.disabledButton : {}) }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '30px 20px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '6px',
    fontSize: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px'
  },
  textArea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px'
  },
  starContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  star: {
    fontSize: '30px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#5271ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  disabledButton: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px'
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px'
  }
};
