import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Header } from '@/components/common/Header/Header'
import { Footer } from '@/components/common/Footer/Footer'
import { PropertyCard } from '@/components/properties/PropertyCard/PropertyCard'
import { selectFavorites } from '@/features/favorites/favoritesSlice'
import axios from '@/services/axios'
import { FiHeart } from 'react-icons/fi'
import styles from './FavoritesPage.module.scss'

export const FavoritesPage = () => {
  const favoriteIds = useSelector(selectFavorites)
  const [favoriteProperties, setFavoriteProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      if (favoriteIds.length === 0) {
        setFavoriteProperties([])
        setLoading(false)
        return
      }

      try {
        setError(null)
        setLoading(true)
        
        // Fetch all properties and filter out favorites client-side
        // In a real app with a lot of properties, you'd want to add an API endpoint to fetch by IDs
        const response = await axios.get('/properties')
        const allProperties = response.data.data || []
        
        const favorites = allProperties.filter(prop => 
          favoriteIds.includes(prop.id)
        )
        
        setFavoriteProperties(favorites)
      } catch (err) {
        console.error('Error fetching favorite properties:', err)
        setError('Не удалось загрузить избранные объекты недвижимости')
      } finally {
        setLoading(false)
      }
    }

    fetchFavoriteProperties()
  }, [favoriteIds])

  return (
    <>
      <Header />
      <div className={styles.favoritesPage}>
        <Container>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              <FiHeart className={styles.heartIcon} />
              Избранное
            </h1>
            <p className={styles.pageDescription}>
              Объекты недвижимости, которые вам понравились
            </p>
          </header>

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Загрузка избранных объектов...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">
              {error}
            </Alert>
          ) : favoriteProperties.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiHeart size={50} />
              </div>
              <h2>У вас пока нет избранных объектов</h2>
              <p>Добавляйте понравившиеся объекты недвижимости в избранное, и они появятся здесь</p>
            </div>
          ) : (
            <div className={styles.propertiesGrid}>
              {favoriteProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  )
} 