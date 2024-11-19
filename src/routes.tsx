import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Loader } from '@/components/Loader/Loader'
import { PathRoutes } from './constants/routes'
import { useRefresh } from './hooks/refresh'

import Main from '@/layout/Main/Main'
import RequireAuth from './pages/Auth/RequireAuth'
// import Metrics from './components/Metrics/Metrics'

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

// export const GasketRoute = '/gaskets'
// export const SnpRoute = '/gaskets/snp'
// export const PutgRoute = '/gaskets/putg'

// export const RingsRoute = '/rings'
// export const RingRoute = '/rings/single'
// export const RingsKitRoute = '/rings/kit'

export const AppRoutes = () => {
	const { ready } = useRefresh()

	if (!ready) return <Loader />

	return (
		<BrowserRouter>
			<Suspense fallback={<Loader />}>
				{/* //TODO убрать коммент с метрики  */}
				{/* <Metrics /> */}
				<Routes>
					<Route path={PathRoutes.Auth.Base} element={<Auth />} />
					<Route path={PathRoutes.Auth.Confirm} element={<Confirm />} />
					<Route path={PathRoutes.Auth.Recovery} element={<Recovery />} />
					<Route path={PathRoutes.Auth.RecoveryCode} element={<RecoveryPassword />} />

					<Route path={PathRoutes.Connect} element={<Manager />}>
						<Route index element={<Connect />} />
					</Route>

					<Route path='*' element={<NotFound />} />

					<Route
						path={PathRoutes.Home}
						element={
							<RequireAuth>
								<Main />
							</RequireAuth>
						}
					>
						<Route index element={<Home />} />

						<Route path={PathRoutes.Gasket.Base} element={<Gasket />}>
							<Route path={PathRoutes.Gasket.SNP} element={<Snp />} />
							<Route path={PathRoutes.Gasket.PUTG} element={<Putg />} />
						</Route>

						<Route path={PathRoutes.Rings.Base} element={<Rings />}>
							<Route path={PathRoutes.Rings.Single} element={<SingleRings />} />
							<Route path={PathRoutes.Rings.Kit} element={<RingsKit />} />
						</Route>

						<Route path={PathRoutes.Orders} element={<Orders />} />
					</Route>

					<Route
						path={PathRoutes.Manager.Base}
						element={
							<CheckAccess forbiddenRoles={['user']}>
								<Manager />
							</CheckAccess>
						}
					>
						<Route path={PathRoutes.Manager.Orders.Base} element={<ManagerOrders />} />
						<Route path={PathRoutes.Manager.Orders.Order} element={<ManagerOrder />} />
						<Route path={PathRoutes.Manager.Orders.Last} element={<LastOrders />} />

						<Route path={PathRoutes.Manager.Analytics.Base} element={<Analytics />} />
						<Route path={PathRoutes.Manager.Analytics.Users} element={<AnalyticsUsers />} />
						<Route path={PathRoutes.Manager.Analytics.Orders} element={<AnalyticsOrders />} />
						<Route path={PathRoutes.Manager.Analytics.Count} element={<AnalyticsCount />} />
						<Route path={PathRoutes.Manager.Analytics.User} element={<AnalyticsUser />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
