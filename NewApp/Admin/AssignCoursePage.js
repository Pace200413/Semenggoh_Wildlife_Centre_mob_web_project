import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const AssignCoursePage = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { guideName, feedback } = route.params;

  // Static AI-recommended courses (examples only)
  const recommendedCourses = [
    {
      id: 'C001',
      title: 'Effective Wildlife Communication',
      description: 'Improve communication skills with international tourists.',
    },
    {
      id: 'C002',
      title: 'Safety and First Aid Refresher',
      description: 'Essential safety practices and emergency response training.',
    },
    {
      id: 'C003',
      title: 'Eco-Tourism Ethics',
      description: 'Deepen understanding of eco-tourism and sustainable guiding.',
    },
  ];

  const handleAssign = (course) => {
    Alert.alert(
      'Course Assigned',
      `${course.title} has been assigned to ${guideName}.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('GuideList', {
            setSelectedTab: 'training',
          }),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Assign Recommended Course</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Guide Information</Text>
        <Text style={styles.infoText}>👤 Name: {guideName}</Text>
        <Text style={styles.infoText}>📝 Feedback Summary:</Text>
        <Text style={styles.feedbackText}>{feedback}</Text>
      </View>

      <Text style={styles.sectionTitle}>AI Recommended Courses</Text>
      {recommendedCourses.map((course) => (
        <View key={course.id} style={styles.courseCard}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDesc}>{course.description}</Text>
          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => handleAssign(course)}
          >
            <Text style={styles.assignButtonText}>🎓 Assign Course</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f8ff',
    padding: 20,
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
    marginTop: 15,
    marginBottom: 10,
    color: '#0D47A1',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
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
  feedbackText: {
    fontStyle: 'italic',
    color: '#555',
  },
  courseCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  courseDesc: {
    fontSize: 14,
    marginVertical: 8,
    color: '#333',
  },
  assignButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AssignCoursePage;