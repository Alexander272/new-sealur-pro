import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Alert, Button, IconButton, Snackbar, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { clearPutg, setAmount, setDesignDrawing, setInfo } from '@/store/gaskets/putg'
import { useCreatePositionMutation, useUpdatePositionMutation } from '@/store/api/order'
import type { Position } from '@/types/card'
import { clearActive, toggle } from '@/store/card'
import { Loader } from '@/components/Loader/Loader'
import { Input } from '@/components/Input/input.style'
import { ResultSkeleton } from '@/pages/Gasket/Skeletons/ResultSkeleton'
import { ResultContainer } from '@/pages/Gasket/gasket.style'

type Props = {}

type Alert = { type: 'error' | 'success'; message: string; open: boolean }

export const Result: FC<Props> = () => {
	const [alert, setAlert] = useState<Alert>({ type: 'success', message: '', open: false })

	const isReady = useAppSelector(state => state.putg.isReady)

	const main = useAppSelector(state => state.putg.main)
	const material = useAppSelector(state => state.putg.material)
	const size = useAppSelector(state => state.putg.size)
	const design = useAppSelector(state => state.putg.design)
	const amount = useAppSelector(state => state.putg.amount)
	const info = useAppSelector(state => state.putg.info)

	const hasSizeError = useAppSelector(state => state.putg.hasSizeError)
	const hasDesignError = useAppSelector(state => state.putg.hasDesignError)

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
			info: info,
			type: 'Putg',
			putgData: {
				main: main,
				size: size,
				material: material,
				design: design,
			},
		}

		try {
			if (cardIndex !== undefined) {
				position.id = positions[cardIndex].id
				position.count = positions[cardIndex].count
				await update(position).unwrap()
				dispatch(clearPutg())
				dispatch(clearActive())
			} else {
				await create(position).unwrap()
			}
			dispatch(setDesignDrawing(null))
		} catch (error) {
			return
		}

		setAlert({ type: 'success', message: '', open: true })
	}

	const cancelHandler = () => {
		dispatch(clearPutg())
		dispatch(clearActive())
	}

	const infoHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setInfo(event.target.value))
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

		// let mounting = ''
		// if (design.mounting.hasMounting) mounting = `, с фиксатором ${design.mounting.code}`

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

		let res = `Прокладка ${form}из ${material.filler?.designation}, ${material.putgType?.description}, ${materials}, для уплотнения фланцевой поверхности исполнения "${main.flangeType?.title}"${coating}${hole}${jumper}${removable}, с размерами ${sizes}`

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

		let sizes = `${d4 && d4 + 'x'}${d3}x${d2}${d1 && 'x' + d1}`

		let designationDesign = ''
		let designationDesignParts: string[] = []

		let coating = ''
		if (design.hasCoating) coating = '/СК'

		// if (design.mounting.hasMounting) {
		// 	designationDesignParts.push(design.mounting.code)
		// }
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

		let materials = ''
		if (
			material.construction?.hasRotaryPlug ||
			material.construction?.hasInnerRing ||
			material.construction?.hasOuterRing
		) {
			materials = `-${material.innerRing?.code || '0'}${material.rotaryPlug?.code || '0'}${
				material.outerRing?.code || '0'
			}`
		}

		if (main.configuration?.code == 'round') {
			//* ТУ 5728-006-93978201-2008
			if (main.standard?.standard.id == '42dca821-6189-445c-877c-87ced7ddf556') {
				// != нестандартные фланцы
				if (main.standard.flangeStandard.id != '8815fa92-22c2-4f47-92ab-c6d0fea6bdb7') {
					return `Прокладка ПУТГ-${main.flangeType?.code}-${material.putgType?.code}-${material.construction?.code}-${dn}-${pn}-${h}${coating}${jumper}${materials} ${designationDesign}(${sizes}) ${main.standard?.standard.title}`
				} else {
					return `Прокладка ПУТГ-${main.flangeType?.code}-${material.putgType?.code}-${material.construction?.code}-${sizes}-${h}${coating}${jumper}${materials} ${designationDesign} ${main.standard?.standard.title}`
				}
			} else {
				let standard = ''
				//  = ASME B 16.21 && != ASME B 16.5
				if (
					main.standard?.standard.id == '2f4150f0-9ab7-409a-815e-6bcc60cb5d86' &&
					main.standard.flangeStandard.id != '7d832d51-7645-4394-94dc-261959d9e374'
				) {
					standard = main.standard.flangeStandard.title
				} else {
					standard = main.standard?.standard.title || ''
				}

				return `Прокладка ПУТГ-${main.flangeType?.code}-${material.putgType?.code}-${material.construction?.code}-${dn}-${pn}-${h}${coating}${jumper}${materials} ${designationDesign}(${sizes}, ${standard}) ТУ 5728-006-93978201-2008`
			}
			// //* ГОСТ 15180-86
			// if (main.standard?.standard.id == '79ef2110-5c48-4b43-be3e-816be1459fb7') {
			// 	return ``
			// }
			// //* ГОСТ 28759.6-2022
			// if (main.standard?.standard.id == 'f7ae1f5e-4dee-45d8-952c-3ab46d235002') {
			// 	return ``
			// }
			// //* ASME B 16.21
			// if (main.standard?.standard.id == '2f4150f0-9ab7-409a-815e-6bcc60cb5d86') {
			// 	return ``
			// }
			// //* DIN 2690
			// if (main.standard?.standard.id == '892b44dd-3afe-4bad-a07e-28123204ed66') {
			// 	return ``
			// }
			// //* EN 1514-1
			// if (main.standard?.standard.id == '6acf5aa4-41a5-4ecf-a576-09ec89ef885f') {
			// 	return ``
			// }
		}
		const form = main.configuration?.code == 'oval' ? 'О' : 'П'

		designationDesignParts.unshift(form)
		if (designationDesignParts.length) {
			designationDesign = `(${designationDesignParts.join(', ')}) `
		}

		return `ПУТГ-${main.flangeType?.code}-${material.putgType?.code}-${material.construction?.code}-${sizes}-${h}${coating}${jumper}${materials} ${designationDesign} ТУ 5728-006-93978201-2008`
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
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{ xs: 0, sm: 2 }}
				alignItems={{ xs: 'flex-start', sm: 'center' }}
				marginBottom={2}
			>
				<Typography fontWeight='bold'>Доп. информация:</Typography>
				<Input
					value={info}
					onChange={infoHandler}
					size='small'
					multiline
					sx={{ width: '100%', maxWidth: '500px' }}
				/>
			</Stack>

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={2}
				alignItems={{ md: 'center' }}
				justifyContent='space-between'
			>
				{isLoading || isLoadingUpdate ? <Loader background='fill' /> : null}

				<Stack direction={'row'} spacing={2} alignItems='center'>
					<Typography fontWeight='bold'>Количество:</Typography>
					<Input name='amount' value={amount} onChange={amountHandler} fullWidth size='small' />
				</Stack>

				{role == 'user' && (
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
							fullWidth
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
					{alert.type == 'error' && createError ? 'Не удалось добавить позицию. ' + alert.message : null}
					{alert.type == 'error' && updateError ? 'Не удалось обновить позицию' : null}
					{alert.type == 'success' && <>Позиция {cardIndex !== undefined ? 'изменена' : 'добавлена'}</>}
				</Alert>
			</Snackbar>
		</ResultContainer>
	)
}
