import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from '../config';

const MyCertificatesPage = ({ navigation, route }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('GuideHome', {
          userId: route?.params?.userId,
          role: route?.params?.role,
        });
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/training_course/certificates?userId=${route?.params?.userId}`
        );
        const data = await response.json();

        const mappedCertificates = data.map((cert, index) => ({
          id: cert.certificateId || index,
          courseTitle: cert.courseTitle,
          dateEarned: cert.earnedAt,
          certificateImage: require('../assets/images/Cert1.png'), // Placeholder image
        }));

        setCertificates(mappedCertificates);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [route?.params?.userId]);

  const renderCertificate = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.courseTitle}>{item.courseTitle}</Text>
      <Text style={styles.dateEarned}>🎓 Earned on {item.dateEarned}</Text>
      <Image source={item.certificateImage} style={styles.image} resizeMode="contain" />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📄 My Certificates</Text>
      {certificates.length > 0 ? (
        <FlatList
          data={certificates}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCertificate}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <Text style={styles.noCertificates}>No certificates earned yet.</Text>
      )}
    </View>
  );
};

export default MyCertificatesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f7f0',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1B5E20',
  },
  dateEarned: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  noCertificates: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
});
