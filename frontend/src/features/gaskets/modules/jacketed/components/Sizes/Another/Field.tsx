import { FC } from 'react'
import { Typography } from '@mui/material'

import type { DSize } from '../../../types/sizes'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Input } from '@/components/Input/input.style'
import { getSize, setDSize } from '../../../jacketedSlice'

type Props = {
	title: string
	name: DSize
	errorText?: string | false
}

export const Field: FC<Props> = ({ title, name, errorText }) => {
	const sizes = useAppSelector(getSize)
	const dispatch = useAppDispatch()

	const sizeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d+[.,]?(\d{1})?)$/
		if (regex.test(event.target.value))
			dispatch(setDSize({ name, value: event.target.value.replace(',', '.').replace(/^0+(?=\d)/, '') }))
		if (event.target.value === '') dispatch(setDSize({ name, value: event.target.value }))
	}

	return (
		<>
			<Typography fontWeight='bold'>{title}</Typography>
			<Input
				name={name}
				value={sizes[name]}
				onChange={sizeHandler}
				error={Boolean(errorText)}
				helperText={errorText}
			/>
		</>
	)
}
