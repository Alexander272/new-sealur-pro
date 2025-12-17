import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getH, getThicknesses, setThickness } from '../../../waveSlice'

const defaultThicknesses = ['3.0', '3.5', '4.0', '4.5']

export const Thickness = () => {
	const h = useAppSelector(getH)
	const thicknesses = useAppSelector(getThicknesses)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (thicknesses && thicknesses.length > 0) {
			const newH = thicknesses.find(v => v == h)
			dispatch(setThickness(newH ? newH : thicknesses[0]))
		} else {
			const newH = defaultThicknesses.find(v => v == h)
			dispatch(setThickness(newH ? newH : defaultThicknesses[0]))
		}
	}, [dispatch, thicknesses, h])

	// const thicknessHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	const regex = /(^\d{1,2}([.,](\d{1,2})?)?)$/
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

			<Select value={h || defaultThicknesses[0]} onChange={thicknessHandler} fullWidth>
				{(thicknesses && thicknesses.length > 0 ? thicknesses : defaultThicknesses).map((v, i) => (
					<MenuItem key={i + '-' + v} value={v}>
						{v.replace('.', ',')}
					</MenuItem>
				))}
				{/* <MenuItem value={'3.0'}>3,0</MenuItem>
				<MenuItem value={'3.5'}>3,5</MenuItem>
				<MenuItem value={'4.0'}>4,0</MenuItem>
				<MenuItem value={'4.5'}>4,5</MenuItem> */}
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
