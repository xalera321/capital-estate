import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PropertiesMap } from './PropertiesMap';
import { FiX } from 'react-icons/fi';
import styles from './MapModal.module.scss';

export const MapModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className={styles.modalBackdrop} 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        <div className={styles.mapWrapper}>
          <PropertiesMap fullscreen />
        </div>
      </div>
    </div>,
    document.body
  );
}; 