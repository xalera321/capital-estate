import { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import styles from './InfoSlider.module.scss'

import 'swiper/css'
import 'swiper/css/navigation'

export const InfoSlider = () => {
	const [activeIndex, setActiveIndex] = useState(0)
	const prevRef = useRef(null)
	const nextRef = useRef(null)
	const textGroupRef = useRef(null)
	const titleRef = useRef(null)
	const sliderWrapperRef = useRef(null)

	const slides = [
		{
			title: 'Поможем продать любую вашу недвижимость',
			text: 'Агентство представляем интересы клиентов в сфере продажи и приобретения жилья на рынках Москвы и Подмосковья уже более 10 лет.',
		},
		{
			title: 'Подберем для Вас новое жилье',
			text: 'Агентство представляем интересы клиентов в сфере продажи',
		},
		{
			title: 'Поможем оформить заем под залог недвижимости',
			text: 'Агентство представляет интересы клиентов в сфере продажи',
		},
		{
			title: 'Окажем юридическую консультацию по вопросам недвижимости',
			text: 'Агентство представляет интересы клиентов в сфере продажи',
		},
	]

	useEffect(() => {
		const updateLayout = () => {
			if (
				textGroupRef.current &&
				titleRef.current &&
				sliderWrapperRef.current
			) {
				const titleHeight = titleRef.current.offsetHeight
				const textGroupHeight = textGroupRef.current.offsetHeight
				const sliderPadding = window.innerWidth >= 768 ? 80 : 40 // 40px*2 или 20px*2

				sliderWrapperRef.current.style.height = `${
					titleHeight + textGroupHeight - sliderPadding
				}px`
				sliderWrapperRef.current.style.marginTop = `${titleHeight}px`
			}
		}

		updateLayout()
		window.addEventListener('resize', updateLayout)
		return () => window.removeEventListener('resize', updateLayout)
	}, [])

	return (
		<section className={styles.infoSlider}>
			<div className='container'>
				<div className={styles.grid}>
					<div className={styles.content}>
						<h2 ref={titleRef} className={styles.title}>
							Быстро продадим любую недвижимость!
						</h2>
						<div ref={textGroupRef} className={styles.textGroup}>
							<p className={styles.text}>
								«Капитал-Недвижимость» представляет интересы клиентов в сфере
								продажи и приобретения жилья на рынках Москвы и Подмосковья уже
								более 10 лет. Профессионализм и опыт наших риелторов и
								руководителей компании позволяет гарантировать качество
								предлагаемых услуг.
							</p>
							<p className={styles.text}>
								За долгие годы работы компании ассортимент предоставляемых услуг
								постепенно расширялся и набирал все большие объёмы и теперь мы
								предлагаем для вас весь спектр услуг на рынке недвижимости.
								Обращаясь в агентство недвижимости «Капитал-Недвижимость» вы
								можете быть уверены, что даже самые трудные ситуации можно
								решить легко быстро и с максимальной выгодой.
							</p>
						</div>
					</div>

					<div ref={sliderWrapperRef} className={styles.sliderWrapper}>
						<Swiper
							loop={true}
							speed={600}
							slidesPerView={1}
							modules={[Navigation]}
							navigation={{
								prevEl: prevRef.current,
								nextEl: nextRef.current,
							}}
							onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
							onBeforeInit={swiper => {
								swiper.params.navigation.prevEl = prevRef.current
								swiper.params.navigation.nextEl = nextRef.current
							}}
							className={styles.swiper}
						>
							{slides.map((slide, index) => (
								<SwiperSlide key={index}>
									<div className={styles.slide}>
										<h3 className={styles.slideTitle}>{slide.title}</h3>
										<p className={styles.slideText}>{slide.text}</p>
									</div>
								</SwiperSlide>
							))}

							<div className={styles.controls}>
								<button
									ref={prevRef}
									className={`${styles.navButton} ${styles.prev}`}
									aria-label='Предыдущий слайд'
								>
									←
								</button>
								<div className={styles.slideNumber}>
									{(activeIndex + 1).toString().padStart(2, '0')} /{' '}
									{slides.length.toString().padStart(2, '0')}
								</div>
								<button
									ref={nextRef}
									className={`${styles.navButton} ${styles.next}`}
									aria-label='Следующий слайд'
								>
									→
								</button>
							</div>
						</Swiper>
					</div>
				</div>
			</div>
		</section>
	)
}