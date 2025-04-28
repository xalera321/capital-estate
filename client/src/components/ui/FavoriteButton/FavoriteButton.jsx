import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { addToFavorites, removeFromFavorites, selectFavorites } from '@/features/favorites/favoritesSlice';
import styles from './FavoriteButton.module.scss';

const FavoriteButton = ({ propertyId, className, size = 'medium' }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.includes(propertyId);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      dispatch(removeFromFavorites(propertyId));
    } else {
      dispatch(addToFavorites(propertyId));
    }
  };

  return (
    <button 
      className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''} ${className || ''} ${styles[size]}`}
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <FiHeart className={styles.icon} />
    </button>
  );
};

export default FavoriteButton; 