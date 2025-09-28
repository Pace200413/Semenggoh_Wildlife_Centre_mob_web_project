import React, { useState } from 'react';
import { API_URL } from '../config';

export default function AddCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [requiredFor, setRequiredFor] = useState('');
  const [price, setPrice] = useState('');
  const [learningOutcome, setLearningOutcome] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [scheduleInput, setScheduleInput] = useState('');
  const [capacity, setCapacity] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', ''], correctIndex: null }]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !lecturer.trim() || !skillLevel.trim()) {
      alert('Please fill in all required fields!');
      return;
    }

    const newCourse = {
      id: Date.now().toString(),
      courseTitle: title,
      courseDescription: description,
      duration,
      price,
      schedule: scheduleInput.split(',').map(s => s.trim()),
      skillLevel,
      requiredFor,
      capacity: Number(capacity),
      lecturer,
      learningOutcome,
      assessments: questions
    };

    try {
      const response = await fetch(`${API_URL}/api/training_course/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Course saved successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('An error occurred while saving the course!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>➕ Add New Course</h2>
        <input placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
        <textarea placeholder="Course Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...styles.input, height: '100px' }} />
        <input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} style={styles.input} />
        <label>Skill Level:</label>
        <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} style={styles.select}>
          <option value="">Select Skill Level...</option>
          <option value="Junior Guide">Junior Guide</option>
          <option value="Senior">Senior</option>
          <option value="Master">Master</option>
        </select>

        <label>Required For (License Type):</label>
        <select value={requiredFor} onChange={(e) => setRequiredFor(e.target.value)} style={styles.select}>
          <option value="">Select required license...</option>
          <option value="Junior Guide">Junior Guide</option>
          <option value="Senior Guide">Senior Guide</option>
          <option value="Master">Master</option>
        </select>

        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} style={styles.input} type="number" />
        <input placeholder="Lecturer Name" value={lecturer} onChange={(e) => setLecturer(e.target.value)} style={styles.input} />

        <label>Learning Outcome:</label>
        <select value={learningOutcome} onChange={(e) => setLearningOutcome(e.target.value)} style={styles.select}>
          <option value="">Select an outcome...</option>
          <option value="Understand basics">Understand basics</option>
          <option value="Apply knowledge">Apply knowledge in projects</option>
          <option value="Problem-solving">Develop problem-solving skills</option>
          <option value="Certification ready">Prepare for certification</option>
        </select>

        <label>Schedule (Comma Separated):</label>
        <input placeholder="e.g. Mon-Wed-Fri, 9am-12pm" value={scheduleInput} onChange={(e) => setScheduleInput(e.target.value)} style={styles.input} />
        <input placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} style={styles.input} type="number" />

        <h4>Assessments:</h4>
        {questions.map((q, qIndex) => (
          <div key={qIndex} style={{ marginBottom: '15px' }}>
            <input placeholder={`Question ${qIndex + 1}`} value={q.question} onChange={(e) => {
              const updated = [...questions];
              updated[qIndex].question = e.target.value;
              setQuestions(updated);
            }} style={styles.input} />

            {q.options.map((opt, oIndex) => (
              <input
                key={oIndex}
                placeholder={`Option ${oIndex + 1}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIndex].options[oIndex] = e.target.value;
                  setQuestions(updated);
                }}
                style={styles.input}
              />
            ))}

            <button onClick={() => {
              const updated = [...questions];
              if (updated[qIndex].options.length < 6) {
                updated[qIndex].options.push('');
                setQuestions(updated);
              } else {
                alert('Max 6 options');
              }
            }} style={styles.button}>➕ Add Option</button>

            <br></br><label>Correct Answer:</label>
            <select value={q.correctIndex !== null ? String(q.correctIndex) : ''} onChange={(e) => {
              const val = e.target.value;
              setQuestions(prev =>
                prev.map((a, idx) =>
                  idx === qIndex ? { ...a, correctIndex: val === '' ? null : parseInt(val) } : a
                )
              );
            }} style={styles.select}>
              <option value="">Select correct option...</option>
              {q.options.map((opt, idx) => (
                <option value={String(idx)} key={idx}>{opt || `Option ${idx + 1}`}</option>
              ))}
            </select>
          </div>
        ))}

        <button onClick={() => {
          setQuestions([...questions, { question: '', options: ['', ''], correctIndex: null }]);
        }} style={styles.button}>➕ Add Another Question</button>

        <button onClick={handleSave} style={styles.saveButton}>Save Course</button>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#e6fff0', padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, width: '90%', maxWidth: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20, color: '#1A237E' },
  input: { width: '100%', padding: 10, marginBottom: 15, border: '1px solid #ccc', borderRadius: 8, backgroundColor: '#fafafa' },
  select: { width: '100%', padding: 10, marginBottom: 15, border: '1px solid #ccc', borderRadius: 8, backgroundColor: '#fafafa' },
  saveButton: { backgroundColor: '#2E7D32', color: 'white', padding: 12, borderRadius: 8, border: 'none', fontWeight: '700', fontSize: 16, cursor: 'pointer', width: '100%', marginTop: 20 },
  button: { backgroundColor: '#00796B', color: 'white', padding: 10, borderRadius: 8, border: 'none', fontWeight: '600', cursor: 'pointer', marginBottom: 10 },
};
