import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdChevronRight } from 'react-icons/md';

export default function SPScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Example logout logic (clear local storage or session)
    localStorage.clear();
    navigate('/Screen/LoginScreen'); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      <div style={styles.optionItem} onClick={handleLogout}>
        <MdLogout size={24} color="#d9534f" />
        <span style={{ ...styles.optionText, color: '#d9534f' }}>Logout</span>
        <MdChevronRight size={24} color="#ccc" />
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
  },
  optionText: {
    flex: 1,
    marginLeft: '15px',
    fontSize: '16px',
  },
};
