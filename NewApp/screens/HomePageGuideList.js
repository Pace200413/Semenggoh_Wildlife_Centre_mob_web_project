import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config';

export default function HomePageGuideList({ navigation, route }) {
  const [searchText, setSearchText] = useState('');
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [genderFilter, setGenderFilter] = useState(null); // null, 'Male', or 'Female'
  const [currentPage, setCurrentPage] = useState(1); // moved to top
  const [allGuides, setAllGuides] = useState([]);

  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuides = filteredGuides.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    filterGuides(searchText, genderFilter);
    setCurrentPage(1); // Reset to first page on search/filter
  }, [searchText, genderFilter, allGuides]);

  const fetchGuides = async () => {
    try {
      const response = await fetch(`${API_URL}/api/guides`);
      const data = await response.json();
      if (data.guides) {
        const sortedGuides = data.guides
          .filter((guide, index, self) =>
            index === self.findIndex(g => g.guide_id === guide.guide_id)
          )
          .sort((a, b) => b.rating - a.rating);
        setAllGuides(sortedGuides);
      }
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    }
  };

  const filterGuides = (text, gender) => {
    let filtered = allGuides;

    if (text.trim() !== '') {
      filtered = filtered.filter((guide) =>
        guide.name.toLowerCase().includes(text.toLowerCase())
      );
    }

    if (gender) {
      filtered = filtered.filter((guide) =>
        guide.gender.toLowerCase() === gender.toLowerCase()
      );
    }

    setFilteredGuides(filtered);
  };


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.profile_image_url || (item.gender === 'male'
          ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
          : 'https://cdn-icons-png.flaticon.com/512/147/147142.png') }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.gender}</Text>
      <Text style={styles.rating}>⭐ {item.rating}/5</Text>
    </View>
  );


  const renderJoinSection = () => {
    return (
      <View style={styles.joinSection}>
        <Text style={styles.joinText}>
          Interested to join our team? We’re always looking for new guides to be part of us!!
        </Text>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.joinButtonText}>Join Us to Be a Guide</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderPagination = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => setCurrentPage(i)}
          style={{
            marginHorizontal: 4,
            padding: 6,
            backgroundColor: i === currentPage ? '#2f855a' : '#e2e8f0',
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              fontWeight: i === currentPage ? 'bold' : 'normal',
              color: i === currentPage ? '#fff' : '#000',
            }}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
  
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        {pages}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guide List</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 5 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search guide..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setGenderFilter(null)}
          style={[styles.filterButton, genderFilter === null && styles.filterButtonActive]}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGenderFilter('Male')}
          style={[styles.filterButton, genderFilter === 'Male' && styles.filterButtonActive]}
        >
          <Text style={styles.filterText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGenderFilter('Female')}
          style={[styles.filterButton, genderFilter === 'Female' && styles.filterButtonActive]}
        >
          <Text style={styles.filterText}>Female</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentGuides}
        renderItem={renderItem}
        keyExtractor={(item) => item.guide_id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {renderPagination()}
      {renderJoinSection()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2d3748',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
  },
  filterButtonActive: {
    backgroundColor: '#2f855a',
  },
  filterText: {
    fontSize: 13,
    color: '#1a202c',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2d3748',
  },
  rating: {
    marginTop: 2,
    color: '#4a5568',
    fontSize: 12,
  },
  joinSection: {
    padding: 12,
    marginTop: 12,
    backgroundColor: '#ebf8ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bee3f8',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  joinText: {
    fontSize: 13,
    color: '#2c5282',
    marginBottom: 8,
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: '#2f855a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});