import axios from 'axios';

// Base URL del backend
const BASE_URL = import.meta.env.DEV 
  ? '/api' // Usar proxy en desarrollo
  : 'http://arreglaya-core-backend.us-east-1.elasticbeanstalk.com'; // URL directa en producción

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
