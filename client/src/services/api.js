// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token to every request if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('admin_jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor - handle auth errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token might be expired or invalid
            console.log('Auth error response:', error.response.status);
        }
        return Promise.reject(error);
    }
);

export default api;