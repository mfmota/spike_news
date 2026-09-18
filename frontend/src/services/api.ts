import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storageService } from './storage.service';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Request Interceptor:
 * Injeta automaticamente o token JWT Bearer em todas as requisições autenticadas.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storageService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Trata respostas de erro globais, como 401 Unauthorized (token expirado/inválido).
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const originalRequest = error.config;

      // Se receber 401 (Unauthorized) e não for uma tentativa do próprio login
      if (status === 401 && originalRequest && !originalRequest.url?.includes('/auth/login')) {
        storageService.clearAuth();
        // Dispara evento customizado para notificar os contextos da aplicação
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;

