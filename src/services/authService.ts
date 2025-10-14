import axios from 'axios';

// Use local backend for development, production backend for deployed app
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
  ? 'http://localhost:3000' 
  : 'https://carandgobackend-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the API URL being used for debugging
console.log('API Base URL:', API_BASE_URL);

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('Request error:', error.request);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: any) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/users/profile/me');
    return response.data;
  },
};

export const vehicleService = {
  async getAllVehicles() {
    const response = await api.get('/vehicles');
    return response.data;
  },

  async getVehicle(id: string) {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  async searchVehicles(filters: any) {
    console.log('API: Calling searchVehicles with filters:', filters);
    try {
      const response = await api.get('/vehicles/search', { params: filters });
      console.log('API: Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Error in searchVehicles:', error);
      throw error;
    }
  },

  async createVehicle(vehicleData: any) {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },
};

export const bookingService = {
  async createBooking(bookingData: any) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getBookings() {
    const response = await api.get('/bookings');
    return response.data;
  },

  async getBooking(id: string) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
};
