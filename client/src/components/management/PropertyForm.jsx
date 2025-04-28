import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import axios from '@services/axios';
import styles from './PropertyForm.module.scss';

const PropertyForm = ({ property = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    operation_type: 'buy',
    city: '',
    district: '',
    area: '',
    rooms: '',
    floor: '',
    total_floors: '',
    description: '',
    category_id: '',
    features: [],
    is_hidden: false,
    coordinates: {
      lat: 0,
      lng: 0
    }
  });
  
  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const isEditMode = !!property;
  
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categoriesResponse, featuresResponse] = await Promise.all([
          axios.get('/categories'),
          axios.get('/features')
        ]);
        
        setCategories(categoriesResponse.data);
        setFeatures(featuresResponse.data);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        toast.error('Не удалось загрузить категории и особенности');
      }
    };
    
    fetchMetadata();
  }, []);
  
  useEffect(() => {
    if (property) {
      // Format property data for the form
      const propertyFeatureIds = property.features ? property.features.map(f => f.id) : [];
      
      setFormData({
        ...property,
        features: propertyFeatureIds,
        category_id: property.category_id || ''
      });
      
      if (property.photos) {
        setPhotos(property.photos.map(photo => photo.url ? photo.url : photo));
      }
    }
  }, [property]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'coordinates.lat' || name === 'coordinates.lng') {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error if field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleFeatureToggle = (featureId) => {
    setFormData(prev => {
      const features = [...prev.features];
      
      if (features.includes(featureId)) {
        return { ...prev, features: features.filter(id => id !== featureId) };
      } else {
        return { ...prev, features: [...features, featureId] };
      }
    });
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Preview the uploaded files
    const newUploadedPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setNewPhotos(prev => [...prev, ...newUploadedPhotos]);
  };
  
  const removePhoto = (index, isNewPhoto) => {
    if (isNewPhoto) {
      setNewPhotos(prev => {
        const updated = [...prev];
        
        // Revoke object URL to avoid memory leaks
        URL.revokeObjectURL(updated[index].preview);
        
        updated.splice(index, 1);
        return updated;
      });
    } else {
      setPhotos(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Название должно содержать минимум 5 символов';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Цена должна быть больше 0';
    }
    
    if (!formData.city) {
      newErrors.city = 'Город обязателен для заполнения';
    }
    
    if (!formData.area || formData.area <= 0) {
      newErrors.area = 'Площадь должна быть больше 0';
    }
    
    if (photos.length === 0 && newPhotos.length === 0) {
      newErrors.photos = 'Добавьте хотя бы одно фото';
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
      let photoUrls = [...photos];
      
      // Upload new photos if any
      if (newPhotos.length > 0) {
        const formData = new FormData();
        
        newPhotos.forEach(photo => {
          formData.append('photos', photo.file);
        });
        
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        photoUrls = [...photoUrls, ...response.data.urls];
      }
      
      // Prepare data for saving
      const propertyData = {
        ...formData,
        photos: photoUrls,
        // Convert empty strings to null for numeric fields
        rooms: formData.rooms === '' ? null : formData.rooms,
        floor: formData.floor === '' ? null : formData.floor,
        total_floors: formData.total_floors === '' ? null : formData.total_floors,
        price: formData.price === '' ? null : formData.price,
        area: formData.area === '' ? null : formData.area
      };
      
      // Log the data being sent
      console.log('Submitting property data:', JSON.stringify(propertyData, null, 2));
      
      // Save property
      let savedProperty;
      
      if (isEditMode) {
        savedProperty = await axios.put(`/properties/${property.id}`, propertyData);
        toast.success('Объект недвижимости успешно обновлен');
      } else {
        savedProperty = await axios.post('/properties', propertyData);
        toast.success('Объект недвижимости успешно создан');
      }
      
      // Call onSave callback with saved property
      if (onSave) {
        onSave(savedProperty.data);
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Произошла ошибка при сохранении объекта');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.propertyForm}>
      <div className={styles.formHeader}>
        <h2>{isEditMode ? 'Редактирование объекта' : 'Новый объект недвижимости'}</h2>
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
            <FiX /> Отменить
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formSection}>
            <h3>Основная информация</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Название*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`${styles.formControl} ${errors.title ? styles.hasError : ''}`}
                placeholder="Название объекта недвижимости"
                disabled={isLoading}
              />
              {errors.title && <div className={styles.errorMessage}>{errors.title}</div>}
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Цена*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`${styles.formControl} ${errors.price ? styles.hasError : ''}`}
                  placeholder="Цена"
                  disabled={isLoading}
                />
                {errors.price && <div className={styles.errorMessage}>{errors.price}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Тип операции*</label>
                <select
                  name="operation_type"
                  value={formData.operation_type}
                  onChange={handleChange}
                  className={styles.formControl}
                  disabled={isLoading}
                >
                  <option value="buy">Продажа</option>
                  <option value="rent">Аренда</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Город*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`${styles.formControl} ${errors.city ? styles.hasError : ''}`}
                  placeholder="Город"
                  disabled={isLoading}
                />
                {errors.city && <div className={styles.errorMessage}>{errors.city}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Район</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder="Район"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Категория</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={styles.formControl}
                disabled={isLoading || categories.length === 0}
              >
                <option value="">Выберите категорию</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Детали объекта</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Площадь (м²)*</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className={`${styles.formControl} ${errors.area ? styles.hasError : ''}`}
                  placeholder="Площадь"
                  step="0.1"
                  disabled={isLoading}
                />
                {errors.area && <div className={styles.errorMessage}>{errors.area}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Количество комнат</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder="Количество комнат"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Этаж</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder="Этаж"
                  disabled={isLoading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Этажей в доме</label>
                <input
                  type="number"
                  name="total_floors"
                  value={formData.total_floors}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder="Всего этажей"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Подробное описание объекта недвижимости"
                rows={5}
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.formGroup}>
              <div className={styles.checkboxControl}>
                <input
                  type="checkbox"
                  name="is_hidden"
                  id="is_hidden"
                  checked={formData.is_hidden}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="is_hidden">Скрыть объект</label>
              </div>
              <small className={styles.formHint}>Скрытые объекты не отображаются на сайте</small>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Координаты на карте</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Широта</label>
                <input
                  type="number"
                  name="coordinates.lat"
                  value={formData.coordinates.lat}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder="Широта"
                  step="any"
                  disabled={isLoading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Долгота</label>
                <input
                  type="number"
                  name="coordinates.lng"
                  value={formData.coordinates.lng}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder="Долгота"
                  step="any"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <div className={`${styles.formSection} ${styles.fullWidth}`}>
            <h3>Особенности и удобства</h3>
            
            <div className={styles.featuresGrid}>
              {features.map(feature => (
                <div key={feature.id} className={styles.featureItem}>
                  <div className={styles.checkboxControl}>
                    <input
                      type="checkbox"
                      id={`feature-${feature.id}`}
                      checked={formData.features.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      disabled={isLoading}
                    />
                    <label htmlFor={`feature-${feature.id}`}>{feature.name}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`${styles.formSection} ${styles.fullWidth}`}>
            <h3>Фотографии</h3>
            <small className={styles.formHint}>Добавьте фотографии объекта (рекомендуемый размер: 1200x800px)</small>
            
            {errors.photos && <div className={styles.errorMessage}>{errors.photos}</div>}
            
            <div className={styles.photosContainer}>
              {photos.length > 0 && (
                <div className={styles.photosList}>
                  {photos.map((photo, index) => (
                    <div key={index} className={styles.photoItem}>
                      <img src={photo} alt={`Фото ${index + 1}`} />
                      <button
                        type="button"
                        className={styles.removePhotoBtn}
                        onClick={() => removePhoto(index, false)}
                        disabled={isLoading}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {newPhotos.length > 0 && (
                <div className={styles.photosList}>
                  {newPhotos.map((photo, index) => (
                    <div key={`new-${index}`} className={styles.photoItem}>
                      <img src={photo.preview} alt={`Новое фото ${index + 1}`} />
                      <button
                        type="button"
                        className={styles.removePhotoBtn}
                        onClick={() => removePhoto(index, true)}
                        disabled={isLoading}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className={styles.uploadContainer}>
                <label className={styles.uploadButton} disabled={isLoading}>
                  <FiUpload /> Загрузить фото
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm; 