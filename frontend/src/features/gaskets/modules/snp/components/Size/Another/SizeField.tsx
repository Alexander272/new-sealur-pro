import { FC, useEffect, useState } from 'react'
import { Typography } from '@mui/material'

import { useAppDispatch } from '@/hooks/redux'
import { useDebounce } from '@/hooks/debounce'
import { setSizeMain } from '@/features/gaskets/modules/snp/snpSlice'
import { Input } from '@/components/Input/input.style'

type Props = {
	title: string
	name: 'd4' | 'd3' | 'd2' | 'd1'
	errorText?: string
}

export const SizeField: FC<Props> = ({ title, name, errorText }) => {
	const [value, setValue] = useState('')

	// const size = useAppSelector(getSize)

	const dispatch = useAppDispatch()

	const debounced = useDebounce(value, 500)

	useEffect(() => {
		// debounced.replace(/(^\d*[.,]?)?$/, '$1')
		// debounced.replace(/(^\d*[.,]?\d{1})?$/, '$1.$2')
		dispatch(setSizeMain({ [name]: debounced }))
	}, [debounced, dispatch, name])

	const sizeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d*[.,]?\d{1})?$/
		if (regex.test(event.target.value)) setValue(event.target.value)

		//? это не работает
		// const temp = event.target.value.replace(/(^\d*[.,]?\d{1})?$/g, '$1.$2')
		// dispatch(setSizeMain({ [name]: temp }))

		//? старое
		// if (event.target.value === '' || !isNaN(+temp)) {
		// 	let value: number | string
		// 	if (+temp > 10000) return

		// 	if (temp[temp.length - 1] == '.') value = temp
		// 	else value = Math.trunc(+temp * 10) / 10

		// 	if (event.target.value === '') value = event.target.value

		// 	dispatch(setSizeMain({ [name]: value.toString() }))
		// }
	}

	return (
		<>
			<Typography fontWeight='bold'>{title}</Typography>
			<Input name={name} value={value} onChange={sizeHandler} error={Boolean(errorText)} helperText={errorText} />
		</>
	)
}
