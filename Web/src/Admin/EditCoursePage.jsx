// Converted EditCoursePage for ReactJS (preserving original design)
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

export default function EditCoursePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { course } = location.state || {};

  const [courseTitle, setCourseTitle] = useState(course?.courseTitle || '');
  const [courseDescription, setCourseDescription] = useState(course?.courseDescription || '');
  const [duration, setDuration] = useState(course?.duration || '');
  const [price, setPrice] = useState(course?.price || '');
  const [scheduleInput, setScheduleInput] = useState((course?.schedule || []).join(', '));
  const [skillLevel, setSkillLevel] = useState(course?.skillLevel || '');
  const [requiredFor, setRequiredFor] = useState(course?.requiredFor || '');
  const [capacity, setCapacity] = useState(course?.capacity?.toString() || '');
  const [lecturer, setLecturer] = useState(course?.lecturer || '');
  const [learningOutcome, setLearningOutcome] = useState(course?.learningOutcome || '');
  const [assessments, setAssessments] = useState(course?.assessments || [
    { question: '', options: ['', ''], correctIndex: null }
  ]);

  const handleSave = async () => {
    const updatedCourse = {
      id: course?.id,
      courseTitle,
      courseDescription,
      duration,
      price,
      schedule: scheduleInput.split(',').map(s => s.trim()),
      skillLevel,
      requiredFor,
      capacity: Number(capacity),
      lecturer,
      learningOutcome,
      assessments,
    };

    try {
      const response = await fetch(`${API_URL}/api/training_course/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse),
      });
      const data = await response.json();

      if (response.ok) {
        alert('Course updated successfully!');
        navigate('/Admin/CourseInfoPage', { state: { course: updatedCourse } });
      } else {
        alert(`Error updating course: ${data.message}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating the course.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>✏️ Edit Course</h2>

      <input
        style={styles.input}
        placeholder="Course Title"
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
      />

      <textarea
        style={{ ...styles.input, height: 100 }}
        placeholder="Course Description"
        value={courseDescription}
        onChange={(e) => setCourseDescription(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Duration (e.g., 4 weeks)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label style={styles.label}>Skill Level:</label>
      <select style={styles.select} value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
        <option value="">Select Skill Level...</option>
        <option value="Junior Guide">Junior Guide</option>
        <option value="Senior">Senior</option>
        <option value="Master">Master</option>
      </select>

      <label style={styles.label}>Required For (License Type):</label>
      <select style={styles.select} value={requiredFor} onChange={(e) => setRequiredFor(e.target.value)}>
        <option value="">Select required license...</option>
        <option value="Junior Guide">Junior Guide</option>
        <option value="Senior Guide">Senior Guide</option>
        <option value="Master">Master</option>
      </select>

      <input
        placeholder="Lecturer Name"
        value={lecturer}
        onChange={(e) => setLecturer(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Learning Outcome:</label>
      <select style={styles.select} value={learningOutcome} onChange={(e) => setLearningOutcome(e.target.value)}>
        <option value="">Select an outcome...</option>
        <option value="Understand basics">Understand basics</option>
        <option value="Apply knowledge">Apply knowledge</option>
        <option value="Problem-solving">Problem-solving</option>
        <option value="Certification ready">Certification ready</option>
      </select>

      <input
        style={styles.input}
        placeholder="Schedule (comma-separated)"
        value={scheduleInput}
        onChange={(e) => setScheduleInput(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Capacity"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />

      <label style={styles.label}>Assessments:</label>
      {assessments.map((q, i) => (
        <div key={i} style={styles.assessmentContainer}>
          <input
            placeholder={`Question ${i + 1}`}
            value={q.question}
            onChange={(e) => {
              const text = e.target.value;
              setAssessments(prev =>
                prev.map((a, idx) => idx === i ? { ...a, question: text } : a)
              );
            }}
            style={styles.input}
          />

          {q.options.map((opt, j) => (
            <input
              key={j}
              placeholder={`Option ${j + 1}`}
              value={opt}
              onChange={(e) => {
                const text = e.target.value;
                setAssessments(prev =>
                  prev.map((a, idx) =>
                    idx === i
                      ? { ...a, options: a.options.map((o, jdx) => jdx === j ? text : o) }
                      : a
                  )
                );
              }}
              style={styles.input}
            />
          ))}

          <button
            onClick={() => {
              if (assessments[i].options.length >= 6) {
                alert('Max 6 options');
                return;
              }
              setAssessments(prev =>
                prev.map((a, idx) =>
                  idx === i ? { ...a, options: [...a.options, ''] } : a
                )
              );
            }}
            style={styles.addOptionButton}
          >➕ Add Option</button>

          <label style={styles.label}>Correct Answer:</label>
          <select
            style={styles.select}
            value={q.correctIndex !== null && q.correctIndex !== undefined ? String(q.correctIndex) : ''}
            onChange={(e) => {
              const val = e.target.value;
              setAssessments(prev =>
                prev.map((a, idx) =>
                  idx === i ? { ...a, correctIndex: val === '' ? null : parseInt(val) } : a
                )
              );
            }}
          >
            <option value="">Select correct option...</option>
            {q.options.map((opt, idx) => (
              <option key={idx} value={String(idx)}>{opt || `Option ${idx + 1}`}</option>
            ))}
          </select>
        </div>
      ))}

      <button
        style={styles.addOptionButton}
        onClick={() =>
          setAssessments([...assessments, { question: '', options: ['', ''], correctIndex: null }])
        }
      >➕ Add Another Question</button>

      <button style={styles.saveButton} onClick={handleSave}>💾 Save Changes</button>
      <button style={styles.cancelButton} onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
}

const styles = {
  container: { padding: 20, backgroundColor: '#e6fff0' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1A237E', marginBottom: 20 },
  input: {
    borderColor: '#ccc', borderWidth: '1px', borderRadius: 8,
    padding: 12, marginBottom: 12, backgroundColor: '#fff', width: '100%', boxSizing: 'border-box'
  },
  label: { fontWeight: '600', marginTop: 10, marginBottom: 5, color: '#333' },
  select: {
    backgroundColor: '#fafafa',
    borderWidth: '1px',
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    width: '100%',
    boxSizing: 'border-box'
  },
  addOptionButton: {
    backgroundColor: '#00796B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    color: 'white',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer'
  },
  saveButton: {
    backgroundColor: '#2E7D32', padding: 15,
    borderRadius: 8, marginBottom: 10,
    color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer'
  },
  cancelButton: {
    backgroundColor: '#DC3545', padding: 15,
    borderRadius: 8,
    color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer'
  },
  assessmentContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: '1px',
    borderColor: '#ddd',
  },
};
