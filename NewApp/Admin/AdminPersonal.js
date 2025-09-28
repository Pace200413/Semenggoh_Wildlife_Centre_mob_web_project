import React from 'react';
import { useState,useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import { Divider } from 'react-native-paper';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';

const { width, height } = Dimensions.get('window');


export default function AdminPersonal({ navigation, route }) {
  const [profilePicUri, setProfilePicUri] = useState(null);
  const [userData, setUserData] = useState({});
  const userId = route?.params?.userId;

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${userId}`);
      const user = response.data;
      setUserData(user);

      if (user.profile_image_url) {
        setProfilePicUri(`${API_URL}${user.profile_image_url}`);
      } else {
        const defaultImg = user.gender === 'male'
          ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
          : 'https://cdn-icons-png.flaticon.com/512/147/147142.png';
        setProfilePicUri(defaultImg);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate('AdminHomePage');
          return true; // Prevent default back behavior
        }
      );
  
      return () => backHandler.remove(); // Cleanup on unmount
    }, [navigation]);
  
  const fullName = `${userData.name || ''}`;
  const email = userData.email || 'N/A';

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Image source={require('../assets/images/logo.jpg')} style={styles.logo} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Semenggoh</Text>
            <Text style={styles.title}>Wildlife</Text>
            <Text style={styles.title}>Centre</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {/* Guide Info Section */}
        <View style={styles.profileSection}>
            <View style={styles.imageWrapper}>
              {profilePicUri && (
                <Image source={{ uri: profilePicUri }} style={styles.logo1} />
              )}
            </View>
            <Text style={styles.profileName}>{fullName}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
        </View>

        {/* Grid Buttons */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminPro', {userId: route.params?.userId, role: route.params?.role})}>
            <MaterialIcons name="person-outline" size={24} color="#2f855a" />
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('spScreen')}>
            <FontAwesome name="lock" size={24} color="#2f855a" />
            <Text style={styles.buttonText}>Security & Privacy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GuideList', {userId: route.params?.userId, role: route.params?.role})}>
            <MaterialIcons name="verified" size={24} color="#2f855a" />
            <Text style={styles.buttonText}>Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GuideList', { setSelectedTab: 'course', userId: route.params?.userId, role: route.params?.role })}>
            <FontAwesome name="book" size={24} color="#2f855a" />
            <Text style={styles.buttonText}>Course</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Help', {userId: route.params?.userId, role: route.params?.role})}>
            <MaterialIcons name="help" size={24} color="#2f855a" />
            <Text style={styles.buttonText}>Help</Text>
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6fff0',
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: Platform.OS === 'android' ? 80 + (StatusBar.currentHeight || 0) : 100,
    backgroundColor: '#2f855a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  leftSection: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 80,
    marginRight: 15,
  },
  logo1: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollArea: {
    paddingTop: Platform.OS === 'android' ? 90 + (StatusBar.currentHeight || 0) : 120,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  guideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  infoText: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: 'white',
    width: '30%',
    height: 110,
    margin: 5,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileEmail: {
    color: "gray",
  },
  divider: {
    marginVertical: 10,
    height: 1,
    width: width - 20,
    backgroundColor: "#A9A9A9",
  },
  imageWrapper: {
    position: "relative",
  },
});