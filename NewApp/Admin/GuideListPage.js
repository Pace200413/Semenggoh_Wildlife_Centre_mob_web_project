import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions, BackHandler, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

const { width } = Dimensions.get('window');

const GuideListPage = ({ navigation, route }) => {
  const [selectedTab, setSelectedTab] = useState('guide');
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState([]);
  const [guidesForAssign, setGuidesForAssign] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [feedbackForGuide, setFeedbackForGuide] = useState('');
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [recommendedCourses, setRecommendedCourses] = useState([]);  // <---- Add this

  useEffect(() => {
    if (route.params?.setSelectedTab) {
      setSelectedTab(route.params.setSelectedTab);
    }
  }, [route.params?.setSelectedTab]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('AdminHomePage');
        return true;
      }
    );
    setFeedback('');
    setFeedbackForGuide('');
    setLoadingRecommended(false);
    setRecommendedCourses([]);
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (selectedTab === 'course') {
      fetchCourses();
    } else if (selectedTab === 'issue') {
      fetchPendingGuides();
    } else if (selectedTab === 'guide') {
      fetchApprovedGuides();
    } else if (selectedTab === 'assign') {
      fetchGuides(); // Make sure you fetch guides again when entering "assign"
      fetchCourses(); // Optional: refresh course list when switching to assign
      setSelectedGuide(null); // reset selected guide each time you enter assign tab
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedGuide) {
      fetchRecommendedCoursesForGuide(selectedGuide.guide_id);
    }
  }, [selectedGuide]);

  const fetchGuides = async () => {
    try {
      setLoadingGuides(true);
      const response = await fetch(`${API_URL}/api/users?approved=1&role=guide`);
      const data = await response.json();
      setGuidesForAssign(data); // Make sure this works with how you render guides
    } catch (error) {
      console.error('Error fetching approved guides:', error);
    } finally {
      setLoadingGuides(false);
    }
  };


  const fetchRecommendedCoursesForGuide = async (guideId) => {
    try {
      setLoadingRecommended(true);
      // Example API call, replace with your actual endpoint
      const response = await fetch(`${API_URL}/api/training_course/recommended_courses?guide_id=${guideId}`);
      const data = await response.json();
      setRecommendedCourses(data.recommendedCourses || []);
      setFeedback(data.feedback || 'No feedback available.');
    } catch (error) {
      console.error('Failed to fetch recommended courses:', error);
      setRecommendedCourses([]);
      setFeedback('');
    } finally {
      setLoadingRecommended(false);
    }
  };

  const fetchPendingGuides = async () => {
    try {
      setLoadingGuides(true);
      const response = await fetch(`${API_URL}/api/license/pending`);
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      console.error('Error fetching guide list:', error);
    } finally {
      setLoadingGuides(false);
    }
  };

  const handleAssign = async (course) => {
    await axios.post(`${API_URL}/api/training_course/assign-course`, {
      guide_id: selectedGuide.guide_id,     // the guide’s ID
      courseId: course.id
    });

    Alert.alert(
      'Course Assigned',
      `${course.courseTitle} has been assigned.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedGuide(null); // reset selection after assign
            // Optionally refresh data or navigate
          },
        },
      ]
    );
  };

  const getFeedbackDescription = (rating) => {
    const r = parseFloat(rating);
    if (r >= 4.5) return '🌟 Outstanding performance!';
    if (r >= 3.5) return '👍 Great guide with solid feedback.';
    if (r >= 2.5) return '🙂 Average, room for improvement.';
    if (r >= 1.5) return '⚠️ Needs training and support.';
    return '❌ Poor rating – consider retraining.';
  };


  // Remove the recommendedCourses dummy data entirely
  const assignCourseUI = (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {!selectedGuide ? (
        <>
          <Text style={styles.sectionTitle}>Select a Guide to Assign Course</Text>
          {guidesForAssign.length === 0 ? (
            <Text>No guides available</Text>
          ) : (
            guidesForAssign.map((guide) => (
              <TouchableOpacity
                key={guide.guide_id}
                style={styles.guideSelectButton}
                onPress={() => {
                  setSelectedGuide(guide); // Pass full guide, not just guide_id
                  setFeedbackForGuide(guide.rating);
                }}
              >
                <Text style={styles.guideSelectText}>{guide.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </>
      ) : (
        <>
          <Text style={styles.title}>Assign Recommended Course</Text>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Guide Information</Text>
            <Text style={styles.infoText}>👤 Name: {selectedGuide.name}</Text>
            <Text style={styles.infoText}>📝 Rating:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={styles.ratingStars}>
                {'★'.repeat(Math.round(feedbackForGuide)) + '☆'.repeat(5 - Math.round(feedbackForGuide))}
              </Text>
              <Text style={styles.ratingNumber}> ({feedbackForGuide}/5)</Text>
            </View>
            <Text style={styles.feedbackComment}>
              {getFeedbackDescription(feedbackForGuide)}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Available Courses</Text>
          {recommendedCourses.length === 0 ? (
            <Text>No courses available for assignment.</Text>
          ) : (
            recommendedCourses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <Text style={styles.courseTitle}>{course.courseTitle}</Text>
                <Text style={styles.courseDesc}>{course.courseDescription}</Text>
                <TouchableOpacity
                  style={styles.assignButton}
                  onPress={() => handleAssign(course)}
                >
                  <Text style={styles.assignButtonText}>🎓 Assign Course</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          <TouchableOpacity
            style={[styles.assignButton, { backgroundColor: '#aaa', marginTop: 20 }]}
            onPress={() => setSelectedGuide(null)}
          >
            <Text style={styles.assignButtonText}>← Back to Guide Selection</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  const fetchApprovedGuides = async () => {
    try {
      setLoadingGuides(true);
      const response = await fetch(`${API_URL}/api/license/approved`);
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      console.error('Error fetching guide list:', error);
    } finally {
      setLoadingGuides(false);
    }
  };

  const fetchCourses = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/training_course/courses?user_id=${route?.params?.userId}`);
    const data = await response.json();
    setCourseList(data);
  } catch (error) {
    console.error('Error fetching courses:', error);
  } finally {
    setLoading(false);
  }
};

  const addCourse = (newCourse) => {
    setCourseList((prevCourses) => [...prevCourses, newCourse]);
  };

  const renderGuide = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>👤 {item.guideName}</Text>
      <Text style={styles.text}>🏞️ Park: {item.park_name}</Text>
      <Text style={styles.text}>🆔 License Name: {item.licenseName}</Text>
      <Text style={styles.text}>📅 Expiry: {new Date(item.expiryDate).toLocaleDateString()}</Text>

      {selectedTab === 'issue' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('ILSPage', {
              guideName: item.guideName,
              park: item.park_name,
              assessmentDate: item.assessmentDate,
              assessmentStatus: item.courseStatus,
              issuanceDate: item.issuanceDate,
              licenseId: item.licenseId,
              licenseName: item.licenseName,
              guide_id: item.guide_id,
              user_id: route?.params?.userId
            })
          }
        >
          <Text style={styles.buttonText}>Issue License</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPageTitle = () => {
    if (selectedTab === 'guide') return 'List of Licensed Guides';
    if (selectedTab === 'issue') return 'Issue License Page';
    if (selectedTab === 'assign') return 'Assign Course Page';
    if (selectedTab === 'course') return 'Course List Page';
  };

  return (
    <View style={styles.container}>
      {/* Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setSelectedTab('guide')}>
          <Text style={[styles.navItem, selectedTab === 'guide' && styles.activeTab]}>
            Guide List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('issue')}>
          <Text style={[styles.navItem, selectedTab === 'issue' && styles.activeTab]}>
            Issue License
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('assign')}>
          <Text style={[styles.navItem, selectedTab === 'assign' && styles.activeTab]}>
            Assign Course
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('course')}>
          <Text style={[styles.navItem, selectedTab === 'course' && styles.activeTab]}>
            Course
          </Text>
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <Text style={styles.title}>{renderPageTitle()}</Text>

      {/* Pages Content */}
      {(selectedTab === 'guide' || selectedTab === 'issue') ? (
        loadingGuides ? (
          <View style={styles.placeholder}><Text>Loading guides...</Text></View>
        ) : (
          <FlatList
            data={guides}
            renderItem={renderGuide}
            keyExtractor={(item) => item.licenseId || item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )
      ) : selectedTab === 'assign' ? (
        // HERE, instead of rendering the FlatList directly, render assignCourseUI
        assignCourseUI
      ) : selectedTab === 'course' ? (
        <View style={{ flex: 1 }}>
          {/* Add Course Button */}
          <TouchableOpacity
            style={styles.addCourseButton}
            onPress={() => navigation.navigate('AddCoursePage', { addCourse })}
          >
            <Text style={styles.addCourseButtonText}>+ Add Course</Text>
          </TouchableOpacity>

          {/* Course List */}
          {loading ? (
            <View style={styles.placeholder}>
              <Text>Loading courses...</Text>
            </View>
          ) : (
            <FlatList
              data={courseList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.name}>📚 {item.courseTitle}</Text>
                  <Text style={styles.text}>📝 {item.courseDescription}</Text>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('CourseInfoPage', {
                        course: item,
                      })
                    }
                  >
                    <Text style={styles.buttonText}>View Course</Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}

        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text>No data to display.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6fff0',
    paddingTop: 40,
    paddingHorizontal: 20,
    width: width,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#2f855a',
    borderRadius: 10,
  },
  navItem: {
    fontSize: 14,
    color: '#e6e6e6',
    fontWeight: '500',
  },
  activeTab: {
    textDecorationLine: 'underline',
    fontWeight: '700',
    color: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 20,
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
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#0D47A1',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2f855a',
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  addCourseButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  addCourseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guideSelectButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  guideSelectText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  assignButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignButtonText: {
    color: 'white',
    fontWeight: '600',
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
  infoText: {
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },
  feedbackText: {
    fontStyle: 'italic',
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#0D47A1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A237E',
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
  ratingStars: {
    fontSize: 16,
    color: '#FFD700', // Gold color
    fontWeight: '600',
  },
  ratingNumber: {
    fontSize: 14,
    color: '#555',
  },
  feedbackComment: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
});

export default GuideListPage;
