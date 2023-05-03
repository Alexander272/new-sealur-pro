import { Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material'
import { BaseInfo, Container, Info, Period } from './analytics.style'
import { Input } from '@/components/Input/input.style'
import { ChangeEvent, useState } from 'react'

interface IAnalytics {
	ordersCount: number
	usersCountRegister: number
	usersCount: number
	snpPositionCount: number
	orders: {
		id: string
		manager: string
		clients: {
			id: string
			name: string
			ordersCount: number
			snpPositionCount: number
		}[]
	}[]
}

const data: { data: IAnalytics } = {
	data: {
		ordersCount: 39,
		usersCount: 10,
		usersCountRegister: 12,
		snpPositionCount: 50,

		orders: [
			{
				id: '1',
				manager: 'Test',
				clients: [
					{
						id: '11',
						name: 'user1',
						ordersCount: 3,
						snpPositionCount: 10,
					},
					{
						id: '12',
						name: 'user2',
						ordersCount: 3,
						snpPositionCount: 10,
					},
					{
						id: '13',
						name: 'user3',
						ordersCount: 3,
						snpPositionCount: 10,
					},
				],
			},
			{
				id: '2',
				manager: 'Test2',
				clients: [
					{
						id: '21',
						name: 'user1',
						ordersCount: 3,
						snpPositionCount: 10,
					},
					{
						id: '22',
						name: 'user2',
						ordersCount: 3,
						snpPositionCount: 10,
					},
					{
						id: '23',
						name: 'user3',
						ordersCount: 3,
						snpPositionCount: 10,
					},
				],
			},
		],
	},
}

export default function Analytics() {
	const [periodAt, setPeriodAt] = useState(new Date().setDate(1))
	const [periodEnd, setPeriodEnd] = useState(new Date().getTime())

	const periodAtHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setPeriodAt(event.target.valueAsNumber)
	}
	const periodEndHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setPeriodEnd(event.target.valueAsNumber)
	}

	const renderInfo = () => {
		let ordersCount = 0
		let usersCount = 0
		let snpPositionCount = 0

		const rows = data?.data.orders.map(o => {
			let r = []
			r.push(
				<TableRow key={o.id}>
					<TableCell rowSpan={o.clients.length + 1}>{o.manager}</TableCell>
					{/* <TableCell />
					<TableCell />
					<TableCell /> */}
				</TableRow>
			)

			const clients = o.clients.map(c => {
				usersCount += 1
				ordersCount += c.ordersCount
				snpPositionCount += c.snpPositionCount

				return (
					<TableRow key={c.id}>
						{/* <TableCell /> */}
						<TableCell>{c.name}</TableCell>
						<TableCell align='center'>{c.ordersCount}</TableCell>
						<TableCell align='center'>{c.snpPositionCount}</TableCell>
					</TableRow>
				)
			})

			r.push(...clients)

			return r
		})

		return (
			<Table>
				<TableHead>
					<TableRow>
						<TableCell align='center' sx={{ fontWeight: 'bold' }}>
							Менеджер
						</TableCell>
						<TableCell align='center' sx={{ fontWeight: 'bold' }}>
							Клиент
						</TableCell>
						<TableCell align='center' sx={{ fontWeight: 'bold' }}>
							Кол-во заявок
						</TableCell>
						<TableCell align='center' sx={{ fontWeight: 'bold' }}>
							Кол-во снп
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{rows}</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell rowSpan={2}>Всего</TableCell>
						<TableCell align='center'>{usersCount}</TableCell>
						<TableCell align='center'>{ordersCount}</TableCell>
						<TableCell align='center'>{snpPositionCount}</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		)
	}

	return (
		<Container>
			<Typography variant='h6'>Поступление заявок с использованием "SealurPro"</Typography>

			<BaseInfo>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>Всего пользователей зарегистрировалось</TableCell>
							<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
								{data?.data.usersCountRegister}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Всего пользователей сделало заказ</TableCell>
							<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>{data?.data.usersCount}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Всего заявок</TableCell>
							<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
								{data?.data.ordersCount}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Всего снп заказано</TableCell>
							<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
								{data?.data.snpPositionCount}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</BaseInfo>

			<Stack direction='row' spacing={2} alignItems='center'>
				<Typography>За период с</Typography>
				<Input
					type='date'
					value={new Date(periodAt).toISOString().substring(0, 10)}
					onChange={periodAtHandler}
					size='small'
				/>
				<Typography>по</Typography>
				<Input
					type='date'
					value={new Date(periodEnd).toISOString().substring(0, 10)}
					onChange={periodEndHandler}
					size='small'
				/>
			</Stack>

			<Info>{renderInfo()}</Info>
		</Container>
	)
}
