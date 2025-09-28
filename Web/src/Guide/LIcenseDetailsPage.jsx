// Converted LicenseDetailsPage to ReactJS (preserving design)
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

export default function LicenseDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { licenseData = {}, userId = 0 } = location.state || {};

  const user = {
    firstName: 'Jayden',
    lastName: 'Wong',
    profilePic: '/assets/images/propic.jpg',
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('LL');
  };

  const renderCertifications = () => {
    if (!licenseData.certifications?.length) {
      return <p style={styles.muted}>No certifications available</p>;
    }

    return licenseData.certifications.map((cert, index) => (
      <div key={cert.id} style={styles.certItem}>
        <div style={styles.certTitle}>✅ {cert.name}</div>
        <div style={styles.certDetail}>Issued by: {cert.issuer}</div>
        <div style={styles.certDetail}>Date: {formatDate(cert.date)}</div>
        <div style={styles.certDetail}>ID: {cert.id}</div>
        {index < licenseData.certifications.length - 1 && <hr style={styles.divider} />}
      </div>
    ));
  };

  const renderSpecialties = () => {
    if (!licenseData.specialty?.length) {
      return <p style={styles.muted}>No specialties listed</p>;
    }

    return (
      <ul style={styles.specialtiesList}>
        {licenseData.specialty.map((item, index) => (
          <li key={index} style={styles.specialtyItem}>⭐ {item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logoTitleBox}>
          <img src="/assets/images/logo.jpg" alt="logo" style={styles.logo} />
          <div>
            <div style={styles.title}>Semenggoh</div>
            <div style={styles.title}>Wildlife</div>
            <div style={styles.title}>Centre</div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} style={styles.backButton}>⬅ Back</button>
      </div>

      <div style={styles.content}>
        <div style={styles.profileSection}>
          <img src={user.profilePic} alt="profile" style={styles.profileImage} />
          <h2>{fullName}</h2>
          <p>ID: {licenseData.id}</p>
        </div>

        <div style={styles.card}>
          <h3>License Information</h3>
          <div style={styles.infoRow}><strong>Status:</strong> <span style={styles.statusText(licenseData.status)}>{licenseData.status}</span></div>
          <div style={styles.infoRow}><strong>Level:</strong> {licenseData.level || 'N/A'}</div>
          <div style={styles.infoRow}><strong>Issue Date:</strong> {formatDate(licenseData.issueDate)}</div>
          <div style={styles.infoRow}><strong>Expiration Date:</strong> <span style={licenseData.isExpired ? styles.expired : {}}>{formatDate(licenseData.expirationDate)}</span></div>
          <div style={styles.infoRow}><strong>Years Active:</strong> {licenseData.yearsActive || '0'}</div>
        </div>

        <div style={styles.card}>
          <h3>Specialties</h3>
          {renderSpecialties()}
        </div>

        <div style={styles.card}>
          <h3>Certifications</h3>
          {renderCertifications()}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e6fff0',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#2f855a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    color: '#fff',
  },
  logoTitleBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    width: 60,
    height: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 18,
    cursor: 'pointer',
  },
  content: {
    padding: 20,
  },
  profileSection: {
    textAlign: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    border: '2px solid #2f855a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  infoRow: {
    margin: '10px 0',
  },
  statusText: (status) => ({
    color:
      status === 'Active' ? '#2e7d32' :
      status === 'Pending' ? '#f57c00' :
      status === 'Expired' ? '#d32f2f' : '#333',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  }),
  expired: {
    color: '#d32f2f',
  },
  muted: {
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8,
  },
  specialtiesList: {
    listStyle: 'none',
    paddingLeft: 0,
    marginTop: 10,
  },
  specialtyItem: {
    fontSize: 16,
    marginBottom: 6,
  },
  certItem: {
    marginBottom: 12,
  },
  certTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f855a',
  },
  certDetail: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    borderTop: '1px solid #ddd',
    marginTop: 10,
  },
};