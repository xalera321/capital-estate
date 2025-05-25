import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import styles from './PropertyFilters.module.scss'

const PropertyFilters = ({ categories, initialValues }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [localFilters, setLocalFilters] = useState({
		operationType: initialValues?.operationType || '',
		categoryId: initialValues?.categoryId || '',
		minPrice: initialValues?.minPrice || '',
		maxPrice: initialValues?.maxPrice || '',
		rooms: initialValues?.rooms || '',
	})

	useEffect(() => {
		setLocalFilters({
			operationType: searchParams.get('operationType') || '',
			categoryId: searchParams.get('categoryId') || '',
			minPrice: searchParams.get('minPrice') || '',
			maxPrice: searchParams.get('maxPrice') || '',
			rooms: searchParams.get('rooms') || '',
		})
	}, [searchParams])

	const handleFilterChange = (name, value) => {
		setLocalFilters(prev => ({
			...prev,
			[name]: value
		}))
	}

	const handleApplyFilters = () => {
		const newParams = new URLSearchParams()
		Object.entries(localFilters).forEach(([key, value]) => {
			if (value) newParams.set(key, value)
		})
		newParams.delete('page')
		setSearchParams(newParams)
	}

	const handleReset = () => {
		setLocalFilters({
			operationType: '',
			categoryId: '',
			minPrice: '',
			maxPrice: '',
			rooms: '',
		})
		setSearchParams(new URLSearchParams())
	}

	return (
		<div className={styles.filters}>
			<div className={styles.filtersHeader}>
				<h3 className={styles.filtersTitle}>
					<svg className={styles.filterIcon} viewBox='0 0 24 24' fill='none'>
						<path
							d='M4 6h16M6 12h12M8 18h8'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
						/>
					</svg>
					Фильтры
				</h3>
			</div>

			<Form className={styles.filtersForm}>
				<div className={styles.columns}>
					<Form.Group className={styles.formGroup} controlId='operationType'>
						<p className={styles.filterDescriptiveLabel}>Тип операции</p>
						{/* <Form.Label>Операция</Form.Label> */}
						<Form.Select
							className={styles.select}
							value={localFilters.operationType}
							onChange={e =>
								handleFilterChange('operationType', e.target.value)
							}
						>
							<option value=''>Все</option>
							<option value='buy'>Купить</option>
							<option value='rent'>Аренда</option>
						</Form.Select>
					</Form.Group>

					<Form.Group className={styles.formGroup} controlId='categoryId'>
						<p className={styles.filterDescriptiveLabel}>Категория недвижимости</p>
						{/* <Form.Label>Категория</Form.Label> */}
						<Form.Select
							className={styles.select}
							value={localFilters.categoryId}
							onChange={e => handleFilterChange('categoryId', e.target.value)}
						>
							<option value=''>Все</option>
							{categories.map(category => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				</div>

				<div className={styles.columns}>
					<Form.Group className={styles.formGroup} controlId='priceRange'>
						<p className={styles.filterDescriptiveLabel}>Цена, ₽</p>
						{/* <Form.Label>Цена, ₽</Form.Label> */}
						<div className={styles.inputGroup}>
							<Form.Control
								className={styles.input}
								placeholder='От'
								type='number'
								min='0'
								value={localFilters.minPrice}
								onChange={e => handleFilterChange('minPrice', e.target.value)}
							/>
							<Form.Control
								className={styles.input}
								placeholder='До'
								type='number'
								min='0'
								value={localFilters.maxPrice}
								onChange={e => handleFilterChange('maxPrice', e.target.value)}
							/>
						</div>
					</Form.Group>

					<Form.Group className={styles.formGroup} controlId='rooms'>
						<p className={styles.filterDescriptiveLabel}>Количество комнат</p>
						{/* <Form.Label>Комнаты</Form.Label> */}
						<Form.Select
							className={styles.select}
							value={localFilters.rooms}
							onChange={e => handleFilterChange('rooms', e.target.value)}
						>
							<option value=''>Любое</option>
							<option value='1'>1</option>
							<option value='2'>2</option>
							<option value='3'>3</option>
							<option value='4'>4+</option>
						</Form.Select>
					</Form.Group>
				</div>
			</Form>

			<div className={styles.buttonGroup}>
				<button
					className={styles.applyButton}
					onClick={handleApplyFilters}
				>
					Применить
				</button>
				<button
					className={styles.resetButton}
					onClick={handleReset}
				>
					Сбросить
				</button>
			</div>
		</div>
	)
}

export default PropertyFilters
