import React from 'react';
import CategoryForm from './CategoryForm';
import styles from './CategoryModal.module.scss'; // Using dedicated styles

const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleSave = (savedCategory) => {
    onSave(savedCategory);
    onClose();
  };
  
  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <CategoryForm 
          category={category} 
          onSave={handleSave} 
          onCancel={onClose} 
        />
      </div>
    </div>
  );
};

export default CategoryModal; 