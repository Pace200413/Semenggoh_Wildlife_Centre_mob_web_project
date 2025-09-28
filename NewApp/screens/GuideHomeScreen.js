import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../config';

const BAR_OK = '#388E3C';
const BAR_WARN = '#FFA000';
const BAR_BAD = '#D32F2F';

const GuideHome = ({ navigation, route }) => {
  const userId = route?.params?.userId;

  const [bookings, setBookings] = useState([]);
  const [scheduleToday, setScheduleToday] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);

  /** 🆕  course progress list  **/
  const [courseProgress, setCourseProgress] = useState([]); // [{ code, progress }]

  // ───────────────────────────────────────── Fetch bookings + progress
  useEffect(() => {
    fetchBookings();
    fetchCourseProgress();
  }, []);

  // ─── BOOKINGS ──────────────────────────────────────────────────────
  const fetchBookings = async () => {
    try {
      const resp = await axios.get(
        `${API_URL}/api/bookings/get-booking/${userId}`
      );

      const data = resp.data;
      setBookings(data);

      const today    = moment().startOf('day');
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
      Alert.alert('Error', 'Failed to fetch booking data.');
    }
  };

  // ─── COURSE PROGRESS (live) ────────────────────────────────────────
  const fetchCourseProgress = async () => {
    try {
      /** 1️⃣ resolve guide_id from user_id **/
      const { data: guideObj } = await axios.get(
        `${API_URL}/api/guides/guide-id?userId=${userId}`
      );
      const guideId = guideObj.guide_id;

      /** 2️⃣ grab every course with status merged in (backend already does this) **/
      const { data: courses } = await axios.get(
        `${API_URL}/api/training_course/courses?userId=${userId}`
      );
      /*
        courses = [
          { id, courseTitle, status: 'completed' | 'enrolled' | 'upcoming', ... }
        ]
      */

      /** 3️⃣ translate status → percentage for a VERY simple gauge      **/
      /**     completed = 100, enrolled = 50, upcoming = 0              **/
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
      console.error(err);
      Alert.alert('Error', 'Could not load course progress.');
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────────
  const progressColour = pct =>
    pct === 100 ? BAR_OK : pct >= 60 ? BAR_WARN : BAR_BAD;

  // ─── UI ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* fixed green header with logo */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Image
            source={require('../assets/images/logo.jpg')}
            style={styles.logo}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.headertitle}>Semenggoh</Text>
            <Text style={styles.headertitle}>Wildlife</Text>
            <Text style={styles.headertitle}>Centre</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity onPress={() => navigation.navigate('GuideNotification', { userId: route?.params?.userId, role: route?.params?.role })}>
            <Ionicons name="notifications" size={34} color="white" style={styles.logo1} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.ii}>
        <ScrollView contentContainerStyle={styles.containe}>
          {/* greeting strip */}
          <View style={styles.header2}>
            <View>
              <Text style={styles.greeting}>Hello, Guide 👋</Text>
              <Text style={styles.date}>
                {moment().format('dddd, MMMM Do YYYY')}
              </Text>
            </View>
            <Ionicons name="person-circle-outline" size={38} color="#4CAF50" />
          </View>

          {/* ───── Schedule Today ───── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule Today</Text>
            <View style={styles.eventRow}>
              {scheduleToday.length ? (
                scheduleToday.map((b, i) => (
                  <View key={i} style={styles.eventCard}>
                    <Text style={styles.timeLabel}>{b.booking_time}</Text>
                    <Image
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/147/147144.png',
                      }}
                      style={styles.image}
                    />
                    <Text style={styles.name}>{b.emergency_contact_name}</Text>
                    <Text style={styles.pax}>
                      Visitors: {b.adult_count + b.child_count}
                    </Text>
                  </View>
                ))
              ) : (
                <Text>No events today.</Text>
              )}
            </View>
          </View>

          {/* ───── Upcoming (tomorrow) ───── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
            {upcomingSchedule.length ? (
              upcomingSchedule.map((it, idx) => (
                <View key={idx} style={styles.scheduleItem}>
                  <Ionicons name="time" size={18} color="#4CAF50" />
                  <Text style={styles.scheduleText}>
                    {it.booking_time} - {it.emergency_contact_name} (
                    {it.adult_count + it.child_count} Visitor)
                  </Text>
                </View>
              ))
            ) : (
              <Text>No events scheduled for tomorrow.</Text>
            )}
          </View>

          {/* ───── Course Progress (LIVE) ───── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Progress</Text>
            {courseProgress.length ? (
              courseProgress.map((c, idx) => (
                <View key={idx} style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.courseCode}>{c.code}</Text>
                    <Text style={styles.progressPercent}>{c.progress}%</Text>
                  </View>
                  <View style={styles.progressBarWrapper}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${c.progress}%`,
                          backgroundColor: progressColour(c.progress),
                        },
                      ]}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text>No course data.</Text>
            )}
          </View>

          {/* buttons row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() =>
                navigation.navigate('GuideNotification', {
                  userId: userId,
                  role: route?.params?.role,
                })
              }>
              <Text style={styles.buttonText}>Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() =>
                navigation.navigate('CertificateView', {
                  userId: userId,
                  role: route?.params?.role,
                })
              }>
              <Text style={styles.buttonText}>Certificate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TakeCourse', { userId: route?.params?.userId, role: route?.params?.role })}>
          <MaterialIcons name="school" size={24} color="#888" />
          <Text style={styles.navText}>Course</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('FeedbackHome', { userId: route?.params?.userId, role: route?.params?.role })}>
          <MaterialIcons name="feedback" size={24} color="#888" />
          <Text style={styles.navText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuideBookingApproval', { userId: route?.params?.userId, role: route?.params?.role })}>
          <Ionicons name="calendar" size={24} color="#888" />
          <Text style={styles.navText}>My Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuideLic', { userId: route?.params?.userId, role: route?.params?.role })}>
          <FontAwesome name="id-card" size={24} color="#888" />
          <Text style={styles.navText}>License</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuidePer', { userId: route?.params?.userId, role: route?.params?.role })}>
          <Ionicons name="person" size={24} color="#888" />
          <Text style={styles.navText}>Guide</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
      position: 'absolute',
      top: 5,
      left: 0,
      right: 0,
      zIndex: 10,
      height: Platform.OS === 'android' ? 80 + (StatusBar.currentHeight || 0) : 100,
      backgroundColor: '#2f855a',
      flexDirection: 'row', // Aligns logo and title horizontally
      alignItems: 'center',
      justifyContent: 'flex-start', // Aligns content to the left
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },

    scrollContent: {
      paddingTop: Platform.OS === 'android' ? 100 + (StatusBar.currentHeight || 0) : 120,
      paddingBottom: 100, // space for bottomNav
      paddingHorizontal: 15,
    },
    headertitle: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: 'bold',
    },

    leftSection: {
      marginLeft:10,
      flexDirection: 'row',
      alignItems: 'center',
    },

    rightSection: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginTop:50,
      paddingleft:20,
    },

    logo: {
      width: 60, // Adjust logo size
      height: 80,
      marginRight: 15,
    },

    title: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: 'bold',
    },
  containe: {
    flexGrow: 1,
    paddingBottom: 20, // Added space for bottom navigation
  },
  ii: {
    paddingTop: Platform.OS === 'android' ? 90 + (StatusBar.currentHeight || 0) : 120,
    alignItems: 'center',
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',

  },
  title: {
    fontSize: 24, // Smaller title
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  section: {
    marginBottom: 15, // Reduced margin
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12, // Reduced padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16, // Smaller font size
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventCard: {
    backgroundColor: '#eaeaea',
    padding: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeLabel: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    marginBottom: 6,
    color: '#666',
  },
  image: {
    width: 50, // Smaller image size
    height: 50,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  pax: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 10, // Reduced margin
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBarWrapper: {
    height: 8, // Reduced height
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8, // Reduced height
    backgroundColor: '#4CAF50',
  },
  progressPercent: {
    fontSize: 12,
    color: '#555',
  },
  buttonBox: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18, // Increased padding
    paddingHorizontal: 20, // Increased padding
    borderRadius: 20, // More rounded corners
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // For Android devices to give a floating effect
    borderWidth: 1, // Subtle border for contrast
    borderColor: '#388E3C', // Darker green for the border
    marginBottom: 10,
  },
  
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8, // Space between the icon and text
    fontSize: 14, // Smaller font size
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  buttonIcon: {
    fontSize: 24, // Icon size (smaller to match the smaller text size)
    color: '#fff',
    marginBottom: 8, // Space between icon and text
  },
  
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15, // Reduced margin
    paddingHorizontal: 5, // Slight padding for spacing
    flexWrap: 'wrap', // Allow buttons to wrap if there's not enough space
  },
  
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
  greeting: {
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 10,
  color: '#2f855a',
},
date: {
  fontSize: 14,
  color: '#666',
  marginBottom: 10,
},
statsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 15,
},
statCard: {
  backgroundColor: '#f9f9f9',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  width: '48%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
statTitle: {
  fontSize: 14,
  marginTop: 6,
  color: '#555',
},
statValue: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#222',
},
scheduleItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},
scheduleText: {
  marginLeft: 8,
  fontSize: 14,
  color: '#333',
},

header2: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 15,
  paddingHorizontal: 5,
  backgroundColor: '#ffffff',
  borderRadius: 12,
  marginTop: 10,
  marginBottom: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

headerLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},

headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  marginLeft: 10,
  color: '#2f855a',
},
greeting: {
  fontSize: 20,
  fontWeight: '700',
  color: '#2f855a',
  marginBottom: 4,
},
date: {
  fontSize: 13,
  color: '#666',
},

statusText: {
  fontSize: 12,
  color: '#4CAF50',
  marginTop: 4,
  fontWeight: '600',
},
progressFill: {
  height: 8,
  borderRadius: 5,
},
});

export default GuideHome;