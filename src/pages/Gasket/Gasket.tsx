// import { useAppSelector } from '@/hooks/useStore'
// import { useEffect } from 'react'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader } from '@/components/Loader/Loader'
import { Container, Content } from './gasket.style'

export default function Gasket() {
	// const navigate = useNavigate()
	// const role = useAppSelector(state => state.user.roleCode)

	// useEffect(() => {
	// 	if (role == 'manager') navigate('/manager/orders')
	// }, [role])

	return (
		<Container>
			{/* //TODO tabs с переключением типа прокладки */}
			{/* <Content> */}
			<Suspense fallback={<Loader />}>
				<Outlet />
			</Suspense>
			{/* </Content> */}
		</Container>
	)
}
