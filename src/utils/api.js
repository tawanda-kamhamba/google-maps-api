// API configuration
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with base URL
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 