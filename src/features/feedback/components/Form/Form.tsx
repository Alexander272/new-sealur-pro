import { FormEvent, useEffect } from 'react'
import { Button, FormControl, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import type { IFetchError } from '@/app/types/error'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useGetUserQuery } from '@/features/user/userApiSlice'
import { getUser, getUserId, setUser } from '@/features/user/userSlice'
import { useInput } from '@/features/auth/hooks/useInput'
import { Input } from '@/features/auth/components/Forms/forms.style'
import { Fallback } from '@/components/Fallback/Fallback'
import { useSendFeedbackMutation } from '../../feedbackApiSlice'
import { Form } from './form.style'

import Privacy from '@/assets/files/privacy.pdf'

export const FeedbackForm = () => {
	const user = useAppSelector(getUser)
	const userId = useAppSelector(getUserId)

	const dispatch = useAppDispatch()

	const { data } = useGetUserQuery(userId, { skip: !userId || Boolean(user) })
	const [sendFeedback, { isLoading }] = useSendFeedbackMutation()

	useEffect(() => {
		if (data && !user) dispatch(setUser(data.data))
	}, [data, dispatch, user])

	const subject = useInput({ validation: 'empty' })
	const email = useInput({ value: user?.email, validation: 'email' })
	const name = useInput({ value: user?.name, validation: 'empty' })
	const message = useInput({ validation: 'empty' })

	const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const subjectValid = subject.validate()
		const emailValid = email.validate()
		const nameValid = name.validate()
		const messageValid = message.validate()

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
			toast.success('Письмо оправлено')
			subject.clear()
			message.clear()
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	return (
		<Form onSubmit={submitHandler}>
			{isLoading ? <Fallback background={'#d8e0fc40'} /> : null}

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
					error={!subject.valid}
					helperText={!subject.valid && 'Поле обязательно для заполнения.'}
				/>
			</FormControl>
			<FormControl>
				<Input
					value={message.value}
					onChange={message.onChange}
					label='Сообщение'
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
	)
}
