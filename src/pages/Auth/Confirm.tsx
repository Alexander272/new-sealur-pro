import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'
import { setUser } from '@/store/user'
import { useConfirmMutation } from '@/store/api/user'
import { useAppDispatch } from '@/hooks/useStore'
import { Loader } from '@/components/Loader/Loader'
import { Container, Wrapper } from './auth.style'

// страница для подтверждения пользователя
export default function Confirm() {
	const location = useLocation()
	const navigate = useNavigate()

	const [error, setError] = useState('')

	const [confirm] = useConfirmMutation()

	const dispatch = useAppDispatch()

	const confirmHandler = useCallback(async (code: string) => {
		try {
			const payload = await confirm(code).unwrap()
			dispatch(setUser(payload.data))
			navigate('/', { replace: true })
		} catch {
			setError('Не удалось активировать аккаунт. Срок действия ссылки истек')
		}
	}, [])

	useEffect(() => {
		if (location.search) {
			confirmHandler(location.search.split('=')[1])
		}
	}, [])

	return (
		<Wrapper>
			<Container>
				{!error && (
					<>
						<Typography align='center' variant='h5' marginTop={4}>
							Выполняется активация.
						</Typography>
						<Typography align='center' color='GrayText'>
							Пожалуиста подождите
						</Typography>
						<Loader />
					</>
				)}

				{error && (
					<Typography align='center' variant='h4' marginTop={4} color='red'>
						{error}
					</Typography>
				)}
			</Container>
		</Wrapper>
	)
}
