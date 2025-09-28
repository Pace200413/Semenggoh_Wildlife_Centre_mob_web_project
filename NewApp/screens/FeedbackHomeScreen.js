import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Feedback System</Text>
          <Text style={styles.subtitle}>Check out what others are saying about your performance</Text>
        </View>
        
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('FeedbackHistory', { userId: route?.params?.userId, role: route?.params?.role })}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#4caf50' }]}>
              <Text style={styles.icon}>🔍</Text>
            </View>
            <Text style={styles.cardTitle}>View History</Text>
            <Text style={styles.cardDescription}>
              See all past feedback and reviews
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Stats', { userId: route?.params?.userId, role: route?.params?.role })}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#ff9800' }]}>
              <Text style={styles.icon}>📊</Text>
            </View>
            <Text style={styles.cardTitle}>Statistics</Text>
            <Text style={styles.cardDescription}>
              View analytics and sentiment breakdown
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by Sentiment Analysis
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 26,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
});

export default HomeScreen;
