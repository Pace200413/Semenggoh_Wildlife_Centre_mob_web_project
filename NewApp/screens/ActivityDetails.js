import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Animated, Easing } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Install if not already
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../config';

export default function ActivityDetails({ navigation, route }) {
  const { activity, role, userId } = route?.params;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [tripFeedback, setTripFeedback] = useState('');
  const [guideFeedback, setGuideFeedback] = useState('');
  const [starScale] = useState(new Animated.Value(1));

  const [cancelReason, setCancelReason] = useState('');
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  useEffect(() => {
    setDropdownOpen(false);
  }, []);

  const handleCancelBooking = () => {
    // Calculate the difference between the current date and activity date
    const currentDate = new Date();
    const activityDate = new Date(activity.date);
    const timeDifference = (activityDate - currentDate) / (1000 * 60 * 60 * 24); // in days

    if (timeDifference <= 2) {
      // Show the alert first
      Alert.alert('Cancellation Policy', 'You will receive only 50% of the refund if you cancel within 2 days.', [
        { text: 'OK', onPress: () => setCancelModalVisible(true) } // Show the cancel modal after user presses OK
      ]);
    } else {
      // If it's not within 2 days, directly show the cancel modal
      setCancelModalVisible(true);
    }
  };

  const animateStar = () => {
    Animated.sequence([
      Animated.timing(starScale, { toValue: 1.5, duration: 200, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(starScale, { toValue: 1, duration: 200, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
    ]).start();
  };


  const tripOptions = ['Excellent', 'Good', 'Average', 'Poor'];
  const guideOptions = ['Friendly', 'Professional', 'Not Helpful', 'Excellent'];

  const [selectedTripOption, setSelectedTripOption] = useState('');
  const [selectedGuideOption, setSelectedGuideOption] = useState('');

  

  const handleStarPress = (value) => {
  setRating(value);
  if (value < 4) {
    setFeedbackModalVisible(true);  // Only show feedback modal for ratings less than 4
  } else {
    animateStar();
  }
};

const submitFeedback = () => {
  setFeedbackModalVisible(false);
  Alert.alert('🎉 Thank you!', 'Your feedback has been submitted.');
  setTripFeedback('');
  setGuideFeedback('');
};

const improvementOptions = ['More interactive', 'Better communication', 'Faster response time', 'More informative', 'Other'];

const profilePicUri = activity.guide_image
    ? `${API_URL}${activity.guide_image}`
    : activity.gender === 'male'
    ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
    : 'https://cdn-icons-png.flaticon.com/512/147/147142.png';

const renderStars = () => {
  return [...Array(5)].map((_, index) => {
    const starIndex = index + 1;
    return (
      <TouchableOpacity key={index} onPress={() => navigation.navigate('FeedbackForm', {userId: userId, rating: starIndex, role: role, activity: activity})}>
        <Animated.Text
          style={[styles.star, rating >= starIndex && styles.filledStar, { transform: [{ scale: starScale }] }]}
        >
          ★
        </Animated.Text>
      </TouchableOpacity>
    );
  });
};


  return (
    <View style={styles.container_nav}>
      
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Activity Details</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Guide Information</Text>
          <View style={styles.guideInfo}>
            <Image source={{uri: profilePicUri }} style={styles.image} />
            <View style={styles.guideText}>
              <Text style={styles.name}>{activity.guide_name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Trip Info</Text>
          <Text style={styles.infoText}>Date: {activity.booking_date}</Text>
          <Text style={styles.infoText}>Time: {activity.booking_time}</Text>
          <Text style={styles.infoText}>Adults: {activity.adult_count}</Text>
          <Text style={styles.infoText}>Children: {activity.child_count}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Payment Method: {activity.payment_method}</Text>
          <Text style={styles.infoText}>Price: ${activity.price}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Emergency Contact</Text>
          <Text style={styles.infoText}>Name: {activity.emergency_contact_name}</Text>
          <Text style={styles.infoText}>Phone: {activity.emergency_contact_no}</Text>
        </View>

        {activity.status === 'completed' && (
          <View style={styles.rateSection}>
            <Text style={styles.label}>Rate this Trip</Text>
            <View style={styles.starRow}>{renderStars()}</View>
          </View>
        )}

        {activity.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: '#e53935' }]}
            onPress={handleCancelBooking}
          >
            <Text style={styles.submitButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}

        <Modal visible={cancelModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cancel Booking</Text>

              <Text style={styles.modalLabel}>Reason for cancellation:</Text>
              <Picker
                selectedValue={cancelReason}
                style={{ height: 50, width: '100%' }}
                onValueChange={(itemValue) => setCancelReason(itemValue)}
              >
                <Picker.Item label="Select a reason..." value="" />
                <Picker.Item label="Change of plans" value="Change of plans" />
                <Picker.Item label="Weather issues" value="Weather issues" />
                <Picker.Item label="Health problems" value="Health problems" />
                
              </Picker>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={async () => {
                  try {
                    const response = await fetch(`${API_URL}/api/bookings/${activity.booking_id}/cancel`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        reason: cancelReason,
                      }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                      Alert.alert('Booking Cancelled', 'Your booking has been successfully cancelled.');
                      activity.status = 'cancelled'; // update local state if necessary
                      setCancelModalVisible(false);
                    } else {
                      Alert.alert('Error', data.message || 'Failed to cancel booking.');
                    }
                  } catch (error) {
                    Alert.alert('Error', 'Something went wrong while cancelling the booking.');
                  }
                }}

                disabled={!cancelReason}
              >
                <Text style={styles.submitButtonText}>Confirm Cancellation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: '#aaa', marginTop: 10 }]}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.submitButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={feedbackModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🌟 Trip Feedback</Text>

            <Text style={styles.modalLabel}>Rate the Trip:</Text>
            <View style={styles.optionsRow}>
              {tripOptions.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.optionButton, selectedTripOption === option && styles.selectedOption]}
                  onPress={() => setSelectedTripOption(option)}
                >
                  <Text
                    style={[styles.optionText, selectedTripOption === option && styles.selectedOptionText]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Rate the Guide:</Text>
            <View style={styles.optionsRow}>
              {guideOptions.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.optionButton, selectedGuideOption === option && styles.selectedOption]}
                  onPress={() => setSelectedGuideOption(option)}
                >
                  <Text
                    style={[styles.optionText, selectedGuideOption === option && styles.selectedOptionText]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {rating < 4 && (
              <>
                <Text style={styles.modalLabel}>How can we improve?</Text>
                <View style={styles.optionsRow}>
                  {improvementOptions.map((option, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.optionButton, selectedTripOption === option && styles.selectedOption]}
                      onPress={() => setSelectedTripOption(option)}
                    >
                      <Text
                        style={[styles.optionText, selectedTripOption === option && styles.selectedOptionText]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedTripOption === 'Other' && (
                  <TextInput
                    style={styles.input}
                    placeholder="Share your suggestions..."
                    multiline
                    value={tripFeedback}
                    onChangeText={setTripFeedback}
                  />
                )}
              </>
            )}

            <Text style={styles.modalLabel}>Additional Comments:</Text>
            <TextInput
              style={styles.input}
              placeholder="Share your experience..."
              multiline
              value={tripFeedback}
              onChangeText={setTripFeedback}
            />

            <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </ScrollView>
      
        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('Species'); }}>
              <Text style={styles.dropdownItem}>Introduction to Species</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('TotallyProtected'); }}>
              <Text style={styles.dropdownItem}>Totally-Protected Wildlife</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedWildlife'); }}>
              <Text style={styles.dropdownItem}>Protected Wildlife</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedPlants'); }}>
              <Text style={styles.dropdownItem}>Protected Plants</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('PlantIdentification'); }}>
              <Text style={styles.dropdownItem}>Identify Plant</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color="#2f855a" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setDropdownOpen(!dropdownOpen)}>
            <FontAwesome name="leaf" size={24} color="#888" />
            <Text style={styles.navText}>Species</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Mapp')}>
            <Ionicons name="map" size={24} color="#888" />
            <Text style={styles.navText}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Guide', { userId: userId, role: role })}>
            <MaterialIcons name="menu-book" size={24} color="#888" />
            <Text style={styles.navText}>Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuidePer', { userId: userId })}>
            <Ionicons name="person" size={24} color="#888" />
            <Text style={styles.navText}>User</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(45deg, #f9f9f9, #e0f7fa)',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 65,
  },
  container_nav: {
    flex: 1,
    backgroundColor: 'linear-gradient(45deg, #f9f9f9, #e0f7fa)',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  datetime: {
    fontSize: 16,
    color: '#888',
    marginBottom: 25,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth:2,
    borderColor: 'gray',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  guideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#ddd',
    marginRight: 20,
  },
  guideText: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#444',
  },
  ratingText: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 6,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  ageBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ageText: {
    fontSize: 18,
    color: '#333',
  },
  ageValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4caf50',
  },
  rateSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    alignItems: 'center',
    elevation: 6,
  },
  starRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  star: {
    fontSize: 40,
    color: '#ccc',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filledStar: {
    color: '#f39c12',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
    color: '#555',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: '#4caf50',
    transform: [{ scale: 1.05 }],
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 12,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  infoCard: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 20,
  marginBottom: 25,
  borderWidth:2,
  borderColor: 'gray',
},
infoText: {
  fontSize: 16,
  color: '#555',
  marginBottom: 6,
},
textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '100%',
},
bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 999, // Keep it on top
  },

  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 10,
    elevation: 5,
  },
  dropdownItem: {
    fontSize: 16,
    paddingVertical: 8,
    color: '#276749',
  },
});