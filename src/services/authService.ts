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

  async getGovBrAuthUrl(): Promise<{ authUrl?: string }> {
    const response = await api.get('/gov-br/auth-url');
    return response.data;
  },

  async validateDocument(body: { document: string; type: 'CPF' | 'CNPJ' }): Promise<{ success: boolean; result?: any; error?: string }> {
    const response = await api.post('/gov-br/validate-document', body);
    return response.data;
  },

  async updateProfile(userData: any) {
    const token = localStorage.getItem('token');
    console.log('Updating profile with token:', token ? 'Token exists' : 'No token');
    console.log('User data being sent:', userData);
    
    const response = await api.patch('/users/profile/me', userData);
    return response.data;
  },

  async uploadProfilePhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post('/users/profile/me/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** URL para foto armazenada em arquivo (legado). Para foto no DB (profilePhoto === 'inline') use fetchProfilePhotoBlobUrl(). */
  getProfilePhotoUrl(profilePhoto: string | undefined): string | undefined {
    if (!profilePhoto || profilePhoto === 'inline') return undefined;
    if (profilePhoto.startsWith('http')) return profilePhoto;
    return `${API_BASE_URL}${profilePhoto.startsWith('/') ? '' : '/'}${profilePhoto}`;
  },

  /** Busca a foto de perfil do backend (armazenada no DB) e retorna uma blob URL. Revogue com URL.revokeObjectURL ao desmontar. */
  async fetchProfilePhotoBlobUrl(): Promise<string | null> {
    try {
      const response = await api.get('/users/profile/me/photo', { responseType: 'blob' });
      return URL.createObjectURL(response.data);
    } catch {
      return null;
    }
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
    console.log('API: Full URL will be:', `${API_BASE_URL}/vehicles/search`);
    try {
      const response = await api.get('/vehicles/search', { params: filters });
      console.log('API: Response received:', response.data);
      console.log('API: Response status:', response.status);
      console.log('API: Number of vehicles in response:', response.data?.length || 0);
      return response.data;
    } catch (error) {
      console.error('API: Error in searchVehicles:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      throw error;
    }
  },

  async createVehicle(vehicleData: any) {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  async updateVehicle(id: string, vehicleData: any) {
    const response = await api.patch(`/vehicles/${id}`, vehicleData);
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

  async checkAvailability(vehicleId: string, startDate: string, endDate: string) {
    const response = await api.get(`/bookings/availability/${vehicleId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  async getBlockedDates(vehicleId: string) {
    const response = await api.get(`/bookings/blocked-dates/${vehicleId}`);
    return response.data;
  },

  async confirmBooking(id: string) {
    const response = await api.post(`/bookings/${id}/confirm`);
    return response.data;
  },

  async rejectBooking(id: string, reason?: string) {
    const response = await api.post(`/bookings/${id}/reject`, { reason });
    return response.data;
  },

  async confirmReturn(id: string, notes?: string) {
    const response = await api.post(`/bookings/${id}/confirm-return`, { notes });
    return response.data;
  },

  async cancelBooking(id: string, reason: string) {
    const response = await api.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  async getPendingForLessor(lessorId: string) {
    const response = await api.get(`/bookings/lessor/${lessorId}/pending`);
    return response.data;
  },

  async getAwaitingReturnForLessor(lessorId: string) {
    const response = await api.get(`/bookings/lessor/${lessorId}/awaiting-return`);
    return response.data;
  },
};

export const paymentService = {
  async pay(bookingId: string, method: 'credit_card' | 'pix', cardData?: { number: string; name: string; expiry: string; cvv: string }) {
    const response = await api.post('/payments/pay', { bookingId, method, cardData });
    return response.data;
  },
};

export const favoriteService = {
  async getFavorites() {
    const response = await api.get('/favorites');
    return response.data;
  },

  async getFavoriteIds(): Promise<string[]> {
    const response = await api.get('/favorites/ids');
    return response.data;
  },

  async checkFavorite(vehicleId: string): Promise<boolean> {
    const response = await api.get(`/favorites/check/${vehicleId}`);
    return response.data.isFavorite;
  },

  async addFavorite(vehicleId: string) {
    const response = await api.post('/favorites', { vehicleId });
    return response.data;
  },

  async removeFavorite(vehicleId: string) {
    await api.delete(`/favorites/${vehicleId}`);
  },

  async toggleFavorite(vehicleId: string): Promise<{ isFavorite: boolean }> {
    const response = await api.post('/favorites/toggle', { vehicleId });
    return response.data;
  },
};

export const reviewService = {
  async getVehicleReviews(vehicleId: string) {
    const response = await api.get(`/vehicles/${vehicleId}/reviews`);
    return response.data;
  },

  async createReview(vehicleId: string, data: { rating: number; comment?: string }) {
    const response = await api.post(`/vehicles/${vehicleId}/reviews`, data);
    return response.data;
  },

  async updateReview(reviewId: string, data: { rating?: number; comment?: string }) {
    const response = await api.put(`/vehicles/reviews/${reviewId}`, data);
    return response.data;
  },

  async deleteReview(reviewId: string) {
    await api.delete(`/vehicles/reviews/${reviewId}`);
  },
};
