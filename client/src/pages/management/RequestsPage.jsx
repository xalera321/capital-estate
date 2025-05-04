import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import ListPage from '@/components/management/ListPage';
import { getRequests, updateRequestStatus, deleteRequest } from '@/features/requests/api/requestApi';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Column configuration
  const columns = [
    {
      id: 'id',
      label: 'ID',
      width: '5%'
    },
    {
      id: 'user_name',
      label: 'Имя',
      sortable: true,
      width: '15%'
    },
    {
      id: 'user_phone',
      label: 'Телефон',
      width: '15%'
    },
    {
      id: 'message',
      label: 'Сообщение',
      width: '30%',
      formatter: (value) => value || '—'
    },
    {
      id: 'status',
      label: 'Статус',
      sortable: true,
      width: '15%',
      formatter: (value) => {
        let statusText, statusClass;
        
        switch(value) {
          case 'new':
            statusText = 'Новая';
            statusClass = 'active';
            break;
          case 'in_progress':
            statusText = 'В работе';
            statusClass = 'warning';
            break;
          case 'completed':
            statusText = 'Завершена';
            statusClass = 'success';
            break;
          default:
            statusText = value;
            statusClass = '';
        }
        
        return { 
          type: 'status', 
          value: statusText,
          status: statusClass
        };
      }
    },
    {
      id: 'createdAt',
      label: 'Дата создания',
      sortable: true,
      width: '15%',
      formatter: (value) => {
        if (!value) return '—';
        return new Date(value).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
  ];
  
  // Fetch requests
  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRequests();
      setRequests(data);
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
  
  // Handle change status - implemented for future use
  const handleChangeStatus = async (id, newStatus) => {
    try {
      await updateRequestStatus(id, newStatus);
      
      // Update the request in state
      setRequests(prev => 
        prev.map(req => 
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
      
      toast.success('Статус заявки обновлен');
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Не удалось обновить статус заявки');
    }
  };
  
  // Handle delete request
  const handleDelete = async (id) => {
    if (window.confirm('Вы действительно хотите удалить эту заявку?')) {
      try {
        await deleteRequest(id);
        setRequests(requests.filter(request => request.id !== id));
        toast.success('Заявка успешно удалена');
      } catch (error) {
        console.error('Error deleting request:', error);
        toast.error('Не удалось удалить заявку');
      }
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchRequests();
  };

  return (
    <div>
      <ListPage 
        title="Заявки пользователей"
        subtitle="Просмотр и управление заявками от пользователей"
        columns={columns}
        data={requests}
        isLoading={isLoading}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        emptyMessage="Нет заявок для отображения"
      />
    </div>
  );
};

export default RequestsPage; 