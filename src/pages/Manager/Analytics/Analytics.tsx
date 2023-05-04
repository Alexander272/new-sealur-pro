import { Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material'
import { BaseInfo, Container, Info } from './analytics.style'
import { Input } from '@/components/Input/input.style'
import { ChangeEvent, useState } from 'react'
import { useGetAnalyticsQuery } from '@/store/api/analytics'
import { Loader } from '@/components/Loader/Loader'

export default function Analytics() {
	const [periodAt, setPeriodAt] = useState(new Date().setDate(1))
	const [periodEnd, setPeriodEnd] = useState(new Date().getTime())

	const { data, isError, isLoading } = useGetAnalyticsQuery({
		periodAt: periodAt.toString(),
		periodEnd: periodEnd.toString(),
	})

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

		const rows = data?.data.orders?.map(o => {
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
			{isLoading && <Loader background='fill' />}

			<Typography variant='h5' marginBottom={2}>
				Поступление заявок с использованием "SealurPro"
			</Typography>

			{isError && (
				<Typography variant='h5' color='error'>
					Не удалось загрузить данные для отчета
				</Typography>
			)}

			{!isError && (
				<>
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
									<TableCell>Пользователей зарегистрировалось (от менеджера)</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.userCountLink}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Пользователей зарегистрировалось (с сайта)</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data ? data?.data.usersCountRegister - data?.data.userCountLink : ''}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Всего пользователей сделало заказ</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.userCount}
									</TableCell>
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

						<Stack
							direction='row'
							spacing={2}
							justifyContent={'center'}
							alignItems='center'
							marginTop={4}
							marginBottom={2}
						>
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

						<Table>
							<TableBody>
								<TableRow>
									{/* //? можно еще выводить компании пользователей которые зарегались */}
									<TableCell>Пользователей зарегистрировалось</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.newUserCount || 0}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Пользователей зарегистрировалось (от менеджера)</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.newUserCountLink || 0}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Пользователей зарегистрировалось (с сайта)</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data ? (data.data.newUserCount || 0) - (data?.data.newUserCountLink || 0) : ''}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</BaseInfo>

					<Info>
						<Typography variant='h5' align='center' marginBottom={2}>
							Заявки
						</Typography>
						{renderInfo()}
					</Info>
				</>
			)}
		</Container>
	)
}
