import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'
// import { Header } from '@/components/Header/Header'
import { Loader } from '@/components/Loader/Loader'
import { Wrapper } from './manager.style'

const Header = lazy(() => import('@/components/Header/Header'))

export default function Main() {
	return (
		<>
			<Suspense fallback={<Loader />}>
				<Header disableCard />
				<Wrapper>
					<Outlet />
				</Wrapper>
			</Suspense>
		</>
	)
}
