import api from '@/services/api';

export const fetchProperties = async (params) => {
    // Преобразуем параметр search для API
    const apiParams = { ...params };
    
    // Если есть поисковый запрос
    if (apiParams.search) {
        // Используем поисковый запрос как параметр keyword для API (поиск по заголовку, описанию и адресу)
        apiParams.keyword = apiParams.search;
        
        // Также дополнительно передаем как city и district, чтобы расширить область поиска
        apiParams.city = apiParams.search;
        apiParams.district = apiParams.search;
        
        // Удаляем оригинальный параметр
        delete apiParams.search;
    }
    
    const requestParams = {
        ...apiParams,
        page: apiParams?.page || 1,
        limit: 12
    };
    
    // Добавляем отладочный вывод параметров запроса
    console.log('Параметры запроса к API:', requestParams);
    
    const response = await api.get('/properties', {
        params: requestParams
    });
    return response.data;
};

export const fetchPropertiesCount = async (params = {}) => {
    try {
        // Преобразуем параметр search для API
        const apiParams = { ...params };
        
        // Если есть поисковый запрос
        if (apiParams.search) {
            // Используем поисковый запрос как параметр keyword для API (поиск по заголовку, описанию и адресу)
            apiParams.keyword = apiParams.search;
            
            // Также дополнительно передаем как city и district, чтобы расширить область поиска
            apiParams.city = apiParams.search;
            apiParams.district = apiParams.search;
            
            // Удаляем оригинальный параметр
            delete apiParams.search;
        }
        
        const cleanedParams = Object.fromEntries(
            Object.entries(apiParams)
                .filter(([_, value]) => value !== undefined && value !== '')
                .map(([key, value]) => [key, String(value)])
        );
        
        // Добавляем отладочный вывод параметров запроса
        console.log('Параметры запроса count к API:', cleanedParams);

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