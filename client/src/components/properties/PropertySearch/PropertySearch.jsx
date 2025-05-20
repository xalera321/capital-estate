import React, { useState, useEffect } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import styles from './PropertySearch.module.scss'

const PropertySearch = ({ initialValue = '' }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialValue || '')

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
  }, [searchParams])

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams)
    
    if (searchQuery) {
      newParams.set('search', searchQuery)
    } else {
      newParams.delete('search')
    }
    
    newParams.delete('page') // Сбрасываем страницу при новом поиске
    setSearchParams(newParams)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
      e.preventDefault()
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputContainer}>
        <FiSearch className={styles.searchIcon} />
        <Form.Control
          className={styles.searchInput}
          placeholder="Поиск по объектам недвижимости..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          <FiSearch />
        </button>
      </div>
    </div>
  )
}

export default PropertySearch 