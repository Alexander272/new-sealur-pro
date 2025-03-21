import { FormEvent, useState } from 'react'
import { Button, FormControl, InputAdornment, TextField, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import InVisibleIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibleIcon from '@mui/icons-material/RemoveRedEye'

import type { IFetchError } from '@/app/types/error'
import { PathRoutes } from '@/constants/routes'
import { useInput } from '@/features/auth/hooks/useInput'
import { ValidMessage } from '@/features/auth/components/ValidMessage/ValidMessage'
import { Title } from '@/features/auth/components/Forms/forms.style'
import { TopFallback } from '@/components/Fallback/TopFallback'
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
			{isLoading ? <TopFallback /> : null}

			<Title open={true}>Восстановление пароля</Title>

			<Typography align='justify' marginTop={2}>
				Укажите новый пароль.
			</Typography>

			<FormControl sx={{ marginTop: 3, marginBottom: 1, position: 'relative' }}>
				<TextField
					label='Пароль'
					type={passIsVisible ? 'text' : 'password'}
					value={password.value}
					onChange={password.onChange}
					error={!password.valid}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position='end' onClick={togglePassVisible} sx={{ cursor: 'pointer' }}>
									{passIsVisible ? <VisibleIcon /> : <InVisibleIcon />}
								</InputAdornment>
							),
						},
					}}
					sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
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
				<TextField
					label='Повторите пароль'
					type={confIsVisible ? 'text' : 'password'}
					value={confirm.value}
					onChange={confirm.onChange}
					error={!confirm.valid || !compare}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position='end' onClick={toggleConfVisible} sx={{ cursor: 'pointer' }}>
									{confIsVisible ? <VisibleIcon /> : <InVisibleIcon />}
								</InputAdornment>
							),
						},
					}}
					sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
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
