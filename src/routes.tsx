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
const CheckAccess = lazy(() => import('@/pages/Auth/CheckAccess'))

const Home = lazy(() => import('@/pages/Home/Home'))

const Gasket = lazy(() => import('@/pages/Gasket/Gasket'))
const Snp = lazy(() => import('@/pages/Gasket/Snp/Snp'))
const Putg = lazy(() => import('@/pages/Gasket/Putg/Putg'))
const Rings = lazy(() => import('@/pages/Rings/Rings'))
const SingleRings = lazy(() => import('@/pages/Rings/SingleRings/SingleRings'))
const RingsKit = lazy(() => import('@/pages/Rings/RingsKit/RingsKit'))

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

const LastOrders = lazy(() => import('@/pages/Manager/LastOrders/LastOrders'))

const Connect = lazy(() => import('@/pages/ConnectWithUs/ConnectWithUs'))

const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

export const GasketRoute = '/gaskets'
export const SnpRoute = '/gaskets/snp'
export const PutgRoute = '/gaskets/putg'

export const RingsRoute = '/rings'
export const RingRoute = '/rings/single'
export const RingsKitRoute = '/rings/kit'

export const AppRoutes = () => {
	const { ready } = useRefresh()

	if (!ready) return <Loader />

	return (
		<BrowserRouter>
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
						<Route index element={<Home />} />

						<Route path='gaskets' element={<Gasket />}>
							<Route path='snp' element={<Snp />} />
							<Route path='putg' element={<Putg />} />
						</Route>

						<Route path='rings' element={<Rings />}>
							<Route path='single' element={<SingleRings />} />
							<Route path='kit' element={<RingsKit />} />
						</Route>

						<Route path='orders' element={<Orders />} />
					</Route>

					<Route
						path='/manager'
						element={
							<CheckAccess forbiddenRoles={['user']}>
								<Manager />
							</CheckAccess>
						}
					>
						<Route path='orders' element={<ManagerOrders />} />
						<Route path='orders/:id' element={<ManagerOrder />} />

						<Route path='analytics' element={<Analytics />} />
						<Route path='analytics/users' element={<AnalyticsUsers />} />
						<Route path='analytics/orders' element={<AnalyticsOrders />} />
						<Route path='analytics/count' element={<AnalyticsCount />} />
						<Route path='analytics/user' element={<AnalyticsUser />} />

						<Route path='orders/last' element={<LastOrders />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
