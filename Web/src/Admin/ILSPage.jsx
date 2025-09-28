// Converted IssueLicenseScreen (ILSPage) for ReactJS with preserved design
import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

export default function ILSPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    guideName,
    park,
    assessmentDate,
    assessmentStatus,
    issuanceDate,
    licenseId,
    licenseName,
    guide_id,
    user_id
  } = location.state || {};

  const handleApprove = async () => {
    if (assessmentStatus !== 'Passed') {
      alert('Guide must pass the assessment first.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/license/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guide_id, licenseId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Approval failed');
      alert(`License successfully issued to ${guideName}`);
      navigate('/Admin/GuideListPage', { state: { setSelectedTab: 'issue', userId: user_id } });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to approve license');
    }
  };

  const handleReject = () => {
    alert(`${guideName}'s application rejected.`);

    navigate('/Admin/GuideListPage', {
      state: { setSelectedTab: 'issue', userId: user_id },
      replace: true  // ✅ prevents adding ILSPage to back stack
    });
  };



  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Issue License to Qualified Guide</h2>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Guide Information</h3>
        <p style={styles.infoText}>👤 Name: {guideName}</p>
        <p style={styles.infoText}>🏞️ Park: {park}</p>
        <p style={styles.infoText}>📋 Status: {assessmentStatus}</p>
        <p style={styles.infoText}>📅 Assessment Date: {new Date(assessmentDate).toLocaleDateString()}</p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>License Information</h3>
        <p style={styles.infoText}>🆔 License ID: {licenseId}</p>
        <p style={styles.infoText}>🏞️ License Name: {licenseName}</p>
        <p style={styles.infoText}>📅 Issue Date: {new Date(issuanceDate).toLocaleDateString()}</p>
      </div>

      <button onClick={handleApprove} style={styles.approveButton}>✅ APPROVE & ISSUE LICENSE</button><br></br>
      <button onClick={handleReject} style={styles.rejectButton}>❌ REJECT</button>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f3f7f0',
    padding: 20,
    minHeight: '100vh',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
    marginBottom: 15,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
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
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
    marginTop: 20,
    
  },
  rejectButton: {
    backgroundColor: '#E53935',
    padding: 14,
    borderRadius: 8,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
    marginTop: 10,
    marginBottom: 30,
  },
};
