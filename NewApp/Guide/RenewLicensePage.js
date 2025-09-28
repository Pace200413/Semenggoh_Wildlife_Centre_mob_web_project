import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

const RenewLicensePage = ({ navigation, route }) => {
  // Check if route.params exists and has the required fields
  const { licenseId, userId, role } = route?.params || {};

  // If parameters are missing, show an error message
  if (!licenseId || !userId || !role) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: Missing necessary parameters (licenseId, userId, role)</Text>
      </View>
    );
  }

  const [licenseData, setLicenseData] = useState(null);

  useEffect(() => {
    axios.post(`${API_URL}/api/license/retake-courses/${userId}/${licenseId}`)
      .then((response) => {
        setLicenseData(response.data);

        // If courses need to be retaken, show an alert
        if (response.data.coursesToRetake && response.data.coursesToRetake.length > 0) {
          const coursesList = response.data.coursesToRetake.map(course => course.courseTitle).join(', ');
          Alert.alert(
            'Courses Retake Required',
            `Your rating is too low and you are considered inexperienced. You need to retake the following courses: ${coursesList}`,
            [{ text: 'OK' }]
          );
        }
      })
      .catch((error) => {
        console.error('Error fetching license data:', error);
      });
  }, [userId, licenseId]);

  if (!licenseData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { licenseDetails, message } = licenseData;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>License Details</Text>
      <Text style={styles.info}>License ID: {licenseDetails.licenseId}</Text>
      <Text style={styles.info}>Expiry Date: {new Date(licenseDetails.expiry_date).toLocaleDateString()}</Text>

      <Text style={styles.warning}>{message}</Text>

      <Button
        title="Renew License"
        onPress={() => {
          axios.post(`${API_URL}/api/license/renew`, {
            userId,
            licenseId,
          })
          .then((res) => {
            Alert.alert('Success', 'License renewed for 2 more years.', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('GuideLic', {userId: userId, role: role}); // Adjust route name if different
                },
              },
            ]);
          })
          .catch((err) => {
            console.error('Error renewing license:', err);
            Alert.alert('Error', 'Failed to renew license.');
          });
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    marginVertical: 8,
  },
  warning: {
    fontSize: 18,
    color: 'red',
    marginTop: 16,
  },
  courseItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 6,
  },
  courseTitle: {
    fontWeight: 'bold',
  },
});

export default RenewLicensePage;
