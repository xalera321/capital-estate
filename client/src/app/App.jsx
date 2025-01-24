// src/app/App.jsx
export default function App() {
	return (
		<div
			style={{
				padding: '2rem',
				textAlign: 'center',
			}}
		>
			<h1>✅ Приложение работает!</h1>
			<p>Текущее время: {new Date().toLocaleTimeString()}</p>
		</div>
	)
}