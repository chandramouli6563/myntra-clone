import api from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface OTPData {
  phone: string;
  otp?: string;
  name?: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/api/auth/login', data);
    if (response.data && response.headers['x-auth-token']) {
      await AsyncStorage.setItem('authToken', response.headers['x-auth-token']);
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async signup(data: SignupData) {
    const response = await api.post('/api/auth/signup', data);
    if (response.data && response.headers['x-auth-token']) {
      await AsyncStorage.setItem('authToken', response.headers['x-auth-token']);
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async sendOTP(phone: string) {
    const response = await api.post('/api/auth/send-otp', { phone });
    return response.data;
  },

  async verifyOTP(data: OTPData) {
    const response = await api.post('/api/auth/verify-otp', data);
    if (response.data?.user) {
      const token = response.headers['x-auth-token'];
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await api.post('/api/auth/reset-password', { token, password });
    return response.data;
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('cart');
      await AsyncStorage.removeItem('wishlist');
    }
  },

  async getCurrentUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};
