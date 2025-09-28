import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faRedo, faLeaf, faImage } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

import { API_URL } from '../config';

export default function PlantIdentificationScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [identifiedPlant, setIdentifiedPlant] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('userId') || localStorage.getItem('userId');
  const userRole = new URLSearchParams(location.search).get('role') || localStorage.getItem('userRole');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setIsLoading(true);
      setError(null);
      if (file.size > 10 * 1024 * 1024) {
        setError('File too large. Max 10MB.');
        return;
      }
      if (!file.type.match('image.*')) {
        setError('Invalid file type. Only image files allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageDataUrl = reader.result;
        setUploadedImage(imageDataUrl);
        await identifyImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError('Failed to process image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) view[i] = byteString.charCodeAt(i);
    return new Blob([buffer], { type: mimeString });
  };

  const identifyImage = async (dataUrl) => {
    try {
      setIsLoading(true);
      const blob = dataURLtoBlob(dataUrl);
      const formData = new FormData();
      formData.append('image', blob, 'plant.jpg');

      const response = await fetch(`${API_URL}/api/plants/identify-plant`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) setIdentifiedPlant(result);
      else setError(result.error || 'Failed to identify plant.');
    } catch (err) {
      console.error(err);
      setError('Error communicating with server.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetIdentification = () => {
    setUploadedImage(null);
    setIdentifiedPlant(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const handleNavigate = (path) => {
    navigate(path, {
      state: { userId, userRole },
      search: `?userId=${userId}&role=${userRole}`,
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Plant Identification</h1>
        <p style={styles.subtitle}>Upload a picture of a plant to identify it</p>
      </header>

      <main style={styles.main}>
        <div
          style={{
            ...styles.uploadArea,
            ...(dragActive ? styles.dragActive : {}),
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedImage ? (
            <div style={styles.imageContainer}>
              <img src={uploadedImage} alt="Uploaded" style={styles.image} />
              {!isLoading && (
                <button style={styles.resetButton} onClick={resetIdentification}>
                  <FontAwesomeIcon icon={faRedo} />
                  <span>Try another image</span>
                </button>
              )}
            </div>
          ) : (
            <div style={styles.placeholder}>
              <FontAwesomeIcon icon={faImage} size="3x" style={styles.icon} />
              <h3>Drag and drop an image here</h3>
              <p>or</p>
              <button style={styles.uploadButton} onClick={openFileDialog}>
                <FontAwesomeIcon icon={faUpload} />
                <span> Browse files</span>
              </button>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div style={styles.tips}>
                <p>For best results:</p>
                <ul>
                  <li>Use clear, well-lit images</li>
                  <li>Focus on leaves or flowers</li>
                  <li>No blurry or dark photos</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div style={styles.results}>
          {isLoading && <p>Analyzing plant image...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {identifiedPlant?.predictions?.length > 0 && (
            <>
              <h2>Plant Identification Results</h2>
              {identifiedPlant.predictions.map((item, i) => (
                <div key={i} style={styles.prediction}>
                  <h3>{item.name}</h3>
                  <div style={styles.confidenceBar}>
                    <div style={{ ...styles.confidenceFill, width: `${item.confidence * 100}%` }} />
                  </div>
                  <p>{(item.confidence * 100).toFixed(1)}% confidence</p>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "100%",
    margin: '0 auto',
    background: '#e6fff0',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    background: '#2f855a',
    color: 'white',
    padding: '20px 0',
    textAlign: 'center',
  },
  title: { fontSize: 24, margin: 0 },
  subtitle: { fontSize: 16, margin: 0 },
  main: { padding: 20, paddingBottom: 80 },
  uploadArea: {
    border: '2px dashed #d1d5db',
    padding: 20,
    borderRadius: 10,
    background: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  dragActive: {
    borderColor: '#2f855a',
    backgroundColor: '#f0fdf4',
  },
  imageContainer: { textAlign: 'center' },
  image: {
    maxWidth: '100%',
    maxHeight: 400,
    borderRadius: 10,
    marginBottom: 10,
  },
  resetButton: {
    background: '#e53e3e',
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  placeholder: { textAlign: 'center' },
  icon: { color: '#2f855a', marginBottom: 10 },
  uploadButton: {
    marginTop: 10,
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  tips: {
    marginTop: 20,
    textAlign: 'left',
    fontSize: 14,
    color: '#444',
  },
  results: {
    background: 'white',
    borderRadius: 10,
    padding: 20,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  prediction: { marginBottom: 20 },
  confidenceBar: {
    height: 10,
    background: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    background: '#48bb78',
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    borderTop: '1px solid #eee',
    zIndex: 100,
  },
  navItem: {
    background: 'none',
    border: 'none',
    padding: 10,
    textAlign: 'center',
    cursor: 'pointer',
    color: '#2f855a',
    fontWeight: 500,
  },
};
