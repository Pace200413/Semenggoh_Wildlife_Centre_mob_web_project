import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  BackHandler, 
  Alert 
} from 'react-native';

const CourseInfoPage = ({ route, navigation }) => {
  const { course = {} } = route.params || {};

  const {
    courseTitle = 'Untitled Course',
    courseDescription = 'No description provided.',
    duration = 'N/A',
    price = 'N/A',
    schedule = [],
    skillLevel = 'N/A',
    requiredFor = 'N/A',
    capacity = 'N/A',
    lecturer = 'N/A',
    learningOutcome = 'N/A',
    assessments = []
  } = course;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('GuideList', { setSelectedTab: 'course' });
        return true;
      }
    );
    return () => backHandler.remove();
  }, [navigation]);

  const handleEditCourse = () => {
    navigation.navigate('EditCoursePage', { course });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{courseTitle}</Text>

        <Text style={styles.subtitle}>📚 Course Overview</Text>
        <Text style={styles.description}>{courseDescription}</Text>

        <View style={styles.detailsContainer}>
          <DetailRow label="⏳ Duration:" value={duration} />
          <DetailRow label="🎯 Skill Level:" value={skillLevel} />
          <DetailRow label="💰 Price:" value={`$${price}`} />
          <DetailRow label="📅 Schedule:" value={schedule.join(', ')} />
          <DetailRow label="👥 Capacity:" value={capacity} />
          <DetailRow label="👨‍🏫 Lecturer:" value={lecturer} />
          <DetailRow label="🎓 Required For:" value={requiredFor} />
          <DetailRow label="🏆 Learning Outcome:" value={learningOutcome} />
        </View>

        {assessments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>📝 Assessments</Text>
            {assessments.map((a, index) => (
              <View key={index} style={styles.assessmentBlock}>
                <Text style={styles.assessmentQuestion}>
                  {index + 1}. {a.question}
                </Text>
                {a.options.map((opt, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.assessmentOption,
                      a.correctIndex === i && styles.correctAnswer
                    ]}
                  >
                    - {opt}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        <TouchableOpacity style={styles.editButton} onPress={handleEditCourse}>
          <Text style={styles.editButtonText}>Edit Course</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e6fff0',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 25,
  },
  detailsContainer: {
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    width: 150,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A237E',
    marginBottom: 15,
    marginTop: 10,
  },
  assessmentBlock: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  assessmentQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  assessmentOption: {
    fontSize: 15,
    color: '#444',
    marginLeft: 10,
    marginBottom: 4,
  },
  correctAnswer: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CourseInfoPage;
