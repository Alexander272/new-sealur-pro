import { Alert, Button, IconButton, Snackbar, Typography } from '@mui/material'
import { FC, MouseEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSnp } from '@/store/gaskets/snp'
import { setOrder, toggle } from '@/store/card'
import { useDeletePositionMutation, useGetOrderQuery, useSaveOrderMutation } from '@/store/api/order'
import { Loader } from '@/components/Loader/Loader'
import { CardContainer, CircleButton, Container, Item, Position, Positions } from './card.style'

type Props = {}

const Card: FC<Props> = () => {
	const [alert, setAlert] = useState<{ type: 'success' | 'error'; open: boolean }>({ type: 'success', open: false })

	const open = useAppSelector(state => state.card.open)
	const orderId = useAppSelector(state => state.card.orderId)
	const positions = useAppSelector(state => state.card.positions)
	const snpCardIndex = useAppSelector(state => state.snp.cardIndex)

	const role = useAppSelector(state => state.user.roleCode)

	const { data } = useGetOrderQuery(null, { skip: role == 'manager' })

	const [deletePosition, { error: delError, isLoading: isLoadingDelete }] = useDeletePositionMutation()
	const [save, { error, isLoading }] = useSaveOrderMutation()

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (data) {
			dispatch(setOrder({ id: data.data.id, positions: data.data.positions || [] }))
		}
	}, [data])

	useEffect(() => {
		if (error || delError) setAlert({ type: 'error', open: true })
	}, [error, delError])

	const toggleHandler = () => {
		dispatch(toggle())
	}

	const selectHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index, id } = (event.target as HTMLDivElement).dataset
		if (index === undefined && id === undefined) return

		if (index != undefined) saveHandler(+index)
		if (id) deleteHandler(id)
	}

	const deleteHandler = (id: string) => {
		deletePosition(id)
	}

	const saveHandler = (index: number) => {
		const position = positions[index]
		if (!position.type || position.type === 'Snp') {
			const snp = {
				cardIndex: index,
				amount: position.amount,
				main: position.snpData.main,
				sizes: position.snpData.size,
				materials: position.snpData.material,
				design: position.snpData.design,
			}

			dispatch(setSnp(snp))
		}
	}

	const sendHandler = () => {
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

			{isLoading || isLoadingDelete ? <Loader background='fill' /> : null}

			<CardContainer open={open}>
				{open && (
					<>
						<Typography variant='h5' sx={{ marginBottom: 1 }}>
							Заявка
						</Typography>

						<Positions onClick={selectHandler}>
							{positions.map((p, idx) => (
								<Item key={p.id}>
									<Position data-index={idx} active={snpCardIndex == idx}>
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

						{positions.length ? (
							<Button
								onClick={sendHandler}
								variant='contained'
								sx={{ borderRadius: '12px', marginTop: 'auto' }}
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
