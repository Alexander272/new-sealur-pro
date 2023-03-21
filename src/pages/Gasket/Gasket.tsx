// import { useAppSelector } from '@/hooks/useStore'
// import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Container, Content } from './gasket.style'

export default function Gasket() {
	// const navigate = useNavigate()
	// const role = useAppSelector(state => state.user.roleCode)

	// useEffect(() => {
	// 	if (role == 'manager') navigate('/manager/orders')
	// }, [role])

	return (
		<Container>
			{/* //TODO табы с переключением типа прокладки */}
			{/* <Content> */}
			<Outlet />
			{/* </Content> */}
		</Container>
	)
}
