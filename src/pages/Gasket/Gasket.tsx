import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { Container } from './gasket.style'
import { useAppDispatch } from '@/hooks/useStore'
import { clearActive } from '@/store/card'
import { GasketSkeleton } from './GasketSkeleton'

const gasketRoute = '/'
export const snpRoute = gasketRoute + 'snp'
export const putgRoute = gasketRoute + 'putg'

export default function Gasket() {
	const navigate = useNavigate()
	const location = useLocation()

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (location.pathname == gasketRoute) navigate(snpRoute, { replace: true })
	}, [location.pathname])

	const navigateHandler = (path: string) => {
		dispatch(clearActive())
		navigate(path)
	}

	return (
		<Container>
			{/* // tabs с переключением типа прокладки */}
			<RadioGroup onChange={navigateHandler}>
				<RadioItem size='large' value={snpRoute} active={location.pathname == snpRoute}>
					СНП
				</RadioItem>
				<RadioItem size='large' value={putgRoute} active={location.pathname == putgRoute}>
					ПУТГ
				</RadioItem>
			</RadioGroup>

			{/* <Content> */}
			<Suspense fallback={<GasketSkeleton />}>
				<Outlet />
			</Suspense>
			{/* </Content> */}
		</Container>
	)
}
