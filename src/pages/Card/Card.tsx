import { Alert, Box, Button, FormControl, IconButton, Snackbar, Stack, Typography } from '@mui/material'
import { ChangeEvent, FC, MouseEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useDebounce } from '@/hooks/debounce'
import { clearSnp, setSnp } from '@/store/gaskets/snp'
import { clearPutg, setPutg } from '@/store/gaskets/putg'
import { clearRing, setRing } from '@/store/rings/ring'
import { clearActive, setActive, setInfo, setOrder, toggle } from '@/store/card'
import {
	useDeletePositionMutation,
	useGetOrderQuery,
	useSaveInfoMutation,
	useSaveOrderMutation,
} from '@/store/api/order'
import { sendMetric } from '@/services/metrics'
import type { IRingData } from '@/types/rings'
import { PutgRoute, RingRoute, RingsKitRoute, SnpRoute } from '@/routes'
import { Loader } from '@/components/Loader/Loader'
import { Input } from '@/components/Input/input.style'
import { Container, Item, Position, Positions } from './card.style'
import { clearKit, setKit } from '@/store/rings/kit'
import { IKitData } from '@/types/ringsKit'

type Props = {}

const Card: FC<Props> = () => {
	const [alert, setAlert] = useState<{ type: 'success' | 'error'; open: boolean }>({ type: 'success', open: false })

	const open = useAppSelector(state => state.card.open)
	const orderId = useAppSelector(state => state.card.orderId)
	const info = useAppSelector(state => state.card.info)
	const positions = useAppSelector(state => state.card.positions)

	const positionId = useAppSelector(state => state.card.activePosition?.id)

	const role = useAppSelector(state => state.user.roleCode)
	const userId = useAppSelector(state => state.user.roleCode)

	const infoChanged = useRef(false)
	const newInfo = useDebounce(info, 1000)

	const { data, isLoading: isLoadingData, isError } = useGetOrderQuery(null, { skip: !userId || role != 'user' })

	const [deletePosition, { error: delError, isLoading: isLoadingDelete }] = useDeletePositionMutation()
	const [save, { error, isLoading }] = useSaveOrderMutation()
	const [saveInfo] = useSaveInfoMutation()

	const dispatch = useAppDispatch()

	const navigate = useNavigate()

	useEffect(() => {
		if (data) {
			dispatch(setOrder({ id: data.data.id, info: data.data.info || '', positions: data.data.positions || [] }))
		}
	}, [data])

	useEffect(() => {
		if (infoChanged.current) {
			saveInfo({ orderId: orderId, info: newInfo })
		}
	}, [orderId, newInfo])

	useEffect(() => {
		if (error || delError) setAlert({ type: 'error', open: true })
	}, [error, delError])

	if (!userId) return null

	const toggleHandler = () => {
		dispatch(toggle())
	}

	const selectHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index, id } = (event.target as HTMLDivElement).dataset
		if (!index && !id) return

		if (index) activeHandler(+index)
		if (id) deleteHandler(id)
	}

	const deleteHandler = (id: string) => {
		deletePosition(id)
		// if (positionId && positionId === id) {
		dispatch(clearActive())

		dispatch(clearSnp())
		dispatch(clearPutg())
		dispatch(clearRing())
		dispatch(clearKit())
		// }
	}

	const activeHandler = (index: number) => {
		const position = positions[index]

		dispatch(setActive({ index, id: position.id, type: position.type }))

		if (position.type === 'Snp') {
			const snp = {
				amount: position.amount,
				info: position.info,
				data: position.snpData,
			}

			dispatch(setSnp(snp))
			navigate(SnpRoute)
		}
		if (position.type === 'Putg') {
			const putg = {
				amount: position.amount,
				info: position.info,
				data: position.putgData,
			}

			dispatch(setPutg(putg))
			navigate(PutgRoute)
		}
		if (position.type === 'Ring') {
			const ring: IRingData = {
				amount: position.amount,
				info: position.info,
				ringData: position.ringData,
			}

			dispatch(setRing(ring))
			navigate(RingRoute)
		}
		if (position.type == 'RingsKit') {
			const kit: IKitData = {
				amount: position.amount,
				info: position.info,
				kitData: position.kitData,
			}

			dispatch(setKit(kit))
			navigate(RingsKitRoute)
		}
	}

	const infoHandler = (event: ChangeEvent<HTMLInputElement>) => {
		infoChanged.current = true
		dispatch(setInfo(event.target.value))
	}

	const sendHandler = async () => {
		// TODO убрать коммент с метрики
		// await sendMetric('reachGoal', 'SendOrder')

		dispatch(clearSnp())
		try {
			await save({ id: orderId, count: positions.length }).unwrap
		} catch (error) {
			return
		}
		setAlert({ type: 'success', open: true })
		infoChanged.current = false
	}

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setAlert({ type: 'success', open: false })
	}

	return (
		<Container open={open}>
			<Snackbar
				open={alert.open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
					{error && 'Не удалось отправить заявку'}
					{delError && 'Не удалось удалить позицию'}
					{alert.type == 'success' && 'Заявка отправлена. Ожидайте ответа менеджера'}
				</Alert>
			</Snackbar>

			<Stack direction={'row'}>
				<Box
					onClick={toggleHandler}
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
					paddingY={1}
					paddingX={0.5}
					borderRadius={'70px 0 0 70px'}
					sx={{ backgroundColor: 'var(--secondary-color)', cursor: 'pointer' }}
				>
					<Typography
						fontSize={'1.4rem'}
						color={'primary'}
						sx={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }}
					>
						➜
					</Typography>
				</Box>
				<Stack
					width={'calc(500px - 27px)'}
					paddingY={1}
					paddingX={2}
					borderTop={'1px solid #f0f0f0'}
					borderBottom={'1px solid #f0f0f0'}
					sx={{ backgroundColor: 'var(--theme-bg-color)' }}
				>
					<Typography variant='h5' sx={{ marginBottom: 1 }}>
						Заявка
					</Typography>

					{isError && (
						<Typography variant='h6' color={'error'}>
							Не удалось загрузить содержание заявки
						</Typography>
					)}

					{isLoadingData || isLoading || isLoadingDelete ? <Loader background='fill' /> : null}

					<Positions onClick={selectHandler}>
						{positions.map((p, idx) => (
							<Item key={p.id}>
								<Position data-index={idx} active={positionId == p.id}>
									<Typography component='span' sx={{ pointerEvents: 'none', fontWeight: 'inherit' }}>
										{idx + 1}. {p.title} - {p.amount} шт.
									</Typography>
								</Position>
								<IconButton
									data-id={p.id}
									sx={{
										lineHeight: '14px',
										position: 'absolute',
										right: '0px',
										top: '50%',
										transform: 'translateY(-50%)',
									}}
								>
									&times;
								</IconButton>
							</Item>
						))}
					</Positions>

					<FormControl sx={{ marginTop: 'auto', marginBottom: '10px' }}>
						<Input
							value={info}
							onChange={infoHandler}
							label='Дополнительная информация'
							size='small'
							multiline
							rows={4}
						/>
					</FormControl>

					<Button
						onClick={sendHandler}
						variant='contained'
						disabled={!positions.length || role != 'user'}
						sx={{ borderRadius: '12px', marginTop: '10px' }}
					>
						Отправить заявку
					</Button>
				</Stack>
			</Stack>
		</Container>
	)
}

export default Card
