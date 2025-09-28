import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import { Ionicons } from '@expo/vector-icons'; // If using Expo
import Icon from 'react-native-vector-icons/FontAwesome';


const { width, height } = Dimensions.get('window');

const pins = [
  {
  id: 1,
  x: 0.45,
  y: 0.82,
  title: "Entry",
  description: "Welcome to the park! Stop by the ticket booth to get your entry pass, visit the guard house for safety assistance, and check out the nearby store for refreshments or souvenirs.",
  image: require("../assets/images/entry.png"),
  type: "Entry",
  color: "red"
},
{
  id: 2,
  x: 0.55,
  y: 0.77,
  title: "Mixed Planting Garden",
  description: "A diverse showcase of local and exotic plant species planted together, promoting biodiversity and demonstrating sustainable gardening practices.",
  image: require("../assets/images/mix.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 3,
  x: 0.38,
  y: 0.78,
  title: "Nepenthes & Wild Orchids Garden",
  description: "Discover Malaysia’s native pitcher plants and beautiful wild orchids in this specialized garden dedicated to rare and endangered plant species.",
  image: require("../assets/images/orchid.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 4,
  x: 0.16,
  y: 0.66,
  title: "Arboretum",
  description: "An educational space featuring a collection of tree species from across the region, offering insight into forest ecology and tree identification.",
  image: require("../assets/images/tree.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 5,
  x: 0.37,
  y: 0.69,
  title: "Ethnobotanical Garden",
  description: "Learn about traditional knowledge and the cultural uses of native plants by local communities, especially in medicine, cooking, and rituals.",
  image: require("../assets/images/water.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 6,
  x: 0.49,
  y: 0.66,
  title: "Ferns & Aroids Garden",
  description: "Wander through lush displays of ferns and aroids, showcasing ancient plant groups that thrive in Malaysia’s humid rainforest environment.",
  image: require("../assets/images/palm.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 7,
  x: 0.41,
  y: 0.6,
  title: "Bamboo & Ficus Garden",
  description: "Explore the versatility of bamboo and the impressive variety of ficus trees, including those that are ecologically important to local wildlife.",
  image: require("../assets/images/bamboo.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 8,
  x: 0.6,
  y: 0.49,
  title: "Wild Fruit Garden",
  description: "Get to know the wild fruit species that grow in Malaysia’s forests—many are important food sources for animals and even local communities.",
  image: require("../assets/images/fruit.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 9,
  x: 0.55,
  y: 0.35,
  title: "Park Shop & Cafe",
  description: "Relax with refreshments or shop for nature-themed gifts, books, and locally made souvenirs. A great place to take a break during your visit.",
  image: require("../assets/images/cafe.png"),
  type: "Building",
  color: '#b22222'
},
{
  id: 10,
  x: 0.51,
  y: 0.24,
  title: "Customer Service Centre & Mini Gallery",
  description: "Need help or more information? Friendly staff are here to assist with maps, lost items, bookings, and general inquiries.",
  image: require("../assets/images/gallery.png"),
  type: "Building",
  color: '#b22222'
},
{
  id: 11,
  x: 0.25,
  y: 0.29,
  title: "Orangutan Main Feeding Area",
  description: "A key location where you can watch semi-wild orangutans being fed. Learn about conservation efforts and observe their natural behaviors up close.",
  image: require("../assets/images/mainfeed.png"),
  type: "Feeding Area",
  color: '#ffa500'
},
{
  id: 12,
  x: 0.58,
  y: 0.08,
  title: "Orangutan Feeding Platform",
  description: "An elevated platform providing a safe and unobtrusive viewing area for observing orangutans during their feeding sessions in a forest-like environment.",
  image: require("../assets/images/feeding.png"),
  type: "Feeding Area",
  color: '#ffa500'
},

  
];


export default function Mapp({ navigation }) {
  

  const imageZoomRef = useRef(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [showPins, setShowPins] = useState(true);

  const handleZoomIn = () => {
    const newScale = Math.min(currentScale + 0.2, 3);
    setCurrentScale(newScale);
    imageZoomRef.current?.centerOn({
      x: positionX,
      y: positionY,
      scale: newScale,
      duration: 100,
    });
  };

  const handleZoomOut = () => {
    const newScale = Math.max(currentScale - 0.2, 1);
    setCurrentScale(newScale);
    imageZoomRef.current?.centerOn({
      x: positionX,
      y: positionY,
      scale: newScale,
      duration: 100,
    });
  };

  const [selectedPin, setSelectedPin] = useState(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        <View style={styles.zoomControls}>
          <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
            <Text style={styles.zoomText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
            <Text style={styles.zoomText}>－</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPins(prev => !prev)}
            style={styles.iconButton}
          >
            <Ionicons
              name={showPins ? 'eye' : 'eye-off'}
              size={24}
              color="#000"
            />
</TouchableOpacity>

        </View>
        

        {/* Zoomable Map Image */}
        <ImageZoom
          ref={imageZoomRef}
          cropWidth={width}
          cropHeight={height}
          imageWidth={width}
          imageHeight={height}
          minScale={1}
          maxScale={3}
          enableCenterFocus={false}
          panToMove={true}
          enableDoubleClickZoom={true}
          useNativeDriver={true}
          onMove={({ positionX, positionY, scale }) => {
            setPositionX(positionX);
            setPositionY(positionY);
            setCurrentScale(scale);
          }}
        >
          <View style={{ width: width, height: height }}>
            <Image source={require('../assets/images/map.jpeg')} style={styles.mapImage} />

            {/* Displaying Titles as Text */}
            {showPins && pins.map((pin) => (
              <TouchableOpacity
                key={pin.id}
                style={[
                  styles.flagPin,
                  {
                    left: pin.x * width - 12,
                    top: pin.y * height - 24,
                  },
                ]}
                onPress={() => setSelectedPin(pin)}
              >
                <Icon name="flag" size={24} color={pin.color || '#e63946'} />
              </TouchableOpacity>
            ))}
          </View>
        </ImageZoom>

        {/* Modal */}
        {selectedPin && (
          <Modal
            transparent
            animationType="slide"
            visible={true}
            onRequestClose={() => setSelectedPin(null)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.enhancedModal}>
                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setSelectedPin(null)}
                  style={styles.closeIcon}
                >
                  <Text style={styles.closeIconText}>✕</Text>
                </TouchableOpacity>

                {/* Image */}

                {/* Info */}
                <Text style={styles.modalTitle}>{selectedPin.title}</Text>
                <Image source={selectedPin.image} style={styles.modalImage} />
                <Text style={styles.modalType}>{selectedPin.type}</Text>
                <Text style={styles.modalDescription}>{selectedPin.description}</Text>
              </View>
            </View>
          </Modal>
        )}

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mapImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  flagPin: {
  position: 'absolute',
},

  pin: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',  // Background to make the text visible
    borderRadius: 5,
  },
  pinText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  enhancedModal: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 20,
  width: 300,  // 85% of screen width
  height: 400, // prevent overflow
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 15,
  elevation: 10,
},
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalType: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  modalDescription: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  modalCoords: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    color: "blue",
  },
  zoomControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  zoomButton: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImage: {
    width: 280,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },

  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },

  closeIconText: {
    fontSize: 18,
    color: '#888',
  },

  toggleButton: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },

  iconButton: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinOnly: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: '#fff',
  }

});