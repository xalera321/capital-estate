// src/pages/ServicesPage.jsx
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Accordion, Button } from 'react-bootstrap'
import { Header } from '@/components/common/Header/Header'
import { Footer } from '@/components/common/Footer/Footer'
import { ContactForm } from '@/components/common/Home/ContactForm'
import { Advantages } from '@/components/common/Home/Advantages'
import CheckMark from '@/assets/images/icons/CheckMark.svg?react'
import Law from '@/assets/images/icons/Law.svg?react'
import Home from '@/assets/images/icons/Home.svg?react'
import Contract from '@/assets/images/icons/Contract.svg?react'
import styles from './ServicesPage.module.scss'

const ServicesPage = () => {
	const [activeTab, setActiveTab] = useState('residential')
	const [activeAccordion, setActiveAccordion] = useState(null)

	const mainServices = [
		{
			id: 'residential',
			title: 'Жилая недвижимость',
			icon: <Home />,
			items: [
				'Продажа квартир на вторичном рынке',
				'Покупка квартир в новостройках',
				'Обмен и разъезд',
				'Сопровождение сделок',
				'Юридическая проверка',
				'Ипотечное сопровождение',
			],
		},
		{
			id: 'commercial',
			title: 'Коммерческая недвижимость',
			icon: <Law />,
			items: [
				'Продажа офисных помещений',
				'Аренда торговых площадей',
				'Покупка производственных объектов',
				'Инвестиционные проекты',
				'Юридическое сопровождение',
			],
		},
	]

	const additionalServices = [
		{
			title: 'Юридические услуги',
			content:
				'Полный комплекс юридического сопровождения: от проверки документов до представительства в суде',
			icon: <Law />,
		},
		{
			title: 'Ипотечное кредитование',
			content:
				'Подбор оптимальных ипотечных программ, помощь в оформлении и получении одобрения',
			icon: <Contract />,
		},
		{
			title: 'Узаконивание перепланировок',
			content:
				'Помощь в согласовании перепланировок любой сложности с контролирующими органами',
			icon: <CheckMark />,
		},
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
							Профессиональные услуги в сфере недвижимости
						</h1>
						<p className={styles.subtitle}>
							Полный комплекс риелторских и юридических услуг для безопасных
							сделок
						</p>
					</div>
				</div>
			</section>

			<section className={styles.mainServices}>
				<div className='container'>
					<div className={styles.tabs}>
						{mainServices.map(service => (
							<Button
								key={service.id}
								className={`${styles.tab} ${
									activeTab === service.id ? styles.active : ''
								}`}
								onClick={() => setActiveTab(service.id)}
							>
								{service.icon}
								{service.title}
							</Button>
						))}
					</div>

					<div className={styles.servicesGrid}>
						{mainServices
							.find(s => s.id === activeTab)
							.items.map((item, index) => (
								<div key={index} className={styles.serviceCard}>
									<CheckMark className={styles.checkIcon} />
									<span>{item}</span>
								</div>
							))}
					</div>
				</div>
			</section>

			<section className={styles.additionalServices}>
				<div className='container'>
					<h2 className={styles.sectionTitle}>Дополнительные услуги</h2>

					<Accordion
						activeKey={activeAccordion}
						onSelect={e => setActiveAccordion(e)}
					>
						{additionalServices.map((service, index) => (
							<Accordion.Item
								key={index}
								eventKey={index.toString()}
								className={styles.accordionItem}
							>
								<Accordion.Header className={styles.accordionHeader}>
									<div className={styles.headerContent}>
										{service.icon}
										<h3>{service.title}</h3>
									</div>
								</Accordion.Header>
								<Accordion.Body className={styles.accordionBody}>
									<p>{service.content}</p>
									<Button
										variant='outline-primary'
										className={styles.detailsButton}
									>
										Подробнее об услуге
									</Button>
								</Accordion.Body>
							</Accordion.Item>
						))}
					</Accordion>
				</div>
			</section>

			<Advantages />
			<ContactForm />
			<Footer />
		</motion.div>
	)
}

export default ServicesPage