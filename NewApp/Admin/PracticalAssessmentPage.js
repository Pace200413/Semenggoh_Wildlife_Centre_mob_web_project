import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PracticalAssessmentPage = ({ route, navigation }) => {
  // Get the guide data from navigation params
  const { guideId, guideName } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practical Assessment</Text>
      
      <View style={styles.card}>
        <Text style={styles.message}>
          {guideName || 'The guide'} is now proceeding to practical assessment.
        </Text>
        <Text style={styles.submessage}>
          This page would contain the practical evaluation components in the full application.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Progress Tracking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f7f0',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f855a',
    marginBottom: 15,
    textAlign: 'center',
  },
  submessage: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#2f855a',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PracticalAssessmentPage;