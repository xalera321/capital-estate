import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import Logo from '@assets/images/icons/logo.svg?react'
import PhoneIcon from '@/assets/images/icons/phone.svg?react'
import Whatsapp from '@/assets/images/icons/whatsapp.svg?react'
import Telegram from '@/assets/images/icons/telegram.svg?react'
import Vk from '@/assets/images/icons/vk.svg?react'
import { FiUser, FiHeart, FiChevronDown } from 'react-icons/fi'
import { selectFavorites } from '@/features/favorites/favoritesSlice'
import styles from './Header.module.scss'
import { fetchCategories } from '@/features/properties/api/propertyApi'
import authService from '@/services/authService'

export const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [categories, setCategories] = useState([])
	const [isObjectsHovered, setIsObjectsHovered] = useState(false)
	const [isMobileObjectsOpen, setIsMobileObjectsOpen] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()
	const isAuthenticated = authService.isAuthenticated()
	const isAdminRoute = location.pathname.startsWith('/management')
	const favorites = useSelector(selectFavorites)
	const isMobile = window.innerWidth <= 768

	// Handle body scroll lock when mobile menu is open
	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = 'hidden'
			document.body.classList.add('no-scroll')
		} else {
			document.body.style.overflow = ''
			document.body.classList.remove('no-scroll')
		}
		
		return () => {
			document.body.style.overflow = ''
			document.body.classList.remove('no-scroll')
		}
	}, [isMenuOpen])

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
		setIsMobileObjectsOpen(false)
	}, [location])
	
	// Handle window resize
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768 && isMenuOpen) {
				setIsMenuOpen(false)
				setIsMobileObjectsOpen(false)
			}
		}
		
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [isMenuOpen])
	
	// Handle "Объекты" click differently on mobile vs. desktop
	const handleObjectsClick = (e) => {
		if (window.innerWidth <= 768) {
			// On mobile, just toggle the dropdown
			e.preventDefault()
			setIsMobileObjectsOpen(!isMobileObjectsOpen)
		} else {
			// On desktop, navigate to properties page
			navigate('/properties')
		}
	}

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
												href='https://wa.me/79099571995'
												aria-label='WhatsApp'
												target="_blank"
												rel="noopener noreferrer"
												whileHover={{ y: -2 }}
												transition={{ type: 'spring', stiffness: 300 }}
											>
												<Whatsapp />
											</motion.a>
											<motion.a
												href='https://t.me/+79099571995'
												aria-label='Telegram'
												target="_blank"
												rel="noopener noreferrer"
												whileHover={{ y: -2 }}
												transition={{ type: 'spring', stiffness: 300 }}
											>
												<Telegram />
											</motion.a>
											<motion.a
												href='https://vk.com/kapitalnedoz'
												aria-label='VK'
												target="_blank"
												rel="noopener noreferrer"
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
									onMouseEnter={() => !isMobile && setIsObjectsHovered(true)}
									onMouseLeave={() => !isMobile && setIsObjectsHovered(false)}
								>
									<motion.div className={styles.dropdownWrapper}>
										<div
											className={`${styles.dropdownTrigger} ${isMobileObjectsOpen ? styles.active : ''}`}
											onClick={handleObjectsClick}
											aria-haspopup='menu'
											aria-expanded={isObjectsHovered || isMobileObjectsOpen}
										>
											<span>Объекты</span>
											<FiChevronDown className={`${styles.chevron} ${isMobileObjectsOpen ? styles.rotated : ''}`} />
										</div>
										<AnimatePresence>
											{(isObjectsHovered || isMobileObjectsOpen) && (
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
																to={`/properties?categoryId=${cat.id}`}
																className={styles.menuItem}
																role='menuitem'
																onClick={() => setIsMobileObjectsOpen(false)}
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
