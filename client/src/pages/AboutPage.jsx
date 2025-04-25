// src/pages/AboutPage.jsx
import { motion } from 'framer-motion'
import { Header } from '@/components/common/Header/Header'
import { Footer } from '@/components/common/Footer/Footer'
import { ContactForm } from '@/components/common/Home/ContactForm'
import { Advantages } from '@/components/common/Home/Advantages'
import styles from './AboutPage.module.scss'

const AboutPage = () => {
	const teamMembers = [
		{
			name: 'Татьяна Пляскина',
			position: 'Руководитель агентства',
			experience: '12 лет в недвижимости',
		},
		{
			name: 'Анна Смирнова',
			position: 'Старший риелтор',
			experience: '8 лет в недвижимости',
		},
		{
			name: 'Дмитрий Волков',
			position: 'Юрист',
			experience: '10 лет в недвижимости',
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
					<div className={styles.grid}>
						<div className={styles.content}>
							<h2 className={styles.sectionTitle}>Наша история</h2>
							<p className={styles.text}>
								Агентство недвижимости «Капитал Недвижимость» было основано в
								2012 году с целью предоставления профессиональных услуг на рынке
								недвижимости Орехово-Зуево и региона. За 10+ лет работы мы
								помогли более 2000 клиентам решить их жилищные вопросы.
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
						<div className={styles.stats}>
							<div className={styles.statItem}>
								<div className={styles.statNumber}>12+</div>
								<div className={styles.statText}>Лет на рынке</div>
							</div>
							<div className={styles.statItem}>
								<div className={styles.statNumber}>2000+</div>
								<div className={styles.statText}>Успешных сделок</div>
							</div>
							<div className={styles.statItem}>
								<div className={styles.statNumber}>98%</div>
								<div className={styles.statText}>Довольных клиентов</div>
							</div>
							<div className={styles.statItem}>
								<div className={styles.statNumber}>15</div>
								<div className={styles.statText}>Профессионалов в команде</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className={styles.team}>
				<div className='container'>
					<h2 className={styles.sectionTitle}>Наша команда</h2>
					<div className={styles.teamGrid}>
						{teamMembers.map((member, index) => (
							<div key={index} className={styles.teamMember}>
								<img src={member.photo} alt={member.name} />
								<div className={styles.memberInfo}>
									<h3>{member.name}</h3>
									<p>{member.position}</p>
									<span>{member.experience}</span>
								</div>
							</div>
						))}
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

			<Advantages />
			<ContactForm />
			<Footer />
		</motion.div>
	)
}

export default AboutPage