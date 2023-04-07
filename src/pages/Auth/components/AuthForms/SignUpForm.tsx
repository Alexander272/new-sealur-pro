import { Alert, Autocomplete, Button, FormControl, Snackbar, Stack, Typography } from '@mui/material'
import { FC, FormEvent, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useInput } from '@/hooks/useInput'
import { useDebounce } from '@/hooks/debounce'
import { CompanyInfo, findCompany } from '@/services/dadata'
import { signUp } from '@/services/auth'
import { ISignUp } from '@/types/auth'
import { Loader } from '@/components/Loader/Loader'
import { FormContent, Input, SignUpForm, Title } from './forms.style'
import { ValidMessage } from '../ValidMessage/ValidMessage'

type Props = {
	isOpen: boolean
	onChangeTab: () => void
}

export const SignUp: FC<Props> = ({ isOpen, onChangeTab }) => {
	const [loading, setLoading] = useState(false)
	const [company, setCompany] = useState('')
	const [companyData, setCompanyData] = useState<CompanyInfo | null>(null)
	const [companyList, setCompanyList] = useState<CompanyInfo[]>([])
	const [open, setOpen] = useState(false)
	const [res, setRes] = useState<{ type: 'success' | 'error'; message: string }>({ type: 'success', message: '' })
	const [companyError, setCompanyError] = useState(false)

	const name = useInput({ validation: 'empty' })
	const position = useInput({ validation: 'empty' })
	const email = useInput({ validation: 'email' })
	const phone = useInput({ validation: 'empty', replace: 'phone' })
	const password = useInput({ validation: 'password' })

	const companyValue = useDebounce(company, 500)

	useEffect(() => {
		if (companyValue) find(companyValue)
	}, [companyValue])

	const find = useCallback(async (value: string) => {
		const res = await findCompany(value)
		if (!res.error) setCompanyList(res.data)
	}, [])

	const companyHandler = (event: any, newInputValue: string) => {
		setCompany(newInputValue)
	}
	const selectCompanyHandler = (event: any, newValue: CompanyInfo | null) => {
		setCompanyData(newValue)
		if (newValue !== null) setCompany('')
	}

	const signUpHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		let nameValid = name.validate()
		let positionValid = position.validate()
		let phoneValid = phone.validate()
		let emailValid = email.validate()
		let passwordValid = password.validate()

		if (!nameValid || !positionValid || !emailValid || !phoneValid || !passwordValid) {
			return
		}

		if (!companyData) {
			setCompanyError(true)
			return
		}
		setCompanyError(false)
		setLoading(true)

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

		const res = await signUp(user)
		if (res.error) {
			console.log(res.error)
			handleClick('error', res.error)
		} else {
			handleClick('success', 'Для активации учетной записи перейдите по ссылке, отправленной вам в письме')
		}
		setLoading(false)
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
		<SignUpForm onClick={!isOpen ? onChangeTab : undefined} onSubmit={signUpHandler} open={isOpen}>
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

			{loading ? <Loader background='fill' /> : null}

			<Title open={isOpen}>Регистрация</Title>

			<FormContent>
				<FormControl sx={{ marginBottom: 2, paddingTop: 0.5 }}>
					<Autocomplete
						value={companyData}
						getOptionLabel={option => (typeof option === 'string' ? option : option.value)}
						autoComplete
						includeInputInList
						options={companyList}
						onChange={selectCompanyHandler}
						noOptionsText=''
						onInputChange={companyHandler}
						renderInput={params => (
							<Input
								{...params}
								name='company'
								placeholder='ИНН или название организации'
								size='small'
								autoComplete='off'
								error={companyError}
							/>
						)}
						renderOption={(props, option) => {
							return (
								<li {...props} key={option.data.hid}>
									<Stack>
										<Typography>{option.value}</Typography>
										<Typography variant='body2' color='text.secondary'>
											{option.data.address.value}
										</Typography>
									</Stack>
								</li>
							)
						}}
					/>
					{/* {companyError && <ValidMessage messages={['Поле обязательно для заполнения.']} />} */}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						name='name'
						value={name.value}
						onChange={name.onChange}
						placeholder='Ф.И.О.'
						size='small'
						error={!name.valid}
					/>
					{!name.valid && <ValidMessage messages={['Поле обязательно для заполнения.']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						name='position'
						value={position.value}
						onChange={position.onChange}
						placeholder='Должность'
						size='small'
						error={!position.valid}
					/>
					{!position.valid && <ValidMessage messages={['Поле обязательно для заполнения.']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						name='email'
						value={email.value}
						onChange={email.onChange}
						placeholder='Email'
						size='small'
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
						size='small'
						error={!phone.valid}
					/>
					{!phone.valid && <ValidMessage messages={['Поле обязательно для заполнения.']} />}
				</FormControl>

				<FormControl sx={{ marginBottom: 2, position: 'relative' }}>
					<Input
						name='password'
						value={password.value}
						onChange={password.onChange}
						type='password'
						placeholder='Пароль'
						size='small'
						error={!password.valid}
					/>
					{!password.valid && (
						<ValidMessage
							messages={[
								'Минимальная длина пароля 6 символов',
								'Пароль должен содержать заглавные, строчные буквы и цифры',
							]}
						/>
					)}
				</FormControl>

				<Typography color={'GrayText'} align='center' marginBottom={1} sx={{ fontSize: '0.75rem' }}>
					{/* Нажимая кнопку "Зарегистрироваться" вы соглашаетесь на обработку персональных данных
					и условиями	использования */}
					Нажимая кнопку "Зарегистрироваться" вы соглашаетесь с{' '}
					<a
						href='https://sealur.ru/wp-content/uploads/2020/03/politika-silur-v-otnoshenii-personalnyh-dannyh.pdf'
						target='blank'
					>
						Политикой организации в отношении обработки персональных данных
					</a>
					.
				</Typography>

				<Button
					type='submit'
					variant='contained'
					sx={{ borderRadius: '20px', fontSize: '1rem', fontWeight: 600 }}
				>
					Зарегистрироваться
				</Button>
			</FormContent>
		</SignUpForm>
	)
}
