import { FormEvent } from 'react'
import { Button, FormControl, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import type { IFetchError } from '@/app/types/error'
import { useInput } from '@/features/auth/hooks/useInput'
import { ValidMessage } from '@/features/auth/components/ValidMessage/ValidMessage'
import { Input, Title } from '@/features/auth/components/Forms/forms.style'
import { Fallback } from '@/components/Fallback/Fallback'
import { useGetRecoveryCodeMutation } from '../../recoveryApiSlice'
import { Form } from './recovery.style'

export const Recovery = () => {
	const [getRecoveryCode, { isLoading }] = useGetRecoveryCodeMutation()

	const email = useInput({ validation: 'email' })

	const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const emailValid = email.validate()
		if (!emailValid) return

		try {
			await getRecoveryCode(email.value).unwrap()
			toast.success('Для продолжения перейдите по ссылке, отправленной вам в письме', { autoClose: false })
		} catch (error) {
			const fetchError = error as IFetchError
			console.log(fetchError.data.message)
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	return (
		<Form onSubmit={submitHandler}>
			{isLoading ? <Fallback background={'#d8e0fc40'} /> : null}

			<Title open={true}>Восстановление пароля</Title>

			<Typography align='justify' marginTop={2}>
				Укажите адрес электронной почты привязанный к аккаунту, и мы отправим на него инструкции по
				восстановлению пароля.
			</Typography>
			<FormControl sx={{ marginTop: 3, marginBottom: 2, position: 'relative' }}>
				<Input
					label='email'
					type='email'
					value={email.value}
					onChange={email.onChange}
					error={!email.valid}
					size='small'
				/>
				{!email.valid && <ValidMessage messages={['Email не корректен']} />}
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
