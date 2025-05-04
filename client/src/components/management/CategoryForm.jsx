import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave, FiX } from 'react-icons/fi';
import axios from '@/services/axios';
import styles from './CategoryForm.module.scss'; // Import dedicated styles

const CategoryForm = ({ category = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const isEditMode = !!category;
  
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || ''
      });
    }
  }, [category]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error if field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Название должно содержать минимум 2 символа';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for saving
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim()
      };
      
      // Save category
      let savedCategory;
      
      if (isEditMode) {
        const response = await axios.put(`/categories/${category.id}`, categoryData);
        savedCategory = response.data;
        toast.success('Категория успешно обновлена');
      } else {
        const response = await axios.post('/categories', categoryData);
        savedCategory = response.data;
        toast.success('Категория успешно создана');
      }
      
      // Call onSave callback with saved category
      if (onSave) {
        onSave(savedCategory);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Произошла ошибка при сохранении категории');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.categoryForm}>
      <div className={styles.formHeader}>
        <h2>{isEditMode ? 'Редактирование категории' : 'Новая категория'}</h2>
        <div className={styles.formActions}>
          <button 
            className={`${styles.button} ${styles.primaryButton}`} 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <FiSave /> Сохранить
          </button>
          <button 
            className={`${styles.button} ${styles.secondaryButton}`} 
            onClick={onCancel}
            disabled={isLoading}
          >
            <FiX /> Отмена
          </button>
        </div>
      </div>
      
      <div className={styles.formContent}>
        <div className={styles.formSection}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Название категории <span className={styles.required}>*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? styles.hasError : ''}
                placeholder="Например: Квартиры, Дома, Коммерческая недвижимость"
              />
              {errors.name && <div className={styles.errorText}>{errors.name}</div>}
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Укажите описание категории (необязательно)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm; 