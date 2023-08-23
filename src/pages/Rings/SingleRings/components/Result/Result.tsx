import { ChangeEvent, useEffect, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetMaterialsQuery, useGetModifyingQuery, useGetRingQuery } from '@/store/api/rings'
import { setAmount, setInfo } from '@/store/rings/ring'
import { Image } from '@/pages/Gasket/gasket.style'
import { Input } from '@/components/Input/input.style'

export const Result = () => {
	const [image, setImage] = useState('')

	const role = useAppSelector(state => state.user.roleCode)

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

	const dispatch = useAppDispatch()

	const { data: rings } = useGetRingQuery(null)
	const { data: materials } = useGetMaterialsQuery(ringType?.materialType || '', { skip: !ringType?.materialType })
	const { data: mods } = useGetModifyingQuery(null)

	useEffect(() => {
		if (ringType?.hasRotaryPlug && construction) {
			const c = rings?.data.constructions.constructions[ringType.id].constructions.find(
				c => construction == c.code
			)
			setImage(c?.image || '')
		} else {
			setImage(ringType?.image || '')
		}
	}, [ringType, construction])

	if (!ringType?.code) return null

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

	const renderDescription = () => {
		let designation = ringType.designation || ''

		if (ringType?.hasRotaryPlug) {
			const c = rings?.data.constructions.constructions[ringType.id].constructions.find(
				c => construction == c.code
			)
			designation = designation.replace('@construction', c?.title || '')
		}

		designation = designation.replace('@density', density?.code || '')
		designation = designation.replace('@sizes', `${sizes}${thickness != '0' ? '×' + thickness : ''}`)

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
			ml={'auto'}
			mr={'auto'}
			padding={'12px 20px'}
			borderRadius={'12px'}
			boxShadow={'0px 0px 4px 0px #2626262b'}
		>
			<Stack direction={'row'} spacing={2}>
				<Box maxWidth={150}>{ringType?.image && <Image src={image} alt={ringType?.code} />}</Box>
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
				<Typography fontWeight='bold'>Доп. информация:</Typography>
				<Input
					value={info}
					// onChange={infoHandler}
					size='small'
					multiline
					sx={{ width: '100%', maxWidth: '600px' }}
				/>
			</Stack>

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={2}
				alignItems={{ xs: 'flex-start', md: 'center' }}
				justifyContent='space-between'
			>
				{/* {isLoading || isLoadingUpdate ? <Loader background='fill' /> : null} */}

				<Stack direction={'row'} spacing={2} alignItems='center'>
					<Typography fontWeight='bold'>Количество:</Typography>
					<Input value={amount} onChange={amountHandler} size='small' />
				</Stack>

				{role == 'user' && (
					<Stack direction={'row'} spacing={2}>
						{cardIndex !== undefined && (
							<Button
								// onClick={cancelHandler}
								variant='outlined'
								color='secondary'
								sx={{ borderRadius: '12px', padding: '6px 20px' }}
							>
								Отменить
							</Button>
						)}

						<Button
							// disabled={!amount || hasSizeError || hasDesignError}
							// onClick={savePosition}
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
