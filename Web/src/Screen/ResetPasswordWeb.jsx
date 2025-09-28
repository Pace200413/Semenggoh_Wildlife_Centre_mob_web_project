// Converted ResetPasswordScreen.js to ReactJS Web
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

export default function ResetPasswordWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email: initialEmail } = location.state || {};

  const [email, setEmail] = useState(initialEmail || '');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!email || !token || !newPassword) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (res.ok) {
        setSuccess(data.message || 'Password reset successfully.');
        setTimeout(() => navigate('/Screen/LoginScreen', { state: { email } }), 1500);
      } else {
        setError(data.message || 'Reset failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>Reset your password</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="6-digit reset code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleResetPassword}>Reset Password</button>

        <button
          style={styles.linkButton}
          onClick={() => navigate('/Screen/ForgotPasswordWeb', { state: { email } })}
        >
          Need a new code?
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: '#ECF9F0',
    minHeight: '100vh',
  },
  card: {
    maxWidth: 500,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  logo: {
    width: 100,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#22543d',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    padding: 12,
    marginBottom: 14,
    borderRadius: 8,
    border: '1px solid #38a169',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#2f855a',
    color: '#fff',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    marginTop: 6,
  },
  linkButton: {
    marginTop: 14,
    background: 'none',
    border: 'none',
    color: '#2b6cb0',
    fontSize: 14,
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    marginBottom: 10,
  },
};
