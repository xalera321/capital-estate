import Speed from '@/assets/images/icons/Speed.svg?react'
import Experience from '@/assets/images/icons/Experience.svg?react'
import Shield from '@/assets/images/icons/Shield.svg?react'
import styles from './Advantages.module.scss'

export const Advantages = () => {
	const items = [
		{
			icon: <Speed />,
			title: 'Оперативная работа',
			text: 'Начинаем работать в день обращения! Быстро проводим сделки благодаря собственной базе клиентов.',
		},
		{
			icon: <Experience />,
			title: 'Большой опыт',
			text: 'Наши специалисты — профессионалы своего дела! У каждого за плечами десятки успешных сделок.',
		},
		{
			icon: <Shield />,
			title: 'Безопасность сделок',
			text: 'Наши юристы отвечают за чистоту всех сделок и консультируют клиентов на всех этапах сделки!',
		},
	]

	return (
		<section className={styles.advantages}>
			<div className='container'>
				<div className={styles.grid}>
					{items.map((item, index) => (
						<div className={styles.item} key={index}>
							<div className={styles.iconWrapper}>
								{item.icon}
								<div className={styles.line} />
							</div>
							<div className={styles.content}>
								<h3 className={styles.title}>
									<span className={styles.highlight}>{item.title}</span>
								</h3>
								<p className={styles.text}>{item.text}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
