import React, { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

const faqData = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to Security & Privacy > Change Password to set a new password.',
  },
  {
    question: 'How do I delete my account?',
    answer: 'Go to Security & Privacy > Delete My Account. Be careful — this is permanent.',
  },
  {
    question: 'Can I download my data?',
    answer: 'Yes. Under Security & Privacy, tap "Download My Data" to save a copy to your device.',
  },
  {
    question: 'How do I contact support?',
    answer: 'On the Help page, tap "Contact Support" to email us directly.',
  },
];

export default function FAQScreen() {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleAnswer = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Frequently Asked Questions</h2>
      {faqData.map((item, index) => (
        <div key={index} style={styles.faqItem}>
          <div onClick={() => toggleAnswer(index)} style={styles.questionRow}>
            <span style={styles.question}>{item.question}</span>
            {activeIndex === index ? (
              <MdExpandLess size={24} color="#555" />
            ) : (
              <MdExpandMore size={24} color="#555" />
            )}
          </div>
          {activeIndex === index && <div style={styles.answer}>{item.answer}</div>}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  faqItem: {
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  questionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  question: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  answer: {
    marginTop: '8px',
    fontSize: '15px',
    color: '#333',
  },
};
