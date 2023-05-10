import { Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import type { IOrderParams } from '@/types/analytics'
import { stampToDate } from '@/services/date'
import { useGetAnalyticsOrdersQuery } from '@/store/api/analytics'
import { Loader } from '@/components/Loader/Loader'
import { Container, TableContainer } from './order.style'

export default function Orders() {
	const navigate = useNavigate()
	const location = useLocation()
	const req = location.state as IOrderParams | null

	const { data, isError, isLoading } = useGetAnalyticsOrdersQuery(req)

	const period = req?.periodAt
		? `За период с ${stampToDate(req.periodAt)} по ${stampToDate(req?.periodEnd || 0)}`
		: 'За все время'
	const client = req?.userId ? `по клиенту ` : ''

	const orderNavigate = (id: string) => () => {
		navigate(`/manager/orders/${id}`)
	}

	const renderRows = () => {
		return data?.data?.map(o => {
			let r = []
			let span = o.clients.length + 1

			const clients = o.clients.map(c => {
				let arr = []
				span += c.orders.length
				arr.push(
					<TableRow key={c.id}>
						<TableCell rowSpan={c.orders.length + 1}>{c.company}</TableCell>
						<TableCell rowSpan={c.orders.length + 1}>{c.name}</TableCell>
					</TableRow>
				)

				const orders = c.orders.map(o => (
					<TableRow key={o.id} hover onClick={orderNavigate(o.id)} sx={{ cursor: 'pointer' }}>
						<TableCell>{o.number}</TableCell>
						<TableCell>{stampToDate(+o.date)}</TableCell>
						<TableCell>
							<Chip
								label={o.status == 'new' ? 'Новая' : o.status == 'work' ? 'Просмотрена' : 'Закрыта'}
								color={o.status === 'finish' ? 'success' : 'primary'}
								variant={o.status == 'new' ? 'outlined' : 'filled'}
							/>
						</TableCell>
					</TableRow>
				))

				arr.push(...orders)
				return arr
			})

			r.push(
				<TableRow key={o.id}>
					<TableCell rowSpan={span}>{o.manager}</TableCell>
				</TableRow>
			)
			r.push(...clients)
			return r
		})
	}

	return (
		<Container>
			{isLoading && <Loader background='fill' />}

			{isError && (
				<Typography variant='h5' color='error' align='center'>
					При загрузке данных произошла ошибка
				</Typography>
			)}
			{!isError && (
				<TableContainer>
					<Typography variant='h5' align='center'>
						Заявки {client}
					</Typography>
					<Typography align='center'>{period}</Typography>

					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Менеджер</TableCell>
								<TableCell>Компания</TableCell>
								<TableCell>Клиент</TableCell>
								<TableCell>№ заявки</TableCell>
								<TableCell>Дата</TableCell>
								<TableCell>Статус</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>{renderRows()}</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	)
}
