import { FormEvent, useState } from 'react'
import { Button, FormControl, InputAdornment, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import InVisibleIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibleIcon from '@mui/icons-material/RemoveRedEye'

import type { IFetchError } from '@/app/types/error'
import { PathRoutes } from '@/constants/routes'
import { useInput } from '@/features/auth/hooks/useInput'
import { ValidMessage } from '@/features/auth/components/ValidMessage/ValidMessage'
import { Input, Title } from '@/features/auth/components/Forms/forms.style'
import { Fallback } from '@/components/Fallback/Fallback'
import { useSetPasswordMutation } from '../../recoveryApiSlice'
import { Form } from './recovery.style'

export const Password = () => {
	const [compare, setCompare] = useState(true)
	const [passIsVisible, setPassIsVisible] = useState(false)
	const [confIsVisible, setConfIsVisible] = useState(false)

	const password = useInput({ validation: 'password' })
	const confirm = useInput({ validation: 'empty' })

	const navigate = useNavigate()
	const { code } = useParams()

	const [setPassword, { isLoading }] = useSetPasswordMutation()

	const togglePassVisible = () => setPassIsVisible(prev => !prev)
	const toggleConfVisible = () => setConfIsVisible(prev => !prev)

	const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const passwordValid = password.validate()
		const confirmValid = confirm.validate()
		const passwordsCompare = password.value === confirm.value

		if (!passwordValid || !confirmValid || !code) return
		if (!passwordsCompare) {
			setCompare(passwordsCompare)
			return
		}

		try {
			await setPassword({ code, password: password.value }).unwrap()
			toast.success('Пароль успешно изменен. Сейчас произойдет перенаправление на страницу авторизации', {
				autoClose: false,
			})
			setTimeout(() => {
				navigate(PathRoutes.Auth.Base)
			}, 5000)
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	return (
		<Form onSubmit={submitHandler}>
			{isLoading ? <Fallback background='#d8e0fc40' /> : null}

			<Title open={true}>Восстановление пароля</Title>

			<Typography align='justify' marginTop={2}>
				Укажите новый пароль.
			</Typography>

			<FormControl sx={{ marginTop: 3, marginBottom: 1, position: 'relative' }}>
				<Input
					label='Пароль'
					type={passIsVisible ? 'text' : 'password'}
					value={password.value}
					onChange={password.onChange}
					error={!password.valid}
					inputProps={{
						endAdornment: (
							<InputAdornment position='start' onClick={togglePassVisible} sx={{ cursor: 'pointer' }}>
								{passIsVisible ? <VisibleIcon /> : <InVisibleIcon />}
							</InputAdornment>
						),
					}}
				/>
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
					type={confIsVisible ? 'text' : 'password'}
					value={confirm.value}
					onChange={confirm.onChange}
					error={!confirm.valid || !compare}
					inputProps={{
						endAdornment: (
							<InputAdornment position='start' onClick={toggleConfVisible} sx={{ cursor: 'pointer' }}>
								{confIsVisible ? <VisibleIcon /> : <InVisibleIcon />}
							</InputAdornment>
						),
					}}
				/>
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
	)
}
