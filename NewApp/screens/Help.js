import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert,BackHandler } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function HelpScreen({ navigation }) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('AdminPer');
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const openEmail = () => {
    Linking.openURL('mailto:support@yourapp.com?subject=App Support');
  };

  const reportProblem = () => {
    Alert.alert('Report a Problem', 'You can describe the issue via email.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Email Us', onPress: openEmail },
    ]);
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://yourapp.com/privacy-policy');
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('FAQ')}>
        <MaterialIcons name="question-answer" size={24} color="#555" />
        <Text style={styles.optionText}>Frequently Asked Questions</Text>
        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionItem} onPress={openEmail}>
        <MaterialIcons name="email" size={24} color="#555" />
        <Text style={styles.optionText}>Contact Support</Text>
        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionItem} onPress={reportProblem}>
        <MaterialIcons name="bug-report" size={24} color="#555" />
        <Text style={styles.optionText}>Report a Problem</Text>
        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionItem} onPress={openPrivacyPolicy}>
        <MaterialIcons name="policy" size={24} color="#555" />
        <Text style={styles.optionText}>Privacy Policy</Text>
        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
});