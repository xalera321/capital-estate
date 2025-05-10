import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button } from 'react-bootstrap'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import { createFeedback } from '@/features/feedback/api/feedbackApi'
import Phone from '@/assets/images/icons/phone.svg?react'
import styles from './ContactForm.module.scss'

const validationSchema = Yup.object().shape({
	name: Yup.string().required('Обязательное поле'),
	phone: Yup.string()
		.matches(/^\+7 \d{3} \d{3} \d{2} \d{2}$/, 'Введите корректный номер')
		.required('Обязательное поле'),
	email: Yup.string().email('Некорректный email'),
	message: Yup.string().required('Обязательное поле').min(10, 'Минимум 10 символов'),
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

export const ContactForm = () => {
	const handleSubmit = async (values, { resetForm }) => {
		try {
			const cleanedPhone = values.phone
				.replace(/\D/g, '')
				.replace(/^7/, '')

			await createFeedback({
				name: values.name,
				phone: `+7${cleanedPhone}`,
				email: values.email || null,
				message: values.message,
			})

			toast.success('Сообщение отправлено!')
			resetForm({
				values: {
					name: '',
					phone: '+7',
					email: '',
					message: '',
					agree: false,
				},
			})
		} catch (error) {
			toast.error('Ошибка при отправке')
		}
	}

	return (
		<section className={styles.contactForm}>
			<div className='container'>
				<div className={styles.formWrapper}>
					<div className={styles.formInfo}>
						<h2 className={styles.title}>
							Ответим на любые вопросы о сделках с недвижимостью!
						</h2>
						<p className={styles.subtitle}>
							Заполните форму и мы свяжемся с вами и ответим на любые ваши
							вопросы. Все заявки рассматриваются оперативно, в течение часа!
						</p>

						<div className={styles.divider} />

						<div className={styles.contacts}>
							<div className={styles.contactBlock}>
								<Phone className={styles.phoneIcon} />
								<span>Не хотите заполнять форму?</span>
								<div className={styles.verticalDivider} />
								<div className={styles.contactInfo}>
									<p>Звоните нам по телефону</p>
									<a href='tel:+79099571995' className={styles.phoneLink}>
										+7 (909) 957-19-95
									</a>
								</div>
							</div>
						</div>
					</div>

					<Formik
						initialValues={{
							name: '',
							phone: '+7',
							email: '',
							message: '',
							agree: false,
						}}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}
					>
						{({ values, setFieldValue, touched, errors }) => (
							<Form className={styles.form}>
								<div className={styles.formGroup}>
									<Field
										name="name"
										type="text"
										placeholder="Имя"
										className={`${styles.input} ${
											errors.name && touched.name ? styles.errorBorder : ''
										}`}
									/>
									<ErrorMessage name="name">
										{msg => <span className={styles.error}>{msg}</span>}
									</ErrorMessage>
								</div>

								<div className={styles.formGroup}>
									<input
										name="phone"
										type="tel"
										placeholder="Телефон"
										className={`${styles.input} ${
											errors.phone && touched.phone ? styles.errorBorder : ''
										}`}
										value={values.phone}
										onChange={e => {
											const formatted = formatPhoneNumber(e.target.value)
											setFieldValue('phone', formatted)
										}}
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
											setFieldValue('phone', formatted)
										}}
									/>
									<ErrorMessage name="phone">
										{msg => <span className={styles.error}>{msg}</span>}
									</ErrorMessage>
								</div>

								<div className={styles.formGroup}>
									<Field
										name="email"
										type="email"
										placeholder="Email"
										className={`${styles.input} ${
											errors.email && touched.email ? styles.errorBorder : ''
										}`}
									/>
									<ErrorMessage name="email">
										{msg => <span className={styles.error}>{msg}</span>}
									</ErrorMessage>
								</div>

								<div className={styles.formGroup}>
									<Field
										as="textarea"
										name="message"
										placeholder="Ваше сообщение"
										className={`${styles.textarea} ${
											errors.message && touched.message ? styles.errorBorder : ''
										}`}
										rows={3}
									/>
									<ErrorMessage name="message">
										{msg => <span className={styles.error}>{msg}</span>}
									</ErrorMessage>
								</div>

								<div className={styles.formFooter}>
									<Button type='submit' className={styles.submitButton}>
										Отправить
									</Button>
									<div className={styles.checkboxWrapper}>
										<label className={styles.checkboxContainer}>
											<Field
												type='checkbox'
												name='agree'
												className={styles.checkboxInput}
											/>
											<span className={styles.checkboxLabel}>
												Соглашаюсь на обработку{' '}
												<a href='/privacy' className={styles.privacyLink}>
													персональных данных
												</a>
											</span>
										</label>
										<ErrorMessage name='agree'>
											{msg => <span className={styles.error}>{msg}</span>}
										</ErrorMessage>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</section>
	)
}
