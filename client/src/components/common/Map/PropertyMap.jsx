import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { formatRUB } from '@utils/formatters';
import { loadYandexMaps, createMap, createPlacemark } from '@services/yandexMapsService';
import styles from './PropertyMap.module.scss';

// Функция для получения URL изображения
const getImageUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Otherwise, prepend the API base URL (stripping out the /api part)
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const serverUrl = baseUrl.replace(/\/api$/, '');
  
  // Remove any leading slash from the path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  return `${serverUrl}/${cleanPath}`;
};

const PropertyMap = ({ property }) => {
  const mapRef = useRef(null);
  const mapInitialized = useRef(false);
  
  useEffect(() => {
    if (!property || !property.coordinates || mapInitialized.current) return;
    
    const initMap = async () => {
      try {
        if (!mapRef.current) return;
        
        await loadYandexMaps();
        
        // Если карта уже инициализирована, не продолжаем
        if (mapInitialized.current) return;
        
        const coordinates = [property.coordinates.lat, property.coordinates.lng];
        
        // Создаем карту
        const map = await createMap(mapRef.current, {
          center: coordinates,
          zoom: 15,
          controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
        });
        
        // Определяем иконку в зависимости от типа операции
        const placemarkOption = property.operation_type === 'rent' 
          ? 'islands#blueHomeIcon' 
          : 'islands#redHomeIcon';
        
        // Создаем метку для объекта
        const placemark = await createPlacemark(
          coordinates, 
          {
            hintContent: property.title,
            balloonContentHeader: `<div style="font-weight: bold; font-size: 16px;">${property.title}</div>`,
            balloonContentBody: `
              <div style="font-size: 14px;">
                <div style="margin-bottom: 10px;">
                  ${property.photos && property.photos.length > 0 
                    ? `<img src="${getImageUrl(property.photos[0]?.url || property.photos[0])}" 
                        style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 4px;">` 
                    : ''}
                </div>
                <p style="font-weight: bold; color: #2069a1; font-size: 16px; margin-bottom: 5px;">
                  ${formatRUB(property.price)} ${property.operation_type === 'rent' ? '/ мес.' : ''}
                </p>
                <p style="margin-bottom: 5px;">
                  <b>${property.operation_type === 'rent' ? 'Аренда' : 'Продажа'}</b>
                  ${property.category ? ` • ${property.category.name}` : ''}
                  ${property.area ? ` • ${property.area} м²` : ''}
                </p>
                <p style="color: #6c757d; margin-bottom: 10px;">
                  ${property.address || `${property.city}${property.district ? `, ${property.district}` : ''}`}
                </p>
              </div>
            `
          },
          {
            preset: placemarkOption,
            balloonMaxWidth: 300,
            hideIconOnBalloonOpen: false
          }
        );
        
        // Добавляем метку на карту
        map.geoObjects.add(placemark);
        
        // Устанавливаем флаг, что карта инициализирована
        mapInitialized.current = true;
      } catch (error) {
        console.error('Error initializing property map:', error);
      }
    };
    
    initMap();
    
    // Очистка
    return () => {
      mapInitialized.current = false;
    };
  }, [property]);
  
  return (
    <div className={styles.propertyMapContainer}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

PropertyMap.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    price: PropTypes.number,
    operation_type: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string
    }),
    photos: PropTypes.array,
    area: PropTypes.number,
    coordinates: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    }),
    address: PropTypes.string,
    city: PropTypes.string,
    district: PropTypes.string
  }).isRequired
};

export default PropertyMap; 