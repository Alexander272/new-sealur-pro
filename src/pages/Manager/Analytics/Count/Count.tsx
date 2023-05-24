import { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useGetOrdersCountQuery } from '@/store/api/analytics'
import type { IOrderParams } from '@/types/analytics'
import { Loader } from '@/components/Loader/Loader'
import { Container, TableContainer } from './count.style'
import { Question } from '../analytics.style'

export default function OrderCount() {
	const navigate = useNavigate()

	const { data, isError, isLoading } = useGetOrdersCountQuery(null)

	const orderNavigate = (id: string) => () => {
		let state: IOrderParams = { userId: id }
		navigate('/manager/analytics/orders', { state })
	}

	const userNavigate = (userId: string) => (event: MouseEvent<HTMLTableCellElement>) => {
		event.stopPropagation()
		navigate('/manager/analytics/user', { state: userId })
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
						Количество заявок по клиентам
					</Typography>

					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Компания</TableCell>
								<TableCell>Клиент</TableCell>
								<TableCell>Кол-во заявок</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.data.map(o => (
								<TableRow key={o.id} hover onClick={orderNavigate(o.id)} sx={{ cursor: 'pointer' }}>
									<TableCell onClick={userNavigate(o.id)} sx={{ cursor: 'pointer' }}>
										{o.company} <Question>?</Question>
									</TableCell>
									<TableCell>{o.name}</TableCell>
									<TableCell>{o.orderCount}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	)
}
