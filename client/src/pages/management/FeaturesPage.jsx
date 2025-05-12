import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import ListPage from '@components/management/ListPage';
import FeatureModal from '@components/management/FeatureModal';
import DeleteConfirmationModal from '@components/management/DeleteConfirmationModal';
import axios from '@services/axios';

const FeaturesPage = () => {
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  
  // Column configuration
  const columns = [
    {
      id: 'name',
      label: 'Название',
      sortable: true,
      width: '60%'
    },
    {
      id: 'createdAt',
      label: 'Дата создания',
      sortable: true,
      width: '20%',
      formatter: (value) => {
        if (!value) return '—';
        return new Date(value).toLocaleDateString('ru-RU');
      }
    },
    {
      id: 'updatedAt',
      label: 'Последнее изменение',
      sortable: true,
      width: '20%',
      formatter: (value) => {
        if (!value) return '—';
        return new Date(value).toLocaleDateString('ru-RU');
      }
    }
  ];
  
  // Fetch features
  const fetchFeatures = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/features');
      setFeatures(response.data);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Не удалось загрузить список особенностей');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);
  
  // Handle add feature
  const handleAdd = () => {
    setSelectedFeature(null);
    setIsModalOpen(true);
  };
  
  // Handle edit feature
  const handleEdit = (id) => {
    const feature = features.find(f => f.id === id);
    if (feature) {
      setSelectedFeature(feature);
      setIsModalOpen(true);
    }
  };
  
  // Handle feature save (both add and edit)
  const handleSave = (savedFeature) => {
    setFeatures(prev => {
      // If the feature already exists, update it. Otherwise, add it.
      const exists = prev.some(f => f.id === savedFeature.id);
      
      if (exists) {
        return prev.map(f => f.id === savedFeature.id ? savedFeature : f);
      } else {
        return [...prev, savedFeature];
      }
    });
  };
  
  // Open delete confirmation modal
  const handleDeleteClick = (id) => {
    const feature = features.find(f => f.id === id);
    if (feature) {
      setDeleteModal({
        isOpen: true,
        id: id,
        name: feature.name
      });
    }
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    const { id } = deleteModal;
    
    try {
      await axios.delete(`/features/${id}`);
      setFeatures(features.filter(feature => feature.id !== id));
      toast.success('Особенность успешно удалена');
    } catch (error) {
      console.error('Error deleting feature:', error);
      if (error.response?.status === 409) {
        toast.error('Невозможно удалить особенность, так как она используется в объектах недвижимости');
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Не удалось удалить особенность');
      }
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: '' });
    }
  };
  
  // Close delete modal
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, id: null, name: '' });
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchFeatures();
  };

  return (
    <div>
      <ListPage 
        title="Управление особенностями"
        subtitle="Создание, редактирование и удаление особенностей объектов недвижимости"
        columns={columns}
        data={features}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onRefresh={handleRefresh}
        addButtonLabel="Добавить особенность"
        emptyMessage="Нет особенностей для отображения"
      />
      
      <FeatureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feature={selectedFeature}
        onSave={handleSave}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.name}
      />
    </div>
  );
};

export default FeaturesPage; 