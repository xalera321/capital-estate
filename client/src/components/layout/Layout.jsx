// src/components/layout/Layout.jsx
import { Header } from '@/components/common/Header/Header'
import { Footer } from '@/components/common/Footer/Footer'
import { motion } from 'framer-motion'

export const Layout = ({ children }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Header />
			<main className='main-content'>{children}</main>
			<Footer />
		</motion.div>
	)
}
