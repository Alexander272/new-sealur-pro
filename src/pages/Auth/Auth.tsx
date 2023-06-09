import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useStore'
import Footer from '@/components/Footer/Footer'
import { Container, Wrapper, Base } from './auth.style'
import { SignIn } from './components/AuthForms/SignInForm'
import { SignUp } from './components/AuthForms/SignUpForm'
import Header from './components/Header/Header'

export default function Auth() {
	const [isSignUp, setIsSignUp] = useState(Boolean(localStorage.getItem('managerId')))

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
			<Header />
			<Wrapper>
				<Container signUp={isSignUp}>
					<SignIn onChangeTab={changeTabHandler(false)} isOpen={!isSignUp} />
					<SignUp onChangeTab={changeTabHandler(true)} isOpen={isSignUp} />
				</Container>
			</Wrapper>
			{/* <AuthFooter /> */}
			<Footer />
		</Base>
	)
}
