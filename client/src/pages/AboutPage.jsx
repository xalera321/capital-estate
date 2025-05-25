// src/pages/AboutPage.jsx
import { motion } from 'framer-motion'
import { Header } from '@/components/common/Header/Header'
import { Footer } from '@/components/common/Footer/Footer'
import { ContactForm } from '@/components/common/Home/ContactForm'
import CEOImage from '@/assets/images/CEO.png'
import officeImage from '@/assets/images/office.jpg' // Import office image
import styles from './AboutPage.module.scss'
import {
	FaBriefcase, 
	FaHome, 
	FaUsers, 
	FaShieldAlt, 
	FaHandshake, 
	FaStar, 
	FaFileSignature, 
	FaBalanceScale, 
	FaUserTie,
	FaChartLine,
	FaBuilding
} from 'react-icons/fa' // Importing various icons

const AboutPage = () => {
	const services = [
		{
			title: 'Купля-продажа квартир',
			items: ['Новостройки', 'Вторичный рынок'],
			icon: <FaHome />
		},
		{
			title: 'Купля-продажа загородной недвижимости',
			items: ['Коттеджи', 'Дома', 'Дачи', 'Земельные участки'],
			icon: <FaBuilding />
		}
	]

	const additionalServices = [
		{ name: 'Подготовка договоров' },
		{ name: 'Представительство в суде' },
		{ name: 'Приватизация квартир' },
		{ name: 'Оформление наследственных прав' },
		{ name: 'Сопровождение сделок' },
		{ name: 'Оформление квартир, домов, земельных участков' }
	]

	const values = [
		{
			title: 'Профессионализм',
			text: 'Каждый сотрудник проходит строгий отбор и регулярное обучение для предоставления услуг высшего качества.',
			icon: <FaBriefcase />
		},
		{
			title: 'Прозрачность',
			text: 'Мы гарантируем честные условия сотрудничества и полную открытость на всех этапах сделки.',
			icon: <FaHandshake />
		},
		{
			title: 'Надежность',
			text: 'Многолетний опыт и безупречная репутация подтверждают нашу надежность и юридическую чистоту.',
			icon: <FaShieldAlt />
		},
		{
			title: 'Фокус на клиенте',
			text: 'Индивидуальный подход и стремление превзойти ожидания каждого клиента.',
			icon: <FaUsers />
		}
	]

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className={styles.aboutPage}
		>
			<Header />
			<section className={styles.hero}>
				<div className='container'>
					<div className={styles.heroContent}>
						<h1 className={styles.title}>
							Агентство недвижимости «Капитал Недвижимость»
						</h1>
						<p className={styles.subtitle}>
							Профессионализм и надежность с 2012 года. Мы помогаем вам найти дом вашей мечты.
						</p>
					</div>
				</div>
			</section>

			<section className={styles.about}>
				<div className='container'>
					<div className={styles.aboutGrid}>
						<div className={styles.aboutText}>
							<h2 className={styles.sectionTitle}>О нашей компании</h2>
							<p className={styles.text}>
								Агентство недвижимости «Капитал» — это команда опытных профессионалов, работающих в сфере недвижимости с 2012 года. Мы гордимся нашей репутацией надежного партнера, предоставляя полный спектр услуг, от консультаций до сопровождения сложных сделок.
							</p>
							<p className={styles.text}>
								Наша миссия — сделать процесс покупки, продажи или аренды недвижимости максимально простым, безопасным и выгодным для каждого клиента. Мы ценим ваше время и доверие, предлагая индивидуальный подход и высочайшие стандарты обслуживания.
							</p>
						</div>
						<div className={styles.aboutImageContainer}>
							<img src={officeImage} alt="Наш офис" className={styles.aboutImage} />
						</div>
					</div>
				</div>
			</section>
			
			<section className={styles.team}>
				<div className='container'>
					<h2 className={styles.sectionTitle}>Наша команда</h2>
					<div className={styles.teamGrid}>
						<div className={styles.teamMemberCard}>
							<img src={CEOImage} alt="Татьяна Пляскина" className={styles.teamMemberImage} />
							<div className={styles.teamMemberInfo}>
								<h4 className={styles.teamMemberName}>Татьяна Пляскина</h4>
								<p className={styles.teamMemberRole}>Основатель и руководитель агентства</p>
								<p className={styles.teamMemberQuote}>
									«Наша главная цель — сделать операции с недвижимостью
									простыми, безопасными и выгодными для клиентов. Мы строим долгосрочные отношения, основанные на доверии и взаимном уважении.»
								</p>
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
								<div className={styles.serviceIcon}>{service.icon}</div>
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
									{/* <span className={styles.additionalIcon}>{service.icon}</span> */}
									<p>{service.name}</p>
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
						{values.map((value, index) => (
							<div key={index} className={styles.valueCard}>
								<div className={styles.valueIcon}>{value.icon}</div>
								<h3>{value.title}</h3>
								<p>{value.text}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<ContactForm />
			<Footer />
		</motion.div>
	)
}

export default AboutPage