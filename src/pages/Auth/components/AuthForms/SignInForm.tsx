import { FC, FormEvent } from 'react'
import { Button, FormControl, InputBase } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
// import { ISignIn } from '../../../types/user'
import { Input, FormContent, SignInForm, Title } from './forms.style'
import { useInput } from '@/hooks/useInput'
import { signIn } from '@/services/auth'
import { ISignIn } from '@/types/auth'
import { useAppDispatch } from '@/hooks/useStore'
import { setUser } from '@/store/user'
// import { Input } from '@/components/Input/input.style'

type Props = {
	isOpen: boolean
	onChangeTab: () => void
}

export const SignIn: FC<Props> = ({ isOpen, onChangeTab }) => {
	// const {
	// 	register,
	// 	handleSubmit,
	// 	formState: { errors },
	// } = useForm<ISignIn>()

	// const { user } = useDispatch<Dispatch>()

	// const signInHandler: SubmitHandler<ISignIn> = data => {
	// 	user.signIn(data)
	// }

	const dispatch = useAppDispatch()

	const email = useInput({ validation: 'email' })
	const password = useInput({ validation: 'empty' })

	const signInHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!email.valid || !password.valid) return

		const value: ISignIn = {
			email: email.value,
			password: password.value,
		}

		const res = await signIn(value)
		if (res.error) {
			console.log(res.error)
			//TODO показать ошибку
			// handleClick('error', res.error)
		} else {
			dispatch(setUser(res.data.data))
		}
	}

	return (
		<SignInForm
			onClick={!isOpen ? onChangeTab : undefined}
			open={isOpen}
			// onSubmit={handleSubmit(signInHandler)}
			onSubmit={signInHandler}
		>
			<Title open={isOpen}>Вход</Title>
			<FormContent>
				<FormControl sx={{ marginTop: 1, marginBottom: 2 }}>
					<Input
						value={email.value}
						onChange={email.onChange}
						name='email'
						placeholder='Email'
						size='small'
					/>
				</FormControl>

				<FormControl sx={{ marginBottom: 5 }}>
					<Input
						value={password.value}
						onChange={password.onChange}
						name='password'
						type='password'
						placeholder='Пароль'
						size='small'
					/>
				</FormControl>
				{/* <Input
					name='login'
					rounded='round'
					placeholder='Логин'
					register={register}
					rule={{ required: true }}
					error={errors.login}
					errorText='Поле логин не может быть пустым'
				/>
				<Input
					name='password'
					type='password'
					rounded='round'
					placeholder='Пароль'
					register={register}
					rule={{ required: true }}
					error={errors.password}
					errorText='Поле пароль не может быть пустым'
				/> */}
				<Button
					type='submit'
					variant='contained'
					sx={{ borderRadius: '20px', fontSize: '1rem', fontWeight: 600 }}
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
