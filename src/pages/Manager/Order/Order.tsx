import { FileDownload } from '@/components/FileInput/FileDownload'
import { useFinishOrderMutation, useGetFullOrderQuery } from '@/store/api/manager'
import { IManagerOrder } from '@/types/order'
import {
	Alert,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Snackbar,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Loader } from '@/components/Loader/Loader'
import Managers from '../Orders/Managers'
import { Container, Icon, OrderList, Row, UserContainer } from './order.style'

type Alert = { type: 'success' | 'error'; message: string; open: boolean }
type Manager = { order: IManagerOrder | null; type: 'order' | 'manager'; open: boolean }

export default function Order() {
	const [alert, setAlert] = useState<Alert>({ type: 'error', message: '', open: false })
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [manager, setManager] = useState<Manager>({ order: null, type: 'order', open: false })
	const ref = useRef<HTMLAnchorElement | null>(null)

	const params = useParams()
	const location = useLocation()
	const navigate = useNavigate()

	const {
		data,
		isError: isErrorGetOrder,
		error: errorGetOrder,
	} = useGetFullOrderQuery(params.id || '', { skip: !params.id })

	const [finish, { error, isSuccess, isLoading }] = useFinishOrderMutation()

	useEffect(() => {
		if (location.search == '?action=save' && ref.current) ref.current.click()
	}, [])

	useEffect(() => {
		if (error) {
			setAlert({
				type: 'error',
				message: 'Не удалось закрыть заявку. ' + (error as any).data.message,
				open: true,
			})
		}
		if (isSuccess) setAlert({ type: 'success', message: '', open: false })
	}, [error, isSuccess])

	useEffect(() => {
		if (alert.type === 'success') navigate('/manager/orders')
	}, [alert])

	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const finishHandler = () => {
		handleClose()
		if (data) {
			finish(data.data.order.id)
		}
	}

	const openHandler = (order: IManagerOrder, type: 'order' | 'manager') => {
		setManager({ order, type, open: true })
	}
	const closeHandler = () => {
		setManager({ order: null, type: 'order', open: false })
	}

	const orderHandler = () => {
		if (!data) return

		handleClose()
		const order: IManagerOrder = {
			id: data.data.order.id,
			date: data.data.order.date || '',
			countPosition: data.data.order.countPosition || 0,
			number: data.data.order.number || 0,
			status: 'work',
			userId: data.data.user.id,
			company: data.data.user.company,
		}
		openHandler(order, 'order')
	}

	const clientHandler = () => {
		if (!data) return

		handleClose()
		const order: IManagerOrder = {
			id: data.data.order.id,
			date: data.data.order.date || '',
			countPosition: data.data.order.countPosition || 0,
			number: data.data.order.number || 0,
			status: 'work',
			userId: data.data.user.id,
			company: data.data.user.company,
		}
		openHandler(order, 'manager')
	}

	const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setAlert({ type: 'success', message: 'Заявка закрыта.', open: false })
	}
	const changeAlert = (alert: Alert) => setAlert(alert)

	const user = data?.data.user
	const order = data?.data.order

	if (isErrorGetOrder)
		return (
			<Container>
				<Typography color={'error'}>
					Не удалось получить данные о заявке. {(errorGetOrder as any).data.message}
				</Typography>
			</Container>
		)

	return (
		<Container>
			<Snackbar open={alert.open} onClose={alertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
				<Alert onClose={alertClose} severity={alert.type} sx={{ width: '100%' }}>
					{/* {error && 'Не удалось закрыть заявку. ' + (error as any).data.message} */}
					{/* {alert.type == 'success' && 'Заявка закрыта.'} */}
					{alert.type == 'error' && alert.message}
					{/* {alert.type == 'success' && alert.message} */}
				</Alert>
			</Snackbar>
			{isLoading ? <Loader background='fill' /> : null}

			<Managers manager={manager} onClose={closeHandler} setAlert={changeAlert} />

			<Typography variant='h5'>Заявка №{order?.number}</Typography>
			<Row>
				<OrderList>
					{order?.info && (
						<>
							<Typography variant='h6' align='center'>
								Дополнительная информация
							</Typography>
							<Typography marginBottom={2}>{order.info}</Typography>
						</>
					)}

					<TableContainer sx={{ maxHeight: 470 }}>
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell>№</TableCell>
									<TableCell>Наименование</TableCell>
									<TableCell>Количество</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{order?.positions?.map((p, idx) => (
									<TableRow key={p.id}>
										<TableCell>{idx + 1}</TableCell>
										<TableCell>{p.title}</TableCell>
										<TableCell align='center'>{p.amount}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</OrderList>

				<UserContainer>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>Компания</TableCell>
								<TableCell>{user?.company}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Юр. адрес</TableCell>
								<TableCell>{user?.address}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>ИНН</TableCell>
								<TableCell>{user?.inn}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>КПП</TableCell>
								<TableCell>{user?.kpp}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>ФИО</TableCell>
								<TableCell>{user?.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Должность</TableCell>
								<TableCell>{user?.position}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Email</TableCell>
								<TableCell>{user?.email}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Телефон</TableCell>
								<TableCell>{user?.phone}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</UserContainer>
			</Row>

			<Stack direction={'row'} spacing={2} alignItems='center'>
				<FileDownload ref={ref} text='Скачать' link={`/api/v1/sealur-pro/orders/${params.id}/заявка.zip`} />

				<IconButton
					aria-label='more'
					id='long-button'
					aria-controls={open ? 'long-menu' : undefined}
					aria-expanded={open ? 'true' : undefined}
					aria-haspopup='true'
					onClick={handleClick}
				>
					<Icon height={16} width={16} src='/image/dots.svg' />
				</IconButton>
				<Menu
					id='long-menu'
					MenuListProps={{
						'aria-labelledby': 'long-button',
					}}
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
				>
					<MenuItem selected={false} onClick={finishHandler}>
						Заявка выполнена
					</MenuItem>
					<MenuItem selected={false} onClick={orderHandler}>
						Передать заявку
					</MenuItem>
					<MenuItem selected={false} onClick={clientHandler}>
						Передать клиента
					</MenuItem>
				</Menu>
			</Stack>

			{/* //TODO Order */}
		</Container>
	)
}
