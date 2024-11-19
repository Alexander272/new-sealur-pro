import { MouseEvent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import type { IOrderParams, IUserParams } from '@/types/analytics'
import { useGetAnalyticUsersQuery } from '@/store/api/analytics'
import { stampToDate } from '@/services/date'
import { Loader } from '@/components/Loader/Loader'
import { Container, TableContainer } from './user.style'
import { Question } from '../analytics.style'
import { PathRoutes } from '@/constants/routes'

export default function Users() {
	const navigate = useNavigate()
	const location = useLocation()
	const req = location.state as IUserParams | null

	const { data, isError, isLoading } = useGetAnalyticUsersQuery(req)

	const period = req?.periodAt
		? `За период с ${stampToDate(req.periodAt)} по ${stampToDate(req?.periodEnd || 0)}`
		: 'За все время'
	const from = req?.useLink != undefined ? (req?.useLink ? '(от менеджеров)' : '(с сайта)') : ''

	const navigateOrder = (req?: IOrderParams) => () => {
		navigate(PathRoutes.Manager.Analytics.Orders, { state: req })
	}

	const navigateUser = (userId: string) => (event: MouseEvent<HTMLTableCellElement>) => {
		event.stopPropagation()
		navigate(PathRoutes.Manager.Analytics.User, { state: userId })
	}

	const renderRows = () => {
		return data?.data?.map(o => {
			let r = []
			r.push(
				<TableRow key={o.id}>
					<TableCell rowSpan={(o.users || []).length + 1}>{o.manager}</TableCell>
				</TableRow>
			)

			const clients = (o.users || []).map(c => {
				return (
					<TableRow key={c.id} hover onClick={navigateOrder({ userId: c.id })} sx={{ cursor: 'pointer' }}>
						<TableCell onClick={navigateUser(c.id)}>
							{c.company} <Question>?</Question>
						</TableCell>
						<TableCell>{c.name}</TableCell>
						<TableCell align='center'>{c.ordersCount || 0}</TableCell>
						{from == '' && <TableCell>{c.useLink ? 'Да' : 'Нет'}</TableCell>}
					</TableRow>
				)
			})

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
						Пользователи {req?.hasOrders && 'которые сделали заказ'}
					</Typography>
					<Typography align='center'>
						{period} {from}
					</Typography>

					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Менеджер</TableCell>
								<TableCell>Компания</TableCell>
								<TableCell>Клиент</TableCell>
								<TableCell>Кол-во заявок</TableCell>
								{from == '' && <TableCell>От менеджера</TableCell>}
							</TableRow>
						</TableHead>
						<TableBody>{renderRows()}</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	)
}
