import { motion } from 'framer-motion'
import { ContactItem } from './ContactItem'
import styles from './ContactInfo.module.scss'
import LocationIcon from '@/assets/images/icons/location.svg?react'
import PhoneIcon from '@/assets/images/icons/phone.svg?react'
import EmailIcon from '@/assets/images/icons/email.svg?react'

export const ContactInfo = () => {
	return (
		<motion.div
			className={styles.contactInfo}
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-50px' }}
			transition={{ duration: 0.4 }}
		>
			<ContactItem
				icon={LocationIcon}
				title='Физический адрес'
				content='г. Орехово-Зуево, Центральный бульвар, д. 6, офис 112'
				iconClassName={styles.contactIcon}
			/>

			<ContactItem
				icon={PhoneIcon}
				title='Телефон'
				content={{ href: 'tel:+79099571995', text: '+7 (909) 957-19-95' }}
				isLink
				iconClassName={styles.contactIcon}
			/>

			<ContactItem
				icon={EmailIcon}
				title='Электронная почта'
				content={{ href: 'mailto:info@capital.ru', text: 'info@capital.ru' }}
				isLink
				iconClassName={styles.contactIcon}
			/>
		</motion.div>
	)
}
