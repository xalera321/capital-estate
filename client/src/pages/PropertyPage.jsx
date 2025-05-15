// src/pages/PropertyPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { Header } from '@/components/common/Header/Header'
import { Footer } from '@/components/common/Footer/Footer'
import { FiMapPin, FiHome, FiMaximize2, FiLayers, FiCheckCircle, FiPhone } from 'react-icons/fi'
import FavoriteButton from '@/components/ui/FavoriteButton/FavoriteButton'
import PropertyRequestForm from '@/components/common/Property/PropertyRequestForm'
import PropertyGallery from '@/components/common/Property/PropertyGallery'
import PropertyMap from '@/components/common/Map/PropertyMap'
import axios from '@/services/axios'
import { formatRUB, getImageUrl } from '@/utils/formatters'
import styles from './PropertyPage.module.scss'

export const PropertyPage = () => {
    const { id } = useParams()
    const [property, setProperty] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`/properties/${id}`)
                setProperty(response.data)
            } catch (error) {
                console.error('Error fetching property:', error)
                setError('Не удалось загрузить информацию об объекте недвижимости')
            } finally {
                setLoading(false)
            }
        }

        fetchProperty()
    }, [id])

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
                        <PropertyGallery 
                            photos={property.photos} 
                            operationType={property.operation_type} 
                        />
                    </div>
                </Container>

                <Container className={styles.contentContainer}>
                    <Row>
                        <Col lg={8}>
                            <div className={styles.mainContent}>
                                <div className={styles.titleSection}>
                                    <div className={styles.titleRow}>
                                        <div className={styles.location}>
                                            <FiMapPin className={styles.icon} />
                                            <span>{property.city}{property.district ? `, ${property.district}` : ''}</span>
                                        </div>
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
                                    <div className={styles.priceCategorySection}>
                                        <div className={styles.priceValue}>
                                            {formatRUB(property.price)}
                                            {property.operation_type === 'rent' && <span className={styles.rentLabel}> / мес.</span>}
                                        </div>
                                        {property.category && (
                                            <div className={styles.categoryTag}>
                                                {property.category.name}
                                            </div>
                                        )}
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
                                
                                {property.coordinates && property.coordinates.lat && property.coordinates.lng && (
                                    <div className={styles.mapSection}>
                                        <h2>Расположение на карте</h2>
                                        <div className={styles.mapContainer}>
                                            <PropertyMap property={property} />
                                        </div>
                                        {property.address && (
                                            <div className={styles.addressInfo}>
                                                <FiMapPin className={styles.icon} />
                                                <span>{property.address}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                        
                        <Col lg={4}>
                            <div className={styles.sidebar}>
                                <div className={styles.contactCard}>
                                    <h3>Оставить заявку</h3>
                                    <div className={styles.contactDivider}></div>
                                    <p>Заинтересовал объект? Оставьте заявку на просмотр, и наш специалист свяжется с вами в ближайшее время</p>
                                    <PropertyRequestForm property={property} isButton={true} />
                                    <div className={styles.contactFooter}>
                                        <div className={styles.contactOr}>или</div>
                                        <a href="tel:+74951234567" className={styles.contactPhone}>
                                            <FiPhone className={styles.phoneIcon} />
                                        +7 (495) 123-45-67
                                        </a>
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
