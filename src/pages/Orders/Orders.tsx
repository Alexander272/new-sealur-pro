import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	IconButton,
	Snackbar,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { MouseEvent, useEffect, useState } from 'react'
import { useCopyOrderMutation, useCopyPositionMutation, useGetAllOrdersQuery } from '@/store/api/order'
import { useAppSelector } from '@/hooks/useStore'
import { stampToDate } from '@/services/date'
import { Loader } from '@/components/Loader/Loader'
import { Container } from './order.style'
import { FullPositionTable } from './FullPositionTable'

export default function Orders() {
	const orderId = useAppSelector(state => state.card.orderId)
	const positions = useAppSelector(state => state.card.positions)

	const { data } = useGetAllOrdersQuery(null)

	const [copyPosition, { error, isSuccess, isLoading }] = useCopyPositionMutation()
	const [copyOrder, { error: errorOrder, isSuccess: isSuccessOrder, isLoading: isLoadingOrder }] =
		useCopyOrderMutation()

	// const [open, setOpen] = useState(false)
	// const [order, setOrder] = useState<IFullOrder | null>(null)
	// const [openAlert, setOpen] = useState(false)
	const [alert, setAlert] = useState<{ type: 'error' | 'success'; open: boolean }>({ type: 'success', open: false })

	useEffect(() => {
		if (error || errorOrder) setAlert({ type: 'error', open: true })
	}, [error, errorOrder])
	useEffect(() => {
		if (isSuccess || isSuccessOrder) setAlert({ type: 'success', open: true })
	}, [isSuccess, isSuccessOrder])

	// const handleClickOpen = (order: IFullOrder) => () => {
	// 	// setOpen(true)
	// 	setOrder(order)
	// }
	// const handleClose = () => {
	// 	// setOpen(false)
	// 	setOrder(null)
	// }

	const allCopyHandler = (id: string) => (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		event.stopPropagation()

		copyOrder({
			fromId: id,
			targetId: orderId,
			count: positions.length > 0 ? positions[positions.length - 1].count + 1 : 1,
		})
	}

	//TODO добавить окно для ввода количества
	const copyHandler = (id: string, fromOrderId: string) => {
		copyPosition({
			id,
			orderId,
			fromOrderId,
			count: positions.length > 0 ? positions[positions.length - 1].count + 1 : 1,
			amount: '',
		})
	}

	const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setAlert({ type: 'success', open: false })
	}

	return (
		<Container>
			<Snackbar
				open={alert.open}
				// autoHideDuration={6000}
				onClose={alertClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={alertClose} severity={alert.type} sx={{ width: '100%' }}>
					{alert.type === 'success'
						? (isSuccess && 'Позиция добавлена в заявку') ||
						  (isSuccessOrder && 'Все позиции добавлены в текущую заявку')
						: (error && 'Не удалось добавить позицию. ' + (error as any).data.message) ||
						  (errorOrder &&
								'Во время добавления позиций произошла ошибка. ' + (errorOrder as any).data.message)}
				</Alert>
			</Snackbar>

			{isLoading || isLoadingOrder ? <Loader background='fill' /> : null}

			{data?.data ? (
				data?.data.map((o, i) => (
					<Accordion key={o.id} defaultExpanded={i == 0}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel2a-content'
							id='panel2a-header'
						>
							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Typography variant='h5' align='center'>
									Заявка №{o.number}
								</Typography>
								<Typography align='center' color={'GrayText'}>
									от {stampToDate(+(o.date || 0))}
								</Typography>

								<Tooltip title='Добавить все позиции в текущую заявку'>
									<IconButton onClick={allCopyHandler(o.id)} color='primary'>
										»
									</IconButton>
								</Tooltip>
							</Stack>
						</AccordionSummary>

						<AccordionDetails>
							<FullPositionTable order={o} onCopy={copyHandler} />
						</AccordionDetails>
						{/* <PositionTable order={o} onCopy={copyHandler} /> */}
					</Accordion>
				))
			) : (
				<Typography align='center' variant='h5'>
					Ни одной заявки еще не создано
				</Typography>
			)}

			{/* {data?.data ? (
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
			)} */}

			{/* <Dialog
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
			</Dialog> */}
		</Container>
	)
}

// const Transition = forwardRef(function Transition(
// 	props: TransitionProps & {
// 		children: ReactElement<any, any>
// 	},
// 	ref: React.Ref<unknown>
// ) {
// 	return <Slide direction='up' ref={ref} {...props} />
// })
