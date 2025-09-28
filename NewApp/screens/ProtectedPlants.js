import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2;

const speciesData = [
  {
    id: '9',
    name: 'Biris (Licuala orbicularis)',
    image: require('../assets/images/biris_licuala_orbicularis.jpg'),
    description: 'A rare fan palm species native to the rainforests of Borneo.'
  },
  {
    id: '10',
    name: 'Orchid (Orchidaceae family)',
    image: require('../assets/images/orchidaceae.jpg'),
    description: 'All native orchid species from the Orchidaceae family.'
  },
  {
    id: '11',
    name: 'Tongkat Ali (Eurycoma longifolia)',
    image: require('../assets/images/tongkat_ali_eurycoma_longifolia.jpg'),
    description: 'A medicinal plant used traditionally for vitality and wellness.'
  },
  {
    id: '12',
    name: 'Melebab (Cyrtandra spp.)',
    image: require('../assets/images/cyrtandra.jpg'),
    description: 'Includes all Cyrtandra species, often found in moist tropical forests.'
  },
];

export default function ProtectedPlants({navigation, route}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    setDropdownOpen(false);
  }, []);

  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < speciesData.length; i += 2) {
      rows.push(
        <View key={i} style={styles.row}>
          {renderItem(speciesData[i])}
          {speciesData[i + 1] ? renderItem(speciesData[i + 1]) : <View style={[styles.card, { backgroundColor: 'transparent' }]} />}
        </View>
      );
    }
    return rows;
  };

  const renderItem = (item) => (
    <View key={item.id} style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2f855a" barStyle="light-content" />
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>Protected Plants</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderGrid()}
      </ScrollView>

      {dropdownOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('Species', { userId: route?.params?.userId, role: route?.params?.role }); }}>
            <Text style={styles.dropdownItem}>Introduction to Species</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('TotallyProtected', { userId: route?.params?.userId, role: route?.params?.role }); }}>
            <Text style={styles.dropdownItem}>Totally-Protected Wildlife</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedWildlife', { userId: route?.params?.userId, role: route?.params?.role }); }}>
            <Text style={styles.dropdownItem}>Protected Wildlife</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('PlantIdentification', { userId: route?.params?.userId, role: route?.params?.role }); }}>
            <Text style={styles.dropdownItem}>Identify Plant</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuestHome', { userId: route?.params?.userId, role: route?.params?.role })}>
          <Ionicons name="home" size={24} color="#2f855a" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setDropdownOpen(!dropdownOpen)}>
          <FontAwesome name="leaf" size={24} color="#888" />
          <Text style={styles.navText}>Species</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Mapp', { userId: route?.params?.userId, role: route?.params?.role })}>
          <Ionicons name="map" size={24} color="#888" />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Guide', { userId: route?.params?.userId, role: route?.params?.role })}>
          <MaterialIcons name="menu-book" size={24} color="#888" />
          <Text style={styles.navText}>Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuestPer', { userId: route?.params?.userId, role: route?.params?.role })}>
          <Ionicons name="person" size={24} color="#888" />
          <Text style={styles.navText}>User</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6fff0' },
  headerWrapper: {
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#2f855a',
    alignItems: 'center',
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#276749',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#4A5568',
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
  },dropdownMenu: {
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
