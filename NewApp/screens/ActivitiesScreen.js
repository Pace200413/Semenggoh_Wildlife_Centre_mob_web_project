import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios'; // You'll need to install axios for HTTP requests
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config';

export default function ActivitiesScreen({ navigation, route }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle errors
  const userId = route?.params?.userId; // Replace this with the actual userId

  // Fetch activities from the backend API
  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/guides/booking-history/${userId}`);
      setActivities(response.data);  // Set the fetched data
      setLoading(false);  // Stop loading

    } catch (error) {
      console.error("Error fetching booking history:", error);
      setError('There was an error fetching your booking history.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(); // Call the fetch function when the component mounts
    setDropdownOpen(false);
  }, []);

  useFocusEffect(
      React.useCallback(() => {
        fetchActivities(); // Call the fetch function when the component mounts
        setDropdownOpen(false);
      }, [])
    );

  const renderItem = ({ item }) => {
    const statusStyle = styles.statusColors[item.status] || {};
  
    const profilePicUri = item.guide_image
    ? `${API_URL}${item.guide_image}`
    : item.gender === 'male'
    ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
    : 'https://cdn-icons-png.flaticon.com/512/147/147142.png';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ActivityDetails', { activity: item, role: route?.params?.role, userId: route?.params?.userId })}
      >
        <Image source={{ uri: profilePicUri }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.guide_name}</Text>
          <Text style={styles.time}>{item.booking_date}</Text>
          <Text style={styles.time}>{item.booking_time}</Text>
        </View>
        <View style={[styles.statusContainer, statusStyle]}>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
          
        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('Species'); }}>
              <Text style={styles.dropdownItem}>Introduction to Species</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('TotallyProtected'); }}>
              <Text style={styles.dropdownItem}>Totally-Protected Wildlife</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedWildlife'); }}>
              <Text style={styles.dropdownItem}>Protected Wildlife</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedPlants'); }}>
              <Text style={styles.dropdownItem}>Protected Plants</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('PlantIdentification'); }}>
              <Text style={styles.dropdownItem}>Identify Plant</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color="#2f855a" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setDropdownOpen(!dropdownOpen)}>
            <FontAwesome name="leaf" size={24} color="#888" />
            <Text style={styles.navText}>Species</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Mapp')}>
            <Ionicons name="map" size={24} color="#888" />
            <Text style={styles.navText}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Guide', { userId: route?.params?.userId, role: route?.params?.role })}>
            <MaterialIcons name="menu-book" size={24} color="#888" />
            <Text style={styles.navText}>Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => (route?.params?.role != 'visitor')? navigation.navigate('Login') : navigation.navigate('GuidePer', { userId: route?.params?.userId })}>
            <Ionicons name="person" size={24} color="#888" />
            <Text style={styles.navText}>User</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  if (activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>You have no booking history.</Text>
          
        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('Species'); }}>
              <Text style={styles.dropdownItem}>Introduction to Species</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('TotallyProtected'); }}>
              <Text style={styles.dropdownItem}>Totally-Protected Wildlife</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedWildlife'); }}>
              <Text style={styles.dropdownItem}>Protected Wildlife</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedPlants'); }}>
              <Text style={styles.dropdownItem}>Protected Plants</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('PlantIdentification'); }}>
              <Text style={styles.dropdownItem}>Identify Plant</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color="#2f855a" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setDropdownOpen(!dropdownOpen)}>
            <FontAwesome name="leaf" size={24} color="#888" />
            <Text style={styles.navText}>Species</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Mapp')}>
            <Ionicons name="map" size={24} color="#888" />
            <Text style={styles.navText}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Guide', { userId: route?.params?.userId, role: route?.params?.role })}>
            <MaterialIcons name="menu-book" size={24} color="#888" />
            <Text style={styles.navText}>Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => (route?.params?.role != 'visitor')? navigation.navigate('Login') : navigation.navigate('GuidePer', { userId: route?.params?.userId })}>
            <Ionicons name="person" size={24} color="#888" />
            <Text style={styles.navText}>User</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.booking_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {dropdownOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('Species'); }}>
            <Text style={styles.dropdownItem}>Introduction to Species</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('TotallyProtected'); }}>
            <Text style={styles.dropdownItem}>Totally-Protected Wildlife</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedWildlife'); }}>
            <Text style={styles.dropdownItem}>Protected Wildlife</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedPlants'); }}>
            <Text style={styles.dropdownItem}>Protected Plants</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('PlantIdentification'); }}>
            <Text style={styles.dropdownItem}>Identify Plant</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#2f855a" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setDropdownOpen(!dropdownOpen)}>
          <FontAwesome name="leaf" size={24} color="#888" />
          <Text style={styles.navText}>Species</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Mapp')}>
          <Ionicons name="map" size={24} color="#888" />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Guide', { userId: route?.params?.userId, role: route?.params?.role })}>
          <MaterialIcons name="menu-book" size={24} color="#888" />
          <Text style={styles.navText}>Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => (route?.params?.role != 'visitor')? navigation.navigate('Login') : navigation.navigate('GuidePer', { userId: route?.params?.userId })}>
          <Ionicons name="person" size={24} color="#888" />
          <Text style={styles.navText}>User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F0F2F5',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1C1C1E',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  time: {
    fontSize: 13,
    color: '#6D6D72',
    marginTop: 4,
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#CCC',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statusColors: {
    'pending': { backgroundColor: '#FFA726' },
    'confirmed': { backgroundColor: '#90EE90' },
    'completed': { backgroundColor: '#66BB6A' },
    'cancelled': { backgroundColor: '#9E9E9E' },
    'commented': { backgroundColor: '#002D04' },
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',  // Center the error message
    marginTop: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 999, // Keep it on top
  },

  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 10,
    elevation: 5,
  },
  dropdownItem: {
    fontSize: 16,
    paddingVertical: 8,
    color: '#276749',
  },
});