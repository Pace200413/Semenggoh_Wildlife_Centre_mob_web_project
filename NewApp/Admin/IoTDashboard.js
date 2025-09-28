import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config';

export default function AdminIoTDashboard({ navigation }) {
  const [intrusionAlerts, setIntrusionAlerts] = useState([]);
  const [iotDevices, setIotDevices] = useState([]);

  useEffect(() => {
    const fetchIntrusionAlerts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/iot/alerts?limit=20`);
        setIntrusionAlerts(res.data);
      } catch (err) {
        console.error("Failed to fetch intrusion alerts:", err);
      }
    };

    const fetchIotDevices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/iot/devices`);
        setIotDevices(res.data);
      } catch (err) {
        console.error("Failed to fetch IoT devices:", err);
      }
    };

    fetchIntrusionAlerts();
    fetchIotDevices();

    const interval1 = setInterval(fetchIntrusionAlerts, 10000);
    const interval2 = setInterval(fetchIotDevices, 15000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>🛡️ IoT Security Dashboard</Text>

      <Text style={styles.sectionTitle}>Latest Intrusion Alerts</Text>
      {intrusionAlerts.length === 0 ? (
        <Text style={styles.emptyText}>No intrusion detected.</Text>
      ) : (
        intrusionAlerts.map(alert => (
          <View key={alert.id} style={styles.card}>
            <Text style={styles.cardTitle}>{alert.device}</Text>
            <Text style={styles.cardText}>Type: {alert.event}</Text>
            <Text style={styles.cardText}>Time: {new Date(alert.timestamp).toLocaleString()}</Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>IoT Kit Status</Text>
      {iotDevices.length === 0 ? (
        <Text style={styles.emptyText}>No devices connected.</Text>
      ) : (
        iotDevices.map(device => (
          <View key={device.id} style={styles.card}>
            <Text style={styles.cardTitle}>{device.device}</Text>
            <Text style={styles.cardText}>Status: {device.mode==="ON" ? '🟢 Online' : '🔴 Offline'}</Text>
            <Text style={styles.cardText}>Last Seen: {new Date(device.lastSeen).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 40,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f855a',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
  },
});
