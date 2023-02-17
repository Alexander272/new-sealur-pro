import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './layout/Main/Main'

export const AppRoutes = () => (
	<BrowserRouter basename={'/'}>
		<Routes>
			<Route path='/' element={<Main />}>
				{/* <Route index element={<Group />} />
				<Route path='/formulas/:id' element={<Formulas />} />
				<Route path='/table' element={<Table />} />*/}
			</Route>
		</Routes>
	</BrowserRouter>
)
