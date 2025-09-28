import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { API_URL } from '../config';

const GuideLicensePage = ({ navigation, route }) => {
  const { userId, role } = route.params;
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/license/by-guide/${userId}`);
        setLicenses(res.data);
      } catch (err) {
        console.error('Failed to fetch guide licenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, [userId]);

  const handleRenew = (licenseId) => {
    Alert.alert(
      "Renew License",
      "This will cost $10 to renew. Do you want to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Proceed", onPress: () => navigation.navigate('RenewLicense', { licenseId, userId, role }) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>🎫 My Licenses</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
        ) : licenses.length === 0 ? (
          <Text style={styles.noDataText}>No license requests found.</Text>
        ) : (
          licenses.map((lic, index) => (
            <View key={`${lic.licenseId}-${index}`} style={styles.card}>
              <View style={styles.row}>
                <Ionicons name="document-text-outline" size={20} color="#2f855a" />
                <Text style={styles.cardTitle}>{lic.licenseName}</Text>
              </View>
              <Text style={styles.cardField}>🏞️ Park: <Text style={styles.value}>{lic.park_name}</Text></Text>
              <Text style={styles.cardField}>📌 Status: <Text style={[styles.value, styles.status(lic.status)]}>{lic.status}</Text></Text>
              <Text style={styles.cardField}>📅 Requested: <Text style={styles.value}>{moment(lic.requestedAt).format('LL')}</Text></Text>
              <Text style={styles.cardField}>✅ Approved: <Text style={styles.value}>{lic.approvedAt ? moment(lic.approvedAt).format('LL') : '-'}</Text></Text>
              <Text style={styles.cardField}>📆 Expiry: <Text style={styles.value}>{lic.expiry_date ? moment(lic.expiry_date).format('LL') : '-'}</Text></Text>

              {/* Renew Button */}
              {lic.status === 'earned' && (
                <TouchableOpacity style={styles.renewButton} onPress={() => handleRenew(lic.licenseId)}>
                  <Text style={styles.renewButtonText}>Renew for $10</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f855a',
    marginBottom: 20,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f855a',
    marginLeft: 6,
  },
  cardField: {
    fontSize: 14,
    marginTop: 8,
    color: '#333',
  },
  value: {
    fontWeight: '600',
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  status: (status) => ({
    color:
      status === 'approved' ? '#2e7d32' :
      status === 'pending' ? '#ff9800' :
      status === 'rejected' ? '#c62828' :
      '#444',
    textTransform: 'capitalize',
  }),
  renewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  renewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GuideLicensePage;
