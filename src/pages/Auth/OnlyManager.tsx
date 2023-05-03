import { useAppSelector } from '@/hooks/useStore'
import { Navigate, useLocation } from 'react-router-dom'

// проверка роли пользователя (все кроме менеджеров отсеиваются)
export default function OnlyManager({ children }: { children: JSX.Element }) {
	// const isAuth = useAppSelector(state => state.user.isAuth)
	const role = useAppSelector(state => state.user.roleCode)
	// const location = useLocation()

	// if (!isAuth) return <Navigate to='/auth' state={{ from: location }} />
	if (role == 'user') return <Navigate to='/' />

	return children
}
