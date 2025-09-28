// Converted to ReactJS (preserving original design)
import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';

export default function GuideListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSelectedTab: initialTab = 'guide', userId } = location.state || {};
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState([]);
  const [guidesForAssign, setGuidesForAssign] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [feedbackForGuide, setFeedbackForGuide] = useState('');
  const [feedback, setFeedback] = useState('');
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    if (selectedTab === 'course') fetchCourses();
    else if (selectedTab === 'issue') fetchPendingGuides();
    else if (selectedTab === 'guide') fetchApprovedGuides();
    else if (selectedTab === 'assign') {
      fetchGuides();
      fetchCourses();
      setSelectedGuide(null);
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedGuide) fetchRecommendedCoursesForGuide(selectedGuide.guide_id);
  }, [selectedGuide]);

  const fetchGuides = async () => {
    try {
      setLoadingGuides(true);
      const response = await fetch(`${API_URL}/api/users?approved=1&role=guide`);
      const data = await response.json();
      setGuidesForAssign(data);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoadingGuides(false);
    }
  };

  const fetchRecommendedCoursesForGuide = async (guideId) => {
    try {
      const response = await fetch(`${API_URL}/api/training_course/recommended_courses?guide_id=${guideId}`);
      const data = await response.json();
      setRecommendedCourses(data.recommendedCourses || []);
      setFeedback(data.feedback || 'No feedback available.');
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendedCourses([]);
      setFeedback('');
    }
  };

  const fetchPendingGuides = async () => {
    try {
      const response = await fetch(`${API_URL}/api/license/pending`);
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      console.error('Error fetching pending guides:', error);
    } finally {
      setLoadingGuides(false);
    }
  };

  const fetchApprovedGuides = async () => {
    try {
      const response = await fetch(`${API_URL}/api/license/approved`);
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      console.error('Error fetching approved guides:', error);
    } finally {
      setLoadingGuides(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/training_course/courses?user_id=${userId}`);
      const data = await response.json();
      setCourseList(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (course) => {
    await axios.post(`${API_URL}/api/training_course/assign-course`, {
      guide_id: selectedGuide.guide_id,
      courseId: course.id
    });
    alert(`${course.courseTitle} has been assigned.`);
    setSelectedGuide(null);
  };

  const getFeedbackDescription = (rating) => {
    const r = parseFloat(rating);
    if (r >= 4.5) return '🌟 Outstanding performance!';
    if (r >= 3.5) return '👍 Great guide with solid feedback.';
    if (r >= 2.5) return '🙂 Average, room for improvement.';
    if (r >= 1.5) return '⚠️ Needs training and support.';
    return '❌ Poor rating – consider retraining.';
  };

  const renderGuideCard = (guide) => (
    <div style={styles.card} key={guide.id}>
      <p style={styles.name}>👤 {guide.guideName}</p>
      <p style={styles.text}>🏞️ Park: {guide.park_name}</p>
      <p style={styles.text}>🆔 License: {guide.licenseName}</p>
      {selectedTab === 'issue' && (
        <button style={styles.button} onClick={() =>
            navigate('/Admin/ILSPage', {
            state: {
              guideName: guide.guideName,
              park: guide.park_name,
              assessmentDate: guide.assessmentDate,
              assessmentStatus: guide.courseStatus,
              issuanceDate: guide.issuanceDate,
              licenseId: guide.licenseId,
              licenseName: guide.licenseName,
              guide_id: guide.guide_id,
              user_id: userId
            }
          })}>Issue License</button>
      )}
    </div>
  );

  const renderAssignView = () => (
    <div>
      {!selectedGuide ? (
        <>
          <p style={styles.sectionTitle}>Select a Guide to Assign Course</p>
          {guidesForAssign.map((guide) => (
            <div style={styles.card} key={guide.guide_id}>
              <p style={styles.name}>👤 {guide.name}</p>
              <button
                style={styles.button}
                onClick={() => {
                  setSelectedGuide(guide);
                  setFeedbackForGuide(guide.rating);
                }}
              >
                Select Guide
              </button>
            </div>
          ))}

        </>
      ) : (
        <>
          <p style={styles.title}>Assign Recommended Course</p>
          <div style={styles.card}>
            <p style={styles.sectionTitle}>Guide Info</p>
            <p style={styles.infoText}>👤 Name: {selectedGuide.name}</p>
            <p style={styles.infoText}>📝 Rating:</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={styles.ratingStars}>{'★'.repeat(Math.round(feedbackForGuide)) + '☆'.repeat(5 - Math.round(feedbackForGuide))}</span>
              <span style={styles.ratingNumber}> ({feedbackForGuide}/5)</span>
            </div>
            <p style={styles.feedbackComment}>{getFeedbackDescription(feedbackForGuide)}</p>
          </div>
          <p style={styles.sectionTitle}>Available Courses</p>
          {recommendedCourses.map(course => (
            <div key={course.id} style={styles.courseCard}>
              <p style={styles.courseTitle}>{course.courseTitle}</p>
              <p style={styles.courseDesc}>{course.courseDescription}</p>
              <button style={styles.assignButton} onClick={() => handleAssign(course)}>🎓 Assign Course</button>
            </div>
          ))}
          <button style={{ ...styles.assignButton, backgroundColor: '#aaa' }} onClick={() => setSelectedGuide(null)}>← Back</button>
        </>
      )}
    </div>
  );

  const renderCourses = () => (
    <div>
      <button style={styles.addCourseButton} onClick={() =>
            navigate('/Admin/AddCoursePage')}>+ Add Course</button>
      {courseList.map((course, index) => (
        <div key={course.id} style={styles.card}>
          <p style={styles.name}>📚 {course.courseTitle}</p>
          <p style={styles.text}>📝 {course.courseDescription}</p>
          <button style={{
            backgroundColor: '#00897B',
            color: '#fff',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}
          onClick={() =>
            navigate('/Admin/CourseInfoPage', {
              state: { course: course, userId: userId, role: 'admin' },
            })
          }
         >View Course</button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.navBar}>
        {['guide', 'issue', 'assign', 'course'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{ ...styles.navItem, ...(selectedTab === tab ? styles.activeTab : {}) }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <h2 style={styles.title}>{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Page</h2>
      <div>
        {selectedTab === 'guide' || selectedTab === 'issue'
          ? (loadingGuides ? <p>Loading guides...</p> : guides.map(renderGuideCard))
          : selectedTab === 'assign'
          ? renderAssignView()
          : renderCourses()
        }
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#e6fff0', padding: 20, minHeight: '100vh' },
  navBar: { display: 'flex', justifyContent: 'space-around', marginBottom: 15, backgroundColor: '#2f855a', padding: 10, borderRadius: 10 },
  navItem: { color: '#e6e6e6', fontSize: 14, fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' },
  activeTab: { color: '#fff', textDecoration: 'underline', fontWeight: '700' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A237E', textAlign: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', margin: '10px 0', color: '#0D47A1' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 15, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#0D47A1' },
  text: { fontSize: 14, marginBottom: 4, color: '#333' },
  infoText: { fontSize: 15, marginBottom: 6, color: '#333' },
  ratingStars: { fontSize: 16, color: '#FFD700', fontWeight: '600' },
  ratingNumber: { fontSize: 14, color: '#555' },
  feedbackComment: { fontSize: 14, color: '#333', fontStyle: 'italic' },
  guideSelectButton: { backgroundColor: '#4caf50', padding: 12, margin: '6px 0', borderRadius: 8, color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer' },
  assignButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: 10 },
  courseCard: { backgroundColor: '#e3f2fd', borderRadius: 10, padding: 16, marginBottom: 15 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#0D47A1' },
  courseDesc: { fontSize: 14, margin: '8px 0', color: '#333' },
  addCourseButton: { backgroundColor: '#2E7D32', color: 'white', padding: '10px 20px', borderRadius: 8, marginBottom: 20, border: 'none', cursor: 'pointer' },
  button: { backgroundColor: '#2f855a', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', marginTop: 10 },
};
