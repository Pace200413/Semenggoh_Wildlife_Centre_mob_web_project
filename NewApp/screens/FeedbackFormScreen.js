import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { submitFeedback } from '../services/api';
import { API_URL } from '../config';

// Star Rating Component
const StarRating = ({ rating, setRating }) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <View style={styles.starContainer}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          style={styles.starButton}
        >
          <Text style={[
            styles.star,
            { color: star <= rating ? '#ffb400' : '#ccc' }
          ]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FeedbackFormScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [user_id, setUserId] = useState(route?.params?.userId); // Store user_id in the state
  const [booking_id, setBookingId] = useState(route.params?.activity?.booking_id); // Store park_id in the state
  const [rating, setRating] = useState(route?.params?.rating || 3);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    // Validate form fields
    if (!rating || !comment) {
      setError('Rating and comment are required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Submit feedback
      const data = await submitFeedback({
        user_id,
        booking_id,
        name,
        rating: parseInt(rating),
        comment
      });

      const response = await fetch(`${API_URL}/api/bookings/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: user_id, activity: route.params?.activity}),
      });
      
      setSuccess(true);
      // Reset form fields after success
      setName('');
      setBookingId(booking_id);
      setUserId(route?.params?.userId);
      setRating(route?.params?.rating || 3);
      setComment('');
      
      // Automatically navigate back after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        navigation.navigate('ActivitiesScreen', { activity: route?.params?.activity, userId: route?.params?.userId, role: route?.params?.role });
      }, 2000);
    } catch (err) {
      // Display the more descriptive error message from our improved API error handling
      setError(err.message || 'Failed to submit feedback. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Share Your Feedback</Text>
            
            {success && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>
                  Thank you for your feedback! Redirecting...
                </Text>
              </View>
            )}
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                maxLength={50}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rating</Text>
              <StarRating rating={rating} setRating={setRating} />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Comment</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Tell us about your experience..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity
              style={[styles.submitButton, loading ? styles.disabledButton : null]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size={20} />
              ) : (
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#f9f9f9',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 36,
  },
  submitButton: {
    backgroundColor: '#5271ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FeedbackFormScreen;
