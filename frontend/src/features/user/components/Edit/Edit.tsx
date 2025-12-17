import { FormEvent, useEffect, useState } from 'react'
import { Button, Divider, FormControl, Stack, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import type { IFetchError } from '@/app/types/error'
import type { CompanyInfo } from '@/features/auth/modules/dadata/types/company'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useInput } from '@/features/auth/hooks/useInput'
import { useGetUserQuery, useUpdateUserMutation } from '../../userApiSlice'
import { changeDialogIsOpen } from '@/features/dialogs/dialogSlice'
import { getRealm, getUserId } from '../../userSlice'
import { Company } from '@/features/auth/modules/dadata/components/Company'
import { ValidMessage } from '@/features/auth/components/ValidMessage/ValidMessage'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { PasswordDialog } from './PasswordDialog'

export const EditUserInfo = () => {
	const userId = useAppSelector(getUserId)
	const realm = useAppSelector(getRealm)
	const dispatch = useAppDispatch()

	const [companyData, setCompanyData] = useState<CompanyInfo | null>(null)
	const [companyError, setCompanyError] = useState(false)

	const { data, isFetching } = useGetUserQuery(userId || '', { skip: !userId })
	const [update, { isLoading }] = useUpdateUserMutation()

	const name = useInput({ value: data?.data.name || '', validation: 'name' })
	const email = useInput({ value: data?.data.email || '', validation: 'email' })
	const phone = useInput({ value: data?.data.phone || '', replace: 'phone', validation: 'phone' })
	const position = useInput({ value: data?.data.position || '', validation: 'empty' })

	useEffect(() => {
		if (data) {
			const newData = {
				value: data.data.company,
				data: {
					hid: '',
					inn: data.data.inn,
					kpp: data.data.kpp,
					address: {
						value: data.data.address,
						unrestricted_value: data.data.address,
						data: {
							region_with_type: data.data.region,
							city_with_type: data.data.city,
						},
					},
				},
			}

			setCompanyData(newData)
		}
	}, [data])

	const selectCompanyHandler = (newValue: CompanyInfo | null) => {
		setCompanyData(newValue)
	}

	const toggle = () =>
		dispatch(changeDialogIsOpen({ variant: 'Password', isOpen: true, content: { userId: data?.data.id } }))

	const saveHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!data) return
		const nameValid = name.validate()
		const positionValid = position.validate()
		const phoneValid = phone.validate()
		const emailValid = email.validate()

		console.log('phone', phoneValid)

		if (!nameValid || !positionValid || !emailValid || !phoneValid) {
			return
		}

		if (!companyData) {
			setCompanyError(true)
			return
		}
		setCompanyError(false)

		const newData = {
			...data.data,
			name: name.value,
			email: email.value,
			phone: phone.value,
			position: position.value,
			company: companyData.value,
			inn: companyData.data.inn,
			kpp: companyData.data.kpp,
			address: companyData.data.address.unrestricted_value,
			region: companyData.data.address.data.region_with_type,
			city: companyData.data.address.data.city_with_type,
		}

		try {
			await update(newData).unwrap()
			toast.success('Данные успешно обновлены')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	if (realm != 'public')
		return (
			<Typography mt={2} textAlign={'center'}>
				Редактирование профиля не доступно для вашего аккаунта
			</Typography>
		)

	if (isFetching) return <TopFallback />
	return (
		<>
			<Stack mt={{ sm: 2, md: 4 }} mb={3} height={'100%'} component={'form'} onSubmit={saveHandler}>
				{isLoading && <TopFallback />}

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<TextField
						name='name'
						value={name.value || ''}
						onChange={name.onChange}
						label='ФИО *'
						placeholder='Ф.И.О.'
						error={!name.valid}
					/>
					{!name.valid && <ValidMessage messages={['Поле обязательно для заполнения.']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<TextField
						name='email'
						type='email'
						value={email.value || ''}
						onChange={email.onChange}
						label='Email *'
						placeholder='Email'
						error={!email.valid}
					/>
					{!email.valid && <ValidMessage messages={['Email не корректен']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<TextField
						name='phone'
						value={phone.value || ''}
						onChange={phone.onChange}
						label='Контактный телефон'
						placeholder='Контактный телефон (формата: +7 (123) 123-45-67 (доб.123))'
						error={!phone.valid}
					/>
					{!phone.valid && <ValidMessage messages={['Неверный формат номера телефона']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<TextField
						name='position'
						value={position.value || ''}
						onChange={position.onChange}
						label='Должность *'
						placeholder='Должность'
						error={!position.valid}
					/>
					{!position.valid && <ValidMessage messages={['Поле обязательно для заполнения.']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, paddingTop: 0.5 }}>
					<Company
						value={companyData}
						onChange={selectCompanyHandler}
						label='Компания *'
						error={companyError}
						sx={{ '& .MuiOutlinedInput-root': null }}
					/>
					{companyError && <ValidMessage messages={['Поле обязательно для заполнения.']} />}
				</FormControl>

				<TextField
					value={companyData?.data.address.unrestricted_value || ''}
					label='Адрес'
					disabled
					sx={{ mb: 2 }}
				/>

				<Divider sx={{ mb: 2, width: '90%', mx: 'auto' }} />
				<Button onClick={toggle} disabled={isLoading} sx={{ textTransform: 'inherit', mb: 1 }}>
					Изменить пароль
				</Button>

				<Button variant='outlined' disabled={isLoading} type='submit' sx={{ textTransform: 'inherit' }}>
					Сохранить
				</Button>
			</Stack>

			<PasswordDialog />
		</>
	)
}
