import { Outlet } from 'react-router-dom'
import { Container, Content } from './gasket.style'

export default function Gasket() {
	return (
		<Container>
			{/* //TODO табы с переключением типа прокладки */}
			{/* <Content> */}
			<Outlet />
			{/* </Content> */}
		</Container>
	)
}
