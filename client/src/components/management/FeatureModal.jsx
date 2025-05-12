import React from 'react';
import FeatureForm from './FeatureForm';
import styles from './FeatureModal.module.scss';

const FeatureModal = ({ isOpen, onClose, feature, onSave }) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleSave = (savedFeature) => {
    onSave(savedFeature);
    onClose();
  };
  
  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <FeatureForm 
          feature={feature} 
          onSave={handleSave} 
          onCancel={onClose} 
        />
      </div>
    </div>
  );
};

export default FeatureModal; 