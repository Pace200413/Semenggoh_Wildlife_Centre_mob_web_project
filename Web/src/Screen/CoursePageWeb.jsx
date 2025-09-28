// Converted TakeCourse.js to ReactJS Web with inline CSS
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function CoursePageWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, role } = location.state || {};
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/training_course/courses?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
  }, [userId]);

  const enrollInCourse = (course) => {
    if (!window.confirm(`Enroll in course: ${course.courseTitle}?`)) return;

    fetch(`${API_URL}/api/training_course/update-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, courseId: course.id, status: 'enrolled' }),
    })
      .then(res => res.json())
      .then(() => {
        alert('Successfully enrolled.');
        setCourses(prev => prev.map(c => c.id === course.id ? { ...c, status: 'enrolled' } : c));
      })
      .catch(err => {
        console.error('Enrollment error:', err);
        alert('Enrollment failed.');
      });
  };

  const renderCourseCard = (course, type) => (
    <div
      key={course.id}
      style={{
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        borderLeft: `6px solid ${type === 'enrolled' ? '#3498db' : type === 'upcoming' ? '#27ae60' : '#95a5a6'}`,
        transition: 'transform 0.2s ease'
      }}
      onClick={() => {
        if (type === 'upcoming') enrollInCourse(course);
        else if (type === 'enrolled') navigate('/CourseDetail', { state: { course, userId, role } });
      }}
    >
      <h4 style={{ margin: 0, marginBottom: 6, color: '#34495e' }}>{course.courseTitle}</h4>
      <p style={{ margin: 0, marginBottom: 10, color: '#555' }}>{course.courseDescription}</p>
      {type !== 'completed' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888' }}>
          <span>🕒 {course.duration}</span>
          <span>➔</span>
        </div>
      )}
    </div>
  );

  const enrolledCourses = courses.filter(c => c.status === 'enrolled');
  const upcomingCourses = courses.filter(c => c.status === 'upcoming');
  const completedCourses = courses.filter(c => c.status === 'completed');

  return (
    <div style={{ padding: 30, fontFamily: 'Segoe UI, sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20, color: '#2c3e50' }}>📘 Courses</h2>
      {loading ? <p style={{ color: '#999', textAlign: 'center' }}>Loading...</p> : (
        <>
          <section style={{ marginBottom: 30 }}>
            <h3>Enrolled Courses</h3>
            {enrolledCourses.length === 0 ? (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>You haven't enrolled in any courses yet.</p>
            ) : (
              enrolledCourses.map(c => renderCourseCard(c, 'enrolled'))
            )}
          </section>

          <section style={{ marginBottom: 30 }}>
            <h3>Upcoming Courses</h3>
            {upcomingCourses.length === 0 ? (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>No upcoming courses available.</p>
            ) : (
              upcomingCourses.map(c => renderCourseCard(c, 'upcoming'))
            )}
          </section>

          <section>
            <h3>Completed Courses</h3>
            {completedCourses.length === 0 ? (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>You haven't completed any courses yet.</p>
            ) : (
              completedCourses.map(c => renderCourseCard(c, 'completed'))
            )}
          </section>
        </>
      )}

    </div>
  );
}

const navBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: 16,
  color: '#34495e',
  cursor: 'pointer'
};
