import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from 'react-hot-toast'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { PropertyPage } from '@/pages/PropertyPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { AdminPage } from '@/pages/AdminPage'
import { ContactsPage } from '@/pages/ContactsPage'
import ProtectedRoute from '@/components/management/ProtectedRoute'
import AdminLayout from '@/components/management/AdminLayout'
import LoginPage from '@/pages/management/LoginPage'
import AdminHomePage from '@/pages/management/AdminHomePage'
import PropertiesPage from '@/pages/management/PropertiesPage'
import CategoriesPage from '@/pages/management/CategoriesPage'
import RequestsPage from '@/pages/management/RequestsPage'
import FeedbackPage from '@/pages/management/FeedbackPage'
import '@assets/styles/main.scss'

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Routes>
					{/* Public routes */}
					<Route path='/' element={<HomePage />} />
					<Route path='/properties' element={<CatalogPage />} />
					<Route path='/properties/:id' element={<PropertyPage />} />
					<Route path='/favorites' element={<FavoritesPage />} />
					<Route path='/contacts' element={<ContactsPage />} />
          
					{/* Management routes */}
					<Route path='/management/login' element={<LoginPage />} />
					<Route path='/management' element={<ProtectedRoute />}>
						<Route element={<AdminLayout />}>
							<Route index element={<AdminHomePage />} />
							<Route path='properties' element={<PropertiesPage />} />
							<Route path='categories' element={<CategoriesPage />} />
							<Route path='requests' element={<RequestsPage />} />
							<Route path='feedback' element={<FeedbackPage />} />
						</Route>
					</Route>

					{/* Legacy routes */}
					<Route path='/admin' element={<AdminPage />} />
          
					{/* Fallback route */}
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
