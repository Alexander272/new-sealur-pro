import { FileDownload } from '@/components/FileInput/FileDownload'
import { useFinishOrderMutation, useGetFullOrderQuery } from '@/store/api/manager'
import { IManagerOrder } from '@/types/order'
import {
	IconButton,
	Menu,
	MenuItem,
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
import Managers from '../Orders/Managers'
import { Container, Icon, OrderList, Row, UserContainer } from './order.style'

export default function Order() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [manager, setManager] = useState<{
		order: IManagerOrder | null
		type: 'order' | 'manager'
		open: boolean
	}>({
		order: null,
		type: 'order',
		open: false,
	})
	const ref = useRef<HTMLAnchorElement | null>(null)

	const params = useParams()
	const location = useLocation()
	const navigate = useNavigate()

	const { data } = useGetFullOrderQuery(params.id || '', { skip: !params.id })

	//TODO обработать ошибку
	const [finish, { error }] = useFinishOrderMutation()

	useEffect(() => {
		if (location.search == '?action=save' && ref.current) ref.current.click()
	}, [])

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
			finish(data?.data.order.id)
			if (!error) navigate('/manager/orders')
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
		// onOpen(data, 'order')
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
		// onOpen(data, 'manager')
	}

	const user = data?.data.user
	const order = data?.data.order

	return (
		<Container>
			<Managers manager={manager} onClose={closeHandler} />

			<Typography variant='h5'>Заявка №{order?.number}</Typography>
			<Row>
				<OrderList>
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
								{order?.positions?.map(p => (
									<TableRow key={p.id}>
										<TableCell>{p.count}</TableCell>
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
