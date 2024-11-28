import { FC, FormEvent, useState } from 'react'
import { Button, FormControl, InputAdornment } from '@mui/material'
import { toast } from 'react-toastify'
import InVisibleIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibleIcon from '@mui/icons-material/RemoveRedEye'

import type { IFetchError } from '@/app/types/error'
import type { ISignIn } from '../../types/auth'
import { PathRoutes } from '@/constants/routes'
import { useAppDispatch } from '@/hooks/redux'
import { useSignInMutation } from '@/features/auth/authApiSlice'
import { setUser } from '@/features/user/userSlice'
import { useInput } from '@/features/auth/hooks/useInput'
import { Input, FormContent, SignInForm, Title, NavLink } from './forms.style'
import { Fallback } from '@/components/Fallback/Fallback'

type Props = {
	isOpen: boolean
	onChangeTab: () => void
}

// форма авторизации
export const SignIn: FC<Props> = ({ isOpen, onChangeTab }) => {
	const [passIsVisible, setPassIsVisible] = useState(false)

	const dispatch = useAppDispatch()

	const [signIn, { isLoading }] = useSignInMutation()

	const togglePassVisible = () => setPassIsVisible(prev => !prev)

	const email = useInput({ validation: 'email' })
	const password = useInput({ validation: 'empty' })

	const signInHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const emailValid = email.validate()
		const passwordValid = password.validate()

		if (!emailValid || !passwordValid) return

		const value: ISignIn = {
			email: email.value,
			password: password.value,
		}

		try {
			const payload = await signIn(value).unwrap()
			dispatch(setUser(payload.data))
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	return (
		<SignInForm onClick={!isOpen ? onChangeTab : undefined} open={isOpen} onSubmit={signInHandler}>
			{isLoading ? <Fallback background={'#d8e0fc40'} /> : null}

			<Title open={isOpen}>Вход</Title>

			<FormContent>
				<FormControl sx={{ marginTop: 1, marginBottom: 2 }}>
					<Input
						value={email.value}
						onChange={email.onChange}
						name='email'
						placeholder='Email'
						error={!email.valid}
					/>
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						value={password.value}
						onChange={password.onChange}
						name='password'
						type={passIsVisible ? 'text' : 'password'}
						placeholder='Пароль'
						error={!password.valid}
						inputProps={{
							endAdornment: (
								<InputAdornment position='start' onClick={togglePassVisible} sx={{ cursor: 'pointer' }}>
									{passIsVisible ? <VisibleIcon /> : <InVisibleIcon />}
								</InputAdornment>
							),
						}}
					/>
					{/* <VisiblePassword password={password.value} /> */}
				</FormControl>

				<NavLink to={PathRoutes.Auth.Recovery}>Забыли пароль?</NavLink>

				<Button
					type='submit'
					variant='contained'
					disabled={isLoading}
					sx={{ borderRadius: '20px', fontSize: '1rem', fontWeight: 600, marginTop: 3 }}
				>
					Войти
				</Button>
				{/* <Link className={classes.link} to={`${ProUrl}/survey`}>
                    Заполнить опросный лист
                </Link> */}
			</FormContent>
		</SignInForm>
	)
}
