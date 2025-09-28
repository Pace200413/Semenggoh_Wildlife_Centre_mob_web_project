// In your SecurityPrivacyScreen.js
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SPScreen({ navigation }) {
  const handleLogout = () => {
    // Your logout logic here
    // Example: auth().signOut();
    navigation.navigate('Login'); // Navigate to login screen
  };

  return (
    <View style={styles.container}>
      {/* Other security options... */}
      
      <TouchableOpacity 
        style={styles.optionItem} 
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={24} color="#d9534f" />
        <Text style={[styles.optionText, { color: '#d9534f' }]}>Logout</Text>
        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
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