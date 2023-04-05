import { AuthFooter } from '@/components/Footer/AuthFooter'
import { useAppSelector } from '@/hooks/useStore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Wrapper, Base } from './auth.style'
import { SignIn } from './components/AuthForms/SignInForm'
import { SignUp } from './components/AuthForms/SignUpForm'

export default function Auth() {
	const [isSignUp, setIsSignUp] = useState(false)

	const navigate = useNavigate()
	const location = useLocation()

	const isAuth = useAppSelector(state => state.user.isAuth)

	const from: string = (location.state as any)?.from?.pathname || '/'

	useEffect(() => {
		if (isAuth) {
			navigate(from, { replace: true })
		}
	}, [isAuth, navigate, from])

	const changeTabHandler = (value: boolean) => () => {
		setIsSignUp(value)
	}

	return (
		<Base>
			<Wrapper>
				<Container signUp={isSignUp}>
					{/* {loading && <Loader background='fill' />} */}
					<SignIn onChangeTab={changeTabHandler(false)} isOpen={!isSignUp} />
					<SignUp onChangeTab={changeTabHandler(true)} isOpen={isSignUp} />
				</Container>
			</Wrapper>
			{/* <AuthFooter /> */}
		</Base>
	)
}
