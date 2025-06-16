import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getH, setThickness } from '../../../jacketedSlice'

export const Thickness = () => {
	const h = useAppSelector(getH)
	const dispatch = useAppDispatch()

	const thicknessHandler = (event: SelectChangeEvent<string>) => {
		dispatch(setThickness(event.target.value))
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Толщина прокладки
			</Typography>

			<Select value={h || '3.0'} onChange={thicknessHandler}>
				<MenuItem value={h}>{h}</MenuItem>
				{/* {(thicknesses && thicknesses.length > 0 ? thicknesses : defaultThicknesses).map((v, i) => (
					<MenuItem key={i + '-' + v} value={v}>
						{v.replace('.', ',')}
					</MenuItem>
				))} */}
			</Select>
		</>
	)
}
