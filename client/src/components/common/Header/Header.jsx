import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import Logo from '@assets/images/icons/logo.svg?react'
import PhoneIcon from '@/assets/images/icons/phone.svg?react'
import Whatsapp from '@/assets/images/icons/whatsapp.svg?react'
import Telegram from '@/assets/images/icons/telegram.svg?react'
import Vk from '@/assets/images/icons/vk.svg?react'
import { FiUser, FiHeart } from 'react-icons/fi'
import { selectFavorites } from '@/features/favorites/favoritesSlice'
import styles from './Header.module.scss'
import { fetchCategories } from '@/features/properties/api/propertyApi'
import authService from '@/services/authService'

export const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [categories, setCategories] = useState([])
	const [isObjectsHovered, setIsObjectsHovered] = useState(false)
	const location = useLocation()
	const isAuthenticated = authService.isAuthenticated()
	const isAdminRoute = location.pathname.startsWith('/management')
	const favorites = useSelector(selectFavorites)

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 50)
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const data = await fetchCategories()
				setCategories(data || [])
			} catch (error) {
				console.error('Error fetching categories:', error)
				setCategories([])
			}
		}
		loadCategories()
	}, [])

	useEffect(() => {
		setIsMenuOpen(false)
	}, [location])

	return (
		<>
			<motion.header
				className={styles.header}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
			>
				<AnimatePresence>
					{!isScrolled && (
						<motion.div
							className={styles.topHeader}
							initial={{ opacity: 1, height: 'auto' }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{
								opacity: 0,
								height: 0,
								transition: { duration: 0.3, ease: 'easeInOut' },
							}}
						>
							<div className='container'>
								<div className={styles.topContent}>
									<address className={styles.address}>
										г. Орехово-Зуево, Центральный бульвар, д. 6, офис 112
									</address>
									<div className={styles.contactsWrapper}>
										<a href='tel:+79099571995' className={styles.phone}>
											<PhoneIcon className={styles.icon} />
											<span>8 (909) 957-19-95</span>
										</a>
										<div className={styles.socials}>
											<motion.a
												href='#'
												aria-label='WhatsApp'
												whileHover={{ y: -2 }}
												transition={{ type: 'spring', stiffness: 300 }}
											>
												<Whatsapp />
											</motion.a>
											<motion.a
												href='#'
												aria-label='Telegram'
												whileHover={{ y: -2 }}
												transition={{ type: 'spring', stiffness: 300 }}
											>
												<Telegram />
											</motion.a>
											<motion.a
												href='#'
												aria-label='VK'
												whileHover={{ y: -2 }}
												transition={{ type: 'spring', stiffness: 300 }}
											>
												<Vk />
											</motion.a>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.nav
					className={styles.mainNav}
					animate={{ padding: isScrolled ? '12px 0' : '15px 0' }}
					transition={{ duration: 0.3 }}
				>
					<div className='container'>
						<div className={styles.navContent}>
							<Link to='/' className={styles.logo}>
								<Logo />
							</Link>

							<div
								className={`${styles.navLinks} ${
									isMenuOpen ? styles.open : ''
								}`}
							>
								<div
									className={styles.dropdownContainer}
									onMouseEnter={() => setIsObjectsHovered(true)}
									onMouseLeave={() => setIsObjectsHovered(false)}
								>
									<motion.div className={styles.dropdownWrapper}>
										<Link
											to='/properties'
											className={styles.dropdownTrigger}
											aria-haspopup='menu'
											aria-expanded={isObjectsHovered}
										>
											<span>Объекты</span>
											<svg
												className={styles.chevron}
												viewBox='0 0 24 24'
												width='16'
												height='16'
											>
												<path
													fill='currentColor'
													d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'
												/>
											</svg>
										</Link>
										<AnimatePresence>
											{isObjectsHovered && (
												<motion.div
													className={styles.megaMenu}
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: 10 }}
													transition={{ duration: 0.2, ease: 'easeOut' }}
													role='menu'
												>
													<div className={styles.megaMenuContent}>
														{categories.map(cat => (
															<Link
																key={cat.id}
																to={`/properties?type=${cat.name}`}
																className={styles.menuItem}
																role='menuitem'
															>
																<div className={styles.menuItemContent}>
																	<div className={styles.menuItemTitle}>
																		{cat.name}
																	</div>
																</div>
															</Link>
														))}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								</div>
								<NavLink to='/services'>Услуги</NavLink>
								<NavLink to='/about'>О компании</NavLink>
								<NavLink to='/contacts'>Контакты</NavLink>
							</div>

							<div className={styles.headerActions}>
								<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Link 
										to='/favorites'
										className={styles.favoritesButton}
										aria-label="Избранное"
									>
										<FiHeart />
										{favorites.length > 0 && (
											<span className={styles.favoritesCount}>{favorites.length}</span>
										)}
									</Link>
								</motion.div>

								{isAuthenticated && (
									<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
										<Link 
											to='/management'
											className={styles.adminButton}
										>
											<FiUser />
											<span>Панель администратора</span>
										</Link>
									</motion.div>
								)}
							</div>

							<motion.button
								className={`${styles.hamburger} ${
									isMenuOpen ? styles.active : ''
								}`}
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								aria-label='Меню'
								whileTap={{ scale: 0.95 }}
							>
								<span></span>
								<span></span>
								<span></span>
							</motion.button>
						</div>
					</div>
				</motion.nav>
			</motion.header>
			<div className={styles.headerSpacer} />
		</>
	)
}

const NavLink = ({ to, children }) => (
	<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
		<Link to={to} className={styles.navLink}>
			{children}
		</Link>
	</motion.div>
)
