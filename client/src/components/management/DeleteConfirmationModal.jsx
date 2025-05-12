import React from 'react';
import { FiAlertTriangle, FiX, FiTrash2 } from 'react-icons/fi';
import styles from './DeleteConfirmationModal.module.scss';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Подтверждение удаления</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.warningIcon}>
            <FiAlertTriangle />
          </div>
          <p>Вы действительно хотите удалить <strong>{itemName || 'этот элемент'}</strong>?</p>
          <p className={styles.warningText}>Это действие нельзя отменить</p>
        </div>
        
        <div className={styles.modalFooter}>
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.button} ${styles.cancelButton}`} 
              onClick={onClose}
            >
              Отмена
            </button>
            <button 
              className={`${styles.button} ${styles.deleteButton}`} 
              onClick={onConfirm}
            >
              <FiTrash2 /> Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 