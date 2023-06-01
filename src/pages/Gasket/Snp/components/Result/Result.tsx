import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Alert, Button, IconButton, Snackbar, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Position } from '@/types/card'
import { clearActive, toggle } from '@/store/card'
import { clearSnp, setAmount } from '@/store/gaskets/snp'
import { useCreatePositionMutation, useUpdatePositionMutation } from '@/store/api/order'
import { Loader } from '@/components/Loader/Loader'
import { Input } from '@/components/Input/input.style'
import { ResultContainer } from '@/pages/Gasket/gasket.style'
import { ResultSkeleton } from '@/pages/Gasket/Skeletons/ResultSkeleton'

type Props = {}

type Alert = { type: 'error' | 'success'; message: string; open: boolean }

// блок с выводом результата
export const Result: FC<Props> = () => {
	const [alert, setAlert] = useState<Alert>({ type: 'success', message: '', open: false })

	const isReady = useAppSelector(state => state.snp.isReady)

	const main = useAppSelector(state => state.snp.main)
	const size = useAppSelector(state => state.snp.size)
	const materials = useAppSelector(state => state.snp.material)
	const design = useAppSelector(state => state.snp.design)
	const amount = useAppSelector(state => state.snp.amount)

	const hasSizeError = useAppSelector(state => state.snp.hasSizeError)
	const hasDesignError = useAppSelector(state => state.snp.hasDesignError)

	const positions = useAppSelector(state => state.card.positions)
	const orderId = useAppSelector(state => state.card.orderId)
	const cardIndex = useAppSelector(state => state.card.activePosition?.index)

	const role = useAppSelector(state => state.user.roleCode)

	const dispatch = useAppDispatch()

	const [create, { error: createError, isLoading }] = useCreatePositionMutation()
	const [update, { error: updateError, isLoading: isLoadingUpdate }] = useUpdatePositionMutation()

	useEffect(() => {
		//TODO стоит наверное разделить это на 2 части
		if (updateError || createError)
			setAlert({ type: 'error', message: (updateError || (createError as any)).data.message, open: true })
	}, [createError, updateError])

	const savePosition = async () => {
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

		try {
			if (cardIndex !== undefined) {
				position.id = positions[cardIndex].id
				position.count = positions[cardIndex].count
				// dispatch(updatePosition({ index: cardIndex, position: position }))
				await update(position).unwrap()
				dispatch(clearSnp())
				dispatch(clearActive())
			} else {
				await create(position).unwrap()
				// dispatch(addPosition(position))
			}
		} catch (error) {
			return
		}

		setAlert({ type: 'success', message: '', open: true })
	}

	const cancelHandler = () => {
		dispatch(clearSnp())
		dispatch(clearActive())
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
		setAlert({ type: 'success', message: '', open: false })
	}
	const openCardHandler = () => {
		dispatch(toggle({ open: true }))
		setAlert({ type: 'success', message: '', open: false })
	}

	// костыль
	const renderDescription = () => {
		let rings
		if (main.snpType?.title == 'Д') {
			rings = `(с наружным ${materials.outerRing?.title} и внутренним ${materials.innerRing?.title} ограничительными кольцами), с металлическим каркасом из ленты ${materials.frame?.title}`
		}
		if (main.snpType?.title == 'Г') {
			rings = `(с наружным ограничительным кольцом ${materials.outerRing?.title}), с металлическим каркасом из ленты ${materials.frame?.title}`
		}
		if (main.snpType?.title == 'В') {
			rings = `(с внутренним ограничительным кольцом ${materials.innerRing?.title}), с металлическим каркасом из ленты ${materials.frame?.title}`
		}
		if (main.snpType?.title == 'Б' || main.snpType?.title == 'А') {
			rings = `(без ограничительных колец), с металлическим каркасом из ленты ${materials.frame?.title}`
		}

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
			jumper = `, с перемычкой типа ${design.jumper.code}${width}`
		}

		let res = `Спирально-навитая прокладка (СНП) по ${main.snpStandard?.standard.title} типа ${main.snpType?.title} ${rings} и наполнителем из ${materials.filler.designation}, для применения на фланце "${main.flangeTypeTitle}"${flange} с размерами ${sizes}, толщиной ${thickness} мм${mounting}${hole}${jumper}`

		return res
	}

	// const getDesignation = (template: string, params: any[]) => {
	// 	const data: any = {
	// 		main,
	// 		size,
	// 		materials,
	// 	}

	// 	params.forEach(param => {
	// 		if (param.type == 'param') {
	// 			let temp: any = data

	// 			const parts = param.value.split('.')
	// 			for (let i = 0; i < parts.length; i++) {
	// 				const element = parts[i]
	// 				temp = temp[element]
	// 				if (!temp) {
	// 					break
	// 				}
	// 			}

	// 			template = template.replace(param.name, temp)
	// 		}
	// 		if (param.type == 'condition') {
	// 			switch (param.condition) {
	// 				case 'isDefaultMaterial':
	// 					break

	// 				default:
	// 					break
	// 			}
	// 			// дописать
	// 			const value = getDesignation(param.template, param.params)
	// 			template = template.replace(param.name, value)
	// 		}
	// 	})
	// 	return template
	// }

	// const testRenderDesignation = () => {
	// 	const data: any = {
	// 		main,
	// 		size,
	// 		materials,
	// 	}
	// 	const format = [
	// 		'СНП-',
	// 		'main.snpType.code',
	// 		'-',
	// 		'materials.filler.code',
	// 		'-',
	// 		'size.d2',
	// 		'-',
	// 		'size.pn.mpa',
	// 		'-',
	// 		'size.h',
	// 		' ',
	// 		'main.snpStandard.standard.title',
	// 	]
	// 	const res = format.map(f => {
	// 		if (f.includes('.')) {
	// 			let temp: any = data
	// 			let ok = true
	// 			const parts = f.split('.')
	// 			for (let i = 0; i < parts.length; i++) {
	// 				const element = parts[i]
	// 				temp = temp[element]
	// 				if (!temp) {
	// 					ok = false
	// 					break
	// 				}
	// 			}
	// 			if (ok) return temp
	// 			else return ''
	// 		} else return f
	// 	})
	// 	return res.join('')
	// 	const resultTemplate = [
	// 		{ value: 'СНП-' },
	// 		{ value: '${main.snpType?.code}' },
	// 		{ value: '-' },
	// 		{ value: '${materials.filler.code}' },
	// 		{ value: '-' },
	// 		{ value: '${size.d2}' },
	// 		{ value: '-' },
	// 		{ value: '${size.pn.mpa}' },
	// 		{ value: '-' },
	// 		{ value: '${size.h}' },
	// 		{ value: ' ' },
	// 		{ value: '${main.snpStandard?.standard.title}' },
	// 		{ type: 'condition', condition: ['isDefaultMaterial'], value: '(' },
	// 		{
	// 			type: 'condition',
	// 			condition: ['isDefaultMaterial', 'hasInnerRing'],
	// 			value: 'вн. кольцо - ${materials.innerRing.code}',
	// 		},
	// 		{
	// 			type: 'condition',
	// 			condition: ['isDefaultMaterial', 'hasFrame'],
	// 			value: 'каркас - ${materials.frame.code}',
	// 		},
	// 		{
	// 			type: 'condition',
	// 			condition: ['isDefaultMaterial', 'hasOuterRing'],
	// 			value: 'нар. кольцо - ${materials.outerRing.code}',
	// 		},
	// 		{ type: 'condition', condition: ['isDefaultMaterial'], value: ')' },
	// 		// {
	// 		// 	type: 'condition',
	// 		// 	condition: ["isDefaultMaterial"],
	// 		// 	values: [
	// 		// 		'(',
	// 		// 		'вн. кольцо - ${materials.innerRing.code}',
	// 		// 		'каркас - ${materials.frame.code}',
	// 		// 		'нар. кольцо - ${materials.outerRing.code}',
	// 		// 		')',
	// 		// 	],
	// 		// },
	// 	]
	// const resultTemplate = {
	// 	template: 'СНП-@X1-@X2-@X3-@X4-@X5 @X7@X8',
	// 	params: [
	// 		{ name: '@X1', type: 'param', value: 'main.snpType.code' },
	// 		{ name: '@X2', type: 'param', value: 'materials.filler.code' },
	// 		//
	// 		{ name: '@X8', type: 'materials', value: ' (@X1)' },
	// 		// {
	// 		// 	name: '@X8',
	// 		// 	type: 'condition',
	// 		// 	value: '',
	// 		// 	condition: 'isDefaultMaterial',
	// 		// 	template: '(@X1)',
	// 		// 	params: [
	// 		// 		{
	// 		// 			name: '@X1',
	// 		// 			type: 'condition',
	// 		// 			value: '',
	// 		// 			condition: 'hasInnerRing',
	// 		// 			template: 'вн. кольцо - @X1',
	// 		// 			params: [{ name: '@X1', type: 'param', value: 'materials.innerRing.code' }],
	// 		// 		},
	// 		// 		{
	// 		// 			name: '@X1',
	// 		// 			type: 'condition',
	// 		// 			value: '',
	// 		// 			condition: 'hasFrame',
	// 		// 			template: 'каркас - @X1',
	// 		// 			params: [{ name: '@X1', type: 'param', value: 'materials.frame.code' }],
	// 		// 		},
	// 		// 		{
	// 		// 			name: '@X1',
	// 		// 			type: 'condition',
	// 		// 			value: '',
	// 		// 			condition: 'hasOuterRing',
	// 		// 			template: 'нар. кольцо - @X1',
	// 		// 			params: [{ name: '@X1', type: 'param', value: 'materials.outerRing.code' }],
	// 		// 		},
	// 		// 	],
	// 		// },
	// 	],
	// 	materials: {
	// 		separator: ', ',
	// 		params: [
	// 			{ default: null, type: 'innerRing', value: 'code', template: 'вн. кольцо - @X1' },
	// 			{ default: null, type: 'frame', value: 'code', template: 'каркас - @X1' },
	// 			{ default: null, type: 'outerRing', value: 'code', template: 'нар. кольцо - @X1' },
	// 		],
	// 	},
	// }
	// const data: any = {
	// 	main,
	// 	size,
	// 	materials,
	// }
	// let notStandardMaterial_test = false
	// let template = resultTemplate.template
	// resultTemplate.params.forEach(param => {
	// 	if (param.type == 'param') {
	// 		let temp: any = data
	// 		const parts = param.value.split('.')
	// 		for (let i = 0; i < parts.length; i++) {
	// 			const element = parts[i]
	// 			temp = temp[element]
	// 			if (!temp) {
	// 				break
	// 			}
	// 		}
	// 		template = template.replace(param.name, temp)
	// 	}
	// 	if (param.type == 'materials') {
	// 		const conditionIr = Boolean(materials.innerRing) && !materials.innerRing?.isDefault
	// 		const conditionFr = Boolean(materials.frame) && !materials.frame?.isDefault
	// 		const conditionOr = Boolean(materials.outerRing) && !materials.outerRing?.isDefault
	// 		if (conditionIr || conditionFr || conditionOr) {
	// 			notStandardMaterial_test = true
	// 		}

	// 		let value = ''
	// 		if (notStandardMaterial_test) {
	// 			let temp = resultTemplate.materials.params.map(param => {
	// 				if (materials[param.type as 'frame'])
	// 					return param.template.replace(
	// 						'@X1',
	// 						materials[param.type as 'frame']![param.value as 'code']
	// 					)
	// 				else {
	// 					if (param.default) return param.default
	// 				}
	// 			})
	// 			value = param.value.replace('@X1', temp.join(resultTemplate.materials.separator))
	// 		}
	// 		template = template.replace(param.name, value)
	// 	}
	// })
	// let test = getDesignation(resultTemplate.template, resultTemplate.params)
	// console.log(template)
	// }
	// testRenderDesignation()

	// костыль
	// ? сделать не костылем как-то не выходит
	const renderDesignation = () => {
		let designationMaterials = ''
		let designationDesign = ''
		let designationDesignParts: string[] = []

		let notStandardMaterial = false

		const conditionIr = Boolean(materials.innerRing) && !materials.innerRing?.isDefault
		const conditionFr = Boolean(materials.frame) && !materials.frame?.isDefault
		const conditionOr = Boolean(materials.outerRing) && !materials.outerRing?.isDefault

		if (conditionIr || conditionFr || conditionOr) {
			notStandardMaterial = true
		}

		if (design.jumper.hasJumper) {
			designationDesignParts.push(`${design.jumper.code}${design.jumper?.width ? `/${design.jumper.width}` : ''}`)
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

		if (main.snpStandard?.standard.title === 'ОСТ 26.260.454-99') {
			if (notStandardMaterial) {
				let temp = []
				if (materials.innerRing) temp.push(`вн. кольцо - ${materials.innerRing.code}`)
				if (materials.frame) temp.push(`каркас - ${materials.frame.code}`)
				if (materials.outerRing) temp.push(`нар. кольцо - ${materials.outerRing.code}`)

				designationMaterials = ` (${temp.join(', ')}) `
			}

			let thickness: string | number = size.h != 'another' ? size.h : size.another
			if (thickness) thickness = (+thickness.replace(',', '.'))?.toFixed(1)?.replace('.', ',')

			return `СНП-${main.snpType?.code}-${materials.filler.code}-${size.d2}-${size.pn.mpa}-${thickness} ${designationDesign}${main.snpStandard.standard.title}${designationMaterials}`
		}
		if (main.snpStandard?.standard.title === 'ГОСТ Р 52376-2005') {
			let y = ''

			if (Boolean(materials.outerRing) && materials.outerRing?.baseCode === '5') y = '-У'
			if (!(conditionIr || conditionFr) && y) {
				notStandardMaterial = false
			}

			let temp = []
			// if (materials.filler.baseCode != '3' && materials.filler.baseCode != '4')
			// 	temp.push(`наполнитель - ${materials.filler.code}`)

			if (notStandardMaterial) {
				if (materials.innerRing) temp.push(`вн. кольцо - ${materials.innerRing.code}`)
				if (materials.frame) temp.push(`каркас - ${materials.frame.code}`)
				if (materials.outerRing) temp.push(`нар. кольцо - ${materials.outerRing.code}`)
			}

			if (temp.length) designationMaterials = ` (${temp.join(', ')}) `

			return `СНП-${main.snpType?.code}-${size.dn}-${size.pn.kg}${y} ${designationDesign}${main.snpStandard.standard.title}${designationMaterials}`
		}
		if (main.snpStandard?.standard.title === 'ASME B 16.20') {
			let ir = materials.innerRing?.code ? `-I.R. ${materials.innerRing?.code}` : ''
			let fr = `-${materials.frame?.code}/`
			let or = materials.outerRing?.code ? `-O.R. ${materials.outerRing?.code}` : ''

			return `SWG-${size.dn}-${size.pn.mpa}${ir}${fr}${materials.filler.code}${or} ${designationDesign}${main.snpStandard.standard.title}`
		}
		if (main.snpStandard?.standard.title === 'EN 12560-2') {
			let fr = ''

			let ir = materials.innerRing?.code ? `${materials.innerRing?.code}-` : ''
			if (materials.innerRing?.code != materials.frame?.code) fr = `${materials.frame?.code}-`
			let or = materials.outerRing?.code ? `-${materials.outerRing?.code}` : ''

			return `Gasket ${main.snpStandard.standard.title}-${main.snpType?.code}-DN ${size.dnMm}-Class ${size.pn.mpa}-${ir}${fr}${materials.filler.code}${or} ${designationDesign}`
		}
		if (main.snpStandard?.standard.title === 'ГОСТ 28759.9') {
			let temp = []

			if (notStandardMaterial) {
				if (materials.innerRing) temp.push(`вн. кольцо - ${materials.innerRing.code}`)
				if (materials.frame) temp.push(`каркас - ${materials.frame.code}`)
				if (materials.outerRing) temp.push(`нар. кольцо - ${materials.outerRing.code}`)
			}

			if (temp.length) designationMaterials = ` (${temp.join(', ')}) `

			return `СНП-${main.snpType?.code}-${materials.filler.code}-${size.dn}-${size.pn.mpa} ${designationDesign}${main.snpStandard.standard.title}${designationMaterials}`
		}
		if (main.snpStandard?.standard.title === 'EN 1514-2') {
			let fr = ''

			let ir = materials.innerRing?.code ? `${materials.innerRing?.code}-` : ''
			if (materials.innerRing?.code != materials.frame?.code) fr = `${materials.frame?.code}-`
			let or = materials.outerRing?.code ? `-${materials.outerRing?.code}` : ''

			return `Gasket ${main.snpStandard.standard.title}-${main.snpType?.code}-DN ${size.dn}-PN ${size.pn.kg}-${ir}${fr}${materials.filler.code}${or} ${designationDesign}`
		}
		if (main.snpStandard?.standard.title === 'ТУ 3689-010-93978201-2008') {
			let sizes = ''
			if (size?.d4) sizes += size.d4 + 'x'
			sizes += `${size?.d3}x${size?.d2}`
			if (size?.d1) sizes += 'x' + size.d1

			//TODO стоить выводить пред. толщину, а не пустоту
			let thickness = size.h != 'another' ? size.h : size.another
			if (thickness) thickness = (+thickness.replace(',', '.'))?.toFixed(1)?.replace('.', ',')

			//TODO выводить словами материалы (с 09Г2С не очень получается)

			let temp = []

			if (materials.innerRing && !materials.innerRing.isStandard)
				temp.push(`вн. кольцо - ${materials.innerRing.title}`)
			if (materials.frame && !materials.frame.isStandard) temp.push(`каркас - ${materials.frame.title}`)
			if (materials.outerRing && !materials.outerRing.isStandard)
				temp.push(`нар. кольцо - ${materials.outerRing.title}`)

			let notStandardMaterials = ''
			if (temp.length) notStandardMaterials = ` (${temp.join(', ')}) `

			designationMaterials = `-${materials.innerRing?.code || 0}${materials.frame?.code || 0}${
				materials.outerRing?.code || 0
			}`

			return `СНП-${main.snpType?.code}-${materials.filler.code}-${sizes}-${thickness}${designationMaterials} ${designationDesign}${main.snpStandard.standard.title}${notStandardMaterials}`
		}

		return ''
	}

	if (!isReady) return <ResultSkeleton />

	return (
		<ResultContainer>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 2 }} marginBottom={2}>
				<Typography fontWeight='bold'>Описание:</Typography>
				<Typography textAlign='justify'>{renderDescription()}</Typography>
			</Stack>

			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{ xs: 0, sm: 2 }}
				alignItems={{ xs: 'flex-start', sm: 'center' }}
				marginBottom={2}
			>
				<Typography fontWeight='bold'>Обозначение:</Typography>
				<Typography fontSize={'1.12rem'}>{renderDesignation()}</Typography>
			</Stack>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={2}
				alignItems={{ xs: 'flex-start', md: 'center' }}
				justifyContent='space-between'
			>
				{isLoading || isLoadingUpdate ? <Loader background='fill' /> : null}

				<Stack direction={'row'} spacing={2} alignItems='center'>
					<Typography fontWeight='bold'>Количество:</Typography>
					<Input value={amount} onChange={amountHandler} size='small' />
				</Stack>

				{role != 'manager' && (
					<Stack direction={'row'} spacing={2}>
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
					{createError && 'Не удалось добавить позицию. ' + alert.message}
					{updateError && 'Не удалось обновить позицию'}
					{alert.type == 'success' && <>Позиция {cardIndex !== undefined ? 'изменена' : 'добавлена'}</>}
				</Alert>
			</Snackbar>
		</ResultContainer>
	)
}
