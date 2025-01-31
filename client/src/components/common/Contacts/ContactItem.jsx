import { motion } from 'framer-motion'
import styles from './ContactItem.module.scss'

export const ContactItem = ({ icon: Icon, title, content, isLink }) => {
	return (
		<motion.div
			className={styles.contactItem}
			whileHover={{ y: -3 }}
			transition={{ type: 'spring', stiffness: 300 }}
		>
			<Icon className={styles.icon} />
			<div className={styles.content}>
				<h4 className={styles.title}>{title}</h4>
				{isLink ? (
					<motion.a
						href={content.href}
						className={styles.link}
						whileHover={{ x: 5 }}
					>
						{content.text}
					</motion.a>
				) : (
					<p className={styles.text}>{content}</p>
				)}
			</div>
		</motion.div>
	)
}