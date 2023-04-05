import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Alert, Button, IconButton, Snackbar, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Position } from '@/types/card'
import { toggle } from '@/store/card'
import { clearSnp, setAmount } from '@/store/gaskets/snp'
import { useCreatePositionMutation, useUpdatePositionMutation } from '@/store/api/order'
import { Input } from '@/components/Input/input.style'
import { Loader } from '@/components/Loader/Loader'
import { ResultContainer } from '@/pages/Gasket/gasket.style'

type Props = {}

export const Result: FC<Props> = () => {
	const [alert, setAlert] = useState<{ type: 'error' | 'success'; open: boolean }>({ type: 'success', open: false })

	const main = useAppSelector(state => state.snp.main)
	const size = useAppSelector(state => state.snp.size)
	const materials = useAppSelector(state => state.snp.material)
	const design = useAppSelector(state => state.snp.design)
	const amount = useAppSelector(state => state.snp.amount)

	// const materialIr = useAppSelector(state => state.snp.materialsIr)
	// const materialFr = useAppSelector(state => state.snp.materialsFr)
	// const materialOr = useAppSelector(state => state.snp.materialsOr)

	const hasSizeError = useAppSelector(state => state.snp.hasSizeError)
	const hasDesignError = useAppSelector(state => state.snp.hasDesignError)

	const positions = useAppSelector(state => state.card.positions)
	const cardIndex = useAppSelector(state => state.snp.cardIndex)
	const orderId = useAppSelector(state => state.card.orderId)

	const role = useAppSelector(state => state.user.roleCode)

	const dispatch = useAppDispatch()

	const [create, { error: createError, isLoading }] = useCreatePositionMutation()
	const [update, { error: updateError, isLoading: isLoadingUpdate }] = useUpdatePositionMutation()

	useEffect(() => {
		if (updateError || createError) setAlert({ type: 'error', open: true })
	}, [createError, updateError])

	const savePosition = () => {
		const position: Position = {
			id: Date.now().toString() + (positions.length + 1),
			orderId: orderId,
			count: positions.length > 0 ? positions[positions.length - 1].count + 1 : 1,
			title: renderDesignation(),
			amount: amount,
			type: 'Snp',
			snpData: {
				main: main,
				size: size,
				material: materials,
				design: design,
			},
		}

		if (cardIndex !== undefined) {
			position.id = positions[cardIndex].id
			position.count = positions[cardIndex].count
			// dispatch(updatePosition({ index: cardIndex, position: position }))
			update(position)
			dispatch(clearSnp())
		} else {
			create(position)
			// dispatch(addPosition(position))
		}
		setAlert({ type: 'success', open: true })
	}

	const cancelHandler = () => {
		dispatch(clearSnp())
	}

	const amountHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9\b]+$/
		if (event.target.value === '' || regex.test(event.target.value)) {
			let value: number | string = +event.target.value
			if (event.target.value === '') value = event.target.value
			dispatch(setAmount(value.toString()))
		}
	}

	const closeHandler = () => {
		setAlert({ type: 'success', open: false })
	}
	const openCardHandler = () => {
		dispatch(toggle({ open: true }))
		setAlert({ type: 'success', open: false })
	}

	//TODO костыль
	const renderDescription = () => {
		let rings
		if (main.snpType?.title == 'Д')
			rings = `(с наружным ${materials.outerRing?.title} и внутренним ${materials.innerRing?.title} ограничительными кольцами), с металлическим каркасом из ленты ${materials.frame?.title}`
		if (main.snpType?.title == 'Г')
			rings = `(с наружным ограничительным кольцом ${materials.outerRing?.title}), с металлическим каркасом из ленты ${materials.frame?.title}`
		if (main.snpType?.title == 'В')
			rings = `(с внутренним ограничительным кольцом ${materials.innerRing?.title}), с металлическим каркасом из ленты ${materials.frame?.title}`
		if (main.snpType?.title == 'Б' || main.snpType?.title == 'А')
			rings = `(без ограничительных колец), с металлическим каркасом из ленты ${materials.frame?.title}`

		let flange = main.snpStandard?.flangeStandard.code ? ` по ${main.snpStandard.flangeStandard.title}` : ''

		let sizes = ''
		if (size?.d4) sizes += size.d4 + 'x'
		sizes += `${size?.d3}x${size?.d2}`
		if (size?.d1) sizes += 'x' + size.d1

		let thickness = size.h != 'another' ? size.h : size.another

		let mounting = ''
		if (design.mounting.hasMounting) mounting = `, с фиксатором ${design.mounting.code}`

		let hole = ''
		if (design.hasHole) hole = `, с отверстиями (по чертежу)`

		let jumper = ''
		if (design.jumper.hasJumper) {
			let width = ''
			if (design.jumper.width !== '') width = ` шириной ${design.jumper.width} мм`
			jumper = `, с перемычкой типа ${jumper}${width}`
		}

		let res = `Спирально-навитая прокладка (СНП) по ${main.snpStandard?.standard.title} типа ${main.snpType?.title} ${rings} и наполнителем из ${materials.filler.designation}, для применения на фланце "${main.flangeTypeTitle}"${flange} с размерами ${sizes}, толщиной ${thickness} мм${mounting}${hole}${jumper}`

		return res
	}

	//TODO костыль
	const renderDesignation = () => {
		// const data: any = {
		// 	main,
		// 	size,
		// 	materials,
		// }
		// const format = [
		// 	'СНП-',
		// 	'main.snpTypeCode',
		// 	'-',
		// 	'materials.filler.code',
		// 	'-',
		// 	'size.d2',
		// 	'-',
		// 	'size.pn.mpa',
		// 	'-',
		// 	'size.h',
		// 	' ',
		//     '',
		// 	'main.snpStandard.standard.title',
		// ]

		// const res = format.map(f => {
		// 	if (f.includes('.')) {
		// 		let temp: any = data
		// 		let ok = true

		// 		const parts = f.split('.')
		// 		for (let i = 0; i < parts.length; i++) {
		// 			const element = parts[i]
		// 			temp = temp[element]
		// 			if (!temp) {
		// 				ok = false
		// 				break
		// 			}
		// 		}

		// 		if (ok) return temp
		// 		else return ''
		// 	} else return f
		// })

		// return res.join('')

		let designationMaterials = ''
		let designationDesign = ''
		let designationDesignParts: string[] = []

		let notStandardMaterial = false

		// const conditionIr = !!materials.ir && materialIr?.default.id != materials.ir?.id
		// const conditionFr = !!materials.fr && materialFr?.default.id != materials.fr?.id
		// const conditionOr = !!materials.or && materialOr?.default.id != materials.or?.id

		const conditionIr = Boolean(materials.innerRing) && !materials.innerRing?.isDefault
		const conditionFr = Boolean(materials.frame) && !materials.frame?.isDefault
		const conditionOr = Boolean(materials.outerRing) && !materials.outerRing?.isDefault

		if (conditionIr || conditionFr || conditionOr) {
			notStandardMaterial = true
		}

		if (design.jumper.hasJumper) {
			designationDesignParts.push(`${design.jumper.code}${design.jumper.width && '/'}${design.jumper.width}`)
		}
		if (design.mounting.hasMounting) {
			designationDesignParts.push(design.mounting.code)
		}
		if (design.hasHole || design.drawing) {
			designationDesignParts.push('черт.')
		}
		if (designationDesignParts.length) {
			designationDesign = `(${designationDesignParts.join(', ')}) `
		}

		if (main.snpStandard?.standard.title === 'ОСТ 26.260.454') {
			if (notStandardMaterial) {
				let temp = []
				// if (materials.ir) temp.push(`вн. кольцо - ${materials.ir.shortRus}`)
				// if (materials.fr) temp.push(`каркас - ${materials.fr.shortRus}`)
				// if (materials.or) temp.push(`нар. кольцо - ${materials.or.shortRus}`)
				if (materials.innerRing) temp.push(`вн. кольцо - ${materials.innerRing.code}`)
				if (materials.frame) temp.push(`каркас - ${materials.frame.code}`)
				if (materials.outerRing) temp.push(`нар. кольцо - ${materials.outerRing.code}`)

				designationMaterials = ` (${temp.join(', ')}) `
			}

			let thickness = size.h != 'another' ? size.h : size.another
			thickness = (+thickness.replaceAll(',', '.')).toFixed(1).replaceAll('.', ',')

			return `СНП-${main.snpType?.code}-${materials.filler.code}-${size.d2}-${size.pn.mpa}-${thickness} ${designationDesign}${main.snpStandard.standard.title}${designationMaterials}`
		}
		if (main.snpStandard?.standard.title === 'ГОСТ Р 52376-2005') {
			let y = ''
			// if (!!materials.or && materials.or?.code === '5') {
			// 	y = '-У'
			// }

			if (Boolean(materials.outerRing) && materials.outerRing?.baseCode === '5') y = '-У'
			if (!(conditionIr || conditionFr) && y) {
				notStandardMaterial = false
			}

			let temp = []
			// if (materials.filler.baseCode != '3' && materials.filler.baseCode != '4')
			// 	temp.push(`наполнитель - ${materials.filler.code}`)

			// if (size.h === 'another')
			// 	temp.push(`толщина - ${(+size.another.replaceAll(',', '.')).toFixed(1).replaceAll('.', ',')}`)

			// if (notStandardMaterial) {
			// 	if (materials.ir) temp.push(`вн. кольцо - ${materials.ir.shortRus}`)
			// 	if (materials.fr) temp.push(`каркас - ${materials.fr.shortRus}`)
			// 	if (materials.or) temp.push(`нар. кольцо - ${materials.or.shortRus}`)
			// }

			if (notStandardMaterial) {
				if (materials.innerRing) temp.push(`вн. кольцо - ${materials.innerRing.code}`)
				if (materials.frame) temp.push(`каркас - ${materials.frame.code}`)
				if (materials.outerRing) temp.push(`нар. кольцо - ${materials.outerRing.code}`)
			}

			if (temp.length) designationMaterials = ` (${temp.join(', ')}) `

			return `СНП-${main.snpType?.code}-${size.dn}-${size.pn.kg}${y} ${designationDesign}${main.snpStandard.standard.title}${designationMaterials}`
		}
		if (main.snpStandard?.standard.title === 'ASME B 16.20') {
			// let ir = materials.ir?.shortEn ? `-I.R. ${materials.ir.shortEn}` : ''
			// let fr = `-${materials.fr?.shortEn}/`
			// let or = materials.or?.shortEn ? `-O.R. ${materials.or.shortEn}` : ''
			let ir = materials.innerRing?.code ? `-I.R. ${materials.innerRing?.code}` : ''
			let fr = `-${materials.frame?.code}/`
			let or = materials.outerRing?.code ? `-O.R. ${materials.outerRing?.code}` : ''

			return `SWG-${size.dn}-${size.pn.mpa}${ir}${fr}${materials.filler.code}${or} ${designationDesign}${main.snpStandard.standard.title}`
		}
		if (main.snpStandard?.standard.title === 'EN 12560-2') {
			// let ir = ''
			let fr = ''
			// let or = ''

			// let ir = materials.ir?.shortEn ? `${materials.ir.shortEn}-` : ''
			// if (materials.ir?.shortEn != materials.fr?.shortEn) fr = `${materials.fr?.shortEn}-`
			// let or = materials.or?.shortEn ? `-${materials.or.shortEn}` : ''

			let ir = materials.innerRing?.code ? `${materials.innerRing?.code}-` : ''
			if (materials.innerRing?.code != materials.frame?.code) fr = `${materials.frame?.code}-`
			let or = materials.outerRing?.code ? `-${materials.outerRing?.code}` : ''

			return `Gasket ${main.snpStandard.standard.title}-${main.snpType?.code}-DN ${size.dnMm}-Class ${size.pn.mpa}-${ir}${fr}${materials.filler.code}${or}`
		}
		if (main.snpStandard?.standard.title === 'ГОСТ 28759.9') {
			let temp = []

			if (notStandardMaterial) {
				// if (materials.ir) temp.push(`вн. кольцо - ${materials.ir.shortRus}`)
				// if (materials.fr) temp.push(`каркас - ${materials.fr.shortRus}`)
				// if (materials.or) temp.push(`нар. кольцо - ${materials.or.shortRus}`)
				if (materials.innerRing) temp.push(`вн. кольцо - ${materials.innerRing.code}`)
				if (materials.frame) temp.push(`каркас - ${materials.frame.code}`)
				if (materials.outerRing) temp.push(`нар. кольцо - ${materials.outerRing.code}`)
			}

			if (temp.length) designationMaterials = ` (${temp.join(', ')}) `

			return `СНП-${main.snpType?.code}-${materials.filler.code}-${size.dn}-${size.pn.mpa} ${main.snpStandard.standard.title}${designationMaterials}`
		}
		if (main.snpStandard?.standard.title === 'EN 1514-2') {
			// let ir = ''
			// let fr = ''
			// let or = ''

			// let thickness = ''
			// if (size.h === 'another')
			// 	thickness = `(толщина - ${(+size.another.replaceAll(',', '.')).toFixed(1).replaceAll('.', ',')}) `

			// if (notStandardMaterial) {
			// 	ir = materials.ir?.shortEn ? `${materials.ir.shortEn}-` : ''
			// 	if (materials.ir?.shortEn != materials.fr?.shortEn) fr = `${materials.fr?.shortEn}-`
			// 	or = materials.or?.shortEn ? `-${materials.or.shortEn}` : ''
			// }

			// return `СНП-${main.snpType?.code}-${size.dn}-${size.pn.mpa}-${ir}${fr}${materials.filler.code}${or} ${thickness}${designationDesign}${main.snpStandard.standard.title}`

			// let ir = ''
			let fr = ''
			// let or = ''

			// let ir = materials.ir?.shortEn ? `${materials.ir.shortEn}-` : ''
			// if (materials.ir?.shortEn != materials.fr?.shortEn) fr = `${materials.fr?.shortEn}-`
			// let or = materials.or?.shortEn ? `-${materials.or.shortEn}` : ''

			let ir = materials.innerRing?.code ? `${materials.innerRing?.code}-` : ''
			if (materials.innerRing?.code != materials.frame?.code) fr = `${materials.frame?.code}-`
			let or = materials.outerRing?.code ? `-${materials.outerRing?.code}` : ''

			return `Gasket ${main.snpStandard.standard.title}-${main.snpType?.code}-DN ${size.dn}-PN ${size.pn.kg}-${ir}${fr}${materials.filler.code}${or}`
		}
		if (main.snpStandard?.standard.title === 'ТУ 3689-010-93978201-2008') {
			let sizes = ''
			if (size?.d4) sizes += size.d4 + 'x'
			sizes += `${size?.d3}x${size?.d2}`
			if (size?.d1) sizes += 'x' + size.d1

			let thickness = size.h != 'another' ? size.h : size.another
			thickness = (+thickness.replaceAll(',', '.')).toFixed(1).replaceAll('.', ',')

			//TODO выводить словами материалы, по типу Incoloy 825

			if (notStandardMaterial) {
				// designationMaterials = `-${materials.ir?.code || 0}${materials.fr?.code || 0}${materials.or?.code || 0}`
				designationMaterials = `-${materials.innerRing?.code || 0}${materials.frame?.code || 0}${
					materials.outerRing?.code || 0
				}`
			}

			return `СНП-${main.snpType?.code}-${materials.filler.code}-${sizes}-${thickness}${designationMaterials} ${designationDesign}${main.snpStandard.standard.title}`
		}

		return ''
	}

	return (
		<ResultContainer>
			<Stack direction={'row'} spacing={1} marginBottom={1}>
				<Typography fontWeight='bold' marginRight={1} sx={{ userSelect: 'none' }}>
					Описание:
				</Typography>
				<Typography textAlign='justify' sx={{ userSelect: 'none' }}>
					{renderDescription()}
				</Typography>
			</Stack>

			<Stack direction={'row'} spacing={2} alignItems='center' marginBottom={1}>
				<Typography fontWeight='bold' sx={{ userSelect: 'none' }}>
					Обозначение:
				</Typography>
				<Typography sx={{ userSelect: 'none' }} fontSize={'1.12rem'}>
					{renderDesignation()}
				</Typography>
			</Stack>
			<Stack direction={'row'} spacing={2} alignItems='center' justifyContent='space-between'>
				{isLoading || isLoadingUpdate ? <Loader background='fill' /> : null}

				<Stack direction={'row'} spacing={2} alignItems='center'>
					<Typography fontWeight='bold'>Количество:</Typography>
					<Input value={amount} onChange={amountHandler} size='small' />
				</Stack>

				{role != 'manager' && (
					<Stack direction={'row'} spacing={2} alignItems='center'>
						{cardIndex !== undefined && (
							<Button
								onClick={cancelHandler}
								variant='outlined'
								color='secondary'
								sx={{ borderRadius: '12px', padding: '6px 20px' }}
							>
								Отменить
							</Button>
						)}

						<Button
							disabled={!amount || hasSizeError || hasDesignError}
							onClick={savePosition}
							variant='contained'
							sx={{ borderRadius: '12px', padding: '6px 20px' }}
						>
							{cardIndex !== undefined ? 'Изменить в заявке' : 'Добавить  в заявку'}
						</Button>
					</Stack>
				)}
			</Stack>

			<Snackbar
				open={alert.open}
				// autoHideDuration={6000}
				onClose={closeHandler}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert
					onClose={closeHandler}
					severity={alert.type}
					action={
						alert.type == 'success' ? (
							<IconButton
								color='inherit'
								size='small'
								sx={{ lineHeight: '18px' }}
								onClick={openCardHandler}
							>
								➜
							</IconButton>
						) : (
							<IconButton color='inherit' size='small' sx={{ lineHeight: '18px' }} onClick={closeHandler}>
								&times;
							</IconButton>
						)
					}
					sx={{ width: '100%' }}
				>
					{createError && 'Не удалось добавить позицию'}
					{updateError && 'Не удалось обновить позицию'}
					{alert.type == 'success' && <>Позиция {cardIndex !== undefined ? 'изменена' : 'добавлена'}</>}
				</Alert>
			</Snackbar>
		</ResultContainer>
	)
}
