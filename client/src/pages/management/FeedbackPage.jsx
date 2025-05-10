import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import ListPage from '@/components/management/ListPage';
import { formatDate } from '@/utils/formatters';
import { getFeedbacks, deleteFeedback } from '@/features/feedback/api/feedbackApi';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Конфигурация колонок для таблицы
  const columns = [
    {
      id: 'name',
      label: 'Имя',
      sortable: true,
      width: '20%'
    },
    {
      id: 'phone',
      label: 'Телефон',
      sortable: true,
      width: '15%'
    },
    {
      id: 'email',
      label: 'Email',
      sortable: true,
      width: '20%',
      formatter: (value) => value || '—'
    },
    {
      id: 'message',
      label: 'Сообщение',
      sortable: false,
      width: '30%',
      formatter: (value) => ({ 
        type: 'text', 
        value: value.length > 100 ? value.substring(0, 100) + '...' : value 
      })
    },
    {
      id: 'createdAt',
      label: 'Дата',
      sortable: true,
      width: '15%',
      formatter: (value) => formatDate(value)
    }
  ];
  
  // Конфигурация фильтров
  const filters = [
    {
      id: 'date_from',
      label: 'Дата от',
      type: 'date'
    },
    {
      id: 'date_to',
      label: 'Дата до',
      type: 'date'
    }
  ];
  
  // Загрузка данных
  const fetchFeedbacks = useCallback(async (filters = {}) => {
    setIsLoading(true);
    try {
      // Получаем все сообщения обратной связи
      const data = await getFeedbacks();
      
      // Фильтруем данные, если есть фильтры по дате
      let filteredData = [...data];
      
      if (filters.date_from) {
        const dateFrom = new Date(filters.date_from);
        filteredData = filteredData.filter(item => 
          new Date(item.createdAt) >= dateFrom
        );
      }
      
      if (filters.date_to) {
        const dateTo = new Date(filters.date_to);
        dateTo.setHours(23, 59, 59, 999); // Конец дня
        filteredData = filteredData.filter(item => 
          new Date(item.createdAt) <= dateTo
        );
      }
      
      setFeedbacks(filteredData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Не удалось загрузить список сообщений');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);
  
  // Обработка удаления сообщения
  const handleDelete = async (id) => {
    try {
      await deleteFeedback(id);
      setFeedbacks(prev => prev.filter(feedback => feedback.id !== id));
      toast.success('Сообщение удалено');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Не удалось удалить сообщение');
    }
  };
  
  // Просмотр полного сообщения
  const handleView = (id) => {
    const feedback = feedbacks.find(f => f.id === id);
    if (feedback) {
      // Показываем модальное окно с полным сообщением
      toast((t) => (
        <div>
          <h4 style={{ marginBottom: '10px' }}>Сообщение от {feedback.name}</h4>
          <p style={{ marginBottom: '5px' }}><strong>Телефон:</strong> {feedback.phone}</p>
          {feedback.email && <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {feedback.email}</p>}
          <p style={{ marginBottom: '5px' }}><strong>Дата:</strong> {formatDate(feedback.createdAt)}</p>
          <p style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>{feedback.message}</p>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            style={{ 
              marginTop: '15px', 
              padding: '5px 10px', 
              background: '#f0f0f0', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Закрыть
          </button>
        </div>
      ), { duration: 10000 });
    }
  };
  
  return (
    <ListPage
      title="Обратная связь"
      subtitle="Управление сообщениями обратной связи"
      columns={columns}
      data={feedbacks}
      isLoading={isLoading}
      onDelete={handleDelete}
      onView={handleView}
      filters={filters}
      onFilter={fetchFeedbacks}
      showAdd={false} // Скрыть кнопку добавления
      showEdit={false} // Скрыть кнопку редактирования
    />
  );
};

export default FeedbackPage; 