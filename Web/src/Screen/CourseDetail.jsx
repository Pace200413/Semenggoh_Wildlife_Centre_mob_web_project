import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function CourseDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course, userId, role } = location.state || {};
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [resultMessage, setResultMessage] = useState('');
  const [eligibleLicenses, setEligibleLicenses] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [nationalParks, setNationalParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);

  if (!course) return <p style={{ padding: '20px' }}>❌ No course data available.</p>;

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const saveCourseHistory = async (courseId, courseTitle, result, certificate) => {
    await fetch(`${API_URL}/api/training_course/course-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId, courseTitle, result, certificate }),
    });
  };

  const checkEligibleLicenses = async () => {
    const res = await fetch(`${API_URL}/api/license/promptable/${userId}`);
    const data = await res.json();
    setEligibleLicenses(data);
    setShowPrompt(data.length > 0);
  };

  const fetchNationalParks = async () => {
    const res = await fetch(`${API_URL}/api/license/national_park`);
    const data = await res.json();
    setNationalParks(data);
  };

  const handleSubmitAnswers = async () => {
    const total = course.assessments.length;
    let correct = 0;

    course.assessments.forEach((a, i) => {
      if (selectedAnswers[i] === a.correctIndex) correct++;
    });

    const passed = correct >= Math.ceil(total / 2);

    if (passed) {
      setResultMessage('🎉 You passed and received a certificate!');
      await fetch(`${API_URL}/api/training_course/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, courseId: course.id, status: 'completed' }),
      });
      await saveCourseHistory(course.id, course.courseTitle, 'Passed', `Certificate for ${course.courseTitle}`);
      await checkEligibleLicenses();
      await fetchNationalParks();
    } else {
      setResultMessage('❌ You did not pass. Please try again.');
      await saveCourseHistory(course.id, course.courseTitle, 'Failed', null);
    }
  };

  const handleRequestLicense = (licenseId) => {
    if (!selectedPark) return alert('Please select a national park.');
    if (window.confirm('Requesting this license requires a $20 payment. Proceed?')) {
      requestLicense(licenseId);
    }
  };

  const requestLicense = async (licenseId) => {
    const res = await fetch(`${API_URL}/api/license/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guide_id: userId, licenseId, park_id: selectedPark }),
    });
    const data = await res.json();
    alert(data.message);
    if (res.ok) navigate('/CertificateView', { state: { userId, role } });
  };

  return (
    <div className="course-container">
      <style>{`
        .course-container {
          font-family: 'Segoe UI', sans-serif;
          padding: 30px;
          max-width: 100%;
          margin: auto;
          background: #e6fff0;
        }
        .card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }
        h2, h3 {
          color: #2e7d32;
        }
        .meta p {
          margin: 4px 0;
        }
        .outcomes {
          margin-top: 16px;
        }
        .assessment {
          margin-top: 32px;
        }
        .question {
          margin-bottom: 20px;
        }
        .option {
          background: #f1f1f1;
          margin: 6px 0;
          padding: 10px 14px;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid #ccc;
        }
        .option.selected {
          background: #d0f0c0;
          border-color: #4caf50;
        }
        .btn {
          background: #2e7d32;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: bold;
          margin-top: 20px;
          cursor: pointer;
        }
        .btn:hover {
          background: #1b5e20;
        }
        .result-message {
          margin-top: 16px;
          font-weight: bold;
          color: #333;
        }
        .license-box {
          padding: 20px;
          background: #e8f5e9;
          border-left: 5px solid #66bb6a;
          border-radius: 10px;
          margin-top: 30px;
        }
        .license-box button {
          margin-top: 10px;
        }
        select {
          padding: 8px;
          margin-top: 10px;
          width: 100%;
          border-radius: 6px;
        }
      `}</style>

      <div className="card">
        <h2>{course.courseTitle}</h2>
        <p>{course.courseDescription}</p>

        <div className="meta">
          <p><strong>Duration:</strong> {course.duration}</p>
          <p><strong>Price:</strong> ${course.price}</p>
          <p><strong>Lecturer:</strong> {course.lecturer}</p>
          <p><strong>Schedule:</strong> {course.schedule?.join(', ')}</p>
          <p><strong>Skill Level:</strong> {course.skillLevel}</p>
          <p><strong>Required For:</strong> {course.requiredFor}</p>
          <p><strong>Capacity:</strong> {course.capacity}</p>
        </div>

        <div className="outcomes">
          <h3>What You'll Learn</h3>
          <ul>
            {course.learningOutcome?.split('\n').map((item, idx) => (
              <li key={idx}>{item.trim()}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card assessment">
        <h3>Assessment</h3>
        {Array.isArray(course.assessments) && course.assessments.length > 0 ? (
          course.assessments.map((a, i) => (
            <div className="question" key={i}>
              <strong>{i + 1}. {a.question}</strong>
              {a.options.map((opt, j) => (
                <div
                  key={j}
                  className={`option ${selectedAnswers[i] === j ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(i, j)}
                >
                  {opt}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No assessments available.</p>
        )}

        <button className="btn" onClick={handleSubmitAnswers}>Submit Answers</button>
        {resultMessage && <p className="result-message">{resultMessage}</p>}
      </div>

      {showPrompt && eligibleLicenses.length > 0 && (
        <div className="card license-box">
          <h3>You are eligible for:</h3>
          {eligibleLicenses.map((license, idx) => (
            <button className="btn" key={idx} onClick={() => handleRequestLicense(license.licenseId)}>
              Request {license.licenseName} License
            </button>
          ))}
          {nationalParks.length > 0 && (
            <>
              <label>Select National Park:</label>
              <select onChange={(e) => setSelectedPark(e.target.value)} value={selectedPark}>
                <option value="">-- Select Park --</option>
                {nationalParks.map((park, idx) => (
                  <option key={idx} value={park.park_id}>{park.park_name}</option>
                ))}
              </select>
            </>
          )}
        </div>
      )}
    </div>
  );
}
