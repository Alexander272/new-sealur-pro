import { Alert, Button, FormControl, IconButton, Snackbar, Typography } from '@mui/material'
import { ChangeEvent, FC, MouseEvent, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { clearSnp, setSnp } from '@/store/gaskets/snp'
import { setInfo, setOrder, toggle } from '@/store/card'
import {
	useDeletePositionMutation,
	useGetOrderQuery,
	useSaveInfoMutation,
	useSaveOrderMutation,
} from '@/store/api/order'
import { Loader } from '@/components/Loader/Loader'
import { CardContainer, CircleButton, Container, Item, Position, Positions } from './card.style'
import { sendMetric } from '@/services/metrics'
import { Input } from '@/components/Input/input.style'
import { useDebounce } from '@/hooks/debounce'

type Props = {}

const Card: FC<Props> = () => {
	const [alert, setAlert] = useState<{ type: 'success' | 'error'; open: boolean }>({ type: 'success', open: false })

	const open = useAppSelector(state => state.card.open)
	const orderId = useAppSelector(state => state.card.orderId)
	const info = useAppSelector(state => state.card.info)
	const positions = useAppSelector(state => state.card.positions)
	// const snpCardIndex = useAppSelector(state => state.snp.cardIndex)
	const positionId = useAppSelector(state => state.snp.positionId)

	const role = useAppSelector(state => state.user.roleCode)
	const userId = useAppSelector(state => state.user.roleCode)

	const infoChanged = useRef(false)
	const newInfo = useDebounce(info, 1000)

	const { data, isLoading: isLoadingData, isError } = useGetOrderQuery(null, { skip: !userId || role != 'user' })

	const [deletePosition, { error: delError, isLoading: isLoadingDelete }] = useDeletePositionMutation()
	const [save, { error, isLoading }] = useSaveOrderMutation()
	const [saveInfo] = useSaveInfoMutation()

	const dispatch = useAppDispatch()

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

		if (index) saveHandler(+index)
		if (id) deleteHandler(id)
	}

	const deleteHandler = (id: string) => {
		deletePosition(id)
		// if (positionId && positionId === id) {
		dispatch(clearSnp())
		// }
	}

	const saveHandler = (index: number) => {
		const position = positions[index]
		if (!position.type || position.type === 'Snp') {
			const snp = {
				cardIndex: index,
				positionId: position.id,
				amount: position.amount,
				main: position.snpData.main,
				sizes: position.snpData.size,
				materials: position.snpData.material,
				design: position.snpData.design,
			}

			dispatch(setSnp(snp))
		}
	}

	const infoHandler = (event: ChangeEvent<HTMLInputElement>) => {
		infoChanged.current = true
		dispatch(setInfo(event.target.value))
	}

	const sendHandler = () => {
		// TODO убрать коммент с метрики
		// sendMetric('reachGoal', 'SendOrder')

		dispatch(clearSnp())
		save({ id: orderId, count: positions.length })
		setAlert({ type: 'success', open: true })
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

			<CardContainer open={open}>
				{open && (
					<>
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
										<Typography
											component='span'
											sx={{ pointerEvents: 'none', fontWeight: 'inherit' }}
										>
											{idx + 1}.
										</Typography>{' '}
										<Typography
											component='span'
											sx={{ pointerEvents: 'none', fontWeight: 'inherit' }}
										>
											{p.title}
										</Typography>{' '}
										-{' '}
										<Typography
											component='span'
											sx={{ pointerEvents: 'none', fontWeight: 'inherit' }}
										>
											{p.amount} шт.
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

						<CircleButton onClick={toggleHandler} open={open}>
							{/* ➔ */}➜
						</CircleButton>

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

						{positions.length ? (
							<Button
								onClick={sendHandler}
								variant='contained'
								sx={{ borderRadius: '12px', marginTop: '10px' }}
							>
								Отправить заявку
							</Button>
						) : null}
					</>
				)}
			</CardContainer>

			{!open && (
				<CircleButton onClick={toggleHandler} open={open}>
					➔
				</CircleButton>
			)}
		</Container>
	)
}

export default Card
