import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Stack } from '@mui/material'
import { PathRoutes } from '@/constants/routes'
import { useAppDispatch } from '@/hooks/useStore'
import { clearActive } from '@/store/card'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { Products } from '@/components/Products/Products'
import { GasketSkeleton } from './GasketSkeleton'
import { Container } from './gasket.style'

export default function Gasket() {
	const navigate = useNavigate()
	const location = useLocation()

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (location.pathname == PathRoutes.Gasket.Base) navigate(PathRoutes.Gasket.SNP, { replace: true })
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
			</Stack>

			{/* <Content> */}
			<Suspense fallback={<GasketSkeleton />}>
				<Outlet />
			</Suspense>
			{/* </Content> */}
		</Container>
	)
}
