import axios from 'axios';
import { Platform } from 'react-native';
import { getToken } from './authStorage';

// For Android emulator, use 10.0.2.2 instead of localhost
// For physical devices or iOS simulator, replace with your machine's IP address on the local network.
// Example: const BASE_URL = 'http://192.168.1.xxx:5000/api';

const getBaseUrl = () => {
  if (__DEV__) {
    // Using the machine's local IP address so physical devices can connect
    return 'http://192.168.48.40:5000/api'; 
  }
  return 'https://your-production-url.com/api';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
