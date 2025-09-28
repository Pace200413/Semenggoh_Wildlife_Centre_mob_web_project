import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config';

const { width } = Dimensions.get('window');
const cardWidth = width - 48; // Adjust to ensure the cards fit in one row

const CoursePage = ({ navigation, route }) => {
  // Get user and role data from route params
  const { userId, role } = route.params;

  // State to store courses fetched from backend
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from backend when component mounts
  useEffect(() => {
    // Replace with your actual API URL for courses
    fetch(`${API_URL}/api/training_course/courses?userId=${userId}`)
      .then(response => response.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetch(`${API_URL}/api/training_course/courses?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          setCourses(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching courses:', error);
          setLoading(false);
        });
    }, [])
  );

  // Filter courses based on their status
  const enrolledCourses = courses.filter(course => course.status === "enrolled");
  const upcomingCourses = courses.filter(course => course.status === "upcoming");
  const completedCourses = courses.filter(course => course.status === "completed");

  // Function to enroll in an upcoming course
  const enrollInCourse = (course) => {
    Alert.alert(
      "Enroll in Course",
      `Are you sure you want to enroll in the course: ${course.courseTitle}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Enroll",
          onPress: () => {
            fetch(`${API_URL}/api/training_course/update-status`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: userId,
                courseId: course.id,
                status: 'enrolled',
              }),
            })
              .then(response => response.json())
              .then(data => {
                Alert.alert("Success", "You have successfully enrolled in the course!");

                // Refresh courses after enrollment
                setCourses(prevCourses =>
                  prevCourses.map(c =>
                    c.id === course.id ? { ...c, status: 'enrolled' } : c
                  )
                );
              })
              .catch(error => {
                console.error('Enrollment error:', error);
                Alert.alert("Error", "Failed to enroll in course. Please try again.");
              });
          },
        },
      ]
    );
  };

  // Render Course Cards
  const renderCourseCard = (type) => ({ item }) => (
    <TouchableOpacity
      onPress={() => (type === "upcoming" ? enrollInCourse(item) : type === "enrolled"? navigation.navigate('CourseDetail', { course: item, userId: route?.params?.userId, role: route?.params?.role }) : null)}>
      <View style={type === 'enrolled' ? styles.enrolledCard : type === 'upcoming' ? styles.upcomingCard : styles.completedCard}>
        <Text style={styles.title}>{item.courseTitle}</Text>
        <Text style={styles.description}>{item.courseDescription}</Text>
        <View style={styles.row}>
          {type !== 'completed' && <Text style={styles.duration}>🕒 {item.duration}</Text>}
          {type !== 'completed' && <Text style={styles.arrow}>➔</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={enrolledCourses}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>Courses</Text>
            <Text style={styles.section}>Enrolled Courses</Text>
            {enrolledCourses.length === 0 ? (
              <View style={styles.enrolledCard}>
                <Text style={styles.title}>No courses enrolled</Text>
                <Text style={styles.description}>You haven't enrolled in any courses yet.</Text>
              </View>
            ) : (
              enrolledCourses.map(course => renderCourseCard('enrolled')({ item: course, key: course.id }))
            )}
          </>
        }
        ListFooterComponent={
          <>
            <Text style={styles.section}>Upcoming Courses</Text>
            {upcomingCourses.length === 0 ? (
              <View style={styles.upcomingCard}>
                <Text style={styles.title}>No upcoming courses</Text>
                <Text style={styles.description}>No upcoming courses available at the moment.</Text>
              </View>
            ) : (
              upcomingCourses.map(course => renderCourseCard('upcoming')({ item: course, key: course.id }))
            )}
            <Text style={styles.section}>Completed Courses</Text>
            {completedCourses.length === 0 ? (
              <View style={styles.completedCard}>
                <Text style={styles.title}>No completed courses</Text>
                <Text style={styles.description}>You haven't completed any courses yet.</Text>
              </View>
            ) : (
              completedCourses.map(course => renderCourseCard('completed')({ item: course, key: course.id }))
            )}
          </>
        }
      />
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuideHome', { userId: userId, role: role })}>
          <Ionicons name="home" size={24} color="#2f855a" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('FeedbackHome', { userId: userId, role: role })}>
          <MaterialIcons name="feedback" size={24} color="#888" />
          <Text style={styles.navText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuideBookingApproval', { userId: userId, role: role })}>
          <Ionicons name="calendar" size={24} color="#888" />
          <Text style={styles.navText}>My Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuideLic', { userId: userId, role: role })}>
          <FontAwesome name="id-card" size={24} color="#888" />
          <Text style={styles.navText}>License</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuidePer', { userId: userId, role: role })}>
          <Ionicons name="person" size={24} color="#888" />
          <Text style={styles.navText}>Guide</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CoursePage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
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
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
    marginBottom: 20,
  },
  enrolledCard: {
    width: cardWidth,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    marginBottom: 10,
  },
  upcomingCard: {
    width: cardWidth,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  completedCard: {
    width: cardWidth,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    marginTop: 6,
  },
  description: {
    fontSize: 12,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  duration: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
