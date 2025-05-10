import { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {
	fetchPropertiesCount,
	fetchCategories,
} from '@/features/properties/api/propertyApi'
import styles from './MainSearch.module.scss'

export const MainSearch = () => {
	const [filters, setFilters] = useState({
		operationType: 'buy',
		categoryId: '',
		minPrice: '',
		maxPrice: '',
	})

	const [count, setCount] = useState(0)
	const [categories, setCategories] = useState([])

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const data = await fetchCategories()
				setCategories(data)
			} catch (error) {
				console.error('Error loading categories:', error)
			}
		}
		loadCategories()
	}, [])

	useEffect(() => {
		const getCount = async () => {
			try {
				const params = {
					operationType: filters.operationType,
					categoryId: filters.categoryId || undefined,
					minPrice: filters.minPrice || undefined,
					maxPrice: filters.maxPrice || undefined,
				}

				const { count } = await fetchPropertiesCount(params)
				setCount(count)
			} catch (error) {
				console.error('Error fetching properties count:', error)
				setCount(0)
			}
		}

		const timer = setTimeout(() => getCount(), 500)
		return () => clearTimeout(timer)
	}, [filters])

	const getFilteredParams = () => {
		return Object.fromEntries(
			Object.entries(filters)
				.filter(([_, value]) => value !== '')
				.map(([key, value]) => [key, String(value)])
		)
	}

	return (
		<section className={styles.mainSearch}>
			<div className='container'>
				<div className={styles.content}>
					<h1 className={styles.title}>
						Найдем идеальную недвижимость
						<span>под ваши потребности</span>
					</h1>

					<div className={styles.filtersWrapper}>
						<div className={styles.topFilters}>
							<Form.Select
								className={styles.operationSelect}
								value={filters.operationType}
								onChange={e =>
									setFilters({ ...filters, operationType: e.target.value })
								}
							>
								<option value='buy'>Купить</option>
								<option value='rent'>Снять</option>
							</Form.Select>

							<Form.Select
								className={styles.typeSelect}
								value={filters.categoryId}
								onChange={e => setFilters({ ...filters, categoryId: e.target.value })}
							>
								<option value=''>Все типы</option>
								{categories.map(cat => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</Form.Select>
						</div>

						<div className={styles.priceFilters}>
							<Form.Control
								className={styles.priceInput}
								type='number'
								placeholder='Минимальная цена'
								value={filters.minPrice}
								onChange={e =>
									setFilters({ ...filters, minPrice: e.target.value })
								}
								min='0'
							/>
							<Form.Control
								className={styles.priceInput}
								type='number'
								placeholder='Максимальная цена'
								value={filters.maxPrice}
								onChange={e =>
									setFilters({ ...filters, maxPrice: e.target.value })
								}
								min='0'
							/>
						</div>

						<Link
							className={styles.resultsButton}
							to={`/properties?${new URLSearchParams(getFilteredParams())}`}
						>
							Показать {count} вариантов
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='currentColor'
							>
								<path d='M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z'></path>
							</svg>
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
