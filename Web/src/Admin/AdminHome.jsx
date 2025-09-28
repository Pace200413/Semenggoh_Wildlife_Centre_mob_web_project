// AdminHomeScreen.js (converted to ReactJS for Web)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {API_URL } from '../config';
import { FaBook, FaClipboard, FaAddressCard } from 'react-icons/fa';
import { MdAssignment, MdVerified, MdPeople, MdPerson } from 'react-icons/md';
import { IoNotifications } from 'react-icons/io5';

export default function AdminHomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || null;

  const [eligibleGuides, setEligibleGuides] = useState([]);
  const [pendingGuides, setPendingGuides] = useState([]);

  const LICENSE_PRIORITY = ['Junior Guide', 'Senior Guide', 'Master'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pending, approved] = await Promise.all([
          axios.get(`${API_URL}/api/guides/pending`),
          axios.get(`${API_URL}/api/users?approved=1&role=guide`),
        ]);
        setPendingGuides(pending.data);

        const enriched = await Promise.all(
          approved.data.map(async (u) => {
            const { data: lic } = await axios.get(`${API_URL}/api/license/promptable/${u.user_id}`);
            if (lic.length) {
              lic.sort((a, b) =>
                LICENSE_PRIORITY.indexOf(a.licenseName) - LICENSE_PRIORITY.indexOf(b.licenseName)
              );
              return { user: u, nextLicence: lic[lic.length - 1] };
            }
            return null;
          })
        );
        setEligibleGuides(enriched.filter(Boolean));
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, []);

  const approveAllPendingGuides = async () => {
    if (!window.confirm('Are you sure you want to approve all pending guides?')) return;
    try {
      await axios.put(`${API_URL}/api/guides/approve-all`);
      setPendingGuides([]);
    } catch (err) {
      console.error('Failed to approve guides:', err);
      alert('Failed to approve guides. Please try again.');
    }
  };

  const navItems = [
    { label: 'Assign Course', icon: <MdAssignment />, route: '/Admin/GuideListPage', state: { setSelectedTab: 'assign', userId } },
    { label: 'Issue License', icon: <MdVerified />, route: '/Admin/GuideListPage', state: { setSelectedTab: 'issue', userId } },
    { label: 'Add Course', icon: <FaBook />, route: '/Admin/AddCoursePage', state: { userId } },
    { label: 'Guide Management', icon: <MdPeople />, route: '/Admin/GuideListPage', state: { userId } },
    { label: 'Tracking', icon: <FaClipboard />, route: '/Admin/TrackProgressPage' },
    { label: 'Courses', icon: <FaAddressCard />, route: '/Admin/GuideListPage', state: { setSelectedTab: 'course', userId } },
    { label: 'Personal Page', icon: <MdPerson />, route: '/Admin/AdminPersonal', state: { userId } },
    { label: 'IoT Dashboard', icon: <MdPerson />, route: '/Admin/IotDashboard', state: { userId } },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.leftSection}>
          <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
          <div>
            <div style={styles.title}>Semenggoh</div>
            <div style={styles.title}>Wildlife</div>
            <div style={styles.title}>Centre</div>
          </div>
        </div>
        <div style={styles.rightSection}>
          <button onClick={() => navigate('/Admin/AdminNotificationPage')} style={styles.iconButton}>
            <IoNotifications size={34} color="white" />
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <h1 style={styles.pageTitle}>Admin Dashboard</h1>

        <div style={styles.grid}>
          {navItems.map((item, index) => (
            <button
              key={index}
              style={styles.button}
              onClick={() => navigate(item.route, { state: item.state })}
            >
              {item.icon}
              <div style={styles.buttonText}>{item.label}</div>
            </button>
          ))}
        </div>

        <h2 style={styles.pageTitle}>Eligible Guides</h2>
        {eligibleGuides.length === 0 ? (
          <div style={styles.emptyState}>
            <MdVerified size={48} color="#4CAF50" />
            <div style={styles.emptyText}>No eligible guides</div>
            <div style={styles.emptySubtext}>
              All guides are up to date or still need requirements
            </div>
          </div>
        ) : (
          eligibleGuides.map(({ user, nextLicence }) => (
            <div key={user.user_id} style={styles.guideCard}>
              <div style={styles.guideCardText}>{user.name}</div>
              <div style={styles.guideCardDate}>
                Ready for <strong>{nextLicence.licenseName}</strong>
              </div>
              <button
                style={{ ...styles.actionButton, ...styles.practicalButton }}
                onClick={() => navigate('/Admin/GuideListPage', { state: { setSelectedTab: 'issue', userId } })}
              >
                Issue Licence
              </button>
            </div>
          ))
        )}

        {pendingGuides.length > 0 && (
          <>
            <h2 style={styles.pageTitle}>Pending Guide Approvals</h2>
            <button
              style={{ ...styles.actionButton, ...styles.practicalButton, marginBottom: 15, width: '100%' }}
              onClick={approveAllPendingGuides}
            >
              Approve All
            </button>
            <div style={styles.grid}>
              {pendingGuides.map((guide) => (
                <div key={guide.id} style={styles.guideCard}>
                  <div style={styles.guideCardText}>{guide.name}</div>
                  <div style={styles.guideCardDate}>Awaiting Admin Approval</div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f7f0', minHeight: '100vh' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2f855a', padding: '10px 20px',
  },
  leftSection: { display: 'flex', alignItems: 'center' },
  rightSection: { display: 'flex', alignItems: 'center' },
  logo: { width: 60, height: 80, marginRight: 10 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  main: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A237E', margin: '20px 0' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: 15 },
  button: {
    backgroundColor: '#fff', width: 'calc(33.33% - 10px)', height: 110, borderRadius: 12,
    padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: 'none',
  },
  buttonText: { marginTop: 8, fontSize: 13, fontWeight: 500, textAlign: 'center' },
  guideCard: {
    backgroundColor: '#fff', width: '100%', borderRadius: 12, boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: 10,
    padding: 15, display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  guideCardText: { fontSize: 16, fontWeight: 'bold', color: '#2f855a' },
  guideCardDate: { fontSize: 12, color: '#888', marginTop: 5 },
  actionButton: {
    padding: 8, borderRadius: 6, width: '100%', textAlign: 'center', fontWeight: 500, color: 'white', fontSize: 12,
    border: 'none', cursor: 'pointer',
  },
  practicalButton: { backgroundColor: '#2f855a' },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: 20, backgroundColor: '#fff', borderRadius: 12, width: '100%', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#2f855a', marginTop: 10, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: '#888', marginTop: 5, textAlign: 'center' },
  iconButton: { background: 'none', border: 'none', cursor: 'pointer' },
};
