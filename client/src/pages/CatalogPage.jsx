import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '@/components/common/Header/Header'
import { Footer } from '@/components/common/Footer/Footer'
import PropertyFilters from '@/components/properties/PropertyFilters/PropertyFilters'
import { PropertyCard } from '@/components/properties/PropertyCard/PropertyCard'
import Pagination from '@/components/ui/Pagination/Pagination'
import {
	fetchProperties,
	fetchCategories,
	fetchPropertiesCount,
} from '@/features/properties/api/propertyApi'
import styles from './CatalogPage.module.scss'
import { FiAlertTriangle, FiPackage } from 'react-icons/fi'

export function CatalogPage() {
	const [searchParams] = useSearchParams()
	const [properties, setProperties] = useState([])
	const [categories, setCategories] = useState([])
	const [totalItems, setTotalItems] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	useEffect(() => {
		const loadData = async () => {
			try {
				setError(null)
				setLoading(true)

				const params = Object.fromEntries(searchParams.entries())
				const [propertiesData, categoriesData, countData] = await Promise.all([
					fetchProperties(params),
					fetchCategories(),
					fetchPropertiesCount(params),
				])

				setProperties(propertiesData.data)
				setCategories(categoriesData)
				setTotalItems(countData.count)
			} catch (err) {
				console.error('Ошибка загрузки данных:', err)
				setError('Не удалось загрузить данные. Попробуйте позже.')
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [searchParams])

	const handlePageChange = page => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('page', page)
		navigate(`?${newParams.toString()}`)
	}

	const renderContent = () => {
		if (loading) {
			return (
				<div className={styles.loadingWrapper}>
					<div className={styles.skeletonGrid}>
						{[...Array(6)].map((_, i) => (
							<div key={i} className={styles.propertySkeleton} />
						))}
					</div>
				</div>
			)
		}

		if (error) {
			return (
				<div className={styles.errorState}>
					<FiAlertTriangle className={styles.errorIcon} />
					<h3 className={styles.errorTitle}>Ошибка загрузки</h3>
					<p className={styles.errorText}>{error}</p>
				</div>
			)
		}

		if (properties.length === 0) {
			return (
				<div className={styles.emptyState}>
					<FiPackage className={styles.emptyIcon} />
					<h3 className={styles.emptyTitle}>Ничего не найдено</h3>
					<p className={styles.emptyText}>
						Попробуйте изменить параметры фильтрации
					</p>
				</div>
			)
		}

		return (
			<>
				<div className={styles.propertiesGrid}>
					{properties.map(property => (
						<PropertyCard
							key={property.id}
							property={property}
							className={styles.propertyCard}
						/>
					))}
				</div>

				{totalItems > 12 && (
					<div className={styles.paginationWrapper}>
						<Pagination
							currentPage={Number(searchParams.get('page') || 1)}
							totalPages={Math.ceil(totalItems / 12)}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Header />
			<div className={styles.catalog}>
				<Container>
					<div className={styles.propertyRow}>
						<div className={styles.filtersSection}>
							<Card className={styles.filtersCard}>
								<Card.Body>
									<PropertyFilters
										categories={categories}
										initialValues={Object.fromEntries(searchParams.entries())}
									/>
									<div className={styles.resultsCount}>
										Найдено объектов: {totalItems}
									</div>
								</Card.Body>
							</Card>
						</div>
						
						<div className={styles.propertiesSection}>
							<div className={styles.propertiesWrapper}>
								{renderContent()}
							</div>
						</div>
					</div>
				</Container>
			</div>
			<Footer />
		</motion.div>
	)
}
