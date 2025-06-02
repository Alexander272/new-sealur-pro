import { Box } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import { useRefresh } from '@/features/auth/hooks/refresh'
import { Auth } from '@/pages/auth/AuthLazy'
import { Confirm } from '@/pages/confirm/ConfirmLazy'
import { Recovery } from '@/pages/recovery/RecoveryLazy'
import { RecoveryPassword } from '@/pages/recovery/PasswordLazy'
import { Connect } from '@/pages/connect/ConnectLazy'
import { NotFound } from '@/pages/notFound/NotFoundLazy'
import { Gaskets } from '@/pages/gaskets/GasketsLazy'
import { Snp } from '@/pages/gaskets/snp/SnpLazy'
import { Putg } from '@/pages/gaskets/putg/PutgLazy'
import { Wave } from '@/pages/gaskets/wave/WaveLazy'
import { Serrated } from '@/pages/gaskets/serrated/SerratedLazy'
import { Jacketed } from '@/pages/gaskets/jacketed/JacketedLazy'
import { Orders } from '@/pages/orders/orders/OrdersLazy'
import { Orders as ManagerOrders } from '@/pages/orders/byManager/OrdersLazy'
import { Order as ManagerOrder } from '@/pages/orders/byManager/OrderLazy'
import { OrdersList } from '@/pages/orders/list/ListLazy'
import { Analytics } from '@/pages/analytics/AnalyticsLazy'
import { UsersInfo } from '@/pages/users/usersInfo/UsersInfoLazy'
import { UserInfo } from '@/pages/users/userInfo/UserInfoLazy'
import { OrdersCount } from '@/pages/orders/count/OrdersCountLazy'
import { OrdersByUser } from '@/pages/orders/byUser/OrdersLazy'
import { Main } from '@/components/Layout/Main/MainLazy'
import { Base } from '@/components/Layout/Base/Base'
import { Fallback } from '@/components/Fallback/Fallback'
import CheckAccess from './CheckAccess'

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
			<Routes>
				<Route path='' element={<Base />}>
					<Route path={PathRoutes.Auth.Base} element={<Auth />} />
					<Route path={PathRoutes.Auth.Confirm} element={<Confirm />} />
					<Route path={PathRoutes.Auth.Recovery} element={<Recovery />} />
					<Route path={PathRoutes.Auth.RecoveryCode} element={<RecoveryPassword />} />

					<Route path={PathRoutes.Connect} element={<Main disableCard />}>
						<Route index element={<Connect />} />
					</Route>

					<Route path='*' element={<NotFound />} />

					<Route
						path={PathRoutes.Home}
						element={
							<CheckAccess>
								<Main />
							</CheckAccess>
						}
					>
						{/* <Route index element={<Home />} /> */}

						<Route path={PathRoutes.Gasket.Base} element={<Gaskets />}>
							<Route path={PathRoutes.Gasket.Snp} element={<Snp />} />
							<Route path={PathRoutes.Gasket.Putg} element={<Putg />} />
							<Route path={PathRoutes.Gasket.Wave} element={<Wave />} />
							<Route path={PathRoutes.Gasket.Serrated} element={<Serrated />} />
							<Route path={PathRoutes.Gasket.Jacketed} element={<Jacketed />} />
						</Route>

						{/* <Route path={PathRoutes.Rings.Base} element={<Rings />}>
							<Route path={PathRoutes.Rings.Single} element={<SingleRings />} />
							<Route path={PathRoutes.Rings.Kit} element={<RingsKit />} />
						</Route> */}

						<Route path={PathRoutes.Orders} element={<Orders />} />
					</Route>

					<Route
						path={PathRoutes.Manager.Base}
						element={
							<CheckAccess forbiddenRoles={['user']}>
								<Main disableCard />
							</CheckAccess>
						}
					>
						<Route path={PathRoutes.Manager.Orders.Base} element={<ManagerOrders />} />
						<Route path={PathRoutes.Manager.Orders.Order} element={<ManagerOrder />} />
						<Route path={PathRoutes.Manager.Orders.List} element={<OrdersList />} />

						<Route path={PathRoutes.Manager.Analytics.Base} element={<Analytics />} />
						<Route path={PathRoutes.Manager.Analytics.Users} element={<UsersInfo />} />
						<Route path={PathRoutes.Manager.Analytics.User} element={<UserInfo />} />
						<Route path={PathRoutes.Manager.Analytics.Count} element={<OrdersCount />} />
						<Route path={PathRoutes.Manager.Analytics.Orders} element={<OrdersByUser />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
