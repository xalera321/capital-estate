// src/components/ui/Skeleton/SkeletonCard.jsx
import React from 'react'
import styles from './SkeletonCard.module.scss'

export const SkeletonCard = () => {
	return (
		<div className={styles.skeletonCard}>
			<div className={styles.image}></div>

			<div className={styles.content}>
				<div className={styles.title}></div>

				<div className={styles.details}>
					<div className={styles.price}></div>
					<div className={styles.meta}>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>

				<div className={styles.link}></div>
			</div>
		</div>
	)
}
