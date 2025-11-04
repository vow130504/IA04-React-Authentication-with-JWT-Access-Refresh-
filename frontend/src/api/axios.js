import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  clearAllTokens,
} from './authStore';

export const base = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Shared instance for authenticated calls
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to outgoing requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshPromise = null;

// Refresh access token using refresh token
async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    isRefreshing = false;
    throw new Error('No refresh token');
  }
  refreshPromise = base
    .post('/auth/refresh', { refreshToken })
    .then((res) => {
      const { accessToken: newAccess } = res.data || {};
      if (!newAccess) throw new Error('No access token in refresh response');
      setAccessToken(newAccess);
      return newAccess;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

// Handle 401 by attempting refresh, then retry once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    if (status === 401 && !original._retry) {
      try {
        original._retry = true;
        const newAccess = await refreshAccessToken();
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        // Refresh failed: clear tokens and redirect to login
        clearAllTokens();
        if (typeof window !== 'undefined') {
          window.location.replace('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
