import { useCallback, useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import { useAppDispatch } from '@/hooks/redux'
import { useConfirmMutation } from '@/features/user/userApiSlice'
import { setUser } from '@/features/user/userSlice'
import { Container, Wrapper } from '../auth/auth.style'
import { Loader } from '@/components/Fallback/Loader'

// страница для подтверждения пользователя
export default function Confirm() {
	const location = useLocation()
	const navigate = useNavigate()

	const [error, setError] = useState('')

	const [confirm] = useConfirmMutation()

	const dispatch = useAppDispatch()

	const confirmHandler = useCallback(
		async (code: string) => {
			try {
				const payload = await confirm(code).unwrap()
				dispatch(setUser(payload.data))
				navigate(PathRoutes.Home, { replace: true })
			} catch {
				setError('Не удалось активировать аккаунт. Срок действия ссылки истек')
			}
		},
		[confirm, dispatch, navigate]
	)

	useEffect(() => {
		if (location.search) {
			confirmHandler(location.search.split('=')[1])
		}
	}, [confirmHandler, location.search])

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
						<Loader text='' />
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
