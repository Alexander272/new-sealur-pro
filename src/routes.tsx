import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

const Analytics = lazy(() => import('@/pages/Manager/Analytics/Analytics'))
const AnalyticsUsers = lazy(() => import('@/pages/Manager/Analytics/Users/Users'))
const AnalyticsOrders = lazy(() => import('@/pages/Manager/Analytics/Orders/Orders'))
const AnalyticsCount = lazy(() => import('@/pages/Manager/Analytics/Count/Count'))
const AnalyticsUser = lazy(() => import('@/pages/Manager/Analytics/User/User'))

const Connect = lazy(() => import('@/pages/ConnectWithUs/ConnectWithUs'))

const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

export const AppRoutes = () => {
	const { ready } = useRefresh()

	if (!ready) return <></>
	return (
		<BrowserRouter basename={'/'}>
			<Suspense fallback={<Loader />}>
				{/* //TODO убрать коммент с метрики  */}
				{/* <Metrics /> */}
				<Routes>
					<Route path='/auth' element={<Auth />} />
					<Route path='/auth/confirm' element={<Confirm />} />
					<Route path='/auth/recovery' element={<Recovery />} />
					<Route path='/auth/recovery/:code' element={<RecoveryPassword />} />

					<Route path='/connect' element={<Manager />}>
						<Route index element={<Connect />} />
					</Route>

					<Route path='*' element={<NotFound />} />

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

						<Route path='analytics' element={<Analytics />} />
						<Route path='analytics/users' element={<AnalyticsUsers />} />
						<Route path='analytics/orders' element={<AnalyticsOrders />} />
						<Route path='analytics/count' element={<AnalyticsCount />} />
						<Route path='analytics/user' element={<AnalyticsUser />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
