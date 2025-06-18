import { FC, useEffect } from 'react'
import { Typography } from '@mui/material'

import type { ISizeErrors } from '../../../types/errors'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Input } from '@/components/Input/input.style'
import { getH, getSizeErrors, setSizeErrors, setThickness } from '../../../jacketedSlice'

type Props = {
	disabled?: boolean
}

export const Thickness: FC<Props> = ({ disabled }) => {
	const h = useAppSelector(getH)
	const err = useAppSelector(getSizeErrors)
	const dispatch = useAppDispatch()

	useEffect(() => {
		const err: ISizeErrors = {}
		err.thickness = !h || +h < 2 || +h > 6

		dispatch(setSizeErrors(err))
	}, [dispatch, h])

	const thicknessHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d+[.,]?(\d{1})?)$/
		if (regex.test(event.target.value))
			dispatch(setThickness(event.target.value.replace(',', '.').replace(/^0+(?=\d)/, '')))
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
				disabled={disabled}
				error={err.thickness}
				helperText={err.thickness && `толщина должна быть ≥ 2 и ≤ 6`}
			/>
		</>
	)
}
