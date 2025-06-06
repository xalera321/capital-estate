import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import ListPage from '@components/management/ListPage';
import PropertyModal from '@components/management/PropertyModal';
import DeleteConfirmationModal from '@components/management/DeleteConfirmationModal';
import HideConfirmationModal from '@components/management/HideConfirmationModal';
import { formatRUB, getImageUrl } from '@utils/formatters';
import axios from '@services/axios';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  const [hideModal, setHideModal] = useState({ isOpen: false, id: null, name: '', isHidden: false });
  
  // Column configuration
  const columns = [
    {
      id: 'photos',
      label: 'Фото',
      width: '80px',
      formatter: (value) => {
        if (!value || value.length === 0) return null;
        
        // Try to extract URL from the photo - handle different data structures
        let photoUrl = null;
        
        if (typeof value[0] === 'string') {
          // Direct URL string
          photoUrl = value[0];
        } else if (value[0] && typeof value[0] === 'object') {
          // Photo object with url property
          photoUrl = value[0].url;
        }
        
        // Format the URL properly
        photoUrl = getImageUrl(photoUrl);
        
        return photoUrl ? { type: 'image', src: photoUrl } : null;
      }
    },
    {
      id: 'price',
      label: 'Цена',
      sortable: true,
      width: '15%',
      formatter: (value) => formatRUB(value)
    },
    {
      id: 'operation_type',
      label: 'Тип операции',
      sortable: true,
      width: '15%',
      formatter: (value) => ({ 
        type: 'enum', 
        value: value === 'rent' ? 'Аренда' : 'Продажа', 
        variant: value === 'rent' ? 'primary' : 'secondary' 
      })
    },
    {
      id: 'area',
      label: 'Площадь',
      sortable: true,
      width: '15%',
      formatter: (value) => `${value} м²`
    },
    {
      id: 'is_hidden',
      label: 'Статус',
      sortable: true,
      width: '15%',
      formatter: (value) => ({ 
        type: 'status', 
        value: !value ? 'Активен' : 'Скрыт',
        status: !value ? 'active' : 'inactive'
      })
    }
  ];
  
  // Filters configuration
  const filters = [
    {
      id: 'operation_type',
      label: 'Тип операции',
      type: 'select',
      options: [
        { value: '', label: 'Все' },
        { value: 'rent', label: 'Аренда' },
        { value: 'buy', label: 'Продажа' }
      ]
    },
    {
      id: 'is_hidden',
      label: 'Статус',
      type: 'select',
      options: [
        { value: '', label: 'Все' },
        { value: 'false', label: 'Активен' },
        { value: 'true', label: 'Скрыт' }
      ]
    }
  ];
  
  // Fetch properties
  const fetchProperties = useCallback(async (filters = {}) => {
    setIsLoading(true);
    try {
      // Format filters for API
      const apiFilters = { ...filters };
      
      // Convert string booleans to actual booleans
      if (apiFilters.is_hidden === 'true') {
        apiFilters.is_hidden = true;
      } else if (apiFilters.is_hidden === 'false') {
        apiFilters.is_hidden = false;
      }
      
      const response = await axios.get('/properties/admin', { params: apiFilters });
      console.log('Properties from API:', response.data);
      
      // If first property has photos, log the photo structure
      if (response.data.length > 0 && response.data[0].photos && response.data[0].photos.length > 0) {
        console.log('First property photos structure:', response.data[0].photos);
      }
      
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Не удалось загрузить список объектов');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);
  
  // Handle add property
  const handleAdd = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };
  
  // Handle edit property
  const handleEdit = (id) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setSelectedProperty(property);
      setIsModalOpen(true);
    }
  };
  
  // Handle property save (both add and edit)
  const handleSave = (savedProperty) => {
    setProperties(prev => {
      // If the property already exists, update it. Otherwise, add it.
      const exists = prev.some(p => p.id === savedProperty.id);
      
      if (exists) {
        return prev.map(p => p.id === savedProperty.id ? savedProperty : p);
      } else {
        return [...prev, savedProperty];
      }
    });
  };
  
  // Open delete confirmation modal
  const handleDeleteClick = (id) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setDeleteModal({
        isOpen: true,
        id: id,
        name: property.address || 'объект недвижимости'
      });
    }
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    const { id } = deleteModal;
    
    try {
      await axios.delete(`/properties/${id}`);
      setProperties(properties.filter(property => property.id !== id));
      toast.success('Объект успешно удален');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Не удалось удалить объект');
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: '' });
    }
  };
  
  // Close delete modal
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, id: null, name: '' });
  };
  
  // Open visibility toggle confirmation modal
  const handleVisibilityClick = (id) => {
    const property = properties.find(p => p.id === id);
    
    if (property) {
      setHideModal({
        isOpen: true,
        id: id,
        name: property.title || 'объект недвижимости',
        isHidden: property.is_hidden
      });
    }
  };
  
  // Handle toggle visibility confirmation
  const handleVisibilityConfirm = async () => {
    const { id, isHidden } = hideModal;
    
    try {
      // Используем обычный endpoint обновления объекта
      await axios.put(`/properties/${id}`, {
        is_hidden: !isHidden
      });
      
      // Update property in state
      setProperties(prev => 
        prev.map(p => 
          p.id === id ? { ...p, is_hidden: !p.is_hidden } : p
        )
      );
      
      toast.success(`Объект ${isHidden ? 'отображен' : 'скрыт'}`);
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Не удалось изменить видимость объекта');
    } finally {
      setHideModal({ isOpen: false, id: null, name: '', isHidden: false });
    }
  };
  
  // Close visibility modal
  const handleVisibilityCancel = () => {
    setHideModal({ isOpen: false, id: null, name: '', isHidden: false });
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchProperties();
  };
  
  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const response = await axios.get('/properties/export', {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'properties-export.xlsx');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Экспорт успешно завершен');
    } catch (error) {
      console.error('Error exporting properties:', error);
      toast.error('Не удалось экспортировать данные');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters) => {
    fetchProperties(newFilters);
  };

  return (
    <div>
      <ListPage 
        title="Управление объектами"
        subtitle="Создание, редактирование и удаление объектов недвижимости"
        columns={columns}
        data={properties}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onRefresh={handleRefresh}
        onExport={handleExport}
        filters={filters}
        onFilterChange={handleFilterChange}
        customActions={[
          {
            label: (item) => item.is_hidden ? 'Отобразить' : 'Скрыть',
            icon: 'eye',
            action: handleVisibilityClick
          }
        ]}
        addButtonLabel="Добавить объект"
        emptyMessage="Нет объектов для отображения"
      />
      
      <PropertyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
        onSave={handleSave}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.name}
      />

      <HideConfirmationModal
        isOpen={hideModal.isOpen}
        onClose={handleVisibilityCancel}
        onConfirm={handleVisibilityConfirm}
        itemName={hideModal.name}
        isHidden={hideModal.isHidden}
      />
    </div>
  );
};

export default PropertiesPage; 