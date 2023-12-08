import { FormEvent, SyntheticEvent, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Button, FormControl, Snackbar, Typography } from '@mui/material'
import { useSetPasswordMutation } from '@/store/api/user'
import { useInput } from '@/hooks/useInput'
import type { IFetchError } from '@/types/auth'
import { Loader } from '@/components/Loader/Loader'
import { Input, Title } from '../components/AuthForms/forms.style'
import { ValidMessage } from '../components/ValidMessage/ValidMessage'
import { VisiblePassword } from '../components/VisiblePassword/VisiblePassword'
import { Container, Wrapper, Base } from '../auth.style'
import { Form } from './recovery.style'

type Alert = { open: boolean; type: 'success' | 'error'; message: string }

// страница для ввода нового пароля
export default function RecoveryPassword() {
	const [alert, setAlert] = useState<Alert>({ open: false, type: 'success', message: '' })
	const [compare, setCompare] = useState(true)
	const password = useInput({ validation: 'password' })
	const confirm = useInput({ validation: 'empty' })

	const navigate = useNavigate()
	const { code } = useParams()

	const [setPassword, { isLoading }] = useSetPasswordMutation()

	const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		let passwordValid = password.validate()
		let confirmValid = confirm.validate()
		let passwordsCompare = password.value === confirm.value

		if (!passwordValid || !confirmValid || !code) return
		if (!passwordsCompare) {
			setCompare(passwordsCompare)
			return
		}

		try {
			await setPassword({ code, password: password.value }).unwrap()
			handleClick('success', 'Пароль успешно изменен. Сейчас произойдет перенаправление на страницу авторизации')
			setTimeout(() => {
				navigate('/auth')
			}, 5000)
		} catch (error) {
			const fetchError = error as IFetchError
			handleClick('error', fetchError.data.message)
		}
	}

	const handleClick = (type: 'success' | 'error', message: string) => {
		setAlert({ open: true, type, message })
	}
	const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setAlert({ open: false, type: 'success', message: '' })
	}

	return (
		<Base>
			<Wrapper>
				<Container>
					<Form onSubmit={submitHandler}>
						<Snackbar
							open={alert.open}
							autoHideDuration={6000}
							onClose={handleClose}
							anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
						>
							<Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
								{alert.message}
							</Alert>
						</Snackbar>

						{isLoading ? <Loader background='fill' /> : null}

						<Title open={true}>Восстановление пароля</Title>

						<Typography align='justify' marginTop={2}>
							Укажите новый пароль.
						</Typography>

						<FormControl sx={{ marginTop: 3, marginBottom: 1, position: 'relative' }}>
							<Input
								label='Пароль'
								type='password'
								value={password.value}
								onChange={password.onChange}
								error={!password.valid}
								size='small'
							/>
							<VisiblePassword password={password.value} />
							{!password.valid && (
								<ValidMessage
									iconRight='46px'
									messages={[
										'Минимальная длина пароля 6 символов',
										'Пароль должен содержать заглавные, строчные буквы и цифры',
									]}
								/>
							)}
						</FormControl>

						<FormControl sx={{ marginTop: 1, marginBottom: 2 }}>
							<Input
								label='Повторите пароль'
								type='password'
								value={confirm.value}
								onChange={confirm.onChange}
								error={!confirm.valid || !compare}
								size='small'
							/>
							<VisiblePassword password={confirm.value} />
							{!confirm.valid || !compare ? (
								<ValidMessage iconRight='46px' messages={['Пароли должны совпадать']} />
							) : null}
						</FormControl>

						<Button
							type='submit'
							variant='contained'
							disabled={isLoading}
							sx={{ borderRadius: '20px', fontSize: '1rem', fontWeight: 600, marginTop: 4 }}
						>
							Восстановить
						</Button>
					</Form>
				</Container>
			</Wrapper>
		</Base>
	)
}
