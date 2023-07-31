import { ChangeEvent, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useGetLastOrdersQuery, useGetOrderByNumberQuery } from '@/store/api/analytics'
import { useDebounce } from '@/hooks/debounce'
import { Loader } from '@/components/Loader/Loader'
import { Container, TableContainer } from './order.style'
import { stampToDate } from '@/services/date'

export default function LastOrders() {
	const [number, setNumber] = useState('')
	const search = useDebounce(number, 500)

	const { data: last, isError: isErrorLast, isLoading: isLoadingLast } = useGetLastOrdersQuery(null)
	const { data, isError, isLoading } = useGetOrderByNumberQuery(search, { skip: !search })

	const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setNumber(event.target.value)
	}

	const renderRows = () => {
		const rows: JSX.Element[] = []

		if (data?.data) {
			const o = data.data

			rows.push(
				<TableRow key={o.id}>
					<TableCell>{o.manager}</TableCell>
					<TableCell>{o.clients[0].company}</TableCell>
					<TableCell>{o.clients[0].name}</TableCell>
					<TableCell>{o.clients[0].orders[0].number}</TableCell>
					<TableCell>{stampToDate(+o.clients[0].orders[0].date)}</TableCell>
				</TableRow>
			)
		} else {
			last?.data?.orders.forEach(o => {
				o.clients.forEach(c => {
					const temp = c.orders.map(or => {
						return (
							<TableRow key={or.id}>
								<TableCell>{o.manager}</TableCell>
								<TableCell>{c.company}</TableCell>
								<TableCell>{c.name}</TableCell>
								<TableCell>{or.number}</TableCell>
								<TableCell>{stampToDate(+or.date)}</TableCell>
							</TableRow>
						)
					})
					rows.push(...temp)
				})
			})
		}

		return rows
	}

	return (
		<Container>
			{isLoadingLast || isLoading ? <Loader background='fill' /> : null}

			{isErrorLast || isError ? (
				<Typography variant='h5' color='error' align='center'>
					При загрузке данных произошла ошибка
				</Typography>
			) : null}

			<TextField
				value={number}
				onChange={searchHandler}
				size='small'
				fullWidth
				sx={{ maxWidth: '700px' }}
				placeholder='№ заявки'
			/>

			{!isErrorLast && !isError && (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Менеджер</TableCell>
								<TableCell>Компания</TableCell>
								<TableCell>Клиент</TableCell>
								<TableCell>№ заявки</TableCell>
								<TableCell>Дата</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>{renderRows()}</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	)
}
