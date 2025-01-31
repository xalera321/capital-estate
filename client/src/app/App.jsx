import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from 'react-hot-toast'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { PropertyPage } from '@/pages/PropertyPage'
import { AdminPage } from '@/pages/AdminPage'
import { ContactsPage } from '@/pages/ContactsPage'
import '@assets/styles/main.scss'

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/properties' element={<CatalogPage />} />
					<Route path='/properties/:id' element={<PropertyPage />} />
					<Route path='/admin' element={<AdminPage />} />
					<Route path='/contacts' element={<ContactsPage />} />
					<Route path='*' element={<HomePage />} />
				</Routes>

				<Toaster
					position='bottom-right'
					toastOptions={{
						duration: 4000,
						style: {
							background: '#363636',
							color: '#fff',
						},
					}}
				/>
			</Router>
		</Provider>
	)
}

export default App
