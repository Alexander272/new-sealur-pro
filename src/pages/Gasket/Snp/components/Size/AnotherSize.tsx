import { ChangeEvent, FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material'
import { Input } from '@/components/Input/input.style'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSizeMain, setSizeThickness } from '@/store/gaskets/snp'

type Props = {}

// const thickness = ['2,3', '2,5', '2,8', '3,2', '3,5', '4,2', '4,5', '6,5', '7,2']

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

export const AnotherSize: FC<Props> = () => {
	const main = useAppSelector(state => state.snp.main)
	const size = useAppSelector(state => state.snp.size)
	const sizeErr = useAppSelector(state => state.snp.sizeError)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!['Г', 'Д'].includes(main.snpTypeTitle)) dispatch(setSizeMain({ d4: '' }))
		if (!['В', 'Д'].includes(main.snpTypeTitle)) dispatch(setSizeMain({ d1: '' }))
	}, [main.snpTypeTitle])

	useEffect(() => {
		dispatch(setSizeThickness({ h: '3,2', s2: '2,5', s3: '3,5' }))
	}, [])

	const sizeHandler = (name: 'd4' | 'd3' | 'd2' | 'd1') => (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9\b]+$/
		if (event.target.value === '' || regex.test(event.target.value)) {
			let value: number | string = +event.target.value
			if (event.target.value === '') value = event.target.value
			dispatch(setSizeMain({ [name]: value.toString() }))
		}
	}

	const thicknessHandler = (event: SelectChangeEvent<string>) => {
		const newThickness: any = {
			h: event.target.value,
		}
		const idx = thickness.findIndex(t => t.frame === event.target.value)
		if (idx == -1) {
			newThickness.s2 = ''
			newThickness.s3 = ''
		} else {
			newThickness.s2 = thickness[idx].ring
			newThickness.s3 = thickness[idx].twisted
		}

		dispatch(setSizeThickness(newThickness))
	}
	const anotherThicknessHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9.,\b]+$/
		const temp = event.target.value.replaceAll(',', '.')

		if (isNaN(+temp)) return

		if (event.target.value === '' || regex.test(event.target.value)) {
			let value: number | string = Math.round(+temp * 10) / 10
			if (temp[temp.length - 1] == '.') value = temp
			if (event.target.value === '') value = event.target.value

			dispatch(setSizeThickness({ another: value.toString().replaceAll('.', ',') }))
		}
	}

	// const thicknessHandler = (event: ChangeEvent<HTMLInputElement>) => {
	// 	const regex = /^[0-9.,\b]+$/
	// 	const temp = event.target.value.replaceAll(',', '.')

	// 	if (isNaN(+temp)) return

	// 	if (event.target.value === '' || regex.test(event.target.value)) {
	// 		let value: number | string = Math.round(+temp * 10) / 10
	// 		if (temp[temp.length - 1] == '.') value = temp
	// 		if (event.target.value === '') value = event.target.value

	// 		dispatch(setSizeThickness({ h: value.toString().replaceAll('.', ',') }))
	// 	}
	// }

	return (
		<>
			{['Г', 'Д'].includes(main.snpTypeTitle) && (
				<>
					<Typography fontWeight='bold'>D4, мм</Typography>
					<Input
						value={size.d4}
						onChange={sizeHandler('d4')}
						error={sizeErr.d4Err}
						helperText={sizeErr.d4Err && 'D4 должен быть больше, чем D3'}
						size='small'
						// type='number'
						// inputProps={{ min: 1 }}
					/>
				</>
			)}

			<Typography fontWeight='bold'>D3, мм</Typography>
			<Input
				value={size.d3}
				onChange={sizeHandler('d3')}
				error={sizeErr.d3Err}
				helperText={sizeErr.d3Err && 'D3 должен быть больше, чем D2'}
				size='small'
				// type='number'
				// inputProps={{ min: 1 }}
			/>

			<Typography fontWeight='bold'>D2, мм</Typography>
			<Input
				value={size.d2}
				onChange={sizeHandler('d2')}
				error={sizeErr.d2Err}
				helperText={sizeErr.d2Err && 'D2 должен быть больше, чем D1'}
				size='small'
				// type='number'
				// inputProps={{ min: 1 }}
			/>

			{['В', 'Д'].includes(main.snpTypeTitle) && (
				<>
					<Typography fontWeight='bold'>D1, мм</Typography>
					<Input
						value={size.d1}
						onChange={sizeHandler('d1')}
						size='small'
						// type='number'
						// inputProps={{ min: 1 }}
					/>
				</>
			)}

			<Typography fontWeight='bold'>Толщина прокладки по каркасу</Typography>
			{/* <Input
				value={size.h}
				onChange={thicknessHandler}
				size='small'
				// type='number'
				// inputProps={{ min: 2, step: 0.1, max: 10 }}
			/> */}
			<Stack direction='row' spacing={1} alignItems='flex-start'>
				<Select
					value={size.h || 'another'}
					onChange={thicknessHandler}
					size='small'
					sx={{ borderRadius: '12px', width: '100%' }}
				>
					{thickness.map(t => (
						<MenuItem key={t.id} value={t.frame}>
							{t.frame}
						</MenuItem>
					))}
					<MenuItem value='another'>другая</MenuItem>
				</Select>

				{size.h == 'another' || size.h == '' ? (
					<Input
						value={size.another}
						onChange={anotherThicknessHandler}
						size='small'
						error={sizeErr.thickness}
						helperText={sizeErr.thickness && 'толщина должна быть больше 2,2 и меньше 10'}
					/>
				) : null}
			</Stack>
		</>

		//     <div className={`${classes.block} ${classes.snpDrawFl}`}>
		//         <p className={classes.titleGroup}>Чертеж прокладки</p>
		//         <div className={`${classes.blockImage}`}>
		//             <div className={classes.imageContainer}>
		//                 <img
		//                     className={classes.image}
		//                     width={470}
		//                     height={200}
		//                     src={imgUrls[(typePr as "Д") || "Д"]}
		//                     alt='gasket drawing'
		//                 />
		//                 {/* Элементы отвечающие за подкраску участков прокладки */}
		//                 <Excretion
		//                     typePr={typePr || ""}
		//                     isOpenFr={isOpenFr}
		//                     isOpenIr={isOpenIr}
		//                     isOpenOr={isOpenOr}
		//                 />

		//                 {/* Вывод размеров */}
		//                 <Sizes
		//                     typePr={typePr || ""}
		//                     h={h}
		//                     oh={oh}
		//                     s2={s2}
		//                     s3={s3}
		//                     st={st}
		//                     d1={size?.d1 || "0"}
		//                     d2={size?.d2 || "0"}
		//                     d3={size?.d3 || "0"}
		//                     d4={size?.d4 || "0"}
		//                 />
		//             </div>
		//         </div>
		//     </div>
		// </div>
	)
}
