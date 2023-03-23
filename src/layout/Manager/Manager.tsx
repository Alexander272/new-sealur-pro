import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header/Header'
import { Loader } from '@/components/Loader/Loader'
import { Wrapper } from './manager.style'

export default function Main() {
	return (
		<>
			<Header />
			<Wrapper>
				<Suspense fallback={<Loader />}>
					<Outlet />
				</Suspense>
			</Wrapper>
		</>
	)
}
