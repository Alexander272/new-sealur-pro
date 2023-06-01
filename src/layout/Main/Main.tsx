import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'
// import { Header } from '@/components/Header/Header'
import { Loader } from '@/components/Loader/Loader'
import { Base, Wrapper } from './main.style'

const Header = lazy(() => import('@/components/Header/Header'))
const Footer = lazy(() => import('@/components/Footer/Footer'))
const Card = lazy(() => import('@/pages/Card/Card'))

export default function Main() {
	return (
		<Base>
			<Suspense fallback={<Loader />}>
				<Header />
				{/* </Suspense> */}
				<Wrapper>
					<Suspense fallback={<Loader />}>
						<Outlet />
					</Suspense>
					<Suspense fallback={<></>}>
						<Card />
					</Suspense>
				</Wrapper>
				{/* <Suspense fallback={<Loader />}> */}
				<Footer />
			</Suspense>
		</Base>
	)
}
