// Converted CourseInfoPage for ReactJS (preserved design)
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CourseInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { course = {} } = location.state || {};

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

  const handleEditCourse = () => {
    navigate('/Admin/EditCoursePage', { state: { course } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{courseTitle}</h2>

        <h3 style={styles.subtitle}>📚 Course Overview</h3>
        <p style={styles.description}>{courseDescription}</p>

        <div style={styles.detailsContainer}>
          <DetailRow label="⏳ Duration:" value={duration} />
          <DetailRow label="🎯 Skill Level:" value={skillLevel} />
          <DetailRow label="💰 Price:" value={`$${price}`} />
          <DetailRow label="📅 Schedule:" value={schedule.join(', ')} />
          <DetailRow label="👥 Capacity:" value={capacity} />
          <DetailRow label="👨‍🏫 Lecturer:" value={lecturer} />
          <DetailRow label="🎓 Required For:" value={requiredFor} />
          <DetailRow label="🏆 Learning Outcome:" value={learningOutcome} />
        </div>

        {assessments.length > 0 && (
          <>
            <h3 style={styles.sectionTitle}>📝 Assessments</h3>
            {assessments.map((a, index) => (
              <div key={index} style={styles.assessmentBlock}>
                <p style={styles.assessmentQuestion}>
                  {index + 1}. {a.question}
                </p>
                {a.options.map((opt, i) => (
                  <p
                    key={i}
                    style={{
                      ...styles.assessmentOption,
                      ...(a.correctIndex === i ? styles.correctAnswer : {})
                    }}
                  >
                    - {opt}
                  </p>
                ))}
              </div>
            ))}
          </>
        )}

        <button onClick={handleEditCourse} style={styles.editButton}>Edit Course</button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{value}</span>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e6fff0',
    padding: 20,
    minHeight: '100vh',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    width: 180,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
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
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginTop: 20,
  },
};
