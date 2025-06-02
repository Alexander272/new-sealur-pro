import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { GasketSkeleton } from '@/features/gaskets/components/Skeletons/Skeleton'
import { Container } from '@/features/gaskets/components/Skeletons/gasket.style'

export default function Gaskets() {
	const navigate = useNavigate()
	const location = useLocation()

	// const dispatch = useAppDispatch()

	useEffect(() => {
		if (location.pathname == PathRoutes.Gasket.Base) navigate(PathRoutes.Gasket.Snp, { replace: true })
	}, [location.pathname, navigate])

	const navigateHandler = (path: string) => {
		// dispatch(clearActive())
		navigate(path)
	}

	return (
		<Container>
			{/* // tabs с переключением типа прокладки */}
			<RadioGroup onChange={navigateHandler}>
				<RadioItem
					size='large'
					value={PathRoutes.Gasket.Snp}
					active={location.pathname == PathRoutes.Gasket.Snp}
				>
					СНП
				</RadioItem>
				<RadioItem
					size='large'
					value={PathRoutes.Gasket.Putg}
					active={location.pathname == PathRoutes.Gasket.Putg}
				>
					ПУТГ
				</RadioItem>
				<RadioItem
					size='large'
					value={PathRoutes.Gasket.Wave}
					active={location.pathname == PathRoutes.Gasket.Wave}
				>
					Волновые
				</RadioItem>
				<RadioItem
					size='large'
					value={PathRoutes.Gasket.Serrated}
					active={location.pathname == PathRoutes.Gasket.Serrated}
				>
					Зубчатые
				</RadioItem>
				<RadioItem
					size='large'
					value={PathRoutes.Gasket.Jacketed}
					active={location.pathname == PathRoutes.Gasket.Jacketed}
				>
					Завальцованные
				</RadioItem>
			</RadioGroup>

			<Suspense key={location.pathname} fallback={<GasketSkeleton />}>
				<Outlet />
			</Suspense>
		</Container>
	)
}
