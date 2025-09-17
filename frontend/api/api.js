import axios from 'axios';
import Constants from 'expo-constants';

let API_URL = '';

// Check if we are in a development environment
if (process.env.NODE_ENV === 'development') {
    // In development, use the local IP address
    const { hostUri } = Constants.expoConfig;
    const ipAddress = hostUri.split(':')[0];
    API_URL = `http://${ipAddress}:5001/api`;
} else {
    // In production (the deployed PWA), use the live Render URL
    API_URL = 'https://khel-saarthi-backend.onrender.com/api';
}

console.log(`Connecting to API at: ${API_URL}`);

const api = axios.create({
    baseURL: API_URL,
});

export default api;