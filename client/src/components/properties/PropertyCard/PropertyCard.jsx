import React from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '@/utils/formatters'
import FavoriteButton from '@/components/ui/FavoriteButton/FavoriteButton'
import styles from './PropertyCard.module.scss'

export const PropertyCard = ({ property, hiddenLabel = null }) => {
	return (
		<div className={`${styles.card} ${hiddenLabel ? styles.hiddenProperty : ''}`}>
			<div className={styles.imageContainer}>
				{property.photos?.[0]?.url && (
					<img
						src={getImageUrl(property.photos[0].url)}
						alt="Property"
						className={styles.image}
					/>
				)}
				<FavoriteButton 
					propertyId={property.id} 
					className={styles.favoriteButton}
					size="small"
				/>
				{hiddenLabel && <div className={styles.hiddenLabel}>{hiddenLabel}</div>}
			</div>

			<div className={styles.content}>
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