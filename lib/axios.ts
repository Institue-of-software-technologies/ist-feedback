import axios from 'axios';

// Create a custom Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://feedback.isteducation.com/api',
  // timeout: 40000, // Set a timeout
});

// Add a request interceptor to inject the token into headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // You can use cookies or other methods to store tokens
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Clear token on unauthorized
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
