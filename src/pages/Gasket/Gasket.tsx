import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Loader } from '@/components/Loader/Loader'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { Container } from './gasket.style'

const gasketRoute = '/'
const snpRoute = '/snp'
const putgRoute = '/putg'

export default function Gasket() {
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if (location.pathname == gasketRoute) navigate('snp')
	}, [location.pathname])

	const navigateHandler = (path: string) => {
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
			<Suspense fallback={<Loader />}>
				<Outlet />
			</Suspense>
			{/* </Content> */}
		</Container>
	)
}
