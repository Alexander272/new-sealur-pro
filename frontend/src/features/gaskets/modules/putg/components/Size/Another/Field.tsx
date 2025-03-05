import { FC } from 'react'
import { Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Input } from '@/components/Input/input.style'
import { getSizes, setSizeMain } from '../../../putgSlice'

type Props = {
	title: string
	name: 'd4' | 'd3' | 'd2' | 'd1'
	errorText?: string | false
}

export const Field: FC<Props> = ({ title, name, errorText }) => {
	// const [value, setValue] = useState('')
	const sizes = useAppSelector(getSizes)

	const dispatch = useAppDispatch()

	// const debounced = useDebounce(value, 500)

	// useEffect(() => {
	// 	if (sizes[name] == debounced) return
	// 	console.log('another')

	// 	dispatch(setSizeMain({ [name]: debounced }))
	// }, [debounced, sizes, dispatch, name])

	const sizeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d+[.,]?(\d{1})?)$/
		if (regex.test(event.target.value)) dispatch(setSizeMain({ [name]: event.target.value }))
		if (event.target.value === '') dispatch(setSizeMain({ [name]: event.target.value }))
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
