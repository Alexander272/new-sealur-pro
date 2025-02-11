import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'

import { Card } from '@/features/card/components/Card/CardLazy'
import { Fallback } from '@/components/Fallback/Fallback'
import { Wrapper } from './main.style'

const Header = lazy(() => import('@/components/Layout/Header/Header'))
const Footer = lazy(() => import('@/components/Layout/Footer/Footer'))
// const Card = lazy(() => import('@/pages/Card/Card'))

type Props = {
	disableCard?: boolean
}

export default function Main({ disableCard }: Props) {
	return (
		<>
			<Header disableCard={disableCard} />
			<Wrapper>
				<Suspense fallback={<Fallback alignSelf={'center'} />}>
					<Outlet />
				</Suspense>

				{!disableCard && (
					<Suspense fallback={<></>}>
						{/* //TODO */}
						<Card />
					</Suspense>
				)}
			</Wrapper>
			<Footer />
		</>
	)
}
