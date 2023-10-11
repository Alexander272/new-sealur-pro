import { ChangeEvent, useEffect, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetModifyingQuery, useGetRingsKitQuery } from '@/store/api/rings'
import { useCreatePositionMutation, useUpdatePositionMutation } from '@/store/api/order'
import { clearKit, setAmount, setDrawing, setInfo } from '@/store/rings/kit'
import { clearActive, toggle } from '@/store/card'
import type { Position } from '@/types/card'
import { Alert, PositionAlert } from '@/components/PositionAlert/PositionAlert'
import { Loader } from '@/components/Loader/Loader'
import { Image } from '@/pages/Gasket/gasket.style'
import { Input } from '@/components/Input/input.style'

export const Result = () => {
	const [alert, setAlert] = useState<Alert>({ type: 'success', message: '', method: 'create', open: false })

	const role = useAppSelector(state => state.user.roleCode)

	const positions = useAppSelector(state => state.card.positions)
	const orderId = useAppSelector(state => state.card.orderId)
	const cardIndex = useAppSelector(state => state.card.activePosition?.index)

	const amount = useAppSelector(state => state.kit.amount)
	const info = useAppSelector(state => state.kit.info)

	const typeId = useAppSelector(state => state.kit.typeId)
	const type = useAppSelector(state => state.kit.type)
	const construction = useAppSelector(state => state.kit.construction)
	const count = useAppSelector(state => state.kit.count)

	const sizes = useAppSelector(state => state.kit.sizes)
	const thickness = useAppSelector(state => state.kit.thickness)

	const materials = useAppSelector(state => state.kit.materials)
	const modifying = useAppSelector(state => state.kit.modifying)
	const drawing = useAppSelector(state => state.kit.drawing)

	const typeStep = useAppSelector(state => state.kit.typeStep)
	const sizeStep = useAppSelector(state => state.kit.sizeStep)
	const materialStep = useAppSelector(state => state.kit.materialStep)

	const dispatch = useAppDispatch()

	const [create, { error: createError, isLoading }] = useCreatePositionMutation()
	const [update, { error: updateError, isLoading: isLoadingUpdate }] = useUpdatePositionMutation()

	const { data: kit } = useGetRingsKitQuery(null)
	const { data: mods } = useGetModifyingQuery(null)

	useEffect(() => {
		//TODO стоит наверное разделить это на 2 части
		if (updateError || createError)
			setAlert({
				type: 'error',
				message: (updateError || (createError as any)).data.message,
				method: updateError ? 'update' : 'create',
				open: true,
			})
	}, [createError, updateError])

	if (!type)
		return (
			<Box
				width={'100%'}
				maxWidth={850}
				mb={2}
				padding={'12px 20px'}
				borderRadius={'12px'}
				boxShadow={'0px 0px 4px 0px #2626262b'}
			></Box>
		)

	const savePosition = async () => {
		if (!construction || !sizes || !materials) return

		let title = 'Комплект '
		title += type
		title += '-' + construction?.code
		title += '-' + count

		title += '-' + sizes
		title += construction?.hasThickness ? '×' + thickness : ''

		title += '-' + materials
		title += modifying ? '-' + modifying : ''

		title += drawing ? ' (черт.)' : ''
		title += ' ТУ 5728-001-93978201-2008'

		const position: Position = {
			id: Date.now().toString() + (positions.length + 1),
			orderId: orderId,
			count: positions.length > 0 ? positions[positions.length - 1].count + 1 : 1,
			title: title,
			amount: amount,
			info: info,
			type: 'RingsKit',
			kitData: {
				typeId: typeId,
				type: type,
				construction: construction,
				count: count,
				size: sizes,
				thickness: thickness || '',
				material: materials,
				modifying: modifying || '',
				drawing: drawing?.link || '',
			},
		}

		try {
			if (cardIndex !== undefined) {
				position.id = positions[cardIndex].id
				position.count = positions[cardIndex].count
				await update(position).unwrap()
				dispatch(clearKit())
				dispatch(clearActive())
			} else {
				await create(position).unwrap()
			}
			dispatch(setDrawing(null))
		} catch (error) {
			return
		}

		setAlert({ type: 'success', message: '', method: cardIndex !== undefined ? 'update' : 'create', open: true })
	}

	const closeHandler = () => {
		setAlert({ type: 'success', message: '', method: 'create', open: false })
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

	const cancelHandler = () => {
		dispatch(clearKit())
		dispatch(clearActive())
	}

	const renderDescription = () => {
		let designation = kit?.data.ringsKitTypes.find(t => t.code == type)?.title || ''

		designation += ` ${type}-${construction?.code}-${count},`

		designation += sizes ? ` размером ${sizes} мм` : ''
		if (construction?.hasThickness) designation += thickness ? `, высота комплекта ${thickness} мм` : ''

		if (modifying) {
			const m = mods?.data.modifying.find(m => m.code == modifying)
			designation += `, ${m?.designation}`
		}

		return designation
	}

	return (
		<Box
			width={'100%'}
			maxWidth={850}
			mb={2}
			padding={'12px 20px'}
			borderRadius={'12px'}
			boxShadow={'0px 0px 4px 0px #2626262b'}
		>
			{isLoading || isLoadingUpdate ? <Loader background='fill' /> : null}

			<PositionAlert alert={alert} onClose={closeHandler} />

			<Stack direction={'row'} spacing={2} mb={2}>
				{construction?.image && (
					<Box maxWidth={150} width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
						<Image src={construction.image} alt={construction?.code} />
					</Box>
				)}
				<Box>
					<Typography fontWeight={'bold'}>Описание:</Typography>
					<Typography textAlign='justify'>{renderDescription()}</Typography>
				</Box>
			</Stack>

			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{ xs: 0, sm: 2 }}
				alignItems={'center'}
				justifyContent={'space-between'}
				marginBottom={2}
			>
				<Typography fontWeight='bold' sx={{ textWrap: 'nowrap' }}>
					Доп. информация:
				</Typography>
				<Input value={info} onChange={infoHandler} size='small' multiline sx={{ width: '100%' }} />
			</Stack>

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={2}
				alignItems={{ xs: 'flex-start', md: 'center' }}
				justifyContent='space-between'
			>
				<Stack direction={'row'} spacing={2} alignItems='center'>
					<Typography fontWeight='bold'>Количество:</Typography>
					<Input value={amount} onChange={amountHandler} size='small' />
				</Stack>

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
						disabled={!amount || typeStep.error || sizeStep.error || materialStep.error || role != 'user'}
						onClick={savePosition}
						variant='contained'
						sx={{ borderRadius: '12px', padding: '6px 20px' }}
					>
						{cardIndex !== undefined ? 'Изменить в заявке' : 'Добавить  в заявку'}
					</Button>
				</Stack>
			</Stack>
		</Box>
	)
}
