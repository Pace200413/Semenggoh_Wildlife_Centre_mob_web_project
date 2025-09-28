import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdQuestionAnswer, MdEmail, MdBugReport, MdPolicy, MdChevronRight } from 'react-icons/md';

export default function Help() {
  const navigate = useNavigate();

  const openEmail = () => {
    window.location.href = 'mailto:support@yourapp.com?subject=App Support';
  };

  const reportProblem = () => {
    const confirm = window.confirm('You can describe the issue via email.\n\nPress OK to email us.');
    if (confirm) {
      openEmail();
    }
  };

  const openPrivacyPolicy = () => {
    window.open('https://yourapp.com/privacy-policy', '_blank');
  };

  return (
    <div style={styles.container}>
      <div style={styles.optionItem} onClick={() => navigate('/Screen/FAQScreen')}>
        <MdQuestionAnswer size={24} color="#555" />
        <span style={styles.optionText}>Frequently Asked Questions</span>
        <MdChevronRight size={24} color="#ccc" />
      </div>

      <div style={styles.optionItem} onClick={openEmail}>
        <MdEmail size={24} color="#555" />
        <span style={styles.optionText}>Contact Support</span>
        <MdChevronRight size={24} color="#ccc" />
      </div>

      <div style={styles.optionItem} onClick={reportProblem}>
        <MdBugReport size={24} color="#555" />
        <span style={styles.optionText}>Report a Problem</span>
        <MdChevronRight size={24} color="#ccc" />
      </div>

      <div style={styles.optionItem} onClick={openPrivacyPolicy}>
        <MdPolicy size={24} color="#555" />
        <span style={styles.optionText}>Privacy Policy</span>
        <MdChevronRight size={24} color="#ccc" />
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid #eee',
    cursor: 'pointer'
  },
  optionText: {
    flex: 1,
    marginLeft: '15px',
    fontSize: '16px'
  }
};
