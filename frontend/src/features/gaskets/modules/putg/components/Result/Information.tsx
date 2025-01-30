import { ChangeEvent } from 'react'
import { Stack, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Input } from '@/components/Input/input.style'
import { getInfo, setInfo } from '../../putgSlice'

export const Information = () => {
	const info = useAppSelector(getInfo)
	const dispatch = useAppDispatch()

	const infoHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setInfo(event.target.value))
	}

	return (
		<Stack
			direction={{ xs: 'column', sm: 'row' }}
			spacing={{ xs: 0, sm: 2 }}
			alignItems={{ xs: 'flex-start', sm: 'center' }}
			marginBottom={2}
		>
			<Typography fontWeight='bold'>Доп. информация:</Typography>
			<Input value={info} onChange={infoHandler} multiline fullWidth sx={{ maxWidth: '500px' }} />
		</Stack>
	)
}
