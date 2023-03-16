import { useAppSelector } from '@/hooks/useStore'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth({ children }: { children: JSX.Element }) {
	// const state = store.getState().user
	// const isAuth = state.isAuth
	const isAuth = useAppSelector(state => state.user.isAuth)
	const role = useAppSelector(state => state.user.roleCode)
	// const roles = state.roles
	const location = useLocation()

	// if (location.pathname.includes("pro") && isAuth) {
	//     const isAccess = roles.some(r => r.service === "pro")
	//     if (!isAccess) return <Navigate to='/' state={{ from: location }} />
	// }
	// if (location.pathname.includes("moment") && isAuth) {
	//     const isAccess = roles.some(r => r.service === "moment")
	//     if (!isAccess) return <Navigate to='/' state={{ from: location }} />
	// }

	if (!isAuth) return <Navigate to='/auth' state={{ from: location }} />

	return children
}
