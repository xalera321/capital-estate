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
        
        // Use the new endpoint that fetches properties by IDs including hidden ones
        const response = await axios.get(`/properties/by-ids?ids=${favoriteIds.join(',')}`)
        const properties = response.data || []
        
        // Mark hidden properties so we can show them differently in the UI
        const processedProperties = properties.map(prop => ({
          ...prop,
          isHidden: prop.is_hidden
        }))
        
        setFavoriteProperties(processedProperties)
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
              <h2>У вас пока нет избранных объектов</h2>
              <p>Добавляйте понравившиеся объекты недвижимости в избранное, и они появятся здесь</p>
            </div>
          ) : (
            <div className={styles.propertiesGrid}>
              {favoriteProperties.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  hiddenLabel={property.isHidden ? "Объект скрыт" : null}
                />
              ))}
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  )
} 