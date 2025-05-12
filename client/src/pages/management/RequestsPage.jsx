import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import ListPage from '@/components/management/ListPage';
import DeleteConfirmationModal from '@/components/management/DeleteConfirmationModal';
import EditRequestModal from '@/components/management/EditRequestModal';
import { formatDate } from '@/utils/formatters';
import axios from '@/services/axios';
import { Link } from 'react-router-dom';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, request: null });
  
  // Конфигурация колонок для таблицы
  const columns = [
    {
      id: 'user_name',
      label: 'Имя',
      sortable: true,
      width: '15%'
    },
    {
      id: 'user_phone',
      label: 'Телефон',
      sortable: true,
      width: '15%'
    },
    {
      id: 'property',
      label: 'Объект',
      sortable: false,
      width: '25%',
      formatter: (property) => {
        if (!property) return 'Нет объекта';
        return {
          type: 'text',
          value: (
            <Link to={`/properties/${property.id}`} target="_blank" rel="noopener noreferrer">
              {property.title}
            </Link>
          )
        };
      }
    },
    {
      id: 'message',
      label: 'Сообщение',
      sortable: false,
      width: '25%',
      formatter: (value) => ({ 
        type: 'text', 
        value: value && value.length > 100 ? value.substring(0, 100) + '...' : (value || '—')
      })
    },
    {
      id: 'status',
      label: 'Статус',
      sortable: true,
      width: '10%',
      formatter: (value) => {
        let status = 'pending';
        let statusLabel = 'Новая';
        
        if (value === 'in_progress') {
          status = 'processing';
          statusLabel = 'В работе';
        } else if (value === 'completed') {
          status = 'success';
          statusLabel = 'Завершена';
        }
        
        return { type: 'status', status, value: statusLabel };
      }
    },
    {
      id: 'createdAt',
      label: 'Дата',
      sortable: true,
      width: '10%',
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
        { value: 'completed', label: 'Завершенные' }
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
  const fetchRequests = useCallback(async (filters = {}) => {
    setIsLoading(true);
    try {
      // Получаем все заявки
      const response = await axios.get('/requests');
      
      let filteredRequests = response.data;
      
      // Фильтры на стороне клиента (можно реализовать на сервере)
      if (filters.status) {
        filteredRequests = filteredRequests.filter(req => req.status === filters.status);
      }
      
      if (filters.date_from) {
        const dateFrom = new Date(filters.date_from);
        filteredRequests = filteredRequests.filter(
          req => new Date(req.createdAt) >= dateFrom
        );
      }
      
      if (filters.date_to) {
        const dateTo = new Date(filters.date_to);
        dateTo.setHours(23, 59, 59, 999); // Конец дня
        filteredRequests = filteredRequests.filter(
          req => new Date(req.createdAt) <= dateTo
        );
      }
      
      setRequests(filteredRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Не удалось загрузить список заявок');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);
  
  // Открытие модального окна для редактирования статуса
  const handleEdit = (id) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setEditModal({
        isOpen: true,
        request
      });
    }
  };
  
  // Сохранение изменений статуса
  const handleSaveStatus = async (newStatus) => {
    const { request } = editModal;
    if (!request) return;
    
    try {
      // Обновляем на сервере
      await axios.put(`/requests/${request.id}`, { status: newStatus });
      
      // Обновляем локально
      setRequests(prev => 
        prev.map(r => r.id === request.id ? { ...r, status: newStatus } : r)
      );
      
      const statusText = 
        newStatus === 'new' ? 'Новая' : 
        newStatus === 'in_progress' ? 'В работе' : 'Завершена';
      
      toast.success(`Статус заявки изменен на "${statusText}"`);
      
      // Закрываем модальное окно
      setEditModal({ isOpen: false, request: null });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Не удалось изменить статус заявки');
    }
  };
  
  // Закрытие модального окна редактирования
  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, request: null });
  };
  
  // Открытие модального окна для подтверждения удаления
  const handleDeleteClick = (id) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setDeleteModal({
        isOpen: true,
        id: id,
        name: `заявку от ${request.user_name}`
      });
    }
  };
  
  // Подтверждение удаления заявки
  const handleDeleteConfirm = async () => {
    const { id } = deleteModal;
    
    try {
      await axios.delete(`/requests/${id}`);
      setRequests(prev => prev.filter(req => req.id !== id));
      toast.success('Заявка удалена');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Не удалось удалить заявку');
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: '' });
    }
  };
  
  // Закрытие модального окна удаления
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, id: null, name: '' });
  };
  
  // Просмотр полной информации о заявке
  const handleView = (id) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      toast((t) => (
        <div>
          <h4 style={{ marginBottom: '10px' }}>Заявка от {request.user_name}</h4>
          <p style={{ marginBottom: '5px' }}><strong>Телефон:</strong> {request.user_phone}</p>
          <p style={{ marginBottom: '5px' }}>
            <strong>Объект:</strong> {
              request.property ? (
                <a 
                  href={`/properties/${request.property.id}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'underline' }}
                >
                  {request.property.title}
                </a>
              ) : 'Не указан'
            }
          </p>
          <p style={{ marginBottom: '5px' }}><strong>Статус:</strong> {
            request.status === 'new' ? 'Новая' : 
            request.status === 'in_progress' ? 'В работе' : 'Завершена'
          }</p>
          <p style={{ marginBottom: '5px' }}><strong>Дата:</strong> {formatDate(request.createdAt)}</p>
          {request.message && (
            <div style={{ marginTop: '10px' }}>
              <strong>Сообщение:</strong>
              <p style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{request.message}</p>
            </div>
          )}
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
    <div>
      <ListPage 
        title="Заявки на просмотр"
        subtitle="Управление заявками на просмотр объектов недвижимости"
        columns={columns}
        data={requests}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onView={handleView}
        filters={filters}
        onFilterChange={fetchRequests}
        onRefresh={() => fetchRequests()}
        showAdd={false}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.name}
      />
      
      <EditRequestModal
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
        request={editModal.request}
        onSave={handleSaveStatus}
      />
    </div>
  );
};

export default RequestsPage; 