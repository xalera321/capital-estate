import React from 'react'
import { Link } from 'react-router-dom'
import styles from './PropertyCard.module.scss'

export const PropertyCard = ({ property }) => {
	return (
		<div className={styles.card}>
			<div className={styles.imageContainer}>
				{property.photos?.[0]?.url && (
					<img
						src={property.photos[0].url}
						alt={property.title}
						className={styles.image}
					/>
				)}
			</div>

			<div className={styles.content}>
				<h3 className={styles.title}>{property.title}</h3>

				<div className={styles.details}>
					<span className={styles.price}>
						{new Intl.NumberFormat('ru-RU').format(property.price)} ₽
					</span>

					<div className={styles.meta}>
						<span>{property.area} м²</span>
						<span>{property.rooms} комн.</span>
						<span>{property.city}</span>
					</div>
				</div>

				<Link to={`/properties/${property.id}`} className={styles.link}>
					Подробнее
				</Link>
			</div>
		</div>
	)
}