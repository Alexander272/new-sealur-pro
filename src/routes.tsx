import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Loader } from '@/components/Loader/Loader'
import { useRefresh } from './hooks/refresh'

import Main from '@/layout/Main/Main'
import RequireAuth from './pages/Auth/RequireAuth'
import Metrics from './components/Metrics/Metrics'
const Auth = lazy(() => import('@/pages/Auth/Auth'))
const Recovery = lazy(() => import('@/pages/Auth/Recovery/Recovery'))
const RecoveryPassword = lazy(() => import('@/pages/Auth/Recovery/RecoveryPassword'))
const Confirm = lazy(() => import('@/pages/Auth/Confirm'))

const ProGasket = lazy(() => import('@/pages/Gasket/Gasket'))
const ProSnp = lazy(() => import('@/pages/Gasket/Snp/Snp'))
const Orders = lazy(() => import('@/pages/Orders/Orders'))

const OnlyManager = lazy(() => import('@/pages/Auth/OnlyManager'))
const Manager = lazy(() => import('@/layout/Manager/Manager'))
const ManagerOrders = lazy(() => import('@/pages/Manager/Orders/Orders'))
const ManagerOrder = lazy(() => import('@/pages/Manager/Order/Order'))

const Connect = lazy(() => import('@/pages/ConnectWithUs/ConnectWithUs'))

export const AppRoutes = () => {
	const { ready } = useRefresh()

	if (!ready) return <></>
	return (
		<BrowserRouter basename={'/'}>
			<Suspense fallback={<Loader />}>
				{/* //TODO убрать коммент с метрики  */}
				<Metrics />
				<Routes>
					<Route path='/auth' element={<Auth />} />
					<Route path='/auth/confirm' element={<Confirm />} />
					<Route path='/auth/recovery' element={<Recovery />} />
					<Route path='/auth/recovery/:code' element={<RecoveryPassword />} />

					<Route path='/connect' element={<Main />}>
						<Route index element={<Connect />} />
					</Route>

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

						{/* <Route path='/connect' element={<Connect />} /> */}
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
