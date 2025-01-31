import { useEffect, useRef, useState } from 'react'
import styles from './ContactMap.module.scss'

export const ContactMap = () => {
	const mapContainer = useRef(null)
	const [isMapLoading, setIsMapLoading] = useState(true)

	useEffect(() => {
		if (!document.getElementById('yandex-map-script')) {
			const script = document.createElement('script')
			script.id = 'yandex-map-script'
			script.src =
				'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Aba948049f71d95e57e200601007374c23266d270707a54b2161bd8d46e7ea61f&amp;width=650&amp;height=420&amp;lang=ru_RU&amp;scroll=true'
			script.async = true

			script.onload = () => setIsMapLoading(false)
			mapContainer.current.appendChild(script)
		} else {
			setIsMapLoading(false)
		}
	}, [])

	return (
		<div className={styles.mapWrapper}>
			{isMapLoading && <div className={styles.spinner} />}
			<div ref={mapContainer} className={styles.mapContainer} />
		</div>
	)
}