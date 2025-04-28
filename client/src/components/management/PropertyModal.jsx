import React from 'react';
import { FiX } from 'react-icons/fi';
import PropertyForm from './PropertyForm';
import styles from './PropertyModal.module.scss';

const PropertyModal = ({ isOpen, onClose, property, onSave }) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleSave = (savedProperty) => {
    onSave(savedProperty);
    onClose();
  };
  
  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        <PropertyForm 
          property={property} 
          onSave={handleSave} 
          onCancel={onClose} 
        />
      </div>
    </div>
  );
};

export default PropertyModal; 