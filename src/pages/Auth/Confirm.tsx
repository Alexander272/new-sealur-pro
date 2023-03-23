import { Loader } from '@/components/Loader/Loader'
import { useAppDispatch } from '@/hooks/useStore'
import { confirm } from '@/services/auth'
import { setUser } from '@/store/user'
import { Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Wrapper } from './auth.style'

export default function Confirm() {
	const location = useLocation()
	const navigate = useNavigate()

	const [error, setError] = useState('')

	const dispatch = useAppDispatch()

	const confirmHandler = useCallback(async (code: string) => {
		const res = await confirm(code)
		if (!res.error) {
			dispatch(setUser(res.data.data))
			navigate('/', { replace: true })
		} else {
			setError('Не удалось активировать аккаунт')
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
