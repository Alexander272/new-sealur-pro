import { MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material'

import type { IThickness } from '@/features/gaskets/modules/snp/types/snp'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getAnother, getSizeErr, getThickness, setSizeThickness } from '@/features/gaskets/modules/snp/snpSlice'
import { Input } from '@/components/Input/input.style'

const thickness = [
	{ id: '1', frame: '2,3', twisted: '2,5', ring: '2,0' },
	{ id: '2', frame: '2,5', twisted: '2,8', ring: '2,0' },
	{ id: '3', frame: '2,8', twisted: '3,3', ring: '2,5' },
	{ id: '4', frame: '3,2', twisted: '3,5', ring: '2,5' },
	{ id: '5', frame: '3,5', twisted: '3,9', ring: '3,0' },
	{ id: '6', frame: '4,2', twisted: '4,8', ring: '3,0' },
	{ id: '7', frame: '4,5', twisted: '5,0', ring: '3,0' },
	{ id: '8', frame: '6,5', twisted: '7,0', ring: '5,0' },
	{ id: '9', frame: '7,2', twisted: '7,8', ring: '5,0' },
]

export const Thickness = () => {
	const h = useAppSelector(getThickness)
	const errors = useAppSelector(getSizeErr)
	const another = useAppSelector(getAnother)

	const dispatch = useAppDispatch()

	const stand = thickness.some(t => t.frame === another)

	const thicknessHandler = (event: SelectChangeEvent<string>) => {
		const tmp = thickness.find(t => t.frame === event.target.value)

		const newThickness: IThickness = {
			// another: event.target.value,
			s2: tmp?.ring || '',
			s3: tmp?.twisted || '',
		}
		if (event.target.value == 'another') newThickness.h = 'another'
		else {
			newThickness.h = ''
			newThickness.another = event.target.value
		}
		dispatch(setSizeThickness(newThickness))
	}

	const anotherThicknessHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /(^([5][0-9]|[1-4][0-9]|[0-9])([.,](\d{1})?)?)$/
		if (regex.test(event.target.value)) dispatch(setSizeThickness({ another: event.target.value }))
		if (event.target.value === '') dispatch(setSizeThickness({ another: event.target.value }))
	}

	return (
		<>
			<Typography fontWeight='bold'>Толщина прокладки по каркасу</Typography>
			<Stack direction='row' spacing={1} alignItems='flex-start'>
				<Select value={stand && h == '' ? another : 'another'} onChange={thicknessHandler} fullWidth>
					{thickness.map(t => (
						<MenuItem key={t.id} value={t.frame}>
							{t.frame}
						</MenuItem>
					))}
					<MenuItem value='another'>другая</MenuItem>
				</Select>

				{(!stand && h == '') || h == 'another' ? (
					<Input
						name='thickness'
						value={another}
						onChange={anotherThicknessHandler}
						error={errors.thickness}
						helperText={errors.thickness && 'толщина должна быть больше 2,2 и меньше 10'}
					/>
				) : null}
			</Stack>
		</>
	)
}
