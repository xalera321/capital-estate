import React from 'react'
import styles from './Pagination.module.scss'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const getPageNumbers = () => {
		const pages = []
		const maxVisible = 5
		let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
		let end = Math.min(totalPages, start + maxVisible - 1)

		if (end - start < maxVisible - 1) {
			start = Math.max(1, end - maxVisible + 1)
		}

		for (let i = start; i <= end; i++) {
			pages.push(
				<button
					key={i}
					className={`${styles.item} ${i === currentPage ? styles.active : ''}`}
					onClick={() => onPageChange(i)}
					disabled={i === currentPage}
				>
					{i}
				</button>
			)
		}
		return pages
	}

	return (
		<div className={styles.pagination}>
			<button
				className={styles.arrow}
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label='Предыдущая страница'
			>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
					<path d='M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z' />
				</svg>
			</button>

			{getPageNumbers()}

			<button
				className={styles.arrow}
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label='Следующая страница'
			>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
					<path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' />
				</svg>
			</button>
		</div>
	)
}

export default Pagination
