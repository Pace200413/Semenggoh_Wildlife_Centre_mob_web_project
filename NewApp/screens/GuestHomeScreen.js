import React, {useState, useEffect} from 'react';
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
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function GuestHomeScreen({ navigation, route }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    setDropdownOpen(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Left Section: Logo & Title */}
        <View style={styles.leftSection}>
          <Image source={require('../assets/images/logo.jpg')} style={styles.logo} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Semenggoh</Text>
            <Text style={styles.title}>Wildlife Centre</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity onPress={() => navigation.navigate('GuideNotification', { userId: route?.params?.userId, role: route?.params?.role })}>
            <Ionicons name="notifications" size={34} color="white" style={styles.logo1} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View style={styles.head2}>
          <Text style={styles.head2text}>Welcome! Visitor</Text>
        </View>
        <View style={styles.mainpic}>
  <ScrollView
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    snapToInterval={width}
    decelerationRate="fast"
    style={{ width: '100%' }}
  >
    <View style={styles.imageSlide}>
      <Image
        source={require('../assets/images/orangutans.jpg')}
        style={styles.productImage}
      />
    </View>
    <View style={styles.imageSlide}>
      <Image
        source={require('../assets/images/homepageImage.png')} // Replace with your second image
        style={styles.productImage}
      />
    </View>
    <View style={styles.imageSlide}>
      <Image
        source={require('../assets/images/homepageImage2.png')} // Replace with your second image
        style={styles.productImage}
      />
    </View>
    <View style={styles.imageSlide}>
      <Image
        source={require('../assets/images/homepageImage3.png')} // Replace with your second image
        style={styles.productImage}
      />
    </View>
    {/* Add more slides here */}
  </ScrollView>
</View>
        <View style={styles.overview}>
          <View style={styles.overviewCon}>
          <Text style={styles.overviewTitle}>About Semenggoh Wildlife Centre</Text>
          <Text style={styles.overviewText}>
            Established in 1975, Semenggoh Wildlife Centre serves as a rehabilitation center 
            for rescued and orphaned orangutans. Located within a lush forest reserve, the center 
            offers visitors a chance to observe these magnificent creatures in their natural habitat 
            while learning about conservation efforts.
          </Text>
          <Text style={styles.cardHeader}>🕒 Visiting Hours</Text>
          <Text style={styles.subNote}>Open daily, including public holidays</Text>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Morning</Text>
              <Text style={styles.scheduleTime}>8:00 AM – 10:00 AM</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Afternoon</Text>
              <Text style={styles.scheduleTime}>2:00 PM – 4:00 PM</Text>
            </View>

            <Text style={[styles.cardHeader, { marginTop: 20 }]}>🍌 Feeding Time</Text>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Morning</Text>
              <Text style={styles.scheduleTime}>9:00 AM – 10:00 AM</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Afternoon</Text>
              <Text style={styles.scheduleTime}>3:00 PM – 4:00 PM</Text>
            </View>
            </View>

            <View style={styles.mustGoSection}>
              <Text style={styles.cardHeader}>🌟 Must Go Places</Text>
              <View style={styles.placeCard}>
                <Image source={require('../assets/images/feedingPlatform.png')} style={styles.placeImage} />
                <View style={styles.placeInfo}>
                  <Text style={styles.placeTitle}>Orangutan Feeding Platform</Text>
                  <Text style={styles.placeDescription}>
                    A key area where you can witness orangutans during feeding times. Located deep in the forest and accessible by trail or buggy.
                  </Text>
                </View>
              </View>

              <View style={styles.placeCard}>
                <Image source={require('../assets/images/orchid.png')} style={styles.placeImage} />
                <View style={styles.placeInfo}>
                  <Text style={styles.placeTitle}>Orchid Garden</Text>
                  <Text style={styles.placeDescription}>
                    A beautiful area near the entrance showcasing native Bornean orchids in bloom. A peaceful place for photography and relaxation.
                  </Text>
                </View>
              </View>
              
            </View>

            <View style={styles.gettingThereContainer}>
            <Text style={styles.gettingThereHeader}>Getting There</Text>
            <Text style={styles.gettingThereText}>By Bus, Taxi or GrabCar</Text>
            <Text style={styles.gettingThereDetails}>
              The Semenggoh Wildlife Centre is situated approximately 24 km from Kuching City and can be reached in about 15 to 20 minutes. 
              As there are no regular bus services directly to the centre, it is advisable to hire a taxi or use GrabCar.
            </Text>
            <Text style={styles.gettingThereText}>Trail</Text>
            <Text style={styles.gettingThereDetails}>
              From the entrance to the feeding station at Semenggoh Wildlife Centre is approximately 1.6 km. Visitors can either take a 
              5-minute buggy ride, with tickets available for purchase at the entrance, or walk, which takes about 30 minutes. 
              There is also a feeding trail around 200 meters long.
            </Text>
            <Text style={styles.gettingThereDetails}>
              Note that no visitor cars are allowed inside the Centre.
            </Text>
          </View>
          <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>📍 Semenggoh Wildlife Centre Location</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 1.3421, // approximate location of Semenggoh
              longitude: 110.2871,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: 1.3421, longitude: 110.2871 }}
              title="Semenggoh Wildlife Centre"
              description="Home of the Orangutans"
            />
          </MapView>
          </View>
          <View style={styles.guideListSection}>
            <Text style={styles.overviewTitle}>Meet Our Guides</Text>
            <Text style={styles.overviewText}>
              Get to know the experienced guides who are ready to help you explore the wonders of Semenggoh Wildlife Centre. 
              You can search by name and filter by gender to find the right guide for your adventure.
            </Text>
            <TouchableOpacity 
              style={styles.guideButton} 
              onPress={() => navigation.navigate('HomePageGuideList', { userId: route?.params?.userId, role: route?.params?.role })}
            >
              <Text style={styles.buttonText}>View Guide List</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactContainer}>
            <Text style={styles.cardHeader}>📞 Contact Us</Text>
            <View style={styles.contactRow}>
              <FontAwesome name="phone" size={18} color="#2f855a" style={styles.contactIcon} />
              <Text style={styles.contactText}>+6082-610088</Text>
            </View>
            <View style={styles.contactRow}>
              <FontAwesome name="envelope" size={18} color="#2f855a" style={styles.contactIcon} />
              <Text style={styles.contactText}>info@sarawakforestry.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Entypo name="location-pin" size={18} color="#2f855a" style={styles.contactIcon} />
              <Text style={styles.contactText}>KM 20, Borneo Highland Road, 93250 Kuching, Sarawak</Text>
            </View>
          </View>
        </View>
        
      </ScrollView>

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
          <TouchableOpacity onPress={() => { setDropdownOpen(false); navigation.navigate('PlantIdentification'); }}>
            <Text style={styles.dropdownItem}>Identify Plant</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomNav}>

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
    backgroundColor: '#f8f8f8',
  },
  head2:{
    marginTop: -5,
    width:width,
    height: 50,
    backgroundColor:'#fdce3b',
    alignItems:'center'
  },
  head2text:{
    marginTop:'10',
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
      position: 'absolute',
      top: 5,
      left: 0,
      right: 0,
      zIndex: 10,
      height: Platform.OS === 'android' ? 80 + (StatusBar.currentHeight || 0) : 100,
      backgroundColor: '#2f855a',
      flexDirection: 'row', // Aligns logo and title horizontally
      alignItems: 'center',
      justifyContent: 'flex-start', // Aligns content to the left
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
  leftSection: {
    marginLeft:10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop:50,
    paddingleft:20,
  },
  overview:{
    backgroundColor: '#ffffff', // Ensures the background is white
    flex:1,
    width: width,

    elevation: 3, // Adds a slight shadow for a clean look
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  overviewCon:{
    padding:5,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f512b',
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  overviewText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    padding: 10,
    backgroundColor: '#ffffff',
  },  
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
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
  logo: {
    width: 60, // Adjust logo size
    height: 80,
    marginRight: 15,
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
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  icon: {
    marginRight: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f855a',
  },
  productImage: {
    width: width,
    height: 250, 
  },
  mainpic: {
    width: width,
    height: 'auto',
    overflow: 'hidden',
  },
  imageCaption: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(255, 254, 254, 0.75)',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'center',
  },

  scheduleCard: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 25,
    marginBottom: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    width: width,
    
    borderLeftColor: '#38a169',
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f855a',
    marginBottom: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
  },
  scheduleLabel: {
    fontSize: 15,
    color: '#2d3748',
  },
  scheduleTime: {
    fontSize: 15,
    color: '#4a5568',
    fontWeight: '500',
  },
  subNote: {
    fontSize: 13,
    color: '#4a5568',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  gettingThereContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  gettingThereHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f855a',
    marginBottom: 10,
  },
  gettingThereText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  gettingThereDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    lineHeight: 20,
  },
  mapContainer: {
    marginTop: 20,
    width: width,
    height: 300,
    paddingHorizontal: 10,
  },
  map: {
    flex: 1,
    borderRadius: 10,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f855a',
    marginBottom: 8,
  },
  guideListSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  guideButton: {
    backgroundColor: '#2f855a',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    width: '100%',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  contactIcon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#2d3748',
    flex: 1,
    flexWrap: 'wrap',
  },
  mainpic: {
    width: width,
    height: 250,
    marginBottom: 20,
  },
 
imageSlide: {
  width: width,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 5,
  backgroundColor: '#fff',
},
productImage: {
  width: width * 0.9,
  height: 200,
  resizeMode: 'cover',
  borderRadius: 10,
},
captionText: {
  marginTop: 8,
  fontSize: 16,
  fontWeight: '500',
  color: '#2f855a',
},
mustGoSection: {
  padding: 10,
  backgroundColor: '#ffffff',
},

placeCard: {
  flexDirection: 'row',
  marginBottom: 10,
  borderRadius: 8,
  overflow: 'hidden',
},

placeImage: {
  width: 100,
  height: 100,
  resizeMode: 'cover',
},

placeInfo: {
  flex: 1,
  padding: 10,
},

placeTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2f855a',
},

placeDescription: {
  fontSize: 13,
  color: '#555',
  marginTop: 4,
},

});