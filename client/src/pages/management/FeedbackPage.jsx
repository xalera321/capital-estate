import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import ListPage from '@/components/management/ListPage';
import DeleteConfirmationModal from '@/components/management/DeleteConfirmationModal';
import EditFeedbackStatusModal from '@/components/management/EditFeedbackStatusModal';
import { formatDate } from '@/utils/formatters';
import { getFeedbacks, deleteFeedback, updateFeedbackStatus } from '@/features/feedback/api/feedbackApi';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, feedback: null });
  
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
      id: 'status',
      label: 'Статус',
      sortable: true,
      width: '10%',
      formatter: (value) => {
        let statusStyle = 'pending'; // Default style
        let statusLabel = 'Новое'; // Default label

        if (value === 'in_progress') {
          statusStyle = 'processing';
          statusLabel = 'В работе';
        } else if (value === 'resolved') {
          statusStyle = 'success';
          statusLabel = 'Решено';
        }
        
        return { type: 'status', status: statusStyle, value: statusLabel };
      }
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
      id: 'status',
      label: 'Статус',
      type: 'select',
      options: [
        { value: '', label: 'Все' },
        { value: 'new', label: 'Новые' },
        { value: 'in_progress', label: 'В работе' },
        { value: 'resolved', label: 'Решенные' }
      ]
    },
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
      const data = await getFeedbacks(filters);
      
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
  
  // Открытие модального окна для подтверждения удаления
  const handleDeleteClick = (id) => {
    const feedback = feedbacks.find(f => f.id === id);
    if (feedback) {
      setDeleteModal({
        isOpen: true,
        id: id,
        name: `сообщение от ${feedback.name}`
      });
    }
  };
  
  // Подтверждение удаления сообщения
  const handleDeleteConfirm = async () => {
    const { id } = deleteModal;
    
    try {
      await deleteFeedback(id);
      setFeedbacks(prev => prev.filter(feedback => feedback.id !== id));
      toast.success('Сообщение удалено');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Не удалось удалить сообщение');
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: '' });
    }
  };
  
  // Закрытие модального окна удаления
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, id: null, name: '' });
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

  // Add handlers for editing status
  const handleEdit = (id) => {
    const feedbackItem = feedbacks.find(f => f.id === id);
    if (feedbackItem) {
      setEditModal({
        isOpen: true,
        feedback: feedbackItem 
      });
    }
  };

  const handleSaveStatus = async (newStatus) => {
    const { feedback } = editModal;
    if (!feedback) return;
    
    try {
      // API call to update status
      const updatedItem = await updateFeedbackStatus(feedback.id, newStatus); 
      
      setFeedbacks(prev => 
        prev.map(f => f.id === feedback.id ? { ...f, status: updatedItem.status } : f)
      );
      
      const statusText = 
        newStatus === 'new' ? 'Новое' : 
        newStatus === 'in_progress' ? 'В работе' : 'Решено';
      
      toast.success(`Статус обращения изменен на "${statusText}"`);
      setEditModal({ isOpen: false, feedback: null });
    } catch (error) {
      console.error('Error updating feedback status:', error);
      toast.error('Не удалось изменить статус обращения');
    }
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, feedback: null });
  };

  return (
    <div>
      <ListPage
        title="Обратная связь"
        subtitle="Управление сообщениями обратной связи"
        columns={columns}
        data={feedbacks}
        isLoading={isLoading}
        onDelete={handleDeleteClick}
        onView={handleView}
        onEdit={handleEdit}
        filters={filters}
        onFilter={fetchFeedbacks}
        showAdd={false} // Скрыть кнопку добавления
        showEdit={true} // Скрыть кнопку редактирования
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.name}
      />

      {/* Use new EditFeedbackStatusModal */}
      {editModal.isOpen && editModal.feedback && (
        <EditFeedbackStatusModal 
          isOpen={editModal.isOpen}
          onClose={handleCloseEditModal}
          feedback={editModal.feedback}
          onSave={handleSaveStatus}
        />
      )}
    </div>
  );
};

export default FeedbackPage; 