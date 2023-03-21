import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header/Header'
import { Wrapper } from './manager.style'

export default function Main() {
	return (
		<>
			<Header />
			<Wrapper>
				<Outlet />
			</Wrapper>
		</>
	)
}
