import { FC } from 'react'
import { Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getH, getMinThick, getSizeErr, getType, setSizeThickness } from '../../../putgSlice'
import { Input } from '@/components/Input/input.style'

type Props = {
	disabled?: boolean
}

export const Thickness: FC<Props> = ({ disabled }) => {
	const h = useAppSelector(getH)
	const err = useAppSelector(getSizeErr)
	const type = useAppSelector(getType)
	const minThick = useAppSelector(getMinThick)
	const dispatch = useAppDispatch()

	const message = `толщина должна быть ≥ ${(minThick || type?.minThickness || 1).toFixed(
		1
	)} и ≤ ${type?.maxThickness.toFixed(1)}`

	const thicknessHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d{1,2}([.,](\d{1,2})?)?)$/
		if (regex.test(event.target.value))
			dispatch(setSizeThickness({ h: event.target.value.replace(',', '.').replace(/^0+(?=\d)/, '') }))
		if (event.target.value === '') dispatch(setSizeThickness({ h: event.target.value }))
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
				disabled={disabled}
				error={err.thickness}
				helperText={err.thickness && message}
			/>
		</>
	)
}
