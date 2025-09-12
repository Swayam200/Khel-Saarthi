import axios from 'axios';

// IMPORTANT: Replace this with your computer's local IP address
const API_URL = 'http://172.25.222.2:5001/api';

const api = axios.create({
    baseURL: API_URL,
});

export default api;