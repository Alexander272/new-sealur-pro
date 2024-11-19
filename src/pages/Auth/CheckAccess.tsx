import { lazy } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import { useAppSelector } from '@/hooks/useStore'

const Forbidden = lazy(() => import('@/pages/Forbidden/Forbidden'))

type Props = {
	children: JSX.Element
	forbiddenRoles: string[]
}

export default function CheckAccess({ children, forbiddenRoles }: Props) {
	const { roleCode: role, isAuth } = useAppSelector(state => state.user)
	const location = useLocation()

	if (!isAuth) return <Navigate to={PathRoutes.Auth.Base} state={{ from: location }} />
	if (forbiddenRoles.includes(role)) return <Forbidden />
	return children
}
