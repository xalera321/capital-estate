// src/pages/HomePage.jsx
import { useEffect } from 'react'
import { Header } from '@/components/common/Header/Header'
import { MainSearch } from '@/components/common/Home/MainSearch'
import { Advantages } from '@/components/common/Home/Advantages'
import { LatestProperties } from '@/components/common/Home/LatestProperties'
import { InfoSlider } from '@/components/common/Home/InfoSlider'
import { ContactForm } from '@/components/common/Home/ContactForm'
import { Footer } from '@/components/common/Footer/Footer'
import { PropertiesMap } from '@/components/common/Map/PropertiesMap'
import { motion } from 'framer-motion'

export const HomePage = () => {
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
			<MainSearch />
			<Advantages />
			<LatestProperties />
			<PropertiesMap />
			<InfoSlider />
			<ContactForm />
			<Footer />
		</motion.div>
	)
}