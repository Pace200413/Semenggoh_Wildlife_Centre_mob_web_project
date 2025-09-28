// Converted FeedbackHomeScreen.js (React Native) to ReactJS Web
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function FeedbackHomeWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, role } = location.state || {};
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Feedback System</h1>
        <p style={styles.subtitle}>Check out what others are saying about your performance</p>
      </div>

      <div style={styles.cardContainer}>
        <div
          style={styles.card}
          onClick={() => navigate('../Screen/FeedbackHistoryWeb', { state: { userId, role } })}
        >
          <div style={{ ...styles.iconContainer, backgroundColor: '#4caf50' }}>🔍</div>
          <h2 style={styles.cardTitle}>View History</h2>
          <p style={styles.cardDescription}>See all past feedback and reviews</p>
        </div>

        <div
          style={styles.card}
          onClick={() => navigate('../Screen/FeedbackStatsWeb', { state: { userId, role } })}
        >
          <div style={{ ...styles.iconContainer, backgroundColor: '#ff9800' }}>📊</div>
          <h2 style={styles.cardTitle}>Statistics</h2>
          <p style={styles.cardDescription}>View analytics and sentiment breakdown</p>
        </div>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>Powered by Sentiment Analysis</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: 280,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 26,
    margin: '0 auto 15px',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
};
