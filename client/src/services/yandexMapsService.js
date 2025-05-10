// Сервис для загрузки и управления Yandex Maps API
let loadPromise = null;

/**
 * Загружает Yandex Maps API, если она еще не загружена
 * @returns {Promise} Промис, который резолвится, когда API готов к использованию
 */
export const loadYandexMaps = () => {
  // Если промис уже существует, возвращаем его
  if (loadPromise) {
    return loadPromise;
  }

  // Если API уже загружена, возвращаем разрешенный промис
  if (window.ymaps && window.ymaps.ready) {
    return new Promise((resolve) => {
      window.ymaps.ready(resolve);
    });
  }

  // Создаем новый промис для загрузки API
  loadPromise = new Promise((resolve, reject) => {
    try {
      // Получаем API ключ из env переменных
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || '';
      
      // Если скрипт уже существует, ждем его загрузки
      const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
      if (existingScript) {
        window.ymaps.ready(resolve);
        return;
      }

      // Создаем новый скрипт
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      
      // Обработчики событий для скрипта
      script.onload = () => {
        window.ymaps.ready(resolve);
      };
      
      script.onerror = (error) => {
        loadPromise = null;
        reject(new Error('Failed to load Yandex Maps API: ' + error.message));
      };
      
      // Добавляем скрипт на страницу
      document.body.appendChild(script);
    } catch (error) {
      loadPromise = null;
      reject(error);
    }
  });

  return loadPromise;
};

/**
 * Получить экземпляр карты
 * @param {string} elementId ID элемента для карты
 * @param {Object} options Опции карты
 * @returns {Promise<Object>} Промис с объектом карты
 */
export const createMap = async (elementContainer, options) => {
  await loadYandexMaps();
  
  if (!elementContainer) {
    throw new Error('Container element is required');
  }
  
  return new window.ymaps.Map(elementContainer, options);
};

/**
 * Создает метку на карте
 * @param {Array} coordinates Координаты [lat, lng]
 * @param {Object} properties Свойства метки
 * @param {Object} options Опции метки
 * @returns {Object} Объект метки
 */
export const createPlacemark = async (coordinates, properties, options) => {
  await loadYandexMaps();
  return new window.ymaps.Placemark(coordinates, properties, options);
};

/**
 * Создает кластеризатор для меток
 * @param {Object} options Опции кластеризатора
 * @returns {Object} Объект кластеризатора
 */
export const createClusterer = async (options) => {
  await loadYandexMaps();
  return new window.ymaps.Clusterer(options);
}; 