import api from '@/services/api';

export const fetchProperties = async (params) => {
    const response = await api.get('/properties', {
        params: {
            ...params,
            page: params?.page || 1,
            limit: 12
        }
    });
    return response.data;
};

export const fetchPropertiesCount = async (params = {}) => {
    try {
        const cleanedParams = Object.fromEntries(
            Object.entries(params)
                .filter(([_, value]) => value !== undefined && value !== '')
                .map(([key, value]) => [key, String(value)])
        );

        const response = await api.get('/properties/count', {
            params: cleanedParams
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching properties count:', error);
        throw error;
    }
};

export const fetchLatestProperties = async (categoryId) => {
    const params = categoryId && categoryId !== 'all' ? { categoryId } : {};
    const response = await api.get('/properties/latest', { params });
    return response.data;
};

export const fetchCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};