import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function SpeciesIntroScreen({ navigation, route }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    setDropdownOpen(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2f855a" barStyle="light-content" />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content} showsVerticalScrollIndicator={true}>
        <Text style={styles.title}>Discover Wildlife in Semenggoh</Text>

        <Text style={styles.paragraph}>
          Semenggoh Wildlife Centre is a sanctuary of biodiversity in Sarawak, Malaysia. Home to some of the region's rarest and most protected species, it serves as a haven for wildlife preservation and education. This page serves as your gateway to explore these treasures.
        </Text>

        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.subheading}>Totally-Protected Wildlife</Text>
        <Text style={styles.paragraph}>
          These species are under the highest protection due to their critically endangered status. Examples include the Orangutan, Hornbill, and Clouded Leopard.
        </Text>

        <Text style={styles.subheading}>Protected Wildlife</Text>
        <Text style={styles.paragraph}>
          These species are protected to ensure sustainable population levels. Includes species like Pig-tailed Macaque, Monitor Lizard, and Sun Bear.
        </Text>

        <Text style={styles.subheading}>Protected Plants</Text>
        <Text style={styles.paragraph}>
          Rare and unique flora such as Tongkat Ali, Cyrtandra species, and Nepenthes are safeguarded under Malaysian conservation law.
        </Text>

        <Text style={styles.sectionTitle}>Fines & Legal Implications</Text>
        <Text style={styles.paragraph}>
          Violators caught harming, trading, or possessing these species illegally can face hefty fines up to RM100,000 or imprisonment under the Sarawak Wildlife Protection Ordinance.
        </Text>

        <Text style={styles.sectionTitle}>Wildlife Policy</Text>
        <Text style={styles.paragraph}>
          The Sarawak Forestry Corporation (SFC) actively enforces strict policies to safeguard protected species and ecosystems, including regular patrols and public awareness campaigns.
        </Text>

        <Text style={styles.sectionTitle}>What You Can Do</Text>
        <Text style={styles.paragraph}>
          As a visitor or citizen, report illegal activities, avoid purchasing wildlife products, and educate others about the importance of biodiversity.
        </Text>

        <Text style={styles.sectionTitle}>Why It Matters</Text>
        <Text style={styles.paragraph}>
          Protecting wildlife ensures a balanced ecosystem, preserves Malaysian natural heritage, and provides invaluable opportunities for education and eco-tourism.
        </Text>

        <Text style={styles.sectionTitle}>Get Involved</Text>
        <Text style={styles.paragraph}>
          Volunteer, donate, or participate in conservation programs organized by SFC and local NGOs to make a lasting impact.
        </Text>
      </ScrollView>

      {dropdownOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('TotallyProtected', { userId: route?.params?.userId, role: route?.params?.role }); }}>
            <Text style={styles.dropdownItem}>Totally-Protected Wildlife</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('ProtectedPlants', { userId: route?.params?.userId, role: route?.params?.role }); }}>
            <Text style={styles.dropdownItem}>Protected Plants</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#e6fff0'
  },
  scrollContainer: {
    flex: 1
  },
  content: {
    padding: 20,
    paddingBottom: 80
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#276749',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#22543d'
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#2f855a'
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4A5568'
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
