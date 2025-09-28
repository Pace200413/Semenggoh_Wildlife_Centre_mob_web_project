// Converted ForgotPasswordScreen.js to ReactJS Web
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

export default function ForgotPasswordWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedEmail = location?.state?.email || '';

  const [email, setEmail] = useState(passedEmail);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEmail(passedEmail);
  }, [passedEmail]);

  const handleRequestReset = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMessage(data.message);
      setError(null);
    } catch (err) {
      setMessage(null);
      setError('Could not send reset link');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />

        <h2 style={styles.title}>Forgot your password?</h2>
        <p style={styles.subtitle}>
          Enter your registered email and we'll send you a 6‑digit reset code.
        </p>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button style={styles.primaryButton} onClick={handleRequestReset}>
          Send Reset Code
        </button>

        <button
          style={styles.linkButton}
          onClick={() => navigate('/Screen/xResetPasswordWeb', { state: { email } })}
        >
          I already have a code
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ECF9F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#22543d',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 20
  },
  input: {
    width: '100%',
    padding: 12,
    border: '1px solid #38a169',
    borderRadius: 8,
    marginBottom: 18,
    fontSize: 16
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#2f855a',
    color: '#fff',
    padding: '14px 0',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer'
  },
  linkButton: {
    marginTop: 14,
    background: 'none',
    border: 'none',
    color: '#2b6cb0',
    fontSize: 14,
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  success: {
    color: '#38a169',
    marginBottom: 12,
    fontWeight: 600
  },
  error: {
    color: '#e53e3e',
    marginBottom: 12,
    fontWeight: 600
  }
};