import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { API_URL } from '../config';

const ILSPage = ({ navigation }) => {
  const route = useRoute();
  const { guideName, park, assessmentDate, assessmentStatus, issuanceDate, licenseId, licenseName, guide_id, user_id } = route.params;

  const handleApprove = async () => {
    if (assessmentStatus !== 'Passed') {
      Alert.alert('Cannot Approve', 'Guide must pass the assessment first.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/license/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guide_id,
          licenseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Approval failed');
      }

      Alert.alert('Success', `License successfully issued to ${guideName}`, [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('GuideList', {
              setSelectedTab: 'issue',
              userId: user_id
            }),
        },
      ]);
    } catch (error) {
      console.error('Error approving license:', error);
      Alert.alert('Error', error.message || 'Failed to approve license');
    }
  };

  const handleReject = () => {
    Alert.alert('Application Rejected', `${guideName}'s application rejected.`, [
      {
        text: 'OK',
        onPress: () =>
          navigation.navigate('GuideList', {
            setSelectedTab: 'issue',
            userId: user_id
          }),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Issue License to Qualified Guide</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Guide Information</Text>
        <Text style={styles.infoText}>👤 Name: {guideName}</Text>
        <Text style={styles.infoText}>🏞️ Park: {park}</Text>
        <Text style={styles.infoText}>📋 Status: {assessmentStatus}</Text>
        <Text style={styles.infoText}>📅 Assessment Date: {new Date(assessmentDate).toLocaleDateString()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>License Information</Text>
        <Text style={styles.infoText}>🆔 License ID: {licenseId}</Text>
        <Text style={styles.infoText}>🏞️ License Name: {licenseName}</Text>
        <Text style={styles.infoText}>📅 Issue Date: {new Date(issuanceDate).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
        <Text style={styles.approveButtonText}>✅ APPROVE & ISSUE LICENSE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
        <Text style={styles.rejectButtonText}>❌ REJECT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f7f0',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1A237E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#0D47A1',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },
  approveButton: {
    backgroundColor: '#4DA8FF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#E53935',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ILSPage;
