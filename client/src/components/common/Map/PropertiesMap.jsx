import React, { useState, useEffect, useRef } from 'react';
import axios from '@services/axios';
import { formatRUB, getImageUrl } from '@utils/formatters';
import { loadYandexMaps, createMap, createPlacemark, createClusterer } from '@services/yandexMapsService';
import styles from './PropertiesMap.module.scss';

export const PropertiesMap = ({ fullscreen = false, externalProperties = null }) => {
  console.log('[PropertiesMap] Received externalProperties:', externalProperties);
  const [internalProperties, setInternalProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInitialized = useRef(false);
  
  const propertiesToDisplay = externalProperties || internalProperties;
  console.log('[PropertiesMap] propertiesToDisplay:', propertiesToDisplay);

  // Загрузка объектов с сервера (только если externalProperties не предоставлены)
  useEffect(() => {
    console.log('[PropertiesMap] Effect for data loading/handling. externalProperties:', externalProperties);
    if (externalProperties) {
      console.log('[PropertiesMap] Using externalProperties.');
      setIsLoading(false); 
      mapInitialized.current = false; 
      return;
    }

    console.log('[PropertiesMap] Fetching internal properties.');
    const fetchProperties = async () => {
      setIsLoading(true);
      mapInitialized.current = false; 
      try {
        const response = await axios.get('/properties', {
          params: {
            limit: fullscreen ? 500 : 100,
            is_hidden: false
          }
        });
        
        const propertiesWithCoordinates = response.data.data.filter(
          property => property.coordinates && 
                    property.coordinates.lat && 
                    property.coordinates.lng
        );
        
        setInternalProperties(propertiesWithCoordinates);
        console.log('[PropertiesMap] Fetched internal properties:', propertiesWithCoordinates);
      } catch (error) {
        console.error('Error fetching properties for map:', error);
        setInternalProperties([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [fullscreen, externalProperties]);
  
  // Инициализация карты
  useEffect(() => {
    console.log(
      '[PropertiesMap] Effect for map initialization. isLoading:', isLoading, 
      'mapInitialized.current:', mapInitialized.current, 
      'propertiesToDisplay.length:', propertiesToDisplay.length
    );

    if (mapRef.current && mapRef.current.__ymaps_map__ && (!propertiesToDisplay || propertiesToDisplay.length === 0)) {
      console.log('[PropertiesMap] Clearing existing map because propertiesToDisplay is empty.');
      mapRef.current.__ymaps_map__.destroy();
      mapRef.current.__ymaps_map__ = null;
      mapInitialized.current = false; // Готов к новой инициализации, если данные появятся
    }

    if (isLoading || mapInitialized.current || !propertiesToDisplay || propertiesToDisplay.length === 0) {
      if (externalProperties && externalProperties.length === 0 && !isLoading) {
          console.log("[PropertiesMap] External properties provided but empty, map will not initialize (or was cleared).");
      }
      console.log('[PropertiesMap] Conditions not met for map initialization. Returning.');
      return;
    }
    
    console.log('[PropertiesMap] Initializing map...');
    const initMap = async () => {
      try {
        if (!mapRef.current) {
          console.log('[PropertiesMap] mapRef.current is null. Cannot init map.');
          return;
        }
        
        console.log('[PropertiesMap] Calling loadYandexMaps()');
        await loadYandexMaps();
        
        if (mapInitialized.current) {
            console.log('[PropertiesMap] Map already initialized. Skipping initMap.');
            return;
        }
        console.log('[PropertiesMap] Map not initialized yet, proceeding.');
        
        // Уничтожаем предыдущую карту, если она есть, перед созданием новой
        if (mapRef.current.__ymaps_map__) {
            console.log("[PropertiesMap] Destroying previous map instance before creating a new one.");
            mapRef.current.__ymaps_map__.destroy();
            mapRef.current.__ymaps_map__ = null;
        }

        let center = [55.7558, 37.6173]; 
        let zoom = 10;
        
        if (propertiesToDisplay.length > 0) {
          const firstProperty = propertiesToDisplay[0];
          center = [firstProperty.coordinates.lat, firstProperty.coordinates.lng];
          zoom = 12;
        }
        console.log('[PropertiesMap] Creating map with center:', center, 'zoom:', zoom);
        
        const map = await createMap(mapRef.current, {
          center: center,
          zoom: zoom,
          controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
        });
        mapRef.current.__ymaps_map__ = map; // Сохраняем экземпляр карты
        
        const clusterer = await createClusterer({
          preset: 'islands#redClusterIcons',
          groupByCoordinates: false,
          clusterDisableClickZoom: false
        });
        
        console.log('[PropertiesMap] Creating placemarks for', propertiesToDisplay.length, 'properties.');
        const placemarksPromises = propertiesToDisplay.map(property => 
          createPlacemark(
            [property.coordinates.lat, property.coordinates.lng],
            {
              hintContent: property.address || property.city,
              balloonContentHeader: `<div style="font-weight: bold; font-size: 16px;">${property.address || property.city}</div>`,
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
        
        const placemarks = await Promise.all(placemarksPromises);
        
        clusterer.add(placemarks);
        map.geoObjects.add(clusterer);
        
        mapInitialized.current = true;
        console.log('[PropertiesMap] Map initialized successfully.');
        
        if (fullscreen) {
          setTimeout(() => {
            if (map && map.container) map.container.fitToViewport();
          }, 100);
        }
      } catch (error) {
        console.error('Error initializing properties map:', error);
        mapInitialized.current = false; // Сброс в случае ошибки
      }
    };
    
    initMap();
    
    return () => {
      console.log('[PropertiesMap] Cleanup function for map initialization effect. mapInitialized.current:', mapInitialized.current);
      if (mapRef.current && mapRef.current.__ymaps_map__) {
        console.log('[PropertiesMap] Destroying map in cleanup.');
        mapRef.current.__ymaps_map__.destroy();
        mapRef.current.__ymaps_map__ = null;
      }
      mapInitialized.current = false;
    };
  }, [isLoading, propertiesToDisplay, fullscreen]);
  
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
          {isLoading && !externalProperties ? (
            <div className={styles.loader}>Загрузка карты...</div>
          ) : (
            <div ref={mapRef} style={mapContainerStyles}></div>
          )}
        </div>
      </div>
    </section>
  );
}; 