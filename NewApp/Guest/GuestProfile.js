import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '../config';

const { width, height } = Dimensions.get('window');

export default function GuideProfile({ navigation, route }) {
  const [profilePicUri, setProfilePicUri] = useState(null);
  const [userData, setUserData] = useState({});

  const userId = route.params?.userId;

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.updateSuccess) {
        Alert.alert('Success', 'Personal Info is updated successfully!');
        navigation.setParams({ updateSuccess: false });
      }

      fetchUserProfile();
    }, [route.params?.updateSuccess])
  );

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const fileType = match ? `image/${match[1]}` : 'image';

      const formData = new FormData();
      formData.append('image', {
        uri: localUri,
        name: filename,
        type: fileType,
      });
      formData.append('type', 'profile');
      formData.append('userId', userId);

      try {
        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (uploadRes.data?.imageUrl) {
          setProfilePicUri(`${API_URL}${uploadRes.data.imageUrl}`);
        }

      } catch (err) {
        console.error('Image upload failed:', err);
        Alert.alert('Upload Failed', 'Could not upload the profile image.');
      }
    }
  };

  const renderInfoRow = (label, value, navigateTo = null) => (
    <TouchableOpacity
      style={styles.infoRow}
      disabled={!navigateTo}
      onPress={() => {
        if (navigateTo) {
          if (typeof navigateTo === 'string') {
            navigation.navigate(navigateTo);
          } else {
            navigation.navigate(navigateTo.screen, navigateTo.params);
          }
        }
      }}
    >
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.infoText}>{value}</Text>
      </View>
      {navigateTo && <MaterialIcons name="chevron-right" size={24} color="#000" />}
    </TouchableOpacity>
  );

  const fullName = `${userData.name || ''}`;
  const birthday = userData.birth_date || 'N/A';
  const gender = userData.gender || 'N/A';
  const email = userData.email || 'N/A';
  const phone = userData.phone_no || 'N/A';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Image source={require('../assets/images/logo.jpg')} style={styles.logo} />
          <View>
            <Text style={styles.title}>Semenggoh Wildlife Centre</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View style={styles.profileSection}>
          <View style={styles.imageWrapper}>
            {profilePicUri && (
              <Image source={{ uri: profilePicUri }} style={styles.logo1} />
            )}
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
              <MaterialIcons name="photo-camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{fullName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        <View style={styles.con2}>
          <Text style={styles.cardTitle}>Your profile info in Park Guide System</Text>
          <Text style={styles.cardText}>
            Personal info and options to manage it. You can make some of this info visible to others.
          </Text>
          <Divider style={styles.divider} />

          {renderInfoRow("NAME", fullName, {
            screen: "NameEdit",
            params: { userId, fullName, userType: "Guest" }
          })}
          {renderInfoRow("BIRTHDAY", birthday, {
            screen: "EditBirthday",
            params: { userId, birthday, userType: "Guest" }
          })}
          {renderInfoRow("GENDER", gender)}
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>Contact Info</Text>
          {renderInfoRow("EMAIL", email, {
            screen: "EditEmail",
            params: { userId, email, userType: "Guest" }
          })}
          {renderInfoRow("PHONE", phone, {
            screen: "EditPhone",
            params: { userId, phone, userType: "Guest" }
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6fff0',
    height,
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
    paddingHorizontal: 10,
    elevation: 3,
  },
  leftSection: {
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
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileEmail: {
    color: "gray",
  },
  con2: {
    paddingHorizontal: 10,
  },
  divider: {
    marginVertical: 10,
    height: 1,
    width: width - 20,
    backgroundColor: "#A9A9A9",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    color: "#2f855a",
    marginTop: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  label: {
    fontSize: 12,
    color: "gray",
  },
  infoText: {
    fontSize: 16,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2f855a",
    borderRadius: 10,
    padding: 4,
  },
});
