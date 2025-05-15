import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave, FiX, FiUpload, FiTrash2, FiMapPin, FiArrowLeft, FiArrowRight, FiStar } from 'react-icons/fi';
import axios from '@/services/axios';
import { loadYandexMaps, createMap, createPlacemark } from '@/services/yandexMapsService';
import { getImageUrl } from '@/utils/formatters';
import styles from './PropertyForm.module.scss';

const PropertyForm = ({ property = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
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
      lat: 55.7558, // Default to Moscow coordinates
      lng: 37.6173
    },
    address: ''
  });
  
  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const isEditMode = !!property;
  
  // Add a new state for map
  const [mapState, setMapState] = useState({
    center: [55.7558, 37.6173], // Default to Moscow
    zoom: 10
  });
  
  const mapRef = useRef(null);
  
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
        ...formData, // Start with default values
        ...property,  // Override with property data
        // Ensure these values are always strings to prevent controlled/uncontrolled input switching
        price: property.price?.toString() || '',
        area: property.area?.toString() || '',
        rooms: property.rooms?.toString() || '',
        floor: property.floor?.toString() || '',
        total_floors: property.total_floors?.toString() || '',
        category_id: property.category_id?.toString() || '',
        features: propertyFeatureIds,
        coordinates: {
          lat: property.coordinates?.lat || 55.7558,
          lng: property.coordinates?.lng || 37.6173
        },
        address: property.address || ''
      });
      
      if (property.photos) {
        setPhotos(property.photos.map(photo => photo.url ? photo.url : photo));
      }
    }
  }, [property]);
  
  // Add map initialization logic
  useEffect(() => {
    let map = null;
    let placemark = null;
    let mapInitialized = false;
    
    const initMap = async () => {
      try {
        if (!mapRef.current) return;
        
        await loadYandexMaps();
        
        // Если карта уже инициализирована, не продолжаем
        if (mapInitialized) return;
        
        // Создаем карту
        map = await createMap(mapRef.current, {
          center: [formData.coordinates.lat, formData.coordinates.lng],
          zoom: 15,
          controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
        });
        
        // Сохраняем ссылку на карту в ref для доступа из других эффектов
        mapRef.current.__yaMap = map;
        
        // Создаем метку
        placemark = await createPlacemark(
          [formData.coordinates.lat, formData.coordinates.lng],
          {},
          {
            preset: 'islands#redDotIcon',
            draggable: true
          }
        );
        
        // Добавляем метку на карту
        map.geoObjects.add(placemark);
        
        // Обработчик клика по карте
        map.events.add('click', function(e) {
          const coords = e.get('coords');
          placemark.geometry.setCoordinates(coords);
          updateFormCoordinates(coords);
        });
        
        // Обработчик перетаскивания метки
        placemark.events.add('dragend', function() {
          const coords = placemark.geometry.getCoordinates();
          updateFormCoordinates(coords);
        });
        
        mapInitialized = true;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    const updateFormCoordinates = async (coords) => {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          lat: coords[0],
          lng: coords[1]
        }
      }));
      
      // Get address, city and district from coordinates
      try {
        await loadYandexMaps();
        const geocoder = await window.ymaps.geocode(coords);
        const result = geocoder.geoObjects.get(0);
        
        if (result) {
          const address = result.getAddressLine();
          // Get GeoObject metadata
          const geoObjectMetadata = result.properties.get('metaDataProperty').GeocoderMetaData;
          const addressComponents = geoObjectMetadata.Address.Components;
          
          // Log address data to debug
          console.log('Full address components:', addressComponents);
          console.log('Full address string:', address);
          console.log('GeoObject kind:', geoObjectMetadata.kind);
          console.log('GeoObject text:', geoObjectMetadata.text);
          
          // Find city and district in the address components
          let city = '';
          let district = '';
          
          // Try to extract administrative components
          let administrativeArea = '';
          let subAdministrativeArea = '';
          let locality = '';
          
          // First pass: find basic components
          addressComponents.forEach(component => {
            switch (component.kind) {
              case 'locality':
                locality = component.name;
                city = component.name; // The city is usually the locality
                break;
              case 'area':
              case 'district':
              case 'administrative_area':
                if (!administrativeArea) {
                  administrativeArea = component.name;
                } else if (!subAdministrativeArea) {
                  subAdministrativeArea = component.name;
                }
                break;
              case 'province':
              case 'country':
                // Skip these high-level components
                break;
              default:
                // Collect any components that might be districts
                if (component.name.includes('район') || 
                    component.name.includes('р-н') || 
                    component.name.includes('микрорайон')) {
                  district = component.name;
                }
            }
          });
          
          // Second pass: determine district from collected data
          if (!district) {
            // Try to use subAdministrativeArea if it exists and doesn't match city
            if (subAdministrativeArea && subAdministrativeArea !== city) {
              district = subAdministrativeArea;
            } 
            // If no suitable district found, try the administrative area
            else if (administrativeArea && administrativeArea !== city && 
                    !administrativeArea.includes('округ')) {
              district = administrativeArea;
            }
          }
          
          // Extra check: try to extract district from the full address if not found in components
          if (!district) {
            // Common district indicators in Russia
            const districtIndicators = ['район', 'р-н', 'микрорайон', 'мкр'];
            
            // Try to extract district from full address
            for (const indicator of districtIndicators) {
              const regex = new RegExp(`(\\S+\\s+${indicator})`, 'i');
              const match = address.match(regex);
              if (match) {
                district = match[1];
                break;
              }
            }
          }
          
          // Clean district name if needed
          if (district) {
            // Remove "район" and other common suffixes
            district = district.replace(/(район|р-н|микрорайон|мкр\.?)\s*$/i, '').trim();
            
            // Remove city name if it's included in the district name
            if (city && district.includes(city)) {
              district = district.replace(city, '').trim();
            }
            
            // Remove words that indicate it's not a district
            const nonDistrictIndicators = ['область', 'край', 'республика', 'округ', 'федеральный'];
            for (const indicator of nonDistrictIndicators) {
              if (district.toLowerCase().includes(indicator)) {
                district = ''; // This is not a district
                break;
              }
            }
          }
          
          console.log('Extracted: city =', city, 'district =', district);
          
          // Update form with geocoding results
          // Always include district in the update, even if it's empty
          setFormData(prev => ({
            ...prev,
            address,
            ...(city && { city }),
            district: district || '' // Always set district, even if empty
          }));
        }
      } catch (error) {
        console.error('Error getting address data:', error);
      }
    };
    
    initMap();
    
    // Cleanup
    return () => {
      if (map) {
        map.destroy();
        mapInitialized = false;
      }
    };
  }, [formData.coordinates.lat, formData.coordinates.lng]);
  
  // Update map when coordinates change
  useEffect(() => {
    const updateMapPosition = async () => {
      try {
        if (!mapRef.current || !mapRef.current.__yaMap) return;
        
        await loadYandexMaps();
        
        const map = mapRef.current.__yaMap;
        map.setCenter([formData.coordinates.lat, formData.coordinates.lng], 15);
          
        const placemark = map.geoObjects.get(0);
        if (placemark) {
          placemark.geometry.setCoordinates([formData.coordinates.lat, formData.coordinates.lng]);
        }
      } catch (error) {
        console.error('Error updating map position:', error);
      }
    };
    
    updateMapPosition();
  }, [formData.coordinates.lat, formData.coordinates.lng]);
  
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
    
    if (files.length > 10) {
      toast.error('Вы не можете загрузить больше 10 фотографий за один раз');
      return;
    }
    
    // Preview the uploaded files
    const newUploadedPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: false // Explicitly mark as not primary
    }));
    
    // Add new photos without changing the order or primary status
    setNewPhotos(prev => [...prev, ...newUploadedPhotos]);
  };
  
  const removePhoto = (index, isNewPhoto) => {
    if (isNewPhoto) {
      setNewPhotos(prev => {
        const updated = [...prev];
        
        // Revoke object URL to avoid memory leaks
        if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview);
        }
        
        updated.splice(index, 1);
        return updated;
      });
      
      // If we're removing the primary photo (first one)
      // and there are existing photos, we need to make the first existing photo primary
      if (index === 0 && photos.length > 0 && newPhotos.length === 1) {
        toast.info('Основная фотография изменена');
      }
    } else {
      setPhotos(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
      
      // If we're removing the primary photo and there are other photos,
      // the next photo becomes primary automatically
      if (index === 0 && (photos.length > 1 || newPhotos.length > 0)) {
        toast.info('Основная фотография изменена');
      }
    }
  };
  
  // Function to move photo to the left in order
  const movePhotoLeft = (index, isNewPhoto) => {
    if (index === 0) return; // Already first
    
    if (isNewPhoto) {
      setNewPhotos(prev => {
        const updated = [...prev];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        return updated;
      });
    } else {
      setPhotos(prev => {
        const updated = [...prev];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        return updated;
      });
    }
  };
  
  // Function to move photo to the right in order
  const movePhotoRight = (index, isNewPhoto) => {
    if (isNewPhoto) {
      if (index === newPhotos.length - 1) return; // Already last
      
      setNewPhotos(prev => {
        const updated = [...prev];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        return updated;
      });
    } else {
      if (index === photos.length - 1) return; // Already last
      
      setPhotos(prev => {
        const updated = [...prev];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        return updated;
      });
    }
  };
  
  // Function to set a photo as primary (first)
  const setAsPrimary = (index, isNewPhoto) => {
    // If the photo is already primary, do nothing
    if (isNewPhoto && index === 0 && photos.length === 0) return;
    if (!isNewPhoto && index === 0) return;
    
    if (isNewPhoto) {
      // Get the new photo that should be primary
      const photoToMakePrimary = newPhotos[index];
      
      // When setting a new photo as primary, we need to:
      // 1. Remove it from the newPhotos array
      const updatedNewPhotos = newPhotos.filter((_, i) => i !== index);
      
      // 2. Handle existing photos (make them non-primary)
      const existingPhotos = [...photos];
      
      // 3. Update both arrays
      setNewPhotos([photoToMakePrimary, ...updatedNewPhotos]);
      setPhotos([]);  // Clear existing photos array as we've made a new photo primary
      
      // If there were existing photos, convert them to new photos and add after our primary
      if (existingPhotos.length > 0) {
        const convertedExistingPhotos = existingPhotos.map(url => ({
          url: url,
          preview: getImageUrl(url)
        }));
        
        // Add at the end of updatedNewPhotos
        setNewPhotos(prev => [photoToMakePrimary, ...updatedNewPhotos, ...convertedExistingPhotos]);
      }
      
      toast.success('Фотография установлена в качестве основной');
    } else {
      // Make an existing photo primary - this was working correctly
      const photoUrl = photos[index];
      const remainingPhotos = photos.filter((_, i) => i !== index);
      setPhotos([photoUrl, ...remainingPhotos]);
      
      // If there are any new photos, they stay as new photos
      toast.success('Фотография установлена в качестве основной');
    }
  };
  
  // Helper function to determine which photo is primary
  const isPrimaryPhoto = (index, isNewPhoto) => {
    if (photos.length === 0) {
      // If no existing photos, the first new photo is primary
      return isNewPhoto && index === 0;
    } else {
      // If there are existing photos, the first one is primary
      return !isNewPhoto && index === 0;
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
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
  
  // Replace the old handleMapClick function
  const handleMapClick = () => {
    // This is no longer needed as map clicks are handled in the map initialization
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // We'll build the final photo URLs array
      let photoUrls = [];
      
      // Upload new photos if any have a file
      const newPhotosWithFiles = newPhotos.filter(photo => photo.file);
      const newPhotosWithUrls = newPhotos.filter(photo => photo.url && !photo.file);
      
      if (newPhotosWithFiles.length > 0) {
        const formData = new FormData();
        
        newPhotosWithFiles.forEach(photo => {
          formData.append('photos', photo.file);
        });
        
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Add the newly uploaded photos to our final array
        const uploadedPhotoUrls = response.data.urls;
        
        // Now create the final photo URLs array in the correct order
        const primaryIsNewPhoto = photos.length === 0 && newPhotos.length > 0;
        
        if (primaryIsNewPhoto) {
          // Start with the new uploaded photos
          photoUrls = [...uploadedPhotoUrls];
          
          // Add URLs from newPhotos that already had URLs
          if (newPhotosWithUrls.length > 0) {
            photoUrls = [...photoUrls, ...newPhotosWithUrls.map(p => p.url)];
          }
          
          // Add existing photos at the end
          photoUrls = [...photoUrls, ...photos];
        } else {
          // Existing photos come first
          photoUrls = [...photos];
          
          // Then new photos with existing URLs
          if (newPhotosWithUrls.length > 0) {
            photoUrls = [...photoUrls, ...newPhotosWithUrls.map(p => p.url)];
          }
          
          // Then newly uploaded photos
          photoUrls = [...photoUrls, ...uploadedPhotoUrls];
        }
      } else {
        // No new files to upload, just combine the arrays in the right order
        const primaryIsNewPhoto = photos.length === 0 && newPhotos.length > 0;
        
        if (primaryIsNewPhoto) {
          // If primary is in newPhotos
          photoUrls = [...newPhotos.map(p => p.url), ...photos];
        } else {
          // If primary is in photos or no primary
          photoUrls = [...photos, ...newPhotos.map(p => p.url || '')].filter(url => url);
        }
      }
      
      // Prepare data for saving
      const propertyData = {
        ...formData,
        photos: photoUrls,
        // Convert empty strings to null for numeric fields, but ensure proper type conversion
        rooms: formData.rooms === '' ? null : parseInt(formData.rooms, 10),
        floor: formData.floor === '' ? null : parseInt(formData.floor, 10),
        total_floors: formData.total_floors === '' ? null : parseInt(formData.total_floors, 10),
        price: formData.price === '' ? null : parseFloat(formData.price),
        area: formData.area === '' ? null : parseFloat(formData.area),
        category_id: formData.category_id === '' ? null : parseInt(formData.category_id, 10),
        address: formData.address
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
                <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`${styles.formControl} ${errors.city ? styles.hasError : ''}`}
                    placeholder="Город"
                    disabled={isLoading}
                  />
                  <FiMapPin className={styles.autoFillIcon} title="Заполняется автоматически при выборе точки на карте" />
                </div>
                {errors.city && <div className={styles.errorMessage}>{errors.city}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Район</label>
                <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={styles.formControl}
                    placeholder="Район"
                    disabled={isLoading}
                  />
                  <FiMapPin className={styles.autoFillIcon} title="Заполняется автоматически при выборе точки на карте" />
                </div>
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
          
          <div className={`${styles.formSection} ${styles.fullWidth}`}>
            <h3>Расположение на карте</h3>
            <p className={styles.formHint}>
              Нажмите на карту, чтобы выбрать местоположение объекта недвижимости. 
              <span className={styles.highlightHint}>Город и район будут заполнены автоматически.</span>
            </p>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Адрес</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.formControl}
                placeholder="Адрес объекта недвижимости"
                disabled={isLoading}
              />
            </div>
            
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
            
            <div className={styles.mapContainer}>
              <div 
                id="property-map" 
                ref={mapRef} 
                style={{ width: '100%', height: '400px' }}
              ></div>
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
            <small className={styles.formHint}>
              Добавьте фотографии объекта (рекомендуемый размер: 1200x800px). 
              Первое фото будет использовано как основное. Вы можете изменить порядок фотографий.
            </small>
            
            {errors.photos && <div className={styles.errorMessage}>{errors.photos}</div>}
            
            <div className={styles.photosContainer}>
                <div className={styles.photosList}>
                {/* Display existing photos */}
                  {photos.map((photo, index) => (
                  <div key={`existing-${index}`} className={styles.photoItem}>
                    <div className={styles.photoPreview}>
                      <img src={getImageUrl(photo)} alt={`Фото ${index + 1}`} />
                      {/* Primary badge shows if this is determined to be the primary photo */}
                      {isPrimaryPhoto(index, false) && (
                        <div className={styles.primaryBadge}>Основное</div>
                      )}
                    </div>
                    <div className={styles.photoActions}>
                      <button
                        type="button"
                        className={styles.photoActionBtn}
                        onClick={() => movePhotoLeft(index, false)}
                        disabled={isLoading || index === 0}
                        title="Переместить влево"
                      >
                        <FiArrowLeft />
                      </button>
                      <button
                        type="button"
                        className={styles.photoActionBtn}
                        onClick={() => setAsPrimary(index, false)}
                        disabled={isLoading || isPrimaryPhoto(index, false)}
                        title="Сделать основным"
                      >
                        <FiStar />
                      </button>
                      <button
                        type="button"
                        className={styles.photoActionBtn}
                        onClick={() => removePhoto(index, false)}
                        disabled={isLoading}
                        title="Удалить"
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        type="button"
                        className={styles.photoActionBtn}
                        onClick={() => movePhotoRight(index, false)}
                        disabled={isLoading || index === photos.length - 1}
                        title="Переместить вправо"
                      >
                        <FiArrowRight />
                      </button>
                    </div>
                    </div>
                  ))}
              
                {/* Display newly uploaded photos */}
                  {newPhotos.map((photo, index) => (
                    <div key={`new-${index}`} className={styles.photoItem}>
                    <div className={styles.photoPreview}>
                      <img 
                        src={photo.preview || (photo.url ? getImageUrl(photo.url) : '')} 
                        alt={`Новое фото ${index + 1}`} 
                      />
                      {/* Show primary badge if this is determined to be the primary photo */}
                      {isPrimaryPhoto(index, true) && (
                        <div className={styles.primaryBadge}>Основное</div>
                      )}
                    </div>
                    <div className={styles.photoActions}>
                      <button
                        type="button"
                        className={styles.photoActionBtn}
                        onClick={() => movePhotoLeft(index, true)}
                        disabled={isLoading || index === 0}
                        title="Переместить влево"
                      >
                        <FiArrowLeft />
                      </button>
                      <button
                        type="button"
                        className={styles.photoActionBtn}
                        onClick={() => setAsPrimary(index, true)}
                        disabled={isLoading || isPrimaryPhoto(index, true)}
                        title="Сделать основным"
                      >
                        <FiStar />
                      </button>
                      <button
                        type="button"
                        className={styles.photoActionBtn}
                        onClick={() => removePhoto(index, true)}
                        disabled={isLoading}
                        title="Удалить"
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        type="button"
                        className={styles.photoActionBtn}
                        onClick={() => movePhotoRight(index, true)}
                        disabled={isLoading || index === newPhotos.length - 1}
                        title="Переместить вправо"
                      >
                        <FiArrowRight />
                      </button>
                    </div>
                    </div>
                  ))}
                </div>
              
              <div className={styles.uploadContainer}>
                <label className={styles.uploadButton} disabled={isLoading}>
                  <FiUpload /> Загрузить фото
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
                <small className={styles.uploadHint}>
                  Можно загружать до 10 фотографий за раз. Поддерживаемые форматы: JPEG, PNG, GIF, WebP
                </small>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm; 