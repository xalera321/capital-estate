import React, { useState, useEffect } from 'react';
import { FiEdit, FiX } from 'react-icons/fi';
import styles from './EditRequestModal.module.scss'; // Reuse styles for now

const EditFeedbackStatusModal = ({ 
  isOpen, 
  onClose, 
  feedback, // Specific prop for feedback item
  onSave 
}) => {
  const [status, setStatus] = useState(feedback?.status || 'new');
  
  useEffect(() => {
    if (feedback) {
      setStatus(feedback.status);
    }
  }, [feedback]);
  
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleSave = () => {
    onSave(status);
  };

  // Hardcoded status options for Feedbacks
  const feedbackStatusOptions = [
    { value: 'new', label: 'Новое' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'resolved', label: 'Решено' }
  ];

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Редактирование статуса обращения</h3> 
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {feedback && (
            <>
              <div className={styles.requestInfo}> {/* Can rename this style class if needed */}
                {feedback.name && <p><strong>Имя:</strong> {feedback.name}</p>}
                {feedback.phone && <p><strong>Телефон:</strong> {feedback.phone}</p>}
                {feedback.email && <p><strong>Email:</strong> {feedback.email}</p>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Статус</label>
                <select 
                  className={styles.select}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {feedbackStatusOptions.map(option => (
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

export default EditFeedbackStatusModal; 