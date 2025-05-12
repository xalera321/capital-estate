// src/pages/AboutPage.jsx
import { motion } from 'framer-motion'
import { Header } from '@/components/common/Header/Header'
import { Footer } from '@/components/common/Footer/Footer'
import { ContactForm } from '@/components/common/Home/ContactForm'
import styles from './AboutPage.module.scss'

const AboutPage = () => {
	const services = [
		{
			title: 'Купля-продажа квартир',
			items: ['Новостройки', 'Вторичный рынок']
		},
		{
			title: 'Купля-продажа загородной недвижимости',
			items: ['Коттеджи', 'Дома', 'Дачи', 'Земельные участки']
		}
	]

	const additionalServices = [
		'Подготовка договоров',
		'Представительство в суде',
		'Приватизация квартир',
		'Оформление наследственных прав',
		'Сопровождение сделок',
		'Оформление квартир, домов, земельных участков'
	]

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Header />
			<section className={styles.hero}>
				<div className='container'>
					<div className={styles.heroContent}>
						<h1 className={styles.title}>
							Агентство недвижимости «Капитал Недвижимость»
						</h1>
						<p className={styles.subtitle}>
							Профессионализм и надежность с 2012 года
						</p>
					</div>
				</div>
			</section>

			<section className={styles.about}>
				<div className='container'>
					<div className={styles.content}>
						<h2 className={styles.sectionTitle}>О нашей компании</h2>
						<p className={styles.text}>
							Агентство недвижимости Капитал — это организация, работающая в сфере недвижимости. 
							Здесь вы сможете получить полную консультацию по интересующим вопросам.
						</p>
						<p className={styles.text}>
							Компания предлагает помощь по всем типам услуг, связанным с недвижимостью — среди них 
							оформление в собственность, реализация дачных домов, жилой недвижимости, земельных участков, 
							консультации юриста и многие другие.
						</p>
						<div className={styles.highlight}>
							<blockquote>
								«Наша главная цель — сделать операции с недвижимостью
								простыми, безопасными и выгодными для клиентов»
							</blockquote>
							<div className={styles.director}>
								<div className={styles.directorInfo}>
									<h4>Татьяна Пляскина</h4>
									<p>Основатель и руководитель агентства</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className={styles.services}>
				<div className='container'>
					<h2 className={styles.sectionTitle}>Наши услуги</h2>
					<p className={styles.serviceIntro}>
						Агентство недвижимости «Капитал» оказывает риелторские услуги в двух основных секторах рынка недвижимости:
					</p>
					
					<div className={styles.servicesGrid}>
						{services.map((service, index) => (
							<div key={index} className={styles.serviceCard}>
								<div className={styles.serviceIcon}></div>
								<h3 className={styles.serviceTitle}>{service.title}</h3>
								<ul className={styles.serviceList}>
									{service.items.map((item, i) => (
										<li key={i} className={styles.serviceItem}>{item}</li>
									))}
								</ul>
							</div>
						))}
					</div>
					
					<div className={styles.additionalServices}>
						<h3 className={styles.additionalTitle}>Дополнительные услуги</h3>
						<p className={styles.additionalIntro}>
							Наше агентство также предоставляет широкий спектр дополнительных услуг:
						</p>
						<div className={styles.additionalGrid}>
							{additionalServices.map((service, index) => (
								<div key={index} className={styles.additionalCard}>
									<span className={styles.additionalIcon}></span>
									<p>{service}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className={styles.values}>
				<div className='container'>
					<h2 className={styles.sectionTitle}>Наши ценности</h2>
					<div className={styles.valuesGrid}>
						<div className={styles.valueCard}>
							<h3>Профессионализм</h3>
							<p>
								Каждый сотрудник проходит строгий отбор и регулярное обучение
							</p>
						</div>
						<div className={styles.valueCard}>
							<h3>Прозрачность</h3>
							<p>Честные условия сотрудничества и открытая отчетность</p>
						</div>
						<div className={styles.valueCard}>
							<h3>Надежность</h3>
							<p>Гарантия юридической чистоты всех проводимых сделок</p>
						</div>
					</div>
				</div>
			</section>

			<ContactForm />
			<Footer />
		</motion.div>
	)
}

export default AboutPage