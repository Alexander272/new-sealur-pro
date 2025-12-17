import { FC, FormEvent, useState } from 'react'
import { Button, Divider, FormControl, InputAdornment, Stack, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import InVisibleIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibleIcon from '@mui/icons-material/RemoveRedEye'

import type { IFetchError } from '@/app/types/error'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useInput } from '@/features/auth/hooks/useInput'
import { useUpdateUsersPasswordMutation } from '../../userApiSlice'
import { changeDialogIsOpen, getDialogState } from '@/features/dialogs/dialogSlice'
import { Dialog } from '@/features/dialogs/components/Dialog'
import { ValidMessage } from '@/features/auth/components/ValidMessage/ValidMessage'
import { Fallback } from '@/components/Fallback/Fallback'

type Context = { userId?: string }

export const PasswordDialog = () => {
	const modal = useAppSelector(getDialogState('Password'))
	const dispatch = useAppDispatch()

	const closeHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Password', isOpen: false }))
	}

	return (
		<Dialog
			title={'Редактировать пароль'}
			body={<Form {...(modal?.content as Context)} />}
			open={modal?.isOpen || false}
			onClose={closeHandler}
			maxWidth='xs'
			fullWidth
		/>
	)
}

const Form: FC<Context> = ({ userId }) => {
	const dispatch = useAppDispatch()

	const [compare, setCompare] = useState(true)

	const [passIsVisible, setPassIsVisible] = useState(false)
	const [confIsVisible, setConfIsVisible] = useState(false)

	const password = useInput({ validation: 'password' })
	const confirm = useInput({ validation: 'empty' })

	const [updatePassword, { isLoading }] = useUpdateUsersPasswordMutation()

	const togglePassVisible = () => setPassIsVisible(prev => !prev)
	const toggleConfVisible = () => setConfIsVisible(prev => !prev)

	const closeHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Password', isOpen: false }))
	}

	const saveHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!userId) return

		const passwordValid = password.validate()
		const confirmValid = confirm.validate()
		const passwordsCompare = password.value === confirm.value
		setCompare(passwordsCompare)

		if (!passwordValid || !confirmValid || !passwordsCompare) {
			return
		}

		const newData = {
			userId: userId,
			password: password.value,
		}

		try {
			await updatePassword(newData).unwrap()
			toast.success('Пароль успешно изменен')
			closeHandler()
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	return (
		<Stack component={'form'} position={'relative'} spacing={2} onSubmit={saveHandler} mt={-2}>
			{isLoading ? <Fallback position={'absolute'} zIndex={5} background={'#f5f5f557'} /> : null}

			<FormControl sx={{ position: 'relative' }}>
				<TextField
					name='password'
					value={password.value}
					onChange={password.onChange}
					type={passIsVisible ? 'text' : 'password'}
					placeholder='Пароль *'
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
					sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10, background: '#fff' } }}
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

			<FormControl sx={{ marginBottom: 2 }}>
				<TextField
					name='confirm'
					value={confirm.value}
					onChange={confirm.onChange}
					type={confIsVisible ? 'text' : 'password'}
					placeholder='Повторите пароль *'
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
					sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10, background: '#fff' } }}
				/>
				{!confirm.valid || !compare ? (
					<ValidMessage iconRight='46px' messages={['Пароли должны совпадать']} />
				) : null}
			</FormControl>

			<Divider sx={{ width: '50%', alignSelf: 'center' }} />
			<Stack spacing={2} direction={'row'}>
				<Button type='submit' variant='contained' fullWidth disabled={isLoading}>
					Сохранить
				</Button>
				<Button onClick={closeHandler} variant='outlined' fullWidth>
					Отмена
				</Button>
			</Stack>
		</Stack>
	)
}
