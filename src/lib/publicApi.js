import axios from 'axios';
import { notifyRateLimited } from './rateLimit';

// Public API client for the marketing website
// Does NOT include credentials (cookies) to avoid CORS issues with wildcard origins
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      notifyRateLimited({
        message: error.response.data?.message,
        retryAfter: error.response.headers?.['retry-after'],
        data: error.response.data,
      });
    }
    return Promise.reject(error);
  },
);
