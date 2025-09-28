import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { API_URL } from '../config';

const MyTrainingPage = ({ route }) => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`${API_URL}/api/training_course/certificates?userId=${route?.params?.userId}`);
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, [route?.params?.userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Certificates</Text>
      <ScrollView style={styles.certificatesList}>
        {certificates.map((certificate) => (
          <View key={certificate.certificateId} style={styles.certificateCard}>
            <Text style={styles.certificateTitle}>{certificate.certificateName}</Text>
            <Image
              source={require('../assets/images/Cert1.png')}
              style={styles.certificateImage}
            />
            <Text style={styles.courseTitle}>Course: {certificate.courseTitle}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f7f0',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 30,
  },
  certificatesList: {
    marginBottom: 20,
  },
  certificateCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  certificateImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  courseTitle: {
    fontSize: 16,
    color: '#555',
  },
});

export default MyTrainingPage;
