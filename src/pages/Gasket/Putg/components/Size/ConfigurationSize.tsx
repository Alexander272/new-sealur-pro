import { ChangeEvent } from 'react'
import { Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setHasRounding, setSizeMain, setSizeThickness, setUseDimensions } from '@/store/gaskets/putg'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Input } from '@/components/Input/input.style'

export default function ConfigurationSize() {
	const main = useAppSelector(state => state.putg.main)
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

	const roundingHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasRounding(event.target.checked))
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
				value={!useDimensions ? size.d3 : size.d4}
				onChange={!useDimensions ? sizeHandler('d3') : sizeHandler('d4')}
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
						value={size.d3}
						onChange={sizeHandler('d3')}
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
				value={size.d2}
				onChange={sizeHandler('d2')}
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
						value={size.d1}
						onChange={sizeHandler('d1')}
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
						value={size.d1}
						onChange={sizeHandler('d1')}
						error={sizeErr.emptyD1}
						helperText={sizeErr.emptyD1 && 'размер не задан'}
						inputProps={{ inputMode: 'decimal' }}
						size='small'
					/>
				</>
			)}

			<Typography fontWeight='bold'>Толщина прокладки</Typography>
			<Input
				name='thickness'
				value={size.h}
				onChange={thicknessHandler}
				error={sizeErr.thickness}
				helperText={
					sizeErr.thickness &&
					`толщина должна быть ≥ ${material.putgType?.minThickness.toFixed(
						1
					)} и ≤ ${material.putgType?.maxThickness.toFixed(1)}`
				}
				inputProps={{ inputMode: 'decimal' }}
				size='small'
				sx={{ marginBottom: 1 }}
			/>

			{main.configuration?.code == 'rectangular' && (
				<Checkbox
					id={'hasRounding'}
					name={'hasRounding'}
					checked={size.hasRounding || false}
					onChange={roundingHandler}
					label='Есть скругления'
				/>
			)}
		</>
	)
}
