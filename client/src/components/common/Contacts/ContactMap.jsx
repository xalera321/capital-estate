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
				'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Af285eeee4d24148da57e3053bb87f15258875356b9ec09f448ab77c06c2c01a3&amp;width=650&amp;height=420&amp;lang=ru_RU&amp;scroll=true'
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