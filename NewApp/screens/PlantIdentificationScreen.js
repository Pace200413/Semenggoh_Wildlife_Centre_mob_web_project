import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config';

const CAMERA_TYPES = {
  BACK: 'environment',
  FRONT: 'user'
};

export default function PlantIdentificationScreen({navigation, route}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState(CAMERA_TYPES.BACK);
  const [isLoading, setIsLoading] = useState(false);
  const [identifiedPlant, setIdentifiedPlant] = useState(null);
  const cameraRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const toggleCameraType = () => {
    setCameraType(currentType =>
      currentType === CAMERA_TYPES.BACK ? CAMERA_TYPES.FRONT : CAMERA_TYPES.BACK
    );
  };

  const identifyImage = async (imageUri) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'plant.jpg',
      });

      const response = await fetch(`${API_URL}/api/plants/identify-plant`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIdentifiedPlant(data);
      } else {
        Alert.alert('Error', data.error || 'Failed to identify plant');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync();

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setCapturedPhoto(manipulatedImage.uri);
      await identifyImage(manipulatedImage.uri);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const selected = result.assets[0];

        const manipulatedImage = await ImageManipulator.manipulateAsync(
          selected.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        setCapturedPhoto(manipulatedImage.uri);
        await identifyImage(manipulatedImage.uri);
      }
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const retakePicture = () => {
    setCapturedPhoto(null);
    setIdentifiedPlant(null);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: 'blue', marginTop: 10 }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        <Image source={{ uri: capturedPhoto }} style={styles.halfScreenImage} resizeMode="cover" />
      ) : (
        <CameraView
          style={styles.halfScreenImage}
          facing={cameraType}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Ionicons name="camera" size={30} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {!isLoading && !identifiedPlant && (
          <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImageFromGallery}
          disabled={isLoading}
        >
          <Text style={styles.uploadText}>Upload from Gallery</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.resultContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          identifiedPlant?.predictions?.length > 0 && (
            <>
              <Text style={styles.title}>Top Predictions</Text>
              {identifiedPlant.predictions.map((item, index) => (
                <View key={index} style={styles.resultItem}>
                  <Text style={styles.plantName}>{item.name}</Text>
                  <Text style={styles.confidence}>
                    Confidence: {(item.confidence * 100).toFixed(2)}%
                  </Text>
                </View>
              ))}
            </>
          )
        )}

        {!isLoading && !identifiedPlant?.predictions?.length && (
          <Text style={styles.instructions}>Capture or upload a plant to identify it.</Text>
        )}

        {capturedPhoto && !isLoading && (
          <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
            <Text style={styles.retakeText}>Retake Photo</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  halfScreenImage: {
    height: '50%',
    width: '100%',
  },
  resultContainer: {
    height: '50%',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  flipButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 30,
  },
  captureButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultItem: {
    marginBottom: 10,
  },
  plantName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 16,
    color: '#666',
  },
  instructions: {
    fontSize: 16,
    color: '#999',
    alignSelf: 'center',
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50', // Green
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  retakeButton: {
    marginTop: 20,
    backgroundColor: '#388E3C', // Darker green
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  retakeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
});
