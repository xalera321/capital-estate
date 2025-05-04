// src/features/requests/api/requestApi.js
import api from '@/services/api';

export const createRequest = async (data) => {
    try {
        const response = await api.post('/requests', data);
        return response.data;
    } catch (error) {
        console.error('Request creation error:', error);
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
        }
    }
};

// Дополнительные методы API для админ-панели
export const getRequests = async () => {
    try {
        const response = await api.get('/requests');
        return response.data;
    } catch (error) {
        console.error('Error fetching requests:', error);
        throw new Error('Не удалось загрузить список заявок');
    }
};

export const updateRequestStatus = async (id, status) => {
    try {
        const response = await api.put(`/requests/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating request:', error);
        throw new Error('Не удалось обновить статус заявки');
    }
};

export const deleteRequest = async (id) => {
    try {
        const response = await api.delete(`/requests/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting request:', error);
        throw new Error('Не удалось удалить заявку');
    }
};