// src/features/requests/api/requestApi.js
import api from '@/services/api';

export const createRequest = async (data) => {
    try {
        const response = await api.post('/requests', data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Ошибка при создании заявки';
    }
};

// Дополнительные методы API при необходимости
export const getRequests = async () => {
    // ...
};