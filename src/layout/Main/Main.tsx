import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header/Header'
import { Card } from '@/components/Card/Card'
import { Wrapper } from './main.style'

export default function Main() {
	return (
		<>
			<Header />
			<Wrapper>
				<Outlet />
				<Card />
			</Wrapper>
		</>
	)
}
