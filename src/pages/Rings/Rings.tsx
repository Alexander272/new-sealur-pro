import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/useStore'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { RingsSkeleton } from './RingsSkeleton'
import { Container } from '@/pages/Gasket/gasket.style'

const ringsRoute = '/rings'
export const singleRoute = ringsRoute + '/single'
// export const putgRoute = gasketRoute + 'putg'

export default function Rings() {
	const navigate = useNavigate()
	const location = useLocation()

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (location.pathname == ringsRoute) navigate(singleRoute, { replace: true })
	}, [location.pathname])

	const navigateHandler = (path: string) => {
		//  dispatch(clearActive())
		// 	navigate(path)
	}

	return (
		<Container>
			{/* // tabs с переключением типа колец */}
			<RadioGroup onChange={navigateHandler}>
				<RadioItem size='large' value={singleRoute} active={location.pathname == singleRoute}>
					Кольца
				</RadioItem>
				{/* <RadioItem size='large' value={putgRoute} active={location.pathname == putgRoute}>
					ПУТГ
				</RadioItem> */}
			</RadioGroup>

			<Suspense fallback={<RingsSkeleton />}>
				<Outlet />
			</Suspense>
		</Container>
	)
}
