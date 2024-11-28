import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'

import { Fallback } from '@/components/Fallback/Fallback'
import { Base, Wrapper } from './main.style'

const Header = lazy(() => import('@/components/Layout/Header/Header'))
const Footer = lazy(() => import('@/components/Layout/Footer/Footer'))
// const Card = lazy(() => import('@/pages/Card/Card'))

export default function Main() {
	return (
		<Base>
			<Suspense fallback={<Fallback />}>
				<Header />
				{/* </Suspense> */}
				<Wrapper>
					<Suspense fallback={<Fallback />}>
						<Outlet />
					</Suspense>

					<Suspense fallback={<></>}>
						{/* //TODO */}
						{/* <Card /> */}
					</Suspense>
				</Wrapper>
				{/* <Suspense fallback={<Loader />}> */}
				<Footer />
			</Suspense>
		</Base>
	)
}
