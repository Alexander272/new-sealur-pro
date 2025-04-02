import { Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Input } from '@/components/Input/input.style'
import { getH, setThickness } from '../../../waveSlice'

export const Thickness = () => {
	const h = useAppSelector(getH)
	const dispatch = useAppDispatch()

	const thicknessHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d+[.,]?(\d{1})?)$/
		if (regex.test(event.target.value)) dispatch(setThickness(event.target.value))
		if (event.target.value === '') dispatch(setThickness(event.target.value))
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Толщина прокладки
			</Typography>

			<Input
				name='thickness'
				value={h}
				onChange={thicknessHandler}
				// disabled={disabled}
				// error={err.thickness}
				// helperText={err.thickness && message}
			/>
		</>
	)
}
