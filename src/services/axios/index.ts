import axios from 'axios';
import { BASE_API_URL } from '../../config/envs';
import { authStorage } from '../../hooks/auth-storage';
import { handleUnauthorizedResponse } from './utils';

export const apiClient = axios.create({
  baseURL: BASE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-is-collector'] = 'true';
    config.headers['x-auth'] = 'v1';
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    switch (status) {
      case 401:
        handleUnauthorizedResponse();
        break;
      case 403:
        handleUnauthorizedResponse();
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);
