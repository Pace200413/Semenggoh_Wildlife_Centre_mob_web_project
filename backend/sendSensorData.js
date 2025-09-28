const axios = require('axios');

// Sample sensor data (same as before, can be expanded)
const sensorData = [
  {
    device: "esp33_01",
    event: "motion",
    timestamp: 1715292552,
    temperature: 28.5,
    humidity: 67.3,
    pressure: 1012.6,
    angle_status: "normal",
    mode: "ON"
  },
  {
    device: "esp33_01",
    event: "motion",
    timestamp: 1715302910,
    temperature: 28.7,
    humidity: 66.8,
    pressure: 1012.8,
    angle_status: "normal",
    mode: "ON"
  },
  {
    device: "esp33_01",
    event: "motion",
    timestamp: 1715303400,
    temperature: 28.6,
    humidity: 67.1,
    pressure: 1012.5,
    angle_status: "alert",
    mode: "ON"
  },
  {
    device: "esp33_01",
    event: "motion",
    timestamp: 1715304123,
    temperature: 28.8,
    humidity: 66.5,
    pressure: 1012.4,
    angle_status: "normal",
    mode: "ON"
  }
];

// Function to send batch data
axios.post('http://172.20.10.3:3000/api/iot/insert', sensorData, {
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ Data sent successfully:', response.data);
})
.catch(error => {
  console.error('❌ Error sending data:', error.response?.data || error.message);
});