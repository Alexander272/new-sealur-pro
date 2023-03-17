import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { refresh } from '@/services/auth'
import { setAuth } from '@/store/user'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Wrapper } from './auth.style'
import { SignIn } from './components/AuthForms/SignInForm'
import { SignUp } from './components/AuthForms/SignUpForm'

export default function Auth() {
	const [isSignUp, setIsSignUp] = useState(false)

	const navigate = useNavigate()
	const location = useLocation()

	// const loading = useSelector((state: RootState) => state.user.loading)
	const isAuth = useAppSelector(state => state.user.isAuth)

	const from: string = (location.state as any)?.from?.pathname || '/'

	// const { user } = useDispatch<Dispatch>()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (isAuth) {
			navigate(from, { replace: true })
		}
	}, [isAuth, navigate, from])

	// const getRefresh = useCallback(async () => {
	// 	const res = await refresh()
	// 	if (!res.error) dispatch(setAuth({ id: res.data.id, roleCode: res.data.roleCode }))
	// }, [])

	//TODO убрать лишние переходы при refresh
	// useLayoutEffect(() => {
	// 	if (!isAuth) {
	// 		getRefresh()
	// 	}
	// }, [isAuth])

	const changeTabHandler = (value: boolean) => () => {
		setIsSignUp(value)
	}

	return (
		<Wrapper>
			<Container signUp={isSignUp}>
				{/* {loading && <Loader background='fill' />} */}
				<SignIn onChangeTab={changeTabHandler(false)} isOpen={!isSignUp} />
				<SignUp onChangeTab={changeTabHandler(true)} isOpen={isSignUp} />
			</Container>
		</Wrapper>
	)
}
