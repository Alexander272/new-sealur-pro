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
		if (location.pathname == PathRoutes.Gasket.Base) navigate(PathRoutes.Gasket.SNP, { replace: true })
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
					value={PathRoutes.Gasket.SNP}
					active={location.pathname == PathRoutes.Gasket.SNP}
				>
					СНП
				</RadioItem>
				<RadioItem
					size='large'
					value={PathRoutes.Gasket.PUTG}
					active={location.pathname == PathRoutes.Gasket.PUTG}
				>
					ПУТГ
				</RadioItem>
			</RadioGroup>

			<Suspense fallback={<GasketSkeleton />}>
				<Outlet />
			</Suspense>
		</Container>
	)
}
