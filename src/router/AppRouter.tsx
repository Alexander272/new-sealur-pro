import { Suspense } from 'react'
import { Box } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import { Fallback } from '@/components/Fallback/Fallback'
import { useRefresh } from '@/features/auth/hooks/refresh'
import { Auth } from '@/pages/auth/AuthLazy'
import { Confirm } from '@/pages/confirm/ConfirmLazy'
import { Recovery } from '@/pages/recovery/RecoveryLazy'
import { RecoveryPassword } from '@/pages/recovery/PasswordLazy'

// import { Loader } from '@/components/Loader/Loader'
// import { PathRoutes } from './constants/routes'
// import { useRefresh } from './hooks/refresh'

// import Main from '@/layout/Main/Main'
// import RequireAuth from './pages/Auth/RequireAuth'

export const AppRouter = () => {
	const { ready } = useRefresh()

	if (!ready)
		return (
			<Box height={'100vh'}>
				<Fallback />
			</Box>
		)

	return (
		<BrowserRouter>
			<Suspense fallback={<Fallback />}>
				{/* //TODO убрать коммент с метрики  */}
				{/* <Metrics />*/}
				<Routes>
					<Route path={PathRoutes.Auth.Base} element={<Auth />} />
					<Route path={PathRoutes.Auth.Confirm} element={<Confirm />} />
					<Route path={PathRoutes.Auth.Recovery} element={<Recovery />} />
					<Route path={PathRoutes.Auth.RecoveryCode} element={<RecoveryPassword />} />

					{/* <Route path={PathRoutes.Connect} element={<Manager />}>
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
					</Route>*/}
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
