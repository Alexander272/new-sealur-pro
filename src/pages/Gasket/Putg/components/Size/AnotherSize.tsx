import { ChangeEvent, FC } from 'react'
import { Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSizeMain, setSizeThickness } from '@/store/gaskets/putg'
import { Input } from '@/components/Input/input.style'

type Props = {}

export const AnotherSize: FC<Props> = () => {
	const material = useAppSelector(state => state.putg.material)
	const size = useAppSelector(state => state.putg.size)
	const sizeErr = useAppSelector(state => state.putg.sizeError)

	const dispatch = useAppDispatch()

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
			{material.construction?.hasD4 && (
				<>
					<Typography fontWeight='bold'>D4, мм</Typography>
					<Input
						name='d4'
						value={size.d4}
						onChange={sizeHandler('d4')}
						error={sizeErr.d4Err || sizeErr.emptyD4}
						helperText={
							(sizeErr.d4Err && 'D4 должен быть больше, чем D3') || (sizeErr.emptyD4 && 'размер не задан')
						}
						inputProps={{ inputMode: 'decimal' }}
						size='small'
					/>
				</>
			)}

			{material.construction?.hasD3 && (
				<>
					<Typography fontWeight='bold'>D3, мм</Typography>
					<Input
						name='d3'
						value={size.d3}
						onChange={sizeHandler('d3')}
						error={sizeErr.d3Err || sizeErr.emptyD3}
						helperText={
							(sizeErr.d3Err && 'D3 должен быть больше, чем D2') || (sizeErr.emptyD3 && 'размер не задан')
						}
						inputProps={{ inputMode: 'decimal' }}
						size='small'
					/>
				</>
			)}

			{material.construction?.hasD2 && (
				<>
					<Typography fontWeight='bold'>D2, мм</Typography>
					<Input
						name='d2'
						value={size.d2}
						onChange={sizeHandler('d2')}
						error={sizeErr.d2Err || sizeErr.emptyD2}
						helperText={
							(sizeErr.d2Err && 'D2 должен быть больше, чем D1') || (sizeErr.emptyD2 && 'размер не задан')
						}
						inputProps={{ inputMode: 'decimal' }}
						size='small'
					/>
				</>
			)}

			{material.construction?.hasD1 && (
				<>
					<Typography fontWeight='bold'>D1, мм</Typography>
					<Input
						name='d1'
						value={size.d1}
						onChange={sizeHandler('d1')}
						error={sizeErr.emptyD1}
						helperText={sizeErr.emptyD1 && 'размер не задан'}
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
