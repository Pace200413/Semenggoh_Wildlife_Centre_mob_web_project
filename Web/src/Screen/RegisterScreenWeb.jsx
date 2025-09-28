// Enhanced RegisterScreen Web Design
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function RegisterScreenWeb() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('male');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState('visitor');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!name || !email || !phone || !password || !confirmPassword || !birthDate) {
      setError('Please fill out all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^(\d{3}-?\d{7,8})$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number (e.g., 0123456789 or 012-3456789)');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone_no: phone,
          password,
          gender,
          birth_date: birthDate,
          role,
        }),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (response.ok) {
        setSuccess('Registration successful!');
        setTimeout(() => navigate('/Screen/LoginScreen'), 1500);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Your Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input style={styles.input} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />

        <div style={styles.inlineGroup}>
          <label style={styles.label}>Gender:</label>
          {["male", "female"].map((g) => (
            <label key={g} style={styles.radioLabel}>
              <input type="radio" name="gender" value={g} checked={gender === g} onChange={() => setGender(g)} /> {g}
            </label>
          ))}
        </div>

        <label style={styles.label}>Birth Date</label>
        <input style={styles.input} type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />

        <div style={styles.inlineGroup}>
          <label style={styles.label}>Role:</label>
          {["visitor", "guide"].map((r) => (
            <label key={r} style={styles.radioLabel}>
              <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} /> {r === 'visitor' ? 'Visitor' : 'Guide (requires approval)'}
            </label>
          ))}
        </div>

        <input style={styles.input} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={styles.input} placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input style={styles.input} placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <button style={styles.button} onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#F0FFF4',
    minHeight: '100vh'
  },
  card: {
    maxWidth: 500,
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#22543d',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    width: '90%',
    padding: 14,
    marginBottom: 16,
    borderRadius: 10,
    border: '1px solid #CBD5E0',
    backgroundColor: '#f7fafc',
    fontSize: 16,
  },
  label: {
    fontWeight: '600',
    color: '#22543d',
    marginBottom: 6,
    display: 'block',
  },
  inlineGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
    gap: 20,
  },
  radioLabel: {
    fontSize: 15,
    color: '#2D3748',
  },
  button: {
    width: '96%',
    padding: 14,
    backgroundColor: '#2f855a',
    color: '#fff',
    borderRadius: 10,
    fontSize: 18,
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    marginTop: 10
  },
  error: {
    color: '#E53E3E',
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  success: {
    color: '#38A169',
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center'
  }
};
