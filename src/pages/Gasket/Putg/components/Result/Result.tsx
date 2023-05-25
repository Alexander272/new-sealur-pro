import { ChangeEvent, FC, useState } from 'react'
import { ResultContainer } from '@/pages/Gasket/gasket.style'
import { Alert, Button, IconButton, Snackbar, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setAmount } from '@/store/gaskets/putg'
import { toggle } from '@/store/card'
import { Loader } from '@/components/Loader/Loader'
import { Input } from '@/components/Input/input.style'

type Props = {}

type Alert = { type: 'error' | 'success'; message: string; open: boolean }

export const Result: FC<Props> = () => {
	const [alert, setAlert] = useState<Alert>({ type: 'success', message: '', open: false })

	//TODO получать значения из запроса
	const isLoading = false
	const isLoadingUpdate = false
	const createError = ''
	const updateError = ''

	const main = useAppSelector(state => state.putg.main)
	const material = useAppSelector(state => state.putg.material)
	const size = useAppSelector(state => state.putg.size)
	const design = useAppSelector(state => state.putg.design)
	const amount = useAppSelector(state => state.putg.amount)
	const cardIndex = useAppSelector(state => state.putg.cardIndex)

	const hasSizeError = useAppSelector(state => state.putg.hasSizeError)
	const hasDesignError = useAppSelector(state => state.putg.hasDesignError)

	const role = useAppSelector(state => state.user.roleCode)

	const dispatch = useAppDispatch()

	const savePosition = () => {
		// const position: Position = {
		// 	id: Date.now().toString() + (positions.length + 1),
		// 	orderId: orderId,
		// 	count: positions.length > 0 ? positions[positions.length - 1].count + 1 : 1,
		// 	title: renderDesignation(),
		// 	amount: amount,
		// 	type: 'Snp',
		// 	snpData: {
		// 		main: main,
		// 		size: size,
		// 		material: materials,
		// 		design: design,
		// 	},
		// }
		// if (cardIndex !== undefined) {
		// 	position.id = positions[cardIndex].id
		// 	position.count = positions[cardIndex].count
		// 	// dispatch(updatePosition({ index: cardIndex, position: position }))
		// 	update(position)
		// 	dispatch(clearSnp())
		// } else {
		// 	create(position)
		// 	// dispatch(addPosition(position))
		// }
		// setAlert({ type: 'success', message: '', open: true })
	}

	const cancelHandler = () => {
		// dispatch(clearSnp())
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

	const renderDescription = () => {
		let form = ''
		if (main.configuration?.code !== 'round') {
			form = main.configuration?.code == 'oval' ? 'овальной формы ' : 'прямоугольной формы '
		}

		let materials = material.construction?.description || ''
		materials = materials.replace('@rotary_plug', material.rotaryPlug?.title || '')
		materials = materials.replace('@inner_ring', material.innerRing?.title || '')
		materials = materials.replace('@outer_ring', material.outerRing?.title || '')

		let coating = ''
		if (design.hasCoating) coating = ' с элементом для крепления на поверхности'

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

		let removable = ''
		if (design.hasRemovable) removable = ', разъемная'

		let d4 = (size?.d4 || '').replace('.', ',')
		let d3 = size.d3.replace('.', ',')
		let d2 = size.d2.replace('.', ',')
		let d1 = (size?.d1 || '').replace('.', ',')
		let thickness = (+size.h).toFixed(1).replace('.', ',')

		let sizes = `${d4 && d4 + 'x'}${d3}x${d2}${d1 && 'x' + d1}-${thickness}`

		let res = `Прокладка ${form}из ${material.filler?.designation}, ${material.type?.description}, ${materials}, для уплотнения фланцевой поверхности исполнения "${main.flangeType?.title}"${coating}${mounting}${hole}${jumper}${removable}, с размерами ${sizes}`

		return res
	}

	const renderDesignation = () => {
		let dn = size.dn
		let pn = size.pn.mpa
		let h = (+size.h).toFixed(1).replace('.', ',')

		let d4 = (size?.d4 || '').replace('.', ',')
		let d3 = size.d3.replace('.', ',')
		let d2 = size.d2.replace('.', ',')
		let d1 = (size?.d1 || '').replace('.', ',')

		let sizes = `(${d4 && d4 + 'x'}${d3}x${d2}${d1 && 'x' + d1})`

		let designationDesign = ''
		let designationDesignParts: string[] = []

		let coating = ''
		if (design.hasCoating) coating = '/СК'

		if (design.mounting.hasMounting) {
			designationDesignParts.push(design.mounting.code)
		}
		if (design.hasRemovable) {
			designationDesignParts.push('разъемная')
		}
		if (design.hasHole || design.drawing) {
			designationDesignParts.push('черт.')
		}
		if (designationDesignParts.length) {
			designationDesign = `(${designationDesignParts.join(', ')}) `
		}

		let jumper = ''
		if (design.jumper.hasJumper) {
			jumper = `(${design.jumper.code}${design.jumper?.width ? `/${design.jumper.width}` : ''})`
		}

		let removable = ''
		if (design.hasRemovable) removable = ', разъемная'

		return `ПУТГ-${main.flangeType?.code}-${material.type?.code}-${material.construction?.code}-${dn}-${pn}-${h}${coating}${jumper} ${designationDesign}${sizes} ${main.standard?.standard.title}`
	}

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