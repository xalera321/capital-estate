// src/components/Home/LatestProperties.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PropertyCard } from '@/components/properties/PropertyCard/PropertyCard'
import {
	fetchLatestProperties,
	fetchCategories,
} from '@/features/properties/api/propertyApi'
import styles from './LatestProperties.module.scss'
import { SkeletonCard } from '@/components/ui/Skeleton/SkeletonCard'

export const LatestProperties = () => {
	const [activeCategory, setActiveCategory] = useState('all')
	const [properties, setProperties] = useState([])
	const [categories, setCategories] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true)
				const [cats, props] = await Promise.all([
					fetchCategories(),
					fetchLatestProperties(),
				])

				setCategories(cats || [])
				setProperties(props || [])
			} catch (error) {
				console.error('Loading error:', error)
				setCategories([])
				setProperties([])
			} finally {
				setIsLoading(false)
			}
		}
		loadData()
	}, [])

	const handleCategoryChange = async categoryId => {
		setActiveCategory(categoryId)
		try {
			setIsLoading(true)
			const props = await fetchLatestProperties(categoryId)
			setProperties(props)
		} catch (error) {
			console.error('Filter error:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<section className={styles.latestProperties}>
			<div className={styles.container}>
				<header className={styles.sectionHeader}>
					<h2 className={styles.title}>Недвижимость в продаже</h2>
					<Link to='/properties' className={styles.seeAll}>
						Смотреть все
						<svg className={styles.arrowIcon} viewBox='0 0 24 24'>
							<path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' />
						</svg>
					</Link>
				</header>

				<nav aria-label='Фильтр по категориям'>
					<div className={styles.categoryFilter}>
						<button
							className={`${styles.filterButton} ${
								activeCategory === 'all' ? styles.active : ''
							}`}
							onClick={() => handleCategoryChange('all')}
							aria-pressed={activeCategory === 'all'}
						>
							Все
						</button>
						{categories.map(cat => (
							<button
								key={cat.id}
								className={`${styles.filterButton} ${
									activeCategory === cat.id ? styles.active : ''
								}`}
								onClick={() => handleCategoryChange(cat.id)}
								aria-pressed={activeCategory === cat.id}
							>
								{cat.name}
							</button>
						))}
					</div>
				</nav>

				<div className={styles.propertiesGrid}>
					{isLoading
						? Array(4)
								.fill()
								.map((_, i) => <SkeletonCard key={i} />)
						: properties
								.slice(0, 4)
								.map(property => (
									<PropertyCard key={property.id} property={property} />
								))}
				</div>
			</div>
		</section>
	)
}
