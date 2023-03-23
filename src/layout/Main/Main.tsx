import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header/Header'
import { Card } from '@/pages/Card/Card'
import { Loader } from '@/components/Loader/Loader'
import { Base, Wrapper } from './main.style'

export default function Main() {
	return (
		<Base>
			<Header />
			<Wrapper>
				<Suspense fallback={<Loader />}>
					<Outlet />
				</Suspense>
				<Card />
			</Wrapper>
		</Base>
	)
}
