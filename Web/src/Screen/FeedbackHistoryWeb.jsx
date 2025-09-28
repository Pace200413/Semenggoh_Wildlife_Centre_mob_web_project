// Web version of FeedbackHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFeedbackList } from '../services/api';

export default function FeedbackHistoryWeb() {
  const location = useLocation();
  const { userId } = location.state || {};

  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeedbackList(userId);
        setFeedbackList(data);
        applyFilter(data, filter);
        setLoading(false);
      } catch (err) {
        setError('Failed to load feedback.');
        setLoading(false);
      }
    };
    loadFeedback();
  }, [userId, filter]);

  const applyFilter = (data, selectedFilter) => {
    if (selectedFilter === 'all') {
      setFilteredList(data);
    } else {
      const match = {
        positive: ['positive', 'very_positive', 'mixed_positive'],
        negative: ['negative', 'very_negative', 'mixed_negative'],
        neutral: ['neutral']
      };
      const filtered = data.filter(item => match[selectedFilter]?.includes(item.sentiment_category));
      setFilteredList(filtered);
    }
  };

  const getSentimentColor = (sentiment) => {
    return {
      very_positive: '#2e7d32',
      positive: '#4caf50',
      mixed_positive: '#8bc34a',
      neutral: '#ff9800',
      mixed_negative: '#ff5722',
      negative: '#f44336',
      very_negative: '#b71c1c'
    }[sentiment] || '#888';
  };

  const getSentimentEmoji = (sentiment) => {
    return {
      very_positive: '😍',
      positive: '😃',
      mixed_positive: '🙂',
      neutral: '🤔',
      mixed_negative: '🙁',
      negative: '😞',
      very_negative: '😡'
    }[sentiment] || '🤔';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Feedback History</h2>

      <div style={{ marginBottom: '10px' }}>
        {['all', 'positive', 'neutral', 'negative'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              marginRight: '10px',
              padding: '6px 12px',
              backgroundColor: filter === type ? '#5271ff' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading feedback...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : filteredList.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        filteredList.map(item => (
          <div key={item.id} style={{ backgroundColor: '#fff', padding: '16px', marginBottom: '12px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{item.name}</strong>
              <span style={{ backgroundColor: getSentimentColor(item.sentiment_category), color: '#fff', padding: '4px 8px', borderRadius: '12px' }}>
                {getSentimentEmoji(item.sentiment_category)} {item.sentiment_category.replace('_', ' ')}
              </span>
            </div>
            <p style={{ marginTop: '10px' }}><strong>Review:</strong> {item.comment}</p>
            {item.recommendation && (
              <p style={{ fontStyle: 'italic', marginTop: '6px' }}><strong>Recommendation:</strong> {item.recommendation}</p>
            )}
            <p style={{ textAlign: 'right', fontSize: '12px', color: '#888' }}>{item.date}</p>
          </div>
        ))
      )}
    </div>
  );
}
