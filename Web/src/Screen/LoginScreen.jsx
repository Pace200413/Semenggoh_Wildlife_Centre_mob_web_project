import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useLocation } from 'react-router-dom';

export default function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
  const handlePopState = () => {
    navigate('/Screen/HomePageScreenWeb');
  };

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/jwt-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Raw server response:', text);
        throw new Error('Server returned invalid JSON');
      }

      if (response.ok) {
        const { user } = data;

        if (user.role === 'visitor') {
          navigate('/Guest', { state: { userId: user.id, role: user.role } });
        } else if (user.role === 'guide') {
          if (user.approved) {
            navigate('/Guide', { state: { userId: user.id, role: user.role } });
          } else {
            alert('Your guide registration is still pending approval.');
          }
        } else if (user.role === 'admin') {
          navigate('/Admin', { state: { userId: user.id, role: user.role } });
        } else {
          navigate('/Home');
        }
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.scrollContainer}>
      <div style={styles.formCard}>
        <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>Welcome to Park Guide System</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.loginButton} onClick={onLogin}>
          LOGIN
        </button>
        <p
          style={styles.forgotText}
          onClick={() => navigate('/Screen/ResetPasswordWeb', { state: { email } })}
        >
          Forgot Password?
        </p>
        <p style={styles.registerText}>
          Don&apos;t have an account?{' '}
          <span style={{ color: '#2f855a', cursor: 'pointer' }} onClick={() => navigate('/Screen/RegisterScreenWeb')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  scrollContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF9F0',
    padding: '50px 20px',
  },
  formCard: {
    maxWidth: '500px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  logo: {
    width: '120px',
    height: 150,
    marginBottom: '20px',
  },
  title: {
    fontSize: '22px',
    color: '#276749',
    fontWeight: '700',
    marginBottom: '20px',
  },
  input: {
    width: '90%',
    border: '1px solid #38a169',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    fontSize: '16px',
  },
  loginButton: {
    backgroundColor: '#2f855a',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '16px',
    width: '100%',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
  },
  forgotText: {
    color: '#2b6cb0',
    marginTop: '10px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  registerText: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#4A5568',
  },
};
