import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Loader } from '@/components/Loader/Loader'
import { useRefresh } from './hooks/refresh'

import Main from '@/layout/Main/Main'
import RequireAuth from './pages/RequireAuth/RequireAuth'
const Auth = lazy(() => import('@/pages/Auth/Auth'))
const ProGasket = lazy(() => import('@/pages/Gasket/Gasket'))
const ProSnp = lazy(() => import('@/pages/Gasket/Snp/Snp'))

export const AppRoutes = () => {
	const { ready } = useRefresh()

	if (!ready) return <></>
	return (
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
}
