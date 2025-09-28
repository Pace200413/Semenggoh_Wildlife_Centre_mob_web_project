// src/services/api.js

import axios from 'axios';
import { API_URL } from '../config'; // Ensure this is defined correctly for web

console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// GET feedback list for a user
export const getFeedbackList = async (userId) => {
  try {
    const response = await api.get(`/api/feedback?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback list:', error);
    throw new Error('Failed to fetch feedback list. Please try again later.');
  }
};

// POST new feedback
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/api/feedback', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback. Please try again.');
  }
};

// GET feedback statistics (optional guideId)
export const getFeedbackStats = async (guideId) => {
  try {
    const url = guideId ? `/api/feedback/stats?guideId=${guideId}` : '/api/feedback/stats';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw new Error('Unable to retrieve feedback statistics.');
  }
};
