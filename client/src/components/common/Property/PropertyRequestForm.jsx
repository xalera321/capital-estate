import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import { FiUser, FiPhone, FiMessageCircle } from 'react-icons/fi'
import { createRequest } from '@/features/requests/api/requestApi'
import styles from './PropertyRequestForm.module.scss'

const validationSchema = Yup.object().shape({
  user_name: Yup.string().required('Обязательное поле'),
  user_phone: Yup.string()
    .matches(/^\+7 \d{3} \d{3} \d{2} \d{2}$/, 'Введите корректный номер')
    .required('Обязательное поле'),
  message: Yup.string(),
  agree: Yup.boolean()
    .oneOf([true], 'Необходимо согласие')
    .required('Необходимо согласие'),
})

const formatPhoneNumber = value => {
  if (!value) return '+7'
  const numbers = value.replace(/\D/g, '').replace(/^7|8/, '')
  let formatted = '+7'

  if (numbers.length > 0) {
    const matches = numbers.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/)
    if (matches) {
      if (matches[1]) formatted += ` ${matches[1]}`
      if (matches[2]) formatted += ` ${matches[2]}`
      if (matches[3]) formatted += ` ${matches[3]}`
      if (matches[4]) formatted += ` ${matches[4]}`
    }
  }

  return formatted
}

// Modal component that uses React Portal
const Modal = ({ children, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div 
      className={styles.modalBackdrop} 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={styles.modalContent}>
        {children}
      </div>
    </div>,
    document.body // Mount directly to the body
  )
}

const PropertyRequestForm = ({ property, isButton = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClose = () => setIsModalOpen(false)
  const handleShow = () => setIsModalOpen(true)

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const cleanedPhone = values.user_phone
        .replace(/\D/g, '')
        .replace(/^7/, '')

      await createRequest({
        ...values,
        user_phone: `+7${cleanedPhone}`,
        property_id: property.id,
      })

      toast.success('Заявка на просмотр отправлена!')
      resetForm()
      
      if (isButton) {
        handleClose()
      }
    } catch (error) {
      toast.error('Ошибка при отправке заявки')
    } finally {
      setSubmitting(false)
    }
  }

  const formContent = (
    <Formik
      initialValues={{
        user_name: '',
        user_phone: '+7',
        message: '',
        agree: false,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, setFieldValue, values }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.inputIcon} />
            <Field
                type="text"
              name="user_name"
                placeholder="Ваше имя"
              className={`${styles.input} ${
                errors.user_name && touched.user_name ? styles.errorBorder : ''
              }`}
            />
            </div>
            <ErrorMessage name="user_name">
              {msg => <span className={styles.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <FiPhone className={styles.inputIcon} />
              <input
                type="tel"
                name="user_phone"
                placeholder="Ваш телефон"
                className={`${styles.input} ${
                  errors.user_phone && touched.user_phone ? styles.errorBorder : ''
                }`}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value)
                  setFieldValue('user_phone', formatted)
                }}
                value={values.user_phone}
                onKeyDown={e => {
                  if (e.key === 'Backspace' && e.target.selectionStart <= 2) {
                    e.preventDefault()
                  }
                }}
                onPaste={e => {
                  e.preventDefault()
                  const paste = e.clipboardData.getData('text')
                  const numbers = paste.replace(/\D/g, '').replace(/^7|8/, '')
                  const formatted = formatPhoneNumber(numbers)
                  setFieldValue('user_phone', formatted)
                }}
              />
            </div>
            <ErrorMessage name="user_phone">
              {msg => <span className={styles.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <FiMessageCircle className={styles.inputIcon} />
            <Field
              as="textarea"
              name="message"
                placeholder="Комментарий (необязательно)"
              className={styles.textarea}
              rows={3}
            />
            </div>
          </div>

          <div className={styles.formFooter}>
            <div className={styles.checkboxWrapper}>
              <label className={styles.checkboxContainer}>
                <Field
                  type="checkbox"
                  name="agree"
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxLabel}>
                  Соглашаюсь на обработку{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className={styles.privacyLink}>
                    персональных данных
                  </a>
                </span>
              </label>
              <ErrorMessage name="agree">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Отправка...' : 'Оставить заявку'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )

  if (isButton) {
    return (
      <>
        <button className={styles.requestButton} onClick={handleShow}>
          Оставить заявку
        </button>

        <Modal isOpen={isModalOpen} onClose={handleClose}>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
          <div className={styles.modalHeader}>
            <h4 className={styles.modalTitle}>Заявка на просмотр объекта</h4>
          </div>
          <div className={styles.modalBody}>
            <p className={styles.propertyTitle}>
              {property?.price && (
                <span className={styles.propertyPrice}>
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    maximumFractionDigits: 0,
                  }).format(property.price)}
                  {property.operation_type === 'rent' && ' / мес.'}
                </span>
              )}
            </p>
            {formContent}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>Заявка на просмотр</h3>
      <p className={styles.formSubtitle}>
        Оставьте контактные данные, и мы свяжемся с вами для организации просмотра
      </p>
      {formContent}
    </div>
  )
}

export default PropertyRequestForm 