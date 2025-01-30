import { FC, useEffect, useState } from 'react'
import { Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useDebounce } from '@/hooks/debounce'
import { Input } from '@/components/Input/input.style'
import { getSizes, setSizeMain } from '../../../putgSlice'

type Props = {
	title: string
	name: 'd4' | 'd3' | 'd2' | 'd1'
	errorText?: string | false
}

export const Field: FC<Props> = ({ title, name, errorText }) => {
	const [value, setValue] = useState('')
	const sizes = useAppSelector(getSizes)

	const dispatch = useAppDispatch()

	const debounced = useDebounce(value, 500)

	useEffect(() => {
		if (sizes[name] == debounced) return
		dispatch(setSizeMain({ [name]: debounced }))
	}, [debounced, sizes, dispatch, name])

	const sizeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d+[.,]?(\d{1})?)$/
		if (regex.test(event.target.value)) setValue(event.target.value)
		if (event.target.value === '') setValue(event.target.value)
	}

	return (
		<>
			<Typography fontWeight='bold'>{title}</Typography>
			<Input name={name} value={value} onChange={sizeHandler} error={Boolean(errorText)} helperText={errorText} />
		</>
	)
}
