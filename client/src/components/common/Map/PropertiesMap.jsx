import React, { useState, useEffect, useRef } from 'react';
import axios from '@services/axios';
import { formatRUB, getImageUrl } from '@utils/formatters';
import { loadYandexMaps, createMap, createPlacemark, createClusterer } from '@services/yandexMapsService';
import styles from './PropertiesMap.module.scss';

export const PropertiesMap = ({ fullscreen = false }) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInitialized = useRef(false);
  
  // Загрузка объектов с сервера
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/properties', {
          params: {
            limit: fullscreen ? 500 : 100, // Больше объектов для полноэкранного режима
            is_hidden: false
          }
        });
        
        // Отфильтровываем объекты без координат
        const propertiesWithCoordinates = response.data.data.filter(
          property => property.coordinates && 
                    property.coordinates.lat && 
                    property.coordinates.lng
        );
        
        setProperties(propertiesWithCoordinates);
      } catch (error) {
        console.error('Error fetching properties for map:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
    
    // При открытии модального окна нужно перезагрузить данные
    if (fullscreen && mapInitialized.current) {
      mapInitialized.current = false;
    }
  }, [fullscreen]);
  
  // Инициализация карты
  useEffect(() => {
    if (isLoading || mapInitialized.current || !properties.length) return;
    
    const initMap = async () => {
      try {
        if (!mapRef.current) return;
        
        await loadYandexMaps();
        
        // Если карта уже инициализирована, не продолжаем
        if (mapInitialized.current) return;
        
        // Определяем центр карты
        let center = [55.7558, 37.6173]; // Москва по умолчанию
        let zoom = 10;
        
        if (properties.length > 0) {
          const firstProperty = properties[0];
          center = [firstProperty.coordinates.lat, firstProperty.coordinates.lng];
          zoom = 12;
        }
        
        // Создаем карту
        const map = await createMap(mapRef.current, {
          center: center,
          zoom: zoom,
          controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
        });
        
        // Создаем кластеризатор для группировки объектов
        const clusterer = await createClusterer({
          preset: 'islands#redClusterIcons',
          groupByCoordinates: false,
          clusterDisableClickZoom: false
        });
        
        // Создаем и добавляем метки для каждого объекта
        const placemarksPromises = properties.map(property => 
          createPlacemark(
            [property.coordinates.lat, property.coordinates.lng],
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
              `,
              balloonContentFooter: `
                <a href="/properties/${property.id}" 
                   style="display: inline-block; background-color: #3498db; color: white; 
                          padding: 8px 16px; border-radius: 4px; text-decoration: none; 
                          font-weight: 500; text-align: center; width: 100%;">
                  Подробнее
                </a>
              `
            }, 
            {
              preset: property.operation_type === 'rent' ? 'islands#blueHomeIcon' : 'islands#redHomeIcon',
              balloonMaxWidth: 300,
              hideIconOnBalloonOpen: false
            }
          )
        );
        
        // Ждем создания всех меток
        const placemarks = await Promise.all(placemarksPromises);
        
        // Добавляем метки в кластеризатор и на карту
        clusterer.add(placemarks);
        map.geoObjects.add(clusterer);
        
        // Устанавливаем флаг, что карта инициализирована
        mapInitialized.current = true;
        
        // В полноэкранном режиме нужно обновить размер карты после рендера
        if (fullscreen) {
          setTimeout(() => {
            map.container.fitToViewport();
          }, 100);
        }
      } catch (error) {
        console.error('Error initializing properties map:', error);
      }
    };
    
    initMap();
    
    // Cleanup
    return () => {
      mapInitialized.current = false;
    };
  }, [isLoading, properties, fullscreen]);
  
  const mapContainerStyles = fullscreen 
    ? { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } 
    : { width: '100%', height: '600px' };
  
  return (
    <section className={`${styles.mapSection} ${fullscreen ? styles.fullscreenMap : ''}`}>
      <div className={styles.container}>
        {!fullscreen && (
          <>
            <h2 className={styles.title}>Найдите объекты на карте</h2>
            <p className={styles.subtitle}>Просмотрите все доступные объекты недвижимости на интерактивной карте</p>
          </>
        )}
        
        <div className={styles.mapContainer}>
          {isLoading ? (
            <div className={styles.loader}>Загрузка карты...</div>
          ) : (
            <div ref={mapRef} style={mapContainerStyles}></div>
          )}
        </div>
      </div>
    </section>
  );
}; 