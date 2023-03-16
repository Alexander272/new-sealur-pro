import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Loader } from '@/components/Loader/Loader'

import Main from '@/layout/Main/Main'
import Auth from './pages/Auth/Auth'
import RequireAuth from './pages/RequireAuth/RequireAuth'
const ProGasket = lazy(() => import('@/pages/Gasket/Gasket'))
const ProSnp = lazy(() => import('@/pages/Gasket/Snp/Snp'))

export const AppRoutes = () => (
	<BrowserRouter basename={'/'}>
		<Suspense fallback={<Loader />}>
			<Routes>
				<Route path='/auth' element={<Auth />} />
				<Route
					path='/'
					element={
						<RequireAuth>
							<Main />
						</RequireAuth>
					}
				>
					<Route path='/' element={<ProGasket />}>
						<Route index element={<ProSnp />} />
					</Route>
				</Route>
				{/* <Route path='/' element={<Main />}>
					<Route path='/' element={<ProGasket />}>
						<Route index element={<ProSnp />} />
					</Route> 
				</Route> */}
			</Routes>
		</Suspense>
	</BrowserRouter>
)
