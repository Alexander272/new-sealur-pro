import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Loader } from '@/components/Loader/Loader'
import { useRefresh } from './hooks/refresh'

import Main from '@/layout/Main/Main'
import RequireAuth from './pages/Auth/RequireAuth'
const Auth = lazy(() => import('@/pages/Auth/Auth'))
const Confirm = lazy(() => import('@/pages/Auth/Confirm'))
const ProGasket = lazy(() => import('@/pages/Gasket/Gasket'))
const ProSnp = lazy(() => import('@/pages/Gasket/Snp/Snp'))
const Orders = lazy(() => import('@/pages/Orders/Orders'))

const OnlyManager = lazy(() => import('@/pages/Auth/OnlyManager'))
const Manager = lazy(() => import('@/layout/Manager/Manager'))
const ManagerOrders = lazy(() => import('@/pages/Manager/Orders/Orders'))
const ManagerOrder = lazy(() => import('@/pages/Manager/Order/Order'))

export const AppRoutes = () => {
	const { ready } = useRefresh()

	if (!ready) return <></>
	return (
		<BrowserRouter basename={'/'}>
			<Suspense fallback={<Loader />}>
				<Routes>
					<Route path='/auth' element={<Auth />} />
					<Route path='/auth/confirm' element={<Confirm />} />
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
						<Route path='/orders' element={<Orders />} />
					</Route>

					{/* <Route
						path='/orders'
						element={
							<RequireAuth>
								<Manager />
							</RequireAuth>
						}
					>
						<Route index element={<Orders />} />
					</Route> */}

					<Route
						path='/manager'
						element={
							<OnlyManager>
								<Manager />
							</OnlyManager>
						}
					>
						<Route path='orders' element={<ManagerOrders />} />
						<Route path='orders/:id' element={<ManagerOrder />} />
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
}
