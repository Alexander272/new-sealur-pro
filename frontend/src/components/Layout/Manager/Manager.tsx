import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'

import { Fallback } from '@/components/Fallback/Fallback'
import { Wrapper } from './manager.style'

const Header = lazy(() => import('@/components/Layout/Header/Header'))

export default function Main() {
	return (
		<>
			<Header disableCard />
			<Wrapper>
				<Suspense fallback={<Fallback alignSelf={'center'} />}>
					<Outlet />
				</Suspense>
			</Wrapper>
		</>
	)
}
