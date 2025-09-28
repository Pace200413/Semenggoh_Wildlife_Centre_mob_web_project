import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Frequently Asked Questions</Text>
      {faqData.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <TouchableOpacity onPress={() => toggleAnswer(index)} style={styles.questionRow}>
            <Text style={styles.question}>{item.question}</Text>
            <MaterialIcons
              name={activeIndex === index ? 'expand-less' : 'expand-more'}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
          {activeIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: { fontSize: 16, fontWeight: 'bold' },
  answer: { marginTop: 8, fontSize: 15, color: '#333' },
});