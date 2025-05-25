import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination, Zoom } from 'swiper/modules';
import { FiMaximize2, FiX } from 'react-icons/fi';
import { getImageUrl } from '@/utils/formatters';
import styles from './PropertyGallery.module.scss';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

const PropertyGallery = ({ photos, operationType }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  
  if (!photos || photos.length === 0) {
    return (
      <div className={styles.noPhotos}>
        <div className={styles.placeholder}>
          <p>Нет доступных фотографий</p>
        </div>
      </div>
    );
  }
  
  // Format photos to ensure we have the URL
  const formattedPhotos = photos.map(photo => {
    if (typeof photo === 'string') {
      return { url: photo };
    }
    return photo;
  });
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    // When entering fullscreen, prevent body scroll
    document.body.style.overflow = !fullscreen ? 'hidden' : '';
  };
  
  return (
    <div className={`${styles.gallery} ${fullscreen ? styles.fullscreen : ''}`}>
      {/* Main gallery */}
      <div className={styles.mainGallery}>
        <Swiper
          modules={[Navigation, Thumbs, Pagination, Zoom]}
          spaceBetween={0}
          navigation
          speed={600}
          pagination={{ clickable: true, dynamicBullets: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          zoom={{ maxRatio: 2 }}
          loop={true}
          className={styles.mainSwiper}
          // Using a custom slide rendering to achieve blur effect
          watchSlidesProgress={true}
        >
          {formattedPhotos.map((photo, index) => (
            <SwiperSlide key={index} className={styles.mainSlide}>
              <div className={styles.blurredBackground}>
                <img 
                  src={getImageUrl(photo.url)} 
                  alt="Фоновое изображение"
                  className={styles.blurredImage}
                />
              </div>
              <div className="swiper-zoom-container">
                <img 
                  src={getImageUrl(photo.url)} 
                  alt={`Фото ${index + 1}`} 
                  className={styles.mainImage}
                />
              </div>
            </SwiperSlide>
          ))}
          
          {/* Only show operation badge when not in fullscreen mode */}
          {!fullscreen && (
            <div className={styles.operationBadge}>
              {operationType === 'rent' ? 'Аренда' : 'Продажа'}
            </div>
          )}
          
          <button 
            className={styles.fullscreenButton} 
            onClick={toggleFullscreen}
            title={fullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
          >
            {fullscreen ? <FiX /> : <FiMaximize2 />}
          </button>
        </Swiper>
      </div>
      
      {/* Thumbnails */}
      {formattedPhotos.length > 1 && (
        <div className={styles.thumbnails}>
          <Swiper
            modules={[Thumbs]}
            watchSlidesProgress
            slidesPerView="auto"
            spaceBetween={10}
            onSwiper={setThumbsSwiper}
            className={styles.thumbsSwiper}
            centeredSlides={true}
            slideToClickedSlide={true}
          >
            {formattedPhotos.map((photo, index) => (
              <SwiperSlide key={index} className={styles.thumbSlide}>
                <img 
                  src={getImageUrl(photo.url)} 
                  alt={`Миниатюра ${index + 1}`}
                  className={styles.thumbImage}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery; 