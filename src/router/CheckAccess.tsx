import { Navigate, useLocation } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import { useAppSelector } from '@/hooks/redux'
import { Forbidden } from '@/pages/forbidden/ForbiddenLazy'

type Props = {
	children: JSX.Element
	forbiddenRoles: string[]
}

export default function CheckAccess({ children, forbiddenRoles }: Props) {
	const { roleCode: role, isAuth } = useAppSelector(state => state.user)
	const location = useLocation()

	if (location.search) {
		const parts = location.search.split('&')[0].split('=')
		if (parts[0] === '?managerId') localStorage.setItem('managerId', parts[1])
	}

	if (!isAuth) return <Navigate to={PathRoutes.Auth.Base} state={{ from: location }} />
	if (forbiddenRoles.includes(role)) return <Forbidden />
	return children
}
