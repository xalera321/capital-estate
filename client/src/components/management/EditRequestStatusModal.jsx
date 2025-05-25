import React, { useState, useEffect } from 'react';
import { FiEdit, FiX } from 'react-icons/fi';
import styles from './EditRequestModal.module.scss'; // Can reuse styles or create new if needed

const EditRequestStatusModal = ({ 
  isOpen, 
  onClose, 
  request, // Specific prop for request item
  onSave 
}) => {
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

  // Hardcoded status options for Requests
  const requestStatusOptions = [
    { value: 'new', label: 'Новая' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'completed', label: 'Завершена' }
  ];

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Редактирование статуса заявки</h3> 
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {request && (
            <>
              <div className={styles.requestInfo}>
                {request.user_name && <p><strong>Клиент:</strong> {request.user_name}</p>}
                {request.user_phone && <p><strong>Телефон:</strong> {request.user_phone}</p>}
                {request.property && (
                  <p><strong>Объект:</strong> {request.property.address || `ID: ${request.property.id}`}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Статус</label>
                <select 
                  className={styles.select}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {requestStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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

export default EditRequestStatusModal; 