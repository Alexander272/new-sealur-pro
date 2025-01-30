import { ChangeEvent } from 'react'
import { Stack, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Input } from '@/components/Input/input.style'
import { getAmount, setAmount } from '../../putgSlice'

export const Amount = () => {
	const amount = useAppSelector(getAmount)
	const dispatch = useAppDispatch()

	const amountHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d{1,6})$/
		if (regex.test(event.target.value)) dispatch(setAmount(event.target.value))
		if (event.target.value === '') dispatch(setAmount(event.target.value))
	}

	return (
		<Stack direction={'row'} spacing={2} alignItems='center'>
			<Typography fontWeight='bold'>Количество:</Typography>
			<Input value={amount} onChange={amountHandler} />
		</Stack>
	)
}
