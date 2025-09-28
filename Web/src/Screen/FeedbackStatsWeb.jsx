// Feedback Stats Web (Enhanced Design)
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFeedbackStats } from '../services/api';

export default function FeedbackStatsWeb() {
  const location = useLocation();
  const { userId } = location.state || {};

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await getFeedbackStats(userId);
        setStats(data);
      } catch (err) {
        setError('Failed to load statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [userId]);

  const renderBar = (label, value, color) => (
    <div style={{ marginBottom: 16 }}>
      <strong style={{ display: 'block', marginBottom: 4 }}>{label}</strong>
      <div style={{ backgroundColor: '#e0e0e0', borderRadius: 10, overflow: 'hidden', height: 24 }}>
        <div style={{ width: `${value}%`, backgroundColor: color, height: '100%', textAlign: 'right', paddingRight: 8, color: '#fff', fontWeight: 'bold' }}>
          {value.toFixed(1)}%
        </div>
      </div>
    </div>
  );

  if (loading) return <div style={styles.loading}>Loading statistics...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!stats || stats.total === 0) return <div style={styles.noData}>No feedback data yet.</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📊 Feedback Overview</h2>
      <p style={styles.subtext}>Based on <strong>{stats.total}</strong> feedback {stats.total === 1 ? 'entry' : 'entries'}</p>
      {stats.model_info && (
        <p style={styles.modelInfo}>
          Using <strong>{stats.model_info.name}</strong> model{stats.model_info.accuracy ? ` (Accuracy: ${stats.model_info.accuracy}%)` : ''}
        </p>
      )}

      <div style={styles.statCards}>
        <div style={{ ...styles.card, borderLeft: '6px solid #2196f3' }}>
          <p>Total Feedback</p>
          <h3>{stats.total}</h3>
        </div>
        <div style={{ ...styles.card, borderLeft: '6px solid #ff9800' }}>
          <p>Average Rating</p>
          <h3>{Number(stats.average_rating || 0).toFixed(1)}</h3>
        </div>
      </div>

      <h3 style={styles.sectionTitle}>Sentiment Breakdown</h3>
      {renderBar('Positive', stats?.simplified?.positive_percentage ?? 0, '#4caf50')}
      {renderBar('Needs Improvement', stats?.simplified?.neutral_percentage ?? 0, '#ff9800')}
      {renderBar('Negative', stats?.simplified?.negative_percentage ?? 0, '#f44336')}

      <h3 style={styles.sectionTitle}>Training Recommendation</h3>
      <div style={styles.recommendationBox}>
        {(stats?.simplified?.negative_percentage ?? 0) > 20 || (stats?.simplified?.neutral_percentage ?? 0) > 90 ? (
          <>
            <p><strong style={{ color: '#c62828' }}>🔧 Retraining Recommended:</strong></p>
            <p>
              With <strong>{stats?.simplified?.negative_percentage.toFixed(1)}%</strong> negative and <strong>{stats?.simplified?.neutral_percentage.toFixed(1)}%</strong> needs improvement feedback,
              a focused retraining program is advised.
            </p>
          </>
        ) : (
          <>
            <p><strong style={{ color: '#4caf50' }}>✅ No Additional Training Required</strong></p>
            <p>
              With <strong>{stats?.simplified?.positive_percentage.toFixed(1)}%</strong> positive feedback, the guide is performing well.
            </p>
          </>
        )}
      </div>

      <h3 style={styles.sectionTitle}>Detailed Sentiment Analysis</h3>
      <div style={styles.detailedSection}>
        {Object.entries(stats.sentiment_counts ?? {}).map(([sentiment, count]) => {
          if (count === 0) return null;
          const color = sentiment === 'positive' ? '#4caf50' : sentiment === 'needs_improvement' ? '#ff9800' : '#f44336';
          const emoji = sentiment === 'positive' ? '😃' : sentiment === 'needs_improvement' ? '🤔' : '😞';
          const label = sentiment.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          const percent = stats.sentiment_percentages[sentiment] ?? 0;

          return (
            <div key={sentiment} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <strong>{emoji} {label}</strong>
                <span>{count} ({percent.toFixed(1)}%)</span>
              </div>
              <div style={{ height: 14, backgroundColor: '#eee', borderRadius: 6 }}>
                <div style={{ width: `${percent}%`, backgroundColor: color, height: '100%', borderRadius: 6 }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 40,
    maxWidth: 960,
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop:40,
    marginBottom:40,
  },
  header: {
    fontSize: 28,
    color: '#333',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  modelInfo: {
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  statCards: {
    display: 'flex',
    gap: 20,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    flex: 1,
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 20,
    color: '#444',
  },
  recommendationBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    lineHeight: 1.6,
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
  },
  detailedSection: {
    marginTop: 10,
  },
  loading: {
    padding: 40,
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
  error: {
    padding: 40,
    textAlign: 'center',
    fontSize: 18,
    color: '#c62828',
  },
  noData: {
    padding: 40,
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  }
};
