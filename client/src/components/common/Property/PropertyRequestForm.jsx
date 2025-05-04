import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button, Modal } from 'react-bootstrap'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import { createRequest } from '@/features/requests/api/requestApi'
import styles from './PropertyRequestForm.module.scss'

const validationSchema = Yup.object().shape({
  user_name: Yup.string().required('Обязательное поле'),
  user_phone: Yup.string()
    .matches(/^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/, 'Введите корректный номер')
    .required('Обязательное поле'),
  message: Yup.string(),
  agree: Yup.boolean()
    .oneOf([true], 'Необходимо согласие')
    .required('Необходимо согласие'),
})

const formatPhoneNumber = value => {
  if (!value) return '+7 ('
  const numbers = value.replace(/\D/g, '').replace(/^7|8/, '')
  let formatted = '+7 ('

  if (numbers.length > 0) {
    const matches = numbers.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/)
    if (matches) {
      if (matches[1]) formatted += `${matches[1]}`
      if (matches[2]) formatted += `) ${matches[2]}`
      if (matches[3]) formatted += ` ${matches[3]}`
      if (matches[4]) formatted += ` ${matches[4]}`
    }
  }

  return formatted
}

const PropertyRequestForm = ({ property, isButton = false }) => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleSubmit = async (values, { resetForm }) => {
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
    }
  }

  const formContent = (
    <Formik
      initialValues={{
        user_name: '',
        user_phone: '+7 (',
        message: `Интересует просмотр объекта: ${property?.title || ''}`,
        agree: false,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <Field
              name="user_name"
              type="text"
              placeholder="Имя"
              className={`${styles.input} ${
                errors.user_name && touched.user_name ? styles.errorBorder : ''
              }`}
            />
            <ErrorMessage name="user_name">
              {msg => <span className={styles.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={styles.formGroup}>
            <input
              name="user_phone"
              type="tel"
              placeholder="Телефон"
              className={`${styles.input} ${
                errors.user_phone && touched.user_phone ? styles.errorBorder : ''
              }`}
              value={values.user_phone}
              onChange={e => {
                const formatted = formatPhoneNumber(e.target.value)
                setFieldValue('user_phone', formatted)
              }}
              onKeyDown={e => {
                if (e.key === 'Backspace' && e.target.selectionStart <= 4) {
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
            <ErrorMessage name="user_phone">
              {msg => <span className={styles.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={styles.formGroup}>
            <Field
              as="textarea"
              name="message"
              placeholder="Комментарий"
              className={styles.textarea}
              rows={3}
            />
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
                  <a href="/privacy" className={styles.privacyLink}>
                    персональных данных
                  </a>
                </span>
              </label>
              <ErrorMessage name="agree">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>

            <Button type="submit" className={styles.submitButton}>
              Оставить заявку
            </Button>
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

        <Modal show={show} onHide={handleClose} centered className={styles.requestModal}>
          <Modal.Header closeButton>
            <Modal.Title>Заявка на просмотр объекта</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className={styles.propertyTitle}>
              {property?.title}
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
          </Modal.Body>
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