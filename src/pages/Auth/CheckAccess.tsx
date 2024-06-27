import { lazy } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAppSelector } from '@/hooks/useStore'

const Forbidden = lazy(() => import('@/pages/Forbidden/Forbidden'))

type Props = {
	children: JSX.Element
	forbiddenRoles: string[]
}

export default function CheckAccess({ children, forbiddenRoles }: Props) {
	const role = useAppSelector(state => state.user.roleCode)
	const isAuth = useAppSelector(state => state.user.isAuth)
	const location = useLocation()

	if (!isAuth) return <Navigate to='/auth' state={{ from: location }} />
	if (forbiddenRoles.includes(role)) return <Forbidden />
	return children
}
