import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'
// import { Header } from '@/components/Header/Header'
import { Loader } from '@/components/Loader/Loader'
import { Base, Wrapper } from './main.style'

const Header = lazy(() => import('@/components/Header/Header'))
const Card = lazy(() => import('@/pages/Card/Card'))

export default function Main() {
	return (
		<Base>
			<Suspense fallback={<Loader />}>
				<Header />
				<Wrapper>
					<Outlet />
					<Card />
				</Wrapper>
			</Suspense>
		</Base>
	)
}
