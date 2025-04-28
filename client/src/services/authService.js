import api from './api';

// Helper to manage JWT token
const TOKEN_KEY = 'admin_jwt_token';

const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
};

// Initialize authentication headers if token exists
const initAuth = () => {
    const token = getToken();
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

// Auth API services
const authService = {
    // Step 1: Login with email & password
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            setToken(response.data.token);
        }
        return response.data;
    },

    // Step 2a: Verify 2FA token
    verify2FA: async (adminId, token) => {
        const response = await api.post('/auth/verify', { adminId, token });
        if (response.data.token) {
            setToken(response.data.token);
        }
        return response.data;
    },

    // Step 2b: Setup 2FA for first time
    setup2FA: async (adminId, token) => {
        const response = await api.post('/auth/setup', { adminId, token });
        if (response.data.token) {
            setToken(response.data.token);
        }
        return response.data;
    },

    // Check if user is authenticated
    checkAuth: async () => {
        try {
            console.log('Sending auth check request');
            const response = await api.get('/auth/check');
            console.log('Auth check response:', response.data);
            
            // If we got a valid response but user is not authenticated
            if (response.data && response.data.isAuthenticated === false) {
                console.log('Server reports not authenticated');
                removeToken();
                return { isAuthenticated: false };
            }
            
            return response.data;
        } catch (error) {
            console.error('Auth check request failed:', error);
            // If token is invalid, clear it
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.log('Unauthorized response, removing token');
                removeToken();
            }
            throw error;
        }
    },

    // Logout
    logout: () => {
        removeToken();
    },

    // Get authentication state
    isAuthenticated: () => {
        return !!getToken();
    }
};

// Initialize auth on import
initAuth();

export default authService; 