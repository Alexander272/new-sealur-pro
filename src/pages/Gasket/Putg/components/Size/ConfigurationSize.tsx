import { ChangeEvent, useState } from 'react'
import { Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSizeMain, setSizeThickness, setUseDimensions } from '@/store/gaskets/putg'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { Input } from '@/components/Input/input.style'

export default function ConfigurationSize() {
	const material = useAppSelector(state => state.putg.material)
	const useDimensions = useAppSelector(state => state.putg.size.useDimensions)
	const size = useAppSelector(state => state.putg.size)
	const sizeErr = useAppSelector(state => state.putg.sizeError)

	const dispatch = useAppDispatch()

	const changeUseDimensions = (value: string) => {
		dispatch(setUseDimensions(value === 'dimensions'))
		// setUseDimensions(value === 'dimensions')
	}

	const sizeHandler = (name: 'd4' | 'd3' | 'd2' | 'd1') => (event: React.ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.value.replace(',', '.')

		if (event.target.value === '' || !isNaN(+temp)) {
			let value: number | string

			if (temp[temp.length - 1] == '.') value = temp
			else value = Math.trunc(+temp * 10) / 10

			if (event.target.value === '') value = event.target.value

			dispatch(setSizeMain({ [name]: value.toString() }))
		}
	}

	const thicknessHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.value.replace(',', '.')

		if (event.target.value === '' || !isNaN(+temp)) {
			let value: number | string

			if (temp[temp.length - 1] == '.') value = temp
			else value = Math.trunc(+temp * 10) / 10

			if (event.target.value === '') value = event.target.value

			dispatch(setSizeThickness({ h: value.toString() }))
		}
	}

	return (
		<>
			<Typography fontWeight='bold'>Размеры через</Typography>
			<RadioGroup onChange={changeUseDimensions}>
				<RadioItem value='dimensions' active={useDimensions}>
					Габариты
				</RadioItem>
				<RadioItem value='field' active={!useDimensions}>
					Поле
				</RadioItem>
			</RadioGroup>

			<Typography fontWeight='bold'>A1, мм</Typography>
			<Input
				name='A1'
				// value={size.d4}
				// onChange={sizeHandler('d4')}
				// error={sizeErr.d4Err || sizeErr.emptyD4}
				// helperText={
				// 	(sizeErr.d4Err && 'D4 должен быть больше, чем D3') || (sizeErr.emptyD4 && 'размер не задан')
				// }
				inputProps={{ inputMode: 'decimal' }}
				size='small'
			/>
			{useDimensions && (
				<>
					<Typography fontWeight='bold'>A2, мм</Typography>
					<Input
						name='A2'
						// value={size.d4}
						// onChange={sizeHandler('d4')}
						// error={sizeErr.d4Err || sizeErr.emptyD4}
						// helperText={
						// 	(sizeErr.d4Err && 'D4 должен быть больше, чем D3') || (sizeErr.emptyD4 && 'размер не задан')
						// }
						inputProps={{ inputMode: 'decimal' }}
						size='small'
					/>
				</>
			)}

			<Typography fontWeight='bold'>B1, мм</Typography>
			<Input
				name='B1'
				// value={size.d4}
				// onChange={sizeHandler('d4')}
				// error={sizeErr.d4Err || sizeErr.emptyD4}
				// helperText={
				// 	(sizeErr.d4Err && 'D4 должен быть больше, чем D3') || (sizeErr.emptyD4 && 'размер не задан')
				// }
				inputProps={{ inputMode: 'decimal' }}
				size='small'
			/>
			{useDimensions && (
				<>
					<Typography fontWeight='bold'>B2, мм</Typography>
					<Input
						name='B2'
						// value={size.d4}
						// onChange={sizeHandler('d4')}
						// error={sizeErr.d4Err || sizeErr.emptyD4}
						// helperText={
						// 	(sizeErr.d4Err && 'D4 должен быть больше, чем D3') || (sizeErr.emptyD4 && 'размер не задан')
						// }
						inputProps={{ inputMode: 'decimal' }}
						size='small'
					/>
				</>
			)}

			{!useDimensions && (
				<>
					<Typography fontWeight='bold'>C, мм</Typography>
					<Input
						name='C'
						// value={size.d1}
						// onChange={sizeHandler('d1')}
						// error={sizeErr.d4Err || sizeErr.emptyD4}
						// helperText={
						// 	(sizeErr.d4Err && 'D4 должен быть больше, чем D3') || (sizeErr.emptyD4 && 'размер не задан')
						// }
						inputProps={{ inputMode: 'decimal' }}
						size='small'
					/>
				</>
			)}

			<Typography fontWeight='bold'>Толщина прокладки по каркасу</Typography>
			<Input
				name='thickness'
				value={size.h}
				onChange={thicknessHandler}
				error={sizeErr.thickness}
				helperText={
					sizeErr.thickness &&
					`толщина должна быть ≥ ${material.type?.minThickness.toFixed(
						1
					)} и ≤ ${material.type?.maxThickness.toFixed(1)}`
				}
				inputProps={{ inputMode: 'decimal' }}
				size='small'
			/>
		</>
	)
}
