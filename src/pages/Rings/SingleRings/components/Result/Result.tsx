import { ChangeEvent, useEffect, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetMaterialsQuery, useGetModifyingQuery, useGetRingQuery } from '@/store/api/rings'
import { useCreatePositionMutation, useUpdatePositionMutation } from '@/store/api/order'
import { clearRing, setAmount, setDrawing, setInfo } from '@/store/rings/ring'
import { clearActive } from '@/store/card'
import type { Position } from '@/types/card'
import { Image } from '@/pages/Gasket/gasket.style'
import { Loader } from '@/components/Loader/Loader'
import { Input } from '@/components/Input/input.style'
import { IRingConstruction, IRingDensity } from '@/types/rings'

type Alert = { type: 'error' | 'success'; message: string; open: boolean }

export const Result = () => {
	const [image, setImage] = useState('')
	const [alert, setAlert] = useState<Alert>({ type: 'success', message: '', open: false })

	const role = useAppSelector(state => state.user.roleCode)

	const positions = useAppSelector(state => state.card.positions)
	const orderId = useAppSelector(state => state.card.orderId)
	const cardIndex = useAppSelector(state => state.card.activePosition?.index)

	const amount = useAppSelector(state => state.ring.amount)
	const info = useAppSelector(state => state.ring.info)

	const ringType = useAppSelector(state => state.ring.ringType)
	const construction = useAppSelector(state => state.ring.construction)
	const density = useAppSelector(state => state.ring.density)

	const sizes = useAppSelector(state => state.ring.sizes)
	const thickness = useAppSelector(state => state.ring.thickness)

	const material = useAppSelector(state => state.ring.material)
	const modifying = useAppSelector(state => state.ring.modifying)
	const drawing = useAppSelector(state => state.ring.drawing)

	const typeStep = useAppSelector(state => state.ring.typeStep)
	const sizeStep = useAppSelector(state => state.ring.sizeStep)
	const materialStep = useAppSelector(state => state.ring.materialStep)

	const dispatch = useAppDispatch()

	const [create, { error: createError, isLoading }] = useCreatePositionMutation()
	const [update, { error: updateError, isLoading: isLoadingUpdate }] = useUpdatePositionMutation()

	const { data: rings } = useGetRingQuery(null)
	const { data: materials } = useGetMaterialsQuery(ringType?.materialType || '', { skip: !ringType?.materialType })
	const { data: mods } = useGetModifyingQuery(null)

	useEffect(() => {
		//TODO стоит наверное разделить это на 2 части
		if (updateError || createError)
			setAlert({ type: 'error', message: (updateError || (createError as any)).data.message, open: true })
	}, [createError, updateError])

	useEffect(() => {
		if (ringType?.hasRotaryPlug && construction) {
			const c = rings?.data.constructions.constructions[ringType.id].constructions.find(
				c => construction.code == c.code
			)
			setImage(c?.image || '')
		} else {
			setImage(ringType?.image || '')
		}
	}, [ringType, construction])

	if (!ringType?.code)
		return (
			<Box
				width={'100%'}
				maxWidth={850}
				mb={2}
				// ml={'auto'}
				// mr={'auto'}
				padding={'12px 20px'}
				borderRadius={'12px'}
				boxShadow={'0px 0px 4px 0px #2626262b'}
			></Box>
		)

	const savePosition = async () => {
		if (!sizes || !thickness || !material) return

		let title = 'Кольцо '
		title += ringType?.hasRotaryPlug ? construction?.code + '-' : ''
		title += ringType?.code
		title += ringType?.hasDensity ? '-' + density?.code : ''

		title += '-' + sizes
		title += ringType?.hasThickness ? '×' + thickness : ''

		title += '-' + material
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
			type: 'Ring',
			ringData: {
				// typeId: ringType.id,
				// typeCode: ringType.code,
				// densityId: density.id,
				// densityCode: density.code,
				// constructionCode: construction.code,
				// constructionWRP: construction.withoutRotaryPlug || false,
				// constructionBaseCode: construction.baseCode,
				ringType,
				density: density || ({ id: '', code: '' } as IRingDensity),
				construction:
					construction || ({ code: '', baseCode: '', withoutRotaryPlug: false } as IRingConstruction),
				size: sizes,
				thickness: thickness,
				material: material,
				modifying: modifying || '',
				drawing: drawing?.link || '',
			},
		}

		console.log(title)

		try {
			if (cardIndex !== undefined) {
				position.id = positions[cardIndex].id
				position.count = positions[cardIndex].count
				await update(position).unwrap()
				dispatch(clearRing())
				dispatch(clearActive())
			} else {
				await create(position).unwrap()
			}
			dispatch(setDrawing(null))
		} catch (error) {
			return
		}

		setAlert({ type: 'success', message: '', open: true })
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
		dispatch(clearRing())
		dispatch(clearActive())
	}

	const renderDescription = () => {
		let designation = ringType.designation || ''

		if (ringType?.hasRotaryPlug) {
			const c = rings?.data.constructions.constructions[ringType.id].constructions.find(
				c => construction?.code == c.code
			)
			designation = designation.replace('@construction', c?.title || '')
		}

		designation = designation.replace('@density', density?.code || '')
		designation = designation.replace(
			'@sizes',
			`${sizes}${Boolean(thickness) && thickness != '0' ? '×' + thickness : ''}`
		)

		const m = materials?.data.materials.find(m => m.title == material)
		designation = designation.replace('@material', m?.designation || '')

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
			// ml={'auto'}
			// mr={'auto'}
			padding={'12px 20px'}
			borderRadius={'12px'}
			boxShadow={'0px 0px 4px 0px #2626262b'}
		>
			{isLoading || isLoadingUpdate ? <Loader background='fill' /> : null}

			<Stack direction={'row'} spacing={2} mb={2}>
				<Box maxWidth={150} width={'100%'}>
					{ringType?.image && <Image src={image} alt={ringType?.code} />}
				</Box>
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
							disabled={!amount || typeStep.error || sizeStep.error || materialStep.error}
							onClick={savePosition}
							variant='contained'
							sx={{ borderRadius: '12px', padding: '6px 20px' }}
						>
							{cardIndex !== undefined ? 'Изменить в заявке' : 'Добавить  в заявку'}
						</Button>
					</Stack>
				)}
			</Stack>
		</Box>
	)
}
