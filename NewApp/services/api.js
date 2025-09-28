import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { API_URL } from '../config';

// Get your current IP address or use a hardcoded one
// Using IP address instead of localhost or 10.0.2.2 can work better across different devices
console.log('Using API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent long-running requests
  timeout: 10000, // 10 seconds
});

// Feedback API calls
export const getFeedbackList = async (userId) => {
  try {
    console.log(`Fetching feedback list from:', API_URL + '/api/feedback?userId=${userId}`);
    const response = await api.get(`/api/feedback?userId=${userId}`);
    console.log('Received feedback list data');
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback list:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      url: API_URL + '/api/feedback'
    });
    if (!error.response) {
      throw new Error('Network error while fetching feedback list. Server may be unreachable at ' + API_URL);
    }
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    console.log('Submitting feedback data:', feedbackData);
    console.log('Request being sent to:', API_URL + '/api/feedback');
    const response = await api.post('/api/feedback', feedbackData);
    console.log('Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      url: API_URL + '/api/feedback',
      hasResponse: !!error.response,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The server is taking too long to respond.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection and try again. Server may be unreachable at ' + API_URL);
    } else if (error.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw error;
    }
  }
};

export const getFeedbackStats = async (guideId) => {
  try {
    const url = guideId
      ? `/api/feedback/stats?guideId=${guideId}`
      : '/api/feedback/stats';
    const { data } = await api.get(url);
    return data;
  } catch (e) {
    console.error('Error fetching feedback stats:', e);
    throw e;
  }
};

export default {
  getFeedbackList,
  submitFeedback,
  getFeedbackStats,
};
