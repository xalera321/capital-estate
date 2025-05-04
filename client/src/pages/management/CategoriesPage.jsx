import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import ListPage from '@/components/management/ListPage';
import CategoryModal from '@/components/management/CategoryModal';
import axios from '@/services/axios';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Column configuration
  const columns = [
    {
      id: 'name',
      label: 'Название',
      sortable: true,
      width: '30%'
    },
    {
      id: 'description',
      label: 'Описание',
      width: '40%',
      formatter: (value) => value || '—'
    },
    {
      id: 'propertiesCount',
      label: 'Объектов',
      sortable: true,
      width: '15%',
      formatter: (value) => value || 0
    },
    {
      id: 'createdAt',
      label: 'Дата создания',
      sortable: true,
      width: '15%',
      formatter: (value) => {
        if (!value) return '—';
        return new Date(value).toLocaleDateString('ru-RU');
      }
    }
  ];
  
  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching categories...');
      const response = await axios.get('/categories/admin/with-counts');
      console.log('Categories response:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
      toast.error('Не удалось загрузить список категорий');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // Handle add category
  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };
  
  // Handle edit category
  const handleEdit = (id) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setSelectedCategory(category);
      setIsModalOpen(true);
    }
  };
  
  // Handle category save (both add and edit)
  const handleSave = (savedCategory) => {
    setCategories(prev => {
      // If the category already exists, update it. Otherwise, add it.
      const exists = prev.some(c => c.id === savedCategory.id);
      
      if (exists) {
        return prev.map(c => c.id === savedCategory.id ? {
          ...savedCategory,
          propertiesCount: c.propertiesCount // Preserve property count
        } : c);
      } else {
        return [...prev, { ...savedCategory, propertiesCount: 0 }];
      }
    });
  };
  
  // Handle delete category
  const handleDelete = async (id) => {
    const category = categories.find(c => c.id === id);
    
    if (!category) return;
    
    if (category.propertiesCount > 0) {
      toast.error(`Невозможно удалить категорию, так как с ней связано ${category.propertiesCount} объектов`);
      return;
    }
    
    if (window.confirm('Вы действительно хотите удалить эту категорию?')) {
      try {
        await axios.delete(`/categories/${id}`);
        setCategories(categories.filter(category => category.id !== id));
        toast.success('Категория успешно удалена');
      } catch (error) {
        console.error('Error deleting category:', error);
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error('Не удалось удалить категорию');
        }
      }
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchCategories();
  };

  return (
    <div>
      <ListPage 
        title="Управление категориями"
        subtitle="Создание, редактирование и удаление категорий недвижимости"
        columns={columns}
        data={categories}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        addButtonLabel="Добавить категорию"
        emptyMessage="Нет категорий для отображения"
      />
      
      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSave={handleSave}
      />
    </div>
  );
};

export default CategoriesPage; 