import React, { useState, useEffect } from 'react';
import { FiEdit, FiX } from 'react-icons/fi';
import styles from './EditRequestModal.module.scss';

const EditRequestModal = ({ isOpen, onClose, request, onSave }) => {
  const [status, setStatus] = useState(request?.status || 'new');
  
  useEffect(() => {
    if (request) {
      setStatus(request.status);
    }
  }, [request]);
  
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleSave = () => {
    onSave(status);
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Редактирование заявки</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {request && (
            <>
              <div className={styles.requestInfo}>
                <p><strong>Клиент:</strong> {request.user_name}</p>
                <p><strong>Телефон:</strong> {request.user_phone}</p>
                {request.property && (
                  <p><strong>Объект:</strong> {request.property.title}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Статус заявки</label>
                <select 
                  className={styles.select}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="new">Новая</option>
                  <option value="in_progress">В работе</option>
                  <option value="completed">Завершена</option>
                </select>
              </div>
            </>
          )}
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
              className={`${styles.button} ${styles.saveButton}`} 
              onClick={handleSave}
            >
              <FiEdit /> Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRequestModal; 