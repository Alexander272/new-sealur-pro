import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getH, setThickness } from '../../../waveSlice'

export const Thickness = () => {
	const h = useAppSelector(getH)
	const dispatch = useAppDispatch()

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
				<MenuItem value={'3.0'}>3,0</MenuItem>
				<MenuItem value={'3.5'}>3,5</MenuItem>
				<MenuItem value={'4.0'}>4,0</MenuItem>
				<MenuItem value={'4.5'}>4,5</MenuItem>
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
