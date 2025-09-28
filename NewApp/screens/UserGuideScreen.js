import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../config';

const { width } = Dimensions.get('window');
  
export default function UserGuideScreen({ navigation, route }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [allGuides, setAllGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
    setDropdownOpen(false);
    setAllGuides([]);
    setFilteredGuides([]);
    setIsLoading(true);
    setSearchText('');
  }, []);

  const fetchGuides = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/guides`);
      
      // Check if we got a response
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      if (data.guides) {
        // Check for duplicate guide_ids
        const uniqueGuides = data.guides.reduce((acc, guide) => {
          if (!acc.find(g => g.guide_id === guide.guide_id)) {
            acc.push(guide);
          }
          return acc;
        }, []);
        
        // Sort guides by rating in descending order
        const sortedGuides = uniqueGuides.sort((a, b) => b.rating - a.rating);  // Sort by rating
        
        setAllGuides(sortedGuides);
        setFilteredGuides(sortedGuides);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      Alert.alert(
        "Connection Error",
        "Could not connect to the server. Please ensure the server is running and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredGuides(allGuides);
    } else {
      setFilteredGuides(
        allGuides.filter(guide => 
          guide.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => (route?.params?.userId)? navigation.navigate('Book', { guide: item, userId: route?.params?.userId }) : Alert.alert("No Account Detected", "Please login before placing a booking.",[{ text: "OK" }])} style={styles.itemContainer}>
      <Image 
        source={{ uri: item.profile_image_url || item.gender === 'male'
          ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
          : 'https://cdn-icons-png.flaticon.com/512/147/147142.png' }} 
        style={styles.image} 
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>Phone: {item.phone_no}</Text>
        <Text style={styles.availableSlots}>Available Slots: {item.available_slots || '0'}</Text>
        <Text style={styles.phone}>Rating: {item.rating}</Text>
      </View>
      <TouchableOpacity 
        style={styles.bookButton} 
        onPress={() => (route?.params?.userId)? navigation.navigate('Book', { guide: item, userId: route?.params?.userId }) : Alert.alert("No Account Detected", "Please login before placing a booking.",[{ text: "OK" }])}
      >
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ActivitiesScreen', {userId: route?.params?.userId})}>
          <Text style={styles.buttonText}>Activities</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.search}>
        <TextInput 
          placeholder='Search guides...' 
          value={searchText} 
          onChangeText={handleSearch} 
          style={styles.searchInput} 
        />
        <Ionicons name='search' size={20} color="#666" />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading guides...</Text>
        </View>
      ) : (
        <FlatList 
          style={styles.list}
          data={filteredGuides}
          renderItem={renderItem}
          keyExtractor={(item) => item.guide_id.toString()}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

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

        <TouchableOpacity style={styles.navItem} onPress={() => (route?.params?.role != 'visitor')? navigation.navigate('Login') : navigation.navigate('GuestPer', { userId: route?.params?.userId })}>
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
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    paddingTop: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  availableSlots: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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

  

