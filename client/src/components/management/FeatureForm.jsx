import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave, FiX } from 'react-icons/fi';
import axios from '@/services/axios';
import styles from './FeatureForm.module.scss';

const FeatureForm = ({ feature = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: feature ? feature.name : '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const isEditMode = !!feature;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Название особенности обязательно';
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
      let savedFeature;
      
      if (isEditMode) {
        const response = await axios.put(`/features/${feature.id}`, formData);
        savedFeature = response.data;
        toast.success('Особенность успешно обновлена');
      } else {
        const response = await axios.post('/features', formData);
        savedFeature = response.data;
        toast.success('Особенность успешно создана');
      }
      
      if (onSave) {
        onSave(savedFeature);
      }
    } catch (error) {
      console.error('Error saving feature:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
        
        if (error.response.data.error.includes('unique')) {
          setErrors(prev => ({
            ...prev,
            name: 'Особенность с таким названием уже существует'
          }));
        }
      } else {
        toast.error('Произошла ошибка при сохранении особенности');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.featureForm}>
      <div className={styles.formHeader}>
        <h2>{isEditMode ? 'Редактирование особенности' : 'Новая особенность'}</h2>
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
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Название особенности*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.formControl} ${errors.name ? styles.hasError : ''}`}
            placeholder="Например: Балкон, Кондиционер, Парковка"
            disabled={isLoading}
          />
          {errors.name && <div className={styles.errorText}>{errors.name}</div>}
          <small className={styles.formHint}>Укажите название особенности или удобства объекта недвижимости</small>
        </div>
      </div>
    </div>
  );
};

export default FeatureForm; 