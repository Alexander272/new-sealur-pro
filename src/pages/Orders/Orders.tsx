import {
	Alert,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Slide,
	Snackbar,
	Tooltip,
	Typography,
} from '@mui/material'
import { forwardRef, ReactElement, useEffect, useState } from 'react'
import { useCopyOrderMutation, useCopyPositionMutation, useGetAllOrdersQuery } from '@/store/api/order'
import { stampToDate } from '@/services/date'
import { PositionTable } from './PositionTable'
import { Container, OrderItem } from './order.style'
import { IFullOrder } from '@/types/order'
import { TransitionProps } from '@mui/material/transitions'
import { FullPositionTable } from './FullPositionTable'
import { useAppSelector } from '@/hooks/useStore'

export default function Orders() {
	const orderId = useAppSelector(state => state.card.orderId)
	const positions = useAppSelector(state => state.card.positions)

	const { data } = useGetAllOrdersQuery(null)

	const [copyPosition, { error }] = useCopyPositionMutation()
	const [copyOrder, { error: errorOrder }] = useCopyOrderMutation()

	// const [open, setOpen] = useState(false)
	const [order, setOrder] = useState<IFullOrder | null>(null)
	const [openAlert, setOpen] = useState(false)

	useEffect(() => {
		if (error || errorOrder) setOpen(true)
	}, [error, errorOrder])

	const handleClickOpen = (order: IFullOrder) => () => {
		// setOpen(true)
		setOrder(order)
	}
	const handleClose = () => {
		// setOpen(false)
		setOrder(null)
	}

	const allCopyHandler = (id: string) => () => {
		copyOrder({
			fromId: id,
			targetId: orderId,
			count: positions.length + 1,
		})
	}

	//TODO добавить окно для ввода количества
	const copyHandler = (id: string, fromOrderId: string) => {
		copyPosition({
			id,
			orderId,
			fromOrderId,
			count: positions.length + 1,
			amount: '',
		})
	}

	const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setOpen(false)
	}

	return (
		<Container>
			<Snackbar
				open={openAlert}
				autoHideDuration={6000}
				onClose={alertClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={alertClose} severity={'error'} sx={{ width: '100%' }}>
					{error && 'Не удалось добавить позицию'}
					{errorOrder && 'Во время добавления позиций произошла ошибка'}
				</Alert>
			</Snackbar>

			{data?.data ? (
				data?.data.map(o => (
					<OrderItem key={o.id}>
						<Typography variant='h5' align='center'>
							Заявка №{o.number}
						</Typography>
						<Typography align='center' color={'GrayText'}>
							от {stampToDate(+(o.date || 0))}
						</Typography>

						<Tooltip title='Добавить все позиции в текущую заявку'>
							<IconButton
								onClick={allCopyHandler(o.id)}
								color='primary'
								sx={{ position: 'absolute', height: '36px', top: '6px', right: '29px' }}
							>
								»
							</IconButton>
						</Tooltip>

						<PositionTable order={o} onCopy={copyHandler} />

						<Button
							onClick={handleClickOpen(o)}
							fullWidth
							endIcon={<>»</>}
							sx={{ marginTop: 'auto', borderRadius: '16px' }}
						>
							Подробнее
						</Button>
					</OrderItem>
				))
			) : (
				<Typography align='center' variant='h5'>
					Ни одной заявки еще не создано
				</Typography>
			)}
			<Dialog
				open={Boolean(order)}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby='alert-dialog-slide-description'
			>
				<DialogTitle align='center'>
					Заявка №{order?.number}{' '}
					<Typography align='center' color={'GrayText'}>
						от {stampToDate(+(order?.date || 0))}
					</Typography>
					{order && (
						<Tooltip title='Добавить все позиции в текущую заявку'>
							<IconButton
								onClick={allCopyHandler(order.id)}
								color='primary'
								sx={{ position: 'absolute', height: '36px', top: '22px', right: '37px' }}
							>
								»
							</IconButton>
						</Tooltip>
					)}
				</DialogTitle>
				<DialogContent>
					<FullPositionTable order={order} onCopy={copyHandler} />
				</DialogContent>
			</Dialog>
		</Container>
	)
}

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement<any, any>
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />
})
