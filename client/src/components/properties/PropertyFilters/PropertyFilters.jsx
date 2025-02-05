import React from 'react'
import { Form } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import styles from './PropertyFilters.module.scss'

const PropertyFilters = ({ categories }) => {
	const [searchParams, setSearchParams] = useSearchParams()

	const handleFilterChange = (name, value) => {
		const newParams = new URLSearchParams(searchParams)
		value ? newParams.set(name, value) : newParams.delete(name)
		newParams.delete('page')
		setSearchParams(newParams)
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
						<Form.Label>Операция</Form.Label>
						<Form.Select
							className={styles.select}
							value={searchParams.get('operationType') || ''}
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
						<Form.Label>Категория</Form.Label>
						<Form.Select
							className={styles.select}
							value={searchParams.get('categoryId') || ''}
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
						<Form.Label>Цена, ₽</Form.Label>
						<div className={styles.inputGroup}>
							<Form.Control
								className={styles.input}
								placeholder='От'
								type='number'
								min='0'
								value={searchParams.get('minPrice') || ''}
								onChange={e => handleFilterChange('minPrice', e.target.value)}
							/>
							<Form.Control
								className={styles.input}
								placeholder='До'
								type='number'
								min='0'
								value={searchParams.get('maxPrice') || ''}
								onChange={e => handleFilterChange('maxPrice', e.target.value)}
							/>
						</div>
					</Form.Group>

					<Form.Group className={styles.formGroup} controlId='rooms'>
						<Form.Label>Комнаты</Form.Label>
						<Form.Select
							className={styles.select}
							value={searchParams.get('rooms') || ''}
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

			<button
				className={styles.resetButton}
				onClick={() => setSearchParams(new URLSearchParams())}
			>
				Сбросить
			</button>
		</div>
	)
}

export default PropertyFilters
