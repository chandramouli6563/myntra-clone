import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

function resolveDefaultBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv;

  const fromConfig = (Constants?.expoConfig as any)?.extra?.apiBaseUrl as string | undefined;
  if (fromConfig && fromConfig.trim().length > 0) return fromConfig;

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
}

const apiBaseURL = resolveDefaultBaseUrl();

export const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const authToken = response.headers['x-auth-token'];
    if (authToken) {
      AsyncStorage.setItem('authToken', authToken);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('authToken');
      AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
