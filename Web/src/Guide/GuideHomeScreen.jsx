// Converted GuideHomeScreen to ReactJS (preserving original design)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../config';
import RenewLicensePage from './RenewLicensePage';

export default function GuideHomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId = 0, role = 'guide' } = location.state || {};

  const [bookings, setBookings] = useState([]);
  const [scheduleToday, setScheduleToday] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [courseProgress, setCourseProgress] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchCourseProgress();
  }, []);

  const fetchBookings = async () => {
    try {
      const resp = await axios.get(`${API_URL}/api/bookings/get-booking/${userId}`);
      const data = resp.data;
      setBookings(data);

      const today = moment().startOf('day');
      const tomorrow = moment().add(1, 'day').startOf('day');

      const todayBookings = data.filter(
        b => moment(b.booking_date).isSame(today, 'day') && b.status === 'confirmed'
      );
      const tomorrowBookings = data.filter(
        b => moment(b.booking_date).isSame(tomorrow, 'day') && b.status === 'confirmed'
      );

      setScheduleToday(todayBookings);
      setUpcomingSchedule(tomorrowBookings);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch booking data.');
    }
  };

  const fetchCourseProgress = async () => {
    try {
      const { data: guideObj } = await axios.get(`${API_URL}/api/guides/guide-id?userId=${userId}`);
      const guideId = guideObj.guide_id;

      const { data: courses } = await axios.get(`${API_URL}/api/training_course/courses?userId=${userId}`);
      const progressArr = courses.map(c => {
        let pct = 0;
        if (c.status === 'completed') pct = 100;
        else if (c.status === 'enrolled') pct = 50;
        return {
          code: c.courseTitle.length > 14 ? `${c.courseTitle.slice(0, 12)}…` : c.courseTitle,
          fullTitle: c.courseTitle,
          progress: pct,
        };
      });

      setCourseProgress(progressArr);
    } catch (err) {
      console.error('Could not load course progress.', err);
    }
  };

  const progressColour = pct => pct === 100 ? '#388E3C' : pct >= 60 ? '#FFA000' : '#D32F2F';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.leftSection}>
          <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
          <div>
            <div style={styles.headertitle}>Semenggoh</div>
            <div style={styles.headertitle}>Wildlife</div>
            <div style={styles.headertitle}>Centre</div>
          </div>
        </div>
        <div style={styles.rightSection}>
          <button onClick={() => navigate('../Screen/GuideNotificationWeb', { state: { userId, role } })} style={styles.notificationBtn}>🔔</button>
        </div>
      </div>

      <div style={styles.scrollContent}>
        <div style={styles.header2}>
          <div>
            <div style={styles.greeting}>Hello, Guide 👋</div>
            <div style={styles.date}>{moment().format('dddd, MMMM Do YYYY')}</div>
          </div>
          <span style={styles.statusText}>🧍</span>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Schedule Today</div>
          <div style={styles.eventRow}>
            {scheduleToday.length ? scheduleToday.map((b, i) => (
              <div key={i} style={styles.eventCard}>
                <div style={styles.timeLabel}>{b.booking_time}</div>
                <img src="https://cdn-icons-png.flaticon.com/512/147/147144.png" style={styles.image} alt="visitor" />
                <div style={styles.name}>{b.emergency_contact_name}</div>
                <div style={styles.pax}>Visitors: {b.adult_count + b.child_count}</div>
              </div>
            )) : <div>No events today.</div>}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Upcoming Schedule</div>
          {upcomingSchedule.length ? upcomingSchedule.map((it, idx) => (
            <div key={idx} style={styles.scheduleItem}>
              ⏰ <span style={styles.scheduleText}>{it.booking_time} - {it.emergency_contact_name} ({it.adult_count + it.child_count} Visitor)</span>
            </div>
          )) : <div>No events scheduled for tomorrow.</div>}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Course Progress</div>
          {courseProgress.length ? courseProgress.map((c, idx) => (
            <div key={idx} style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span>{c.code}</span>
                <span>{c.progress}%</span>
              </div>
              <div style={styles.progressBarWrapper}>
                <div style={{ ...styles.progressFill, width: `${c.progress}%`, backgroundColor: progressColour(c.progress) }} />
              </div>
            </div>
          )) : <div>No course data.</div>}
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.buttonBox} onClick={() => navigate('../Screen/GuideNotificationWeba.jpg', { state: { userId, role } })}>Notification</button>
          <button style={styles.buttonBox} onClick={() => navigate('/Guide/CertificateView', { state: { userId, role } })}>Certificate</button>
        </div>
      </div>

      <div style={styles.bottomNav}>
        <div style={styles.navItem} onClick={() => navigate('../Screen/CoursePageWeb', { state: { userId, role } })}>
          📘<div style={styles.navLabel}>Course</div>
        </div>
        <div style={styles.navItem} onClick={() => navigate('../Screen/FeedbackHomeWeb', { state: { userId, role } })}>
          💬<div style={styles.navLabel}>Feedback</div>
        </div>
        <div style={styles.navItem} onClick={() => navigate('../Screen/GuideBookingApprovalWeb', { state: { userId, role } })}>
          📅<div style={styles.navLabel}>Booking</div>
        </div>
        <div style={styles.navItem} onClick={() => navigate('/Guide/GuideLicensePage', { state: { userId, role } })}>
          🪪<div style={styles.navLabel}>License</div>
        </div>
        <div style={styles.navItem} onClick={() => navigate('/Guide/GuidePersonal', { state: { userId, role } })}>
          👤<div style={styles.navLabel}>Profile</div>
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f8f8f8', fontFamily: 'Arial, sans-serif', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#2f855a', color: '#fff' },
  leftSection: { display: 'flex', alignItems: 'center', gap: 15 },
  logo: { width: 60, height: 80 },
  headertitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  rightSection: {},
  notificationBtn: { fontSize: 24, background: 'none', border: 'none', color: 'white', cursor: 'pointer' },
  scrollContent: { padding: 15, paddingBottom: 80 },
  header2: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#2f855a' },
  date: { fontSize: 14, color: '#666' },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  eventRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  eventCard: { backgroundColor: '#eaeaea', padding: 10, borderRadius: 10, width: '48%', textAlign: 'center' },
  timeLabel: { backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: 8, fontSize: 12, marginBottom: 6, display: 'inline-block' },
  image: { width: 50, height: 50, borderRadius: 8, marginBottom: 8 },
  name: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  pax: { fontSize: 12, color: '#666' },
  progressContainer: { marginBottom: 10 },
  progressHeader: { display: 'flex', justifyContent: 'space-between', fontSize: 14 },
  progressBarWrapper: { height: 8, backgroundColor: '#ddd', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 5 },
  buttonRow: { display: 'flex', gap: 10 },
  buttonBox: { flex: 1, backgroundColor: '#4CAF50', color: '#fff', padding: 12, border: 'none', borderRadius: 8, cursor: 'pointer' },
  bottomNav: {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: '#ffffff',
  borderTop: '1px solid #ddd',
  padding: '8px 0',
  boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.05)',
  zIndex: 100,
},
navItem: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontSize: '20px',
  color: '#2f855a',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
},
navItemHover: {
  color: '#1a532d',
},
navLabel: {
  fontSize: '12px',
  marginTop: '4px',
},

  scheduleItem: { display: 'flex', alignItems: 'center', marginBottom: 6 },
  scheduleText: { marginLeft: 8, fontSize: 14, color: '#333' },
  statusText: { fontSize: 18, color: '#4CAF50' },
};
