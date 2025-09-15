import axios from 'axios';
import Constants from 'expo-constants';

// Get the host URI from the Expo constants
const { hostUri } = Constants.expoConfig;

// Extract the IP address from the host URI. 
// The host URI is typically in the format '192.168.1.5:8081'.
// We need to split it at the colon and take the first part.
const ipAddress = hostUri.split(':')[0];

// Construct the base URL for your backend server
const API_URL = `http://${ipAddress}:5001/api`;

console.log(`Connecting to API at: ${API_URL}`); // This will log the URL in your terminal

const api = axios.create({
    baseURL: API_URL,
});

export default api;