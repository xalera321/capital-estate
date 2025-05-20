import React from 'react';
import { FiEyeOff, FiAlertTriangle, FiX } from 'react-icons/fi';
import styles from './ConfirmationModal.module.scss';

const HideConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, isHidden }) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const actionText = isHidden ? 'отобразить' : 'скрыть';
  const confirmButtonText = isHidden ? 'Отобразить' : 'Скрыть';
  const confirmButtonClass = isHidden ? styles.showButton : styles.hideButton;
  
  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {isHidden ? 'Отобразить объект' : 'Скрыть объект'}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.iconContainer}>
            {isHidden ? (
              <div className={`${styles.iconCircle} ${styles.showIcon}`}>
                <FiEyeOff />
              </div>
            ) : (
              <div className={`${styles.iconCircle} ${styles.hideIcon}`}>
                <FiEyeOff />
              </div>
            )}
          </div>
          
          <p className={styles.confirmText}>
            Вы действительно хотите {actionText} объект{' '}
            <span className={styles.itemName}>"{itemName}"</span>?
          </p>
          
          <p className={styles.warningText}>
            <FiAlertTriangle className={styles.warningIcon} />
            {isHidden ? 'После отображения объект будет виден посетителям сайта.' : 'После скрытия объект не будет отображаться на сайте.'}
          </p>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
            >
              Отмена
            </button>
            
            <button 
              className={confirmButtonClass}
              onClick={onConfirm}
            >
              {confirmButtonText}
            </button>
        </div>
      </div>
    </div>
  );
};

export default HideConfirmationModal; 