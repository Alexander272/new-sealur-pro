import { Input } from '@/components/Input/input.style'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Stack, Typography } from '@mui/material'
import { getAmount, setAmount } from '../../snpSlice'
import { ChangeEvent } from 'react'

export const Amount = () => {
	const amount = useAppSelector(getAmount)
	const dispatch = useAppDispatch()

	const amountHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d*)?$/
		if (regex.test(event.target.value)) dispatch(setAmount(event.target.value))

		// const regex = /^[0-9\b]+$/
		// if (event.target.value === '' || regex.test(event.target.value)) {
		// 	let value: number | string = +event.target.value
		// 	if (event.target.value === '') value = event.target.value
		// 	dispatch(setAmount(value.toString()))
		// }
	}

	return (
		<Stack direction={'row'} spacing={2} alignItems='center'>
			<Typography fontWeight='bold'>Количество:</Typography>
			<Input value={amount} onChange={amountHandler} />
		</Stack>
	)
}
