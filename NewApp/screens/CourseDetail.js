import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Install if not already
import { API_URL } from '../config';

const CourseDetail = ({ navigation, route }) => {
  const { course } = route.params;
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [resultMessage, setResultMessage] = useState('');
  const [eligibleLicenses, setEligibleLicenses] = useState([]);  // To store eligible licenses
  const [showPrompt, setShowPrompt] = useState(false);           // Flag to show the prompt
  const [nationalParks, setNationalParks] = useState([]);       // To store national parks list
  const [selectedPark, setSelectedPark] = useState(null);       // To store selected park ID

  // Handle answer selection
  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  // Save course history to the backend
  const saveCourseHistory = async (userId, courseId, courseTitle, result, certificate) => {
    try {
      const response = await fetch(`${API_URL}/api/training_course/course-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          courseId,
          courseTitle,
          result,
          certificate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Course history saved:', data);
      } else {
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // Check for eligible licenses after course completion
  const checkEligibleLicenses = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/license/promptable/${userId}`);
      const data = await response.json();
      console.log(data);

      if (data.length > 0) {
        setEligibleLicenses(data);
        setShowPrompt(true);  // Show prompt if there are eligible licenses
      } else {
        setShowPrompt(false); // Hide prompt if no eligible licenses
      }
    } catch (error) {
      console.error('Error fetching eligible licenses:', error);
    }
  };

  // Fetch national parks list
  const fetchNationalParks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/license/national_park`);
      const data = await response.json();
      setNationalParks(data);
    } catch (error) {
      console.error('Error fetching national parks:', error);
    }
  };

  // Handle submit answers and check license eligibility
  const handleSubmitAnswers = async () => {
    const total = course.assessments.length;
    let correct = 0;

    // Check answers
    course.assessments.forEach((a, i) => {
      if (selectedAnswers[i] === a.correctIndex) {
        correct += 1;
      }
    });

    const passed = correct >= Math.ceil(total / 2);

    if (passed) {
      setResultMessage('🎉 You passed and received a certificate!');

      // Update course status to completed via API
      fetch(`${API_URL}/api/training_course/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: route?.params?.userId, courseId: course.id, status: 'completed' })
      })
        .then(res => res.json())
        .then(data => console.log(data.message))
        .catch(err => console.error(err));

      // Save course history
      saveCourseHistory(route?.params?.userId, course.id, course.courseTitle, 'Passed', `Certificate for ${course.courseTitle}`);

      // Check if the user is eligible for any licenses
      checkEligibleLicenses(route?.params?.userId);

      // Fetch national parks list
      fetchNationalParks();

    } else {
      setResultMessage('❌ You did not pass. Please try again.');
      saveCourseHistory(route?.params?.userId, course.id, course.courseTitle, 'Failed', null);
    }
  };

  const handleRequestLicense = (licenseId) => {
    if (!selectedPark) {
      Alert.alert("Error", "Please select a national park to request the license.");
      return;
    }

    Alert.alert(
      "License Request - $20 Fee",
      "Requesting this license requires a $20 payment. Do you want to proceed?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => navigation.navigate('TakeCourse', {userId: route?.params?.userId, role: route?.params?.role} )
        },
        {
          text: "Pay",
          onPress: () => requestLicense(licenseId)  // Proceed to backend request
        }
      ]
    );
  };

  // Request the selected license for the guide
  const requestLicense = async (licenseId) => {
    const response = await fetch(`${API_URL}/api/license/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guide_id: route?.params?.userId,   // Use the user's ID
        licenseId,
        park_id: selectedPark, // Use the selected park ID
      })
    });

    const data = await response.json();
    if (response.ok) {
      Alert.alert("License Requested", data.message, [
        {
          text: "OK",
          onPress: () => {
            // ✅ Navigate after request
            navigation.navigate('CertificateView', {
              userId: route?.params?.userId,
              role: route?.params?.role
            });
          }
        }
      ]);
    } else {
      Alert.alert("Error", data.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>{course.courseTitle}</Text>
        <Text style={styles.description}>{course.courseDescription}</Text>

        <View style={styles.detailGroup}>
          <Text style={styles.detailLabel}>⏱ Duration:</Text>
          <Text style={styles.detailValue}>{course.duration}</Text>
        </View>

        <View style={styles.detailGroup}>
          <Text style={styles.detailLabel}>💵 Price:</Text>
          <Text style={styles.detailValue}>${course.price}</Text>
        </View>

        <View style={styles.detailGroup}>
          <Text style={styles.detailLabel}>👨‍🏫 Instructor:</Text>
          <Text style={styles.detailValue}>{course.lecturer}</Text>
        </View>

        <View style={styles.detailGroup}>
          <Text style={styles.detailLabel}>🗓 Schedule:</Text>
          <Text style={styles.detailValue}>{course.schedule.join(', ')}</Text>
        </View>

        <View style={styles.detailGroup}>
          <Text style={styles.detailLabel}>📈 Skill Level:</Text>
          <Text style={styles.detailValue}>{course.skillLevel}</Text>
        </View>

        <View style={styles.detailGroup}>
          <Text style={styles.detailLabel}>🎯 Required For:</Text>
          <Text style={styles.detailValue}>{course.requiredFor}</Text>
        </View>

        <View style={styles.detailGroup}>
          <Text style={styles.detailLabel}>👥 Capacity:</Text>
          <Text style={styles.detailValue}>{course.capacity}</Text>
        </View>

        <Text style={styles.sectionTitle}>🚀 What You'll Learn</Text>
        {course.learningOutcome.split('\n').map((item, index) => (
          <Text key={index} style={styles.listItem}>
            • {item.trim()}
          </Text>
        ))}
      </View>


      {/* Assessments */}
      {Array.isArray(course.assessments) && course.assessments.length > 0 ? (
        <>
          <Text style={styles.modulesTitle}>Assessment</Text>
          {course.assessments.map((a, i) => (
            <View key={i} style={styles.questionBlock}>
              <Text style={styles.question}>{i + 1}. {a.question}</Text>
              {a.options.map((opt, j) => (
                <TouchableOpacity
                  key={j}
                  style={[styles.option, selectedAnswers[i] === j && styles.selectedOption]}
                  onPress={() => handleOptionSelect(i, j)}
                >
                  <Text>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <Button title="Submit Answers" onPress={handleSubmitAnswers} />
          {resultMessage !== '' && <Text style={styles.result}>{resultMessage}</Text>}
        </>
      ) : (
        <Text>No assessments available for this course.</Text>
      )}

      {showPrompt && eligibleLicenses.length > 0 && (
        <>
          <Text style={styles.eligibleTitle}>You are eligible for the following licenses:</Text>
          {eligibleLicenses.map((license, idx) => (
            <View key={idx}>
              <Button 
                title={`Request ${license.licenseName} License`} 
                onPress={() => handleRequestLicense(license.licenseId)} 
              />
            </View>
          ))}
          {nationalParks.length > 0 && (
            <View style={styles.parkPicker}>
              <Text style={styles.info}>Select a National Park:</Text>
              <Picker
                selectedValue={selectedPark}
                onValueChange={(itemValue) => setSelectedPark(itemValue)}
              >
                {nationalParks.map((park, idx) => (
                  <Picker.Item key={idx} label={park.park_name} value={park.park_id} />
                ))}
              </Picker>
            </View>
          )}
        </>
      )}

      {course.status !== "enrolled" ? (
        <Button title="Enroll" onPress={() => alert('Enrolled!')} />
      ) : (
        <Text style={styles.enrolled}>You are already enrolled</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginVertical: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  modulesTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  eligibleTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: 'green',
  },
  parkPicker: {
    marginTop: 12,
  },
  enrolled: {
    marginTop: 12,
    color: 'green',
    fontWeight: '600',
  },
  questionBlock: {
    marginVertical: 12,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  question: {
    fontWeight: '600',
    marginBottom: 6,
  },
  option: {
    padding: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  selectedOption: {
    backgroundColor: '#cce5ff',
    borderColor: '#007bff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
    marginBottom: 16,
    color: '#444',
  },

  detailGroup: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  detailLabel: {
    fontWeight: '600',
    marginRight: 6,
    color: '#333',
  },

  detailValue: {
    color: '#555',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#222',
  },

  listItem: {
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 10,
    color: '#444',
  }
});

export default CourseDetail;
