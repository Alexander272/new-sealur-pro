import { Alert, Button, FormControl, Snackbar, Typography } from '@mui/material'
import { FormEvent, SyntheticEvent, useEffect, useState } from 'react'
import TelegramIcon from '@mui/icons-material/Telegram'
import { setUser } from '@/store/user'
import { useGetUserQuery } from '@/store/api/user'
import { useSendFeedbackMutation } from '@/store/api/feedback'
import { useInput } from '@/hooks/useInput'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import type { IFetchError } from '@/types/auth'
import { Loader } from '@/components/Loader/Loader'
import { Input } from '@/components/Input/input.style'
import { Container, Form, Link, Links, LinksLine } from './connect.style'

import Privacy from '@/assets/files/privacy.pdf'

export default function ConnectWithUs() {
	const [open, setOpen] = useState(false)
	const [res, setRes] = useState<{ type: 'success' | 'error'; message: string }>({ type: 'success', message: '' })

	const user = useAppSelector(state => state.user.user)
	const userId = useAppSelector(state => state.user.userId)

	const dispatch = useAppDispatch()

	const { data } = useGetUserQuery(userId, { skip: !userId || Boolean(user) })
	const [sendFeedback, { isLoading }] = useSendFeedbackMutation()

	useEffect(() => {
		if (data && !user) dispatch(setUser(data.data))
	}, [data])

	const subject = useInput({ validation: 'empty' })
	const email = useInput({ value: user?.email, validation: 'email' })
	const name = useInput({ value: user?.name, validation: 'empty' })
	const message = useInput({ validation: 'empty' })

	const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		let subjectValid = subject.validate()
		let emailValid = email.validate()
		let nameValid = name.validate()
		let messageValid = message.validate()

		if (!subjectValid || !emailValid || !nameValid || !messageValid) return

		const feedback = {
			subject: subject.value,
			email: email.value,
			name: name.value,
			company: user?.company,
			message: message.value,
		}

		try {
			await sendFeedback(feedback).unwrap()
			handleClick('success', 'Письмо оправлено')
			subject.clear()
			message.clear()
		} catch (error) {
			const fetchError = error as IFetchError
			handleClick('error', fetchError.data.message)
		}
	}

	const handleClick = (type: 'success' | 'error', message: string) => {
		setOpen(true)
		setRes({ type, message })
	}
	const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setOpen(false)
	}

	return (
		<Container>
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={handleClose} severity={res.type} sx={{ width: '100%' }}>
					{res.message}
				</Alert>
			</Snackbar>

			{isLoading ? <Loader background='fill' /> : null}

			<Form onSubmit={submitHandler}>
				<Typography variant='h5' align='center'>
					Напишите нам
				</Typography>
				<Typography>Оставьте нам свое сообщение, и мы обязательно свяжемся с Вами!</Typography>
				<FormControl>
					<Input
						value={email.value}
						onChange={email.onChange}
						label='Email'
						fullWidth
						size='small'
						error={!email.valid}
						helperText={!email.valid && 'Email не корректен'}
					/>
				</FormControl>
				<FormControl>
					<Input
						value={name.value}
						onChange={name.onChange}
						label='Ф.И.О.'
						fullWidth
						size='small'
						error={!name.valid}
						helperText={!name.valid && 'Поле обязательно для заполнения.'}
					/>
				</FormControl>

				<FormControl>
					<Input
						value={subject.value}
						onChange={subject.onChange}
						label='Тема обращения'
						fullWidth
						size='small'
						error={!subject.valid}
						helperText={!subject.valid && 'Поле обязательно для заполнения.'}
					/>
				</FormControl>
				<FormControl>
					<Input
						value={message.value}
						onChange={message.onChange}
						label='Сообщение'
						size='small'
						error={!message.valid}
						helperText={!message.valid && 'Поле обязательно для заполнения.'}
						multiline
						rows={5}
					/>
				</FormControl>

				<Typography color={'GrayText'} align='center' marginBottom={1} sx={{ fontSize: '0.75rem' }}>
					Нажимая кнопку "Отправить" вы соглашаетесь с{' '}
					<a href={Privacy} target='blank'>
						Политикой организации в отношении обработки персональных данных
					</a>
					.
				</Typography>

				<Button
					type='submit'
					variant='contained'
					disabled={isLoading}
					sx={{ borderRadius: '12px', fontSize: '1rem', fontWeight: 600 }}
				>
					Отправить
				</Button>
			</Form>

			<Links>
				<Typography variant='h5' align='center'>
					Иные способы связи
				</Typography>
				<LinksLine>
					<Link href='https://t.me/m_alex272' target='_blank'>
						<TelegramIcon sx={{ color: 'white', marginRight: 1 }} /> Telegram
					</Link>
				</LinksLine>
			</Links>
		</Container>
	)
}
