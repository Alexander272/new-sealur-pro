import { Alert, Autocomplete, Button, FormControl, Snackbar, Stack, Typography } from '@mui/material'
import { FC, FormEvent, useCallback, useEffect, useState } from 'react'
import { useInput } from '@/hooks/useInput'
import { useDebounce } from '@/hooks/debounce'
import { FormContent, Input, SignUpForm, Title } from './forms.style'
import { CompanyInfo, findCompany } from '@/services/dadata'
import { ISignUp } from '@/types/auth'
import { signUp } from '@/services/auth'
// import { ISignUp } from '../../../types/user'

type Props = {
	isOpen: boolean
	onChangeTab: () => void
}

export const SignUp: FC<Props> = ({ isOpen, onChangeTab }) => {
	// const {
	// 	register,
	// 	handleSubmit,
	// 	formState: { errors },
	// } = useForm<ISignUp>()

	// const { user } = useDispatch<Dispatch>()

	// const signUpHandler: SubmitHandler<ISignUp> = data => {
	// 	user.singUp(data)
	// }

	const [company, setCompany] = useState('')
	const [companyData, setCompanyData] = useState<CompanyInfo | null>(null)
	const [companyList, setCompanyList] = useState<CompanyInfo[]>([])
	const [open, setOpen] = useState(false)
	const [res, setRes] = useState<{ type: 'success' | 'error'; message: string }>({ type: 'success', message: '' })

	const name = useInput({ validation: 'empty' })
	const position = useInput({ validation: 'empty' })
	const email = useInput({ validation: 'email' })
	const phone = useInput()
	const password = useInput()

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
		//TODO проверить валидность полей
		if (!companyData) return

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
		}

		const res = await signUp(user)
		if (res.error) {
			console.log(res.error)
			//TODO показать ошибку
			handleClick('error', res.error)
		} else {
			console.log('sended')
			//TODO
			handleClick('success', 'TODO')
			//TODO вывести сообщение о необходимости подтверждения почты
			// для подтверждения генерировать код и записывать его в редис на 30 минут
			// при подтверждении забирать код и id пользователя из редиса
		}
	}

	const handleClick = (type: 'success' | 'error', message: string) => {
		setOpen(true)
		setRes({ type, message })
	}

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	return (
		<SignUpForm
			onClick={!isOpen ? onChangeTab : undefined}
			// onSubmit={handleSubmit(signUpHandler)}
			onSubmit={signUpHandler}
			open={isOpen}
		>
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
			<Title open={isOpen}>Регистрация</Title>
			<FormContent>
				{/* <FormControl sx={{ marginTop: 1, marginBottom: 2 }}>
					<Input
						name='inn'
						value={inn.value}
						onChange={inn.onChange}
						placeholder='ИНН организации'
						size='small'
						error={!inn.valid}
					/>
				</FormControl>

				{/* //TODO похоже это лишнее
				<FormControl sx={{ marginBottom: 2 }}>
					<Input
						name='city'
						value={city.value}
						onChange={city.onChange}
						placeholder='Город'
						size='small'
						error={!city.valid}
					/>
				</FormControl> */}

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
							<Input {...params} name='company' placeholder='ИНН или название организации' size='small' />
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

					{/* <Input
						name='company'
						value={company.value}
						onChange={company.onChange}
						placeholder='Предприятие.'
						size='small'
						error={!name.valid}
					/> */}
				</FormControl>

				<FormControl sx={{ marginBottom: 2 }}>
					<Input
						name='name'
						value={name.value}
						onChange={name.onChange}
						placeholder='Ф.И.О.'
						size='small'
						error={!name.valid}
					/>
				</FormControl>

				<FormControl sx={{ marginBottom: 2 }}>
					<Input
						name='position'
						value={position.value}
						onChange={position.onChange}
						placeholder='Должность'
						size='small'
						error={!position.valid}
					/>
				</FormControl>

				<FormControl sx={{ marginBottom: 2 }}>
					<Input
						name='email'
						value={email.value}
						onChange={email.onChange}
						placeholder='Email'
						size='small'
						error={!email.valid}
					/>
				</FormControl>

				<FormControl sx={{ marginBottom: 2 }}>
					<Input
						name='phone'
						value={phone.value}
						onChange={phone.onChange}
						placeholder='Контактный телефон'
						size='small'
						error={!phone.valid}
					/>
				</FormControl>

				<FormControl sx={{ marginBottom: 2 }}>
					<Input
						name='password'
						value={password.value}
						onChange={password.onChange}
						type='password'
						placeholder='Пароль'
						size='small'
						error={!password.valid}
					/>
				</FormControl>
				{/* <Input
					name='organization'
					rounded='round'
					placeholder='Предприятие'
					register={register}
					rule={{ required: true }}
					error={errors.organization}
					errorText='Поле предприятие не может быть пустым'
				/>
				<Input
					name='name'
					rounded='round'
					placeholder='Ф.И.О.'
					register={register}
					rule={{ required: true }}
					error={errors.name}
					errorText='Поле Ф.И.О. не может быть пустым'
				/>
				<Input
					name='email'
					rounded='round'
					type='email'
					placeholder='Email'
					register={register}
					rule={{
						required: true,
						pattern:
							/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
					}}
					error={errors.email}
					errorText='Email задан некорректно'
				/>
				<Input
					name='city'
					rounded='round'
					placeholder='Город'
					register={register}
					rule={{ required: true }}
					error={errors.city}
					errorText='Поле город не может быть пустым'
				/>
				<Input
					name='position'
					rounded='round'
					placeholder='Должность'
					register={register}
					rule={{ required: true }}
					error={errors.position}
					errorText='Поле должность не может быть пустым'
				/>
				<Input name='phone' rounded='round' placeholder='Контактный телефон' register={register} /> */}
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
