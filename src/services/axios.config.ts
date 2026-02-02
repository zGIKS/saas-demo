import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getTokenFromCookie } from '@/lib/auth';

// Axios configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosConfig: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosConfig.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors with more detail
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      if (status === 400) {
        console.error('Bad Request:', data?.message || 'Invalid request data');
      } else if (status === 401) {
        console.error('Unauthorized:', data?.message || 'Authentication required');
      } else if (status === 403) {
        console.error('Forbidden:', data?.message || 'Access denied');
      } else if (status === 404) {
        console.error('Not Found:', data?.message || 'Resource not found');
      } else if (status === 409) {
        console.error('Conflict:', data?.message || 'Resource already exists');
      } else if (status >= 500) {
        console.error('Server Error:', data?.message || 'Internal server error');
      } else {
        console.error(`HTTP ${status} Error:`, data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Network error (no response)
      console.error('Network Error: No response from server. Check your connection or API URL.');
    } else {
      // Other errors
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;