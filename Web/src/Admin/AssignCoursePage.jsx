// Converted AssignCoursePage for ReactJS (Web version with preserved design)
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AssignCoursePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { guideName, feedback } = location.state || {};

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
    alert(`${course.title} has been assigned to ${guideName}.`);
    navigate('/GuideList', { state: { setSelectedTab: 'training' } });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Assign Recommended Course</h2>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Guide Information</h3>
        <p style={styles.infoText}>👤 Name: {guideName}</p>
        <p style={styles.infoText}>📝 Feedback Summary:</p>
        <p style={styles.feedbackText}>{feedback}</p>
      </div>

      <h3 style={styles.sectionTitle}>AI Recommended Courses</h3>
      {recommendedCourses.map((course) => (
        <div key={course.id} style={styles.courseCard}>
          <p style={styles.courseTitle}>{course.title}</p>
          <p style={styles.courseDesc}>{course.description}</p>
          <button onClick={() => handleAssign(course)} style={styles.assignButton}>
            🎓 Assign Course
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f2f8ff',
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
    marginTop: 15,
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
    margin: '8px 0',
    color: '#333',
  },
  assignButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 6,
    border: 'none',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
