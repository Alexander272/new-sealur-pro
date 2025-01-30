import { FC } from 'react'
import { Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Input } from '@/components/Input/input.style'
import { getH, getMinThick, getSizeErr, getType, setSizeThickness } from '../../../putgSlice'

type Props = {
	disabled?: boolean
}

export const Thickness: FC<Props> = ({ disabled }) => {
	const h = useAppSelector(getH)
	const err = useAppSelector(getSizeErr)
	const type = useAppSelector(getType)
	const minThick = useAppSelector(getMinThick)
	const dispatch = useAppDispatch()

	const message = `толщина должна быть ≥ ${
		minThick.toFixed(1) || type?.minThickness.toFixed(1)
	} и ≤ ${type?.maxThickness.toFixed(1)}`

	const thicknessHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d+[.,]?(\d{1})?)$/
		if (regex.test(event.target.value)) dispatch(setSizeThickness({ h: event.target.value }))
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
