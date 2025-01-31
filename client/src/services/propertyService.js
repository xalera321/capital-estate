import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

export const fetchCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const fetchLatestProperties = async (categoryId) => {
    const params = categoryId !== 'all' ? { categoryId } : {};
    const response = await api.get('/properties/latest', { params });
    return response.data;
};

export default {
    getProperties: (params) => api.get('/properties', { params }),
    getCategories: () => api.get('/categories')
};