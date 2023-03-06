import { ChangeEvent, FC, useEffect } from 'react'
import { MenuItem, Select, Stack, Typography } from '@mui/material'
import { Input } from '@/components/Input/input.style'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSizeMain, setSizeThickness } from '@/store/gaskets/snp'

type Props = {}

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
		dispatch(setSizeThickness({ h: '3,2' }))
	}, [])

	const sizeHandler = (name: 'd4' | 'd3' | 'd2' | 'd1') => (event: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9\b]+$/
		if (event.target.value === '' || regex.test(event.target.value)) {
			let value: number | string = +event.target.value
			if (event.target.value === '') value = event.target.value
			dispatch(setSizeMain({ [name]: value.toString() }))
		}
	}

	// const changeHHandler = (value: string) => {
	//     let idx = size?.h.split(";").findIndex(h => h === value)
	//     snp.changeH(idx || 0)
	// }

	const thicknessHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9.,\b]+$/
		const temp = event.target.value.replaceAll(',', '.')

		if (isNaN(+temp)) return

		if (event.target.value === '' || regex.test(event.target.value)) {
			let value: number | string = Math.round(+temp * 10) / 10
			if (temp[temp.length - 1] == '.') value = temp
			if (event.target.value === '') value = event.target.value

			dispatch(setSizeThickness({ h: value.toString().replaceAll('.', ',') }))
		}
	}

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

			<Typography fontWeight='bold'>Толщина каркаса прокладки</Typography>
			<Input
				value={size.h}
				onChange={thicknessHandler}
				size='small'
				// type='number'
				// inputProps={{ min: 2, step: 0.1, max: 10 }}
			/>
			{/* <Stack direction='row' spacing={1}>
				<Select
					value={size.h || 'another'}
					// onChange={flangeTypeHandler}
					size='small'
					sx={{ borderRadius: '12px', width: '100%' }}
				>
					{/* {data?.data.flangeTypes.map(f => (
					<MenuItem key={f.id} value={f.code}>
						{f.code} {f.title} {f.description}
					</MenuItem>
				))} 
					<MenuItem value='another'>другая</MenuItem>
				</Select>
				{size.h == 'another' || size.h == '' ? (
					<Input
						value={size.another}
						// onChange={sizeHandler('d1')}
						size='small'
						// type='number'
						// inputProps={{ min: 1 }}
					/>
				) : null}
			</Stack> */}
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
