import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Stack } from '@mui/material'
import { useAppDispatch } from '@/hooks/useStore'
import { clearActive } from '@/store/card'
import { RingRoute, RingsKitRoute, RingsRoute } from '@/routes'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { Container } from '@/pages/Gasket/gasket.style'
import { Products } from '@/components/Products/Products'
import { RingsSkeleton } from './RingsSkeleton'

export default function Rings() {
	const navigate = useNavigate()
	const location = useLocation()

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (location.pathname == RingsRoute) navigate(RingRoute, { replace: true })
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
					<RadioItem size='large' value={RingRoute} active={location.pathname == RingRoute}>
						Кольца
					</RadioItem>
					<RadioItem size='large' value={RingsKitRoute} active={location.pathname == RingsKitRoute}>
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
