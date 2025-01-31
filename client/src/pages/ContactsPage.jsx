import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/common/Header/Header'
import { ContactMap } from '@/components/common/Contacts/ContactMap'
import { ContactInfo } from '@/components/common/Contacts/ContactInfo'
import { Footer } from '@/components/common/Footer/Footer'

export const ContactsPage = () => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Header />
			<main className='container'>
				<ContactMap />
				<ContactInfo />
			</main>
			<Footer />
		</motion.div>
	)
}
