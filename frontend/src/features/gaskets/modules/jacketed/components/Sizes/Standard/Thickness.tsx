import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getH, getShell, setThickness } from '../../../jacketedSlice'

export const Thickness = () => {
	const h = useAppSelector(getH)
	const shell = useAppSelector(getShell)
	const dispatch = useAppDispatch()

	const thicknessHandler = (event: SelectChangeEvent<string>) => {
		dispatch(setThickness(event.target.value))
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Толщина прокладки
			</Typography>

			<Select value={h || '3.4'} onChange={thicknessHandler}>
				<MenuItem value={shell?.thickness}>{shell?.thickness}</MenuItem>
			</Select>
		</>
	)
}
