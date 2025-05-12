import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PhoneIcon from '@/assets/images/icons/phone.svg?react'
import Whatsapp from '@/assets/images/icons/whatsapp.svg?react'
import Telegram from '@/assets/images/icons/telegram.svg?react'
import Vk from '@/assets/images/icons/vk.svg?react'
import EmailIcon from '@/assets/images/icons/email.svg?react'
import LocationIcon from '@/assets/images/icons/location.svg?react'
import ClockIcon from '@/assets/images/icons/clock.svg?react'
import styles from './Footer.module.scss'

const FooterSection = ({ title, children }) => (
	<motion.div
		className={styles.footerSection}
		initial={{ opacity: 0, y: 20 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true, margin: '-50px' }}
		transition={{ duration: 0.4 }}
	>
		<h4>{title}</h4>
		{children}
	</motion.div>
)

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className='container'>
				<div className={styles.footerContent}>
					<FooterSection title='Контакты'>
						<ul className={styles.contacts}>
							<li>
								<LocationIcon className={styles.contactIcon} />
								<div>
									<span>Адрес:</span>
									г. Орехово-Зуево, Центральный бульвар, д. 6, офис 112
								</div>
							</li>
							<li>
								<PhoneIcon className={styles.contactIcon} />
								<div>
									<span>Телефон:</span>
									<motion.a
										href='tel:+79099571995'
										className={styles.phoneLink}
										whileHover={{ x: 5 }}
									>
										8 (909) 957-19-95
									</motion.a>
								</div>
							</li>
							<li>
								<EmailIcon className={styles.contactIcon} />
								<div>
									<span>Email:</span>
									<motion.a
										href='mailto:vip.kapitalned@mail.ru'
										className={styles.emailLink}
										whileHover={{ x: 5 }}
									>
										vip.kapitalned@mail.ru
									</motion.a>
								</div>
							</li>
							<li>
								<ClockIcon className={styles.contactIcon} />
								<div>
									<span>Часы работы:</span>
									Пн-Пт: 09:00 - 18:00
									<br />
									Сб-Вс: 10:00 - 13:00
								</div>
							</li>
						</ul>
					</FooterSection>

					<FooterSection title='Навигация'>
						<ul className={styles.navLinks}>
							<li>
								<motion.div whileHover={{ x: 5 }}>
									<Link to='/properties' className={styles.navLink}>
										Недвижимость
									</Link>
								</motion.div>
							</li>
							<li>
								<motion.div whileHover={{ x: 5 }}>
									<Link to='/about' className={styles.navLink}>
										О компании
									</Link>
								</motion.div>
							</li>
							<li>
								<motion.div whileHover={{ x: 5 }}>
									<Link to='/contacts' className={styles.navLink}>
										Контакты
									</Link>
								</motion.div>
							</li>
						</ul>
					</FooterSection>

					<FooterSection title='Соцсети'>
						<div className={styles.socials}>
							<motion.a
								href='https://wa.me/79099571995'
								className={styles.socialLink}
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ y: -5 }}
								transition={{ type: 'spring', stiffness: 300 }}
							>
								<Whatsapp className={styles.socialIcon} />
								<span>WhatsApp</span>
							</motion.a>
							<motion.a
								href='https://t.me/+79099571995'
								className={styles.socialLink}
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ y: -5 }}
								transition={{ type: 'spring', stiffness: 300 }}
							>
								<Telegram className={styles.socialIcon} />
								<span>Telegram</span>
							</motion.a>
							<motion.a
								href='https://vk.com/kapitalnedoz'
								className={styles.socialLink}
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ y: -5 }}
								transition={{ type: 'spring', stiffness: 300 }}
							>
								<Vk className={styles.socialIcon} />
								<span>VKontakte</span>
							</motion.a>
						</div>
					</FooterSection>
				</div>

				<motion.div
					className={styles.copyright}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2 }}
				>
					<div className={styles.copyrightContent}>
						<p>
							© {new Date().getFullYear()} Капитал-Недвижимость. Все права
							защищены
						</p>
						<div className={styles.legalLinks}>
							<Link to='/privacy' target="_blank" rel="noopener noreferrer">Политика конфиденциальности</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</footer>
	)
}
