import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Loader } from '@/components/Loader/Loader'

import Main from '@/layout/Main/Main'
const ProGasket = lazy(() => import('@/pages/Gasket/Gasket'))
const ProSnp = lazy(() => import('@/pages/Gasket/Snp/Snp'))

export const AppRoutes = () => (
	<BrowserRouter basename={'/'}>
		<Suspense fallback={<Loader />}>
			<Routes>
				<Route path='/' element={<Main />}>
					<Route path='/' element={<ProGasket />}>
						<Route index element={<ProSnp />} />
					</Route>
					{/* <Route index element={<Group />} />
				<Route path='/formulas/:id' element={<Formulas />} />
				<Route path='/table' element={<Table />} />*/}
				</Route>
			</Routes>
		</Suspense>
	</BrowserRouter>
)
