// src/pages/PropertyPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { Header } from '@/components/common/Header/Header'
import { Footer } from '@/components/common/Footer/Footer'
import { FiMapPin, FiHome, FiMaximize2, FiLayers, FiCheckCircle } from 'react-icons/fi'
import FavoriteButton from '@/components/ui/FavoriteButton/FavoriteButton'
import PropertyRequestForm from '@/components/common/Property/PropertyRequestForm'
import axios from '@/services/axios'
import { formatRUB, getImageUrl } from '@/utils/formatters'
import styles from './PropertyPage.module.scss'

export const PropertyPage = () => {
    const { id } = useParams()
    const [property, setProperty] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`/properties/${id}`)
                setProperty(response.data)
                
                // Set the first photo as the main image if available
                if (response.data.photos && response.data.photos.length > 0) {
                    setMainImage(response.data.photos[0].url)
                }
            } catch (error) {
                console.error('Error fetching property:', error)
                setError('Не удалось загрузить информацию об объекте недвижимости')
            } finally {
                setLoading(false)
            }
        }

        fetchProperty()
    }, [id])

    const nextImage = () => {
        if (property?.photos?.length > 0) {
            const newIndex = (currentImageIndex + 1) % property.photos.length
            setCurrentImageIndex(newIndex)
            setMainImage(property.photos[newIndex].url)
        }
    }

    const prevImage = () => {
        if (property?.photos?.length > 0) {
            const newIndex = (currentImageIndex - 1 + property.photos.length) % property.photos.length
            setCurrentImageIndex(newIndex)
            setMainImage(property.photos[newIndex].url)
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className={styles.loadingContainer}>
                    <Spinner animation="border" />
                    <p>Загрузка данных...</p>
                </div>
                <Footer />
            </>
        )
    }

    if (error || !property) {
        return (
            <>
                <Header />
                <div className={styles.errorContainer}>
                    <h2>Объект не найден</h2>
                    <p>{error || 'Запрашиваемый объект недвижимости не существует или был удален'}</p>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <div className={styles.propertyPage}>
                <Container fluid className={styles.heroSection}>
                    <div className={styles.galleryContainer}>
                        {property.photos && property.photos.length > 0 && (
                            <>
                                <div 
                                    className={styles.mainImage}
                                    style={{ backgroundImage: `url(${getImageUrl(mainImage)})` }}
                                >
                                    {property.photos.length > 1 && (
                                        <>
                                            <button onClick={prevImage} className={`${styles.navButton} ${styles.prevButton}`}>
                                                <span>&#10094;</span>
                                            </button>
                                            <button onClick={nextImage} className={`${styles.navButton} ${styles.nextButton}`}>
                                                <span>&#10095;</span>
                                            </button>
                                        </>
                                    )}
                                    <div className={styles.operationBadge}>
                                        {property.operation_type === 'rent' ? 'Аренда' : 'Продажа'}
                                    </div>
                                </div>
                                {property.photos.length > 1 && (
                                    <div className={styles.thumbnailsRow}>
                                        {property.photos.map((photo, index) => (
                                            <div 
                                                key={index} 
                                                className={`${styles.thumbnail} ${index === currentImageIndex ? styles.active : ''}`}
                                                onClick={() => {
                                                    setMainImage(photo.url)
                                                    setCurrentImageIndex(index)
                                                }}
                                            >
                                                <img src={getImageUrl(photo.url)} alt={`Фото ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Container>

                <Container className={styles.contentContainer}>
                    <Row>
                        <Col lg={8}>
                            <div className={styles.mainContent}>
                                <div className={styles.titleSection}>
                                    <h1 className={styles.propertyTitle}>{property.title}</h1>
                                    <div className={styles.location}>
                                        <FiMapPin className={styles.icon} />
                                        <span>{property.city}{property.district ? `, ${property.district}` : ''}</span>
                                    </div>
                                </div>

                                <div className={styles.propertyStats}>
                                    {property.area && (
                                        <div className={styles.statItem}>
                                            <FiMaximize2 className={styles.statIcon} />
                                            <div className={styles.statContent}>
                                                <div className={styles.statValue}>{property.area} м²</div>
                                                <div className={styles.statLabel}>Площадь</div>
                                            </div>
                                        </div>
                                    )}
                                    {property.rooms && (
                                        <div className={styles.statItem}>
                                            <FiHome className={styles.statIcon} />
                                            <div className={styles.statContent}>
                                                <div className={styles.statValue}>{property.rooms}</div>
                                                <div className={styles.statLabel}>Комнаты</div>
                                            </div>
                                        </div>
                                    )}
                                    {property.floor && (
                                        <div className={styles.statItem}>
                                            <FiLayers className={styles.statIcon} />
                                            <div className={styles.statContent}>
                                                <div className={styles.statValue}>
                                                    {property.floor}{property.total_floors ? `/${property.total_floors}` : ''}
                                                </div>
                                                <div className={styles.statLabel}>Этаж</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {property.description && (
                                    <div className={styles.descriptionSection}>
                                        <h2>Описание</h2>
                                        <div className={styles.description}>
                                            {property.description}
                                        </div>
                                    </div>
                                )}

                                {property.features && property.features.length > 0 && (
                                    <div className={styles.featuresSection}>
                                        <h2>Особенности и удобства</h2>
                                        <div className={styles.featuresList}>
                                            {property.features.map(feature => (
                                                <div key={feature.id} className={styles.featureItem}>
                                                    <FiCheckCircle className={styles.featureIcon} />
                                                    <span>{feature.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Col>
                        
                        <Col lg={4}>
                            <div className={styles.sidebar}>
                                <div className={styles.priceCard}>
                                    <div className={styles.priceValue}>
                                        {formatRUB(property.price)}
                                        {property.operation_type === 'rent' && <span className={styles.rentLabel}> / мес.</span>}
                                    </div>
                                    {property.category && (
                                        <div className={styles.categoryTag}>
                                            {property.category.name}
                                        </div>
                                    )}
                                    <div className={styles.favoritesAction}>
                                        <FavoriteButton 
                                            propertyId={property.id} 
                                            size="large"
                                        />
                                        <span className={styles.favoriteLabel}>
                                            В избранное
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.contactCard}>
                                    <h3>Связаться с нами</h3>
                                    <p>Оставьте заявку, и наш менеджер свяжется с вами для уточнения деталей и организации просмотра объекта</p>
                                    <PropertyRequestForm property={property} isButton={true} />
                                    <div className={styles.contactPhone}>
                                        +7 (495) 123-45-67
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </>
    )
}
