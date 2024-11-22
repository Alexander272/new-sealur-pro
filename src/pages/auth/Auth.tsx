import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import { useAppSelector } from '@/hooks/redux'
import { getIsAuth } from '@/features/user/userSlice'
import Header from '@/features/auth/components/Header/Header'
import { SignIn } from '@/features/auth/components/Forms/SignInForm'
import { SignUp } from '@/features/auth/components/Forms/SignUpForm'
import Footer from '@/components/Layout/Footer/Footer'
import { Container, Wrapper, Base } from './auth.style'

type LocationState = {
	from?: Location
}

export default function Auth() {
	const [isSignUp, setIsSignUp] = useState(Boolean(localStorage.getItem('managerId')))

	const navigate = useNavigate()
	const location = useLocation()

	const isAuth = useAppSelector(getIsAuth)

	const from: string = (location.state as LocationState)?.from?.pathname || PathRoutes.Home

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
