import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Stack } from '@mui/material'
import { useAppDispatch } from '@/hooks/useStore'
import { clearActive } from '@/store/card'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { Container } from '@/pages/Gasket/gasket.style'
import { Products } from '@/components/Products/Products'
import { RingsSkeleton } from './RingsSkeleton'
import { PathRoutes } from '@/constants/routes'

export default function Rings() {
	const navigate = useNavigate()
	const location = useLocation()

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (location.pathname == PathRoutes.Rings.Base) navigate(PathRoutes.Rings.Base, { replace: true })
	}, [location.pathname])

	const navigateHandler = (path: string) => {
		dispatch(clearActive())
		navigate(path)
	}

	return (
		<Container>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{ xs: 1, sm: 6 }}
				alignItems={{ sm: 'flex-start', xs: 'center' }}
			>
				<Products />

				<RadioGroup onChange={navigateHandler}>
					<RadioItem
						size='large'
						value={PathRoutes.Rings.Single}
						active={location.pathname == PathRoutes.Rings.Single}
					>
						Кольца
					</RadioItem>
					<RadioItem
						size='large'
						value={PathRoutes.Rings.Kit}
						active={location.pathname == PathRoutes.Rings.Kit}
					>
						Комплекты
					</RadioItem>
				</RadioGroup>
			</Stack>

			<Suspense fallback={<RingsSkeleton />}>
				<Outlet />
			</Suspense>
		</Container>
	)
}
