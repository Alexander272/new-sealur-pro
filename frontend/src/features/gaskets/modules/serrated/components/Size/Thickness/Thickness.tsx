import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getH, getThicknesses, setThickness } from '../../../serratedSlice'

const defaultThicknesses = ['2.0', '2.5', '3.0', '4.0']

export const Thickness = () => {
	const h = useAppSelector(getH)
	const thicknesses = useAppSelector(getThicknesses)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (thicknesses && thicknesses.length > 0) dispatch(setThickness(thicknesses[0]))
		else dispatch(setThickness(defaultThicknesses[0]))
	}, [dispatch, thicknesses])

	// const thicknessHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	const regex = /(^\d+[.,]?(\d{1})?)$/
	// 	if (regex.test(event.target.value)) dispatch(setThickness(event.target.value))
	// 	if (event.target.value === '') dispatch(setThickness(event.target.value))
	// }
	const thicknessHandler = (event: SelectChangeEvent<string>) => {
		dispatch(setThickness(event.target.value))
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Толщина прокладки
			</Typography>

			<Select
				value={h || '3.0'}
				onChange={thicknessHandler}
				size='small'
				sx={{ borderRadius: '12px', width: '100%' }}
			>
				{(thicknesses && thicknesses.length > 0 ? thicknesses : defaultThicknesses).map((v, i) => (
					<MenuItem key={i + '-' + v} value={v}>
						{v.replace('.', ',')}
					</MenuItem>
				))}
			</Select>
			{/* <Input
				name='thickness'
				value={h}
				onChange={thicknessHandler}
				// disabled={disabled}
				// error={err.thickness}
				// helperText={err.thickness && message}
			/> */}
		</>
	)
}
