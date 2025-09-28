import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

const LicenseDetailsPage = ({ navigation, route }) => {
  const { licenseData, userId, onUpdate } = route.params;
  const user = {
    firstName: "Jayden",
    lastName: "Wong",
    profilePic: require("../assets/images/propic.jpg"),
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('GuideLic');
        return true; // Prevent default back behavior
      }
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [navigation]);

  const fullName = `${user.firstName} ${user.lastName}`;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderCertifications = () => {
    if (!licenseData.certifications || licenseData.certifications.length === 0) {
      return (
        <View style={styles.certificationItem}>
          <Text style={styles.noCertificationsText}>No certifications available</Text>
        </View>
      );
    }

    return licenseData.certifications.map((cert, index) => (
      <View key={cert.id} style={styles.certificationItem}>
        <View style={styles.certificationHeader}>
          <MaterialIcons name="verified" size={20} color="#2E7D32" />
          <Text style={styles.certificationName}>{cert.name}</Text>
        </View>
        <View style={styles.certificationDetails}>
          <Text style={styles.certificationDetail}>Issued by: {cert.issuer}</Text>
          <Text style={styles.certificationDetail}>Date: {formatDate(cert.date)}</Text>
          <Text style={styles.certificationDetail}>ID: {cert.id}</Text>
        </View>
        {index < licenseData.certifications.length - 1 && <Divider style={styles.certificationDivider} />}
      </View>
    ));
  };

  const renderSpecialties = () => {
    if (!licenseData.specialty || licenseData.specialty.length === 0) {
      return <Text style={styles.noSpecialtiesText}>No specialties listed</Text>;
    }

    return (
      <View style={styles.specialtiesContainer}>
        {licenseData.specialty.map((item, index) => (
          <View key={index} style={styles.specialtyItem}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.specialtyText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Image source={require('../assets/images/logo.jpg')} style={styles.logo} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Semenggoh</Text>
            <Text style={styles.title}>Wildlife</Text>
            <Text style={styles.title}>Centre</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View style={styles.profileSection}>
          <Image source={user.profilePic} style={styles.profileImage} />
          <Text style={styles.guideName}>{fullName}</Text>
          <Text style={styles.licenseId}>{licenseData.id}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>License Information</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status</Text>
            <View style={[styles.statusBadge, 
              licenseData.status === 'Active' ? styles.activeBadge : 
              licenseData.status === 'Pending' ? styles.pendingBadge : styles.expiredBadge]}>
              <Text style={styles.statusText}>{licenseData.status}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Level</Text>
            <Text style={styles.value}>{licenseData.level || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Issue Date</Text>
            <Text style={styles.value}>{formatDate(licenseData.issueDate)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Expiration Date</Text>
            <Text style={[styles.value, 
              licenseData.isExpired && styles.expiredText]}>
              {formatDate(licenseData.expirationDate)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Years Active</Text>
            <Text style={styles.value}>{licenseData.yearsActive || '0'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Specialties</Text>
          <Divider style={styles.divider} />
          {renderSpecialties()}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Certifications</Text>
          <Divider style={styles.divider} />
          {renderCertifications()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6fff0',
  },
  header: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: Platform.OS === 'android' ? 80 + (StatusBar.currentHeight || 0) : 100,
    backgroundColor: '#2f855a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  leftSection: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 80,
    marginRight: 15,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 40,
  },
  scrollArea: {
    paddingTop: Platform.OS === 'android' ? 90 + (StatusBar.currentHeight || 0) : 120,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#2f855a',
  },
  guideName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  licenseId: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f855a',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF8E1',
  },
  expiredBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  expiredText: {
    color: '#D32F2F',
  },
  specialtiesContainer: {
    marginTop: 8,
  },
  specialtyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialtyText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  noSpecialtiesText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  certificationItem: {
    marginTop: 12,
  },
  certificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  certificationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  certificationDetails: {
    marginLeft: 28,
  },
  certificationDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  certificationDivider: {
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  noCertificationsText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default LicenseDetailsPage;