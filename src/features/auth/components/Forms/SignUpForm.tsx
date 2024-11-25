import { Button, FormControl, InputAdornment, Typography } from '@mui/material'
import { FC, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import InVisibleIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibleIcon from '@mui/icons-material/RemoveRedEye'

import type { IFetchError } from '@/app/types/error'
import type { CompanyInfo } from '@/features/auth/modules/dadata/types/company'
import type { ISignUp } from '@/features/auth/types/auth'
import { Fallback } from '@/components/Fallback/Fallback'
import { Company } from '@/features/auth/modules/dadata/components/Company'
import { useSignUpMutation } from '@/features/auth/authApiSlice'
import { useInput } from '@/features/auth/hooks/useInput'
import { ValidMessage } from '../ValidMessage/ValidMessage'
import { FormContent, Input, SignUpForm, Title } from './forms.style'

import Privacy from '@/assets/files/privacy.pdf'

type Props = {
	isOpen: boolean
	onChangeTab: () => void
}

// форма регистрации
export const SignUp: FC<Props> = ({ isOpen, onChangeTab }) => {
	const [companyData, setCompanyData] = useState<CompanyInfo | null>(null)
	const [companyError, setCompanyError] = useState(false)
	const [compare, setCompare] = useState(true)

	const [passIsVisible, setPassIsVisible] = useState(false)
	const [confIsVisible, setConfIsVisible] = useState(false)

	const togglePassVisible = () => setPassIsVisible(prev => !prev)
	const toggleConfVisible = () => setConfIsVisible(prev => !prev)

	const name = useInput({ validation: 'empty' })
	const position = useInput({ validation: 'empty' })
	const email = useInput({ validation: 'email' })
	const phone = useInput({ replace: 'phone', validation: 'phone' })
	const password = useInput({ validation: 'password' })
	const confirm = useInput({ validation: 'empty' })

	const [signUp, { isLoading }] = useSignUpMutation()

	const selectCompanyHandler = (newValue: CompanyInfo | null) => {
		setCompanyData(newValue)
	}

	const signUpHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const nameValid = name.validate()
		const positionValid = position.validate()
		const phoneValid = phone.validate()
		const emailValid = email.validate()
		const passwordValid = password.validate()
		const confirmValid = confirm.validate()
		const passwordsCompare = password.value === confirm.value

		if (!nameValid || !positionValid || !emailValid || !phoneValid || !passwordValid || !confirmValid) {
			return
		}

		setCompare(passwordsCompare)
		if (!passwordsCompare) {
			return
		}

		if (!companyData) {
			setCompanyError(true)
			return
		}
		setCompanyError(false)

		const user: ISignUp = {
			company: companyData.value,
			inn: companyData.data.inn,
			kpp: companyData.data.kpp,
			region: companyData.data.address.data.region_with_type,
			city: companyData.data.address.data.city_with_type,
			address: companyData.data.address.unrestricted_value,
			name: name.value,
			position: position.value,
			email: email.value,
			phone: phone.value,
			password: password.value,
			managerId: localStorage.getItem('managerId') || '',
		}

		try {
			await signUp(user).unwrap()
			toast.success(
				'Для активации учетной записи в течение часа перейдите по ссылке, отправленной вам в письме',
				{ autoClose: false }
			)
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
			// console.log(fetchError.data.message)
			// handleClick('error', fetchError.data.message)
		}

		localStorage.removeItem('managerId')
	}

	return (
		<SignUpForm onClick={!isOpen ? onChangeTab : undefined} onSubmit={signUpHandler} open={isOpen}>
			{isLoading ? <Fallback background={'#d8e0fc40'} /> : null}

			<Title open={isOpen}>Регистрация</Title>

			<FormContent>
				<FormControl sx={{ marginBottom: 2, paddingTop: 0.5 }}>
					<Company value={companyData} onChange={selectCompanyHandler} error={companyError} />
					{/* {companyError && <ValidMessage messages={['Поле обязательно для заполнения.']} />} */}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						name='name'
						value={name.value}
						onChange={name.onChange}
						placeholder='Ф.И.О.'
						error={!name.valid}
					/>
					{!name.valid && <ValidMessage messages={['Поле обязательно для заполнения.']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						name='position'
						value={position.value}
						onChange={position.onChange}
						placeholder='Должность *'
						error={!position.valid}
					/>
					{/* //TODO надо наверное ValidMessage тоже запихать в input props */}
					{!position.valid && <ValidMessage messages={['Поле обязательно для заполнения.']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						name='email'
						type='email'
						value={email.value}
						onChange={email.onChange}
						placeholder='Email *'
						error={!email.valid}
					/>
					{!email.valid && <ValidMessage messages={['Email не корректен']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						name='phone'
						value={phone.value}
						onChange={phone.onChange}
						placeholder='Телефон (+7 (123) 123-45-67 (доб.123))'
						error={!phone.valid}
					/>
					{!phone.valid && <ValidMessage messages={['Поле обязательно для заполнения.']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						name='password'
						value={password.value}
						onChange={password.onChange}
						type={passIsVisible ? 'text' : 'password'}
						placeholder='Пароль *'
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

				<FormControl sx={{ marginBottom: 2 }}>
					<Input
						name='confirm'
						value={confirm.value}
						onChange={confirm.onChange}
						type={confIsVisible ? 'text' : 'password'}
						placeholder='Повторите пароль *'
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

				<Typography color={'GrayText'} align='center' marginBottom={1} sx={{ fontSize: '0.75rem' }}>
					Нажимая кнопку "Зарегистрироваться" вы соглашаетесь с{' '}
					<a href={Privacy} target='blank'>
						Политикой организации в отношении обработки персональных данных
					</a>
					.
				</Typography>

				<Button
					type='submit'
					variant='contained'
					disabled={isLoading}
					sx={{ borderRadius: '20px', fontSize: '1rem', fontWeight: 600 }}
				>
					Зарегистрироваться
				</Button>
			</FormContent>
		</SignUpForm>
	)
}
