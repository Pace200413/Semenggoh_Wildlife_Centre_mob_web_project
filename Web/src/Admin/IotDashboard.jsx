import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export function AdminIoTDashboard() {
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
    <div style={iotStyles.container}>
      <h2 style={iotStyles.header}>🛡️ IoT Security Dashboard</h2>

      <h3 style={iotStyles.sectionTitle}>Latest Intrusion Alerts</h3>
      {intrusionAlerts.length === 0 ? (
        <p style={iotStyles.emptyText}>No intrusion detected.</p>
      ) : (
        intrusionAlerts.map(alert => (
          <div key={alert.id} style={iotStyles.card}>
            <h4 style={iotStyles.cardTitle}>{alert.device}</h4>
            <p style={iotStyles.cardText}>Type: {alert.event}</p>
            <p style={iotStyles.cardText}>Time: {new Date(alert.timestamp).toLocaleString()}</p>
          </div>
        ))
      )}

      <h3 style={iotStyles.sectionTitle}>IoT Kit Status</h3>
      {iotDevices.length === 0 ? (
        <p style={iotStyles.emptyText}>No devices connected.</p>
      ) : (
        iotDevices.map(device => (
          <div key={device.id} style={iotStyles.card}>
            <h4 style={iotStyles.cardTitle}>{device.device}</h4>
            <p style={iotStyles.cardText}>Status: {device.mode === "ON" ? '🟢 Online' : '🔴 Offline'}</p>
            <p style={iotStyles.cardText}>Last Seen: {new Date(device.lastSeen).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

const iotStyles = {
  container: { backgroundColor: '#eef3f7', padding: 20, minHeight: '100vh' },
  header: { fontSize: 26, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2f855a', marginTop: 20, marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  cardText: { fontSize: 14, color: '#555' },
  emptyText: { fontStyle: 'italic', color: '#888', textAlign: 'center', marginBottom: 15 },
};
