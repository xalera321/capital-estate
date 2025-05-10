import axios from '@services/axios';

/**
 * Создает новую запись обратной связи
 * @param {Object} feedbackData Данные формы обратной связи
 * @returns {Promise} Промис с результатом запроса
 */
export const createFeedback = async (feedbackData) => {
  try {
    const response = await axios.post('/feedback', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке обратной связи:', error);
    throw error;
  }
};

/**
 * Получает список всех записей обратной связи (для администраторов)
 * @returns {Promise} Промис со списком сообщений обратной связи
 */
export const getFeedbacks = async () => {
  try {
    const response = await axios.get('/feedback');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении списка обратной связи:', error);
    throw error;
  }
};

/**
 * Получает количество записей обратной связи (для администраторов)
 * @returns {Promise} Промис с количеством сообщений
 */
export const getFeedbacksCount = async () => {
  try {
    const response = await axios.get('/feedback/count');
    return response.data.count;
  } catch (error) {
    console.error('Ошибка при получении количества сообщений:', error);
    throw error;
  }
};

/**
 * Удаляет запись обратной связи (для администраторов)
 * @param {number} id Идентификатор записи
 * @returns {Promise} Промис с результатом запроса
 */
export const deleteFeedback = async (id) => {
  try {
    const response = await axios.delete(`/feedback/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении обратной связи:', error);
    throw error;
  }
}; 