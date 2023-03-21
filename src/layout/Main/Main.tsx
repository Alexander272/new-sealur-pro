import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header/Header'
import { Card } from '@/pages/Card/Card'
import { Base, Wrapper } from './main.style'

export default function Main() {
	return (
		<Base>
			<Header />
			<Wrapper>
				<Outlet />
				<Card />
			</Wrapper>
		</Base>
	)
}
