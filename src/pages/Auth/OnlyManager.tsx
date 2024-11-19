import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useStore'
import { PathRoutes } from '@/constants/routes'

// проверка роли пользователя (все простые пользователи отсеиваются)
export default function OnlyManager({ children }: { children: JSX.Element }) {
	const isAuth = useAppSelector(state => state.user.isAuth)
	const role = useAppSelector(state => state.user.roleCode)
	const location = useLocation()

	console.log('only manager component')

	// TODO похоже есть проблема с навигацией
	// в firefox при переходе на страницу manager/orders неавторизованного пользователя выдает ошибку "Слишком много вызовов API Location или History за короткий промежуток времени." и белый экран
	// также в chrome у некоторых людей при нажатии кнопки "Войти" не происходит редирект на страницу

	if (!isAuth) return <Navigate to={PathRoutes.Auth.Base} state={{ from: location }} />
	if (role == 'user') return <Navigate to={PathRoutes.Home} replace />

	return children
}
