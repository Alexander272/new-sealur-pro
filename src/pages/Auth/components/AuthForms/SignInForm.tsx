import { FC, FormEvent, useState } from 'react'
import { Alert, Button, FormControl, Snackbar } from '@mui/material'
import { useInput } from '@/hooks/useInput'
import { useAppDispatch } from '@/hooks/useStore'
import { setUser } from '@/store/user'
import { signIn } from '@/services/auth'
import { ISignIn } from '@/types/auth'
import { Loader } from '@/components/Loader/Loader'
import { Input, FormContent, SignInForm, Title, NavLink } from './forms.style'

type Props = {
	isOpen: boolean
	onChangeTab: () => void
}

export const SignIn: FC<Props> = ({ isOpen, onChangeTab }) => {
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [error, setError] = useState<string>('')

	const dispatch = useAppDispatch()

	const email = useInput({ validation: 'email' })
	const password = useInput({ validation: 'empty' })

	const signInHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		let emailValid = email.validate()
		let passwordValid = password.validate()

		if (!emailValid || !passwordValid) return

		setLoading(true)
		const value: ISignIn = {
			email: email.value,
			password: password.value,
		}

		const res = await signIn(value)
		if (res.error) {
			console.log(res.error)
			// показать ошибку
			handleClick(res.error)
		} else {
			dispatch(setUser(res.data.data))
		}
		setLoading(false)
	}

	const handleClick = (message: string) => {
		setOpen(true)
		setError(message)
	}

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	return (
		<SignInForm onClick={!isOpen ? onChangeTab : undefined} open={isOpen} onSubmit={signInHandler}>
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
					{error}
				</Alert>
			</Snackbar>

			{loading ? <Loader background='fill' /> : null}

			<Title open={isOpen}>Вход</Title>

			<FormContent>
				<FormControl sx={{ marginTop: 1, marginBottom: 2 }}>
					<Input
						value={email.value}
						onChange={email.onChange}
						name='email'
						placeholder='Email'
						size='small'
						error={!email.valid}
					/>
				</FormControl>

				<FormControl sx={{ marginBottom: 1 }}>
					<Input
						value={password.value}
						onChange={password.onChange}
						name='password'
						type='password'
						placeholder='Пароль'
						size='small'
						error={!password.valid}
					/>
				</FormControl>

				{/* //TODO добавить кнопку для восстановления пароля */}
				<NavLink to='reset'>Забыли пароль?</NavLink>

				<Button
					type='submit'
					variant='contained'
					sx={{ borderRadius: '20px', fontSize: '1rem', fontWeight: 600, marginTop: 4 }}
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
