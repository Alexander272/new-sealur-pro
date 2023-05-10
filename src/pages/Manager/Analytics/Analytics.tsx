import { Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetAnalyticsQuery } from '@/store/api/analytics'
import type { IOrderParams, IUserParams } from '@/types/analytics'
import { Input } from '@/components/Input/input.style'
import { Loader } from '@/components/Loader/Loader'
import { BaseInfo, Container, Info } from './analytics.style'

const periodAtName = 'analytics_period_at'
const periodEndName = 'analytics_period_end'

export default function Analytics() {
	const [periodAt, setPeriodAt] = useState(+(localStorage.getItem(periodAtName) || 0) || new Date().setDate(1))
	const [periodEnd, setPeriodEnd] = useState(+(localStorage.getItem(periodEndName) || 0) || new Date().getTime())

	const navigate = useNavigate()

	const { data, isError, isLoading } = useGetAnalyticsQuery({
		periodAt: periodAt.toString(),
		periodEnd: periodEnd.toString(),
	})

	const periodAtHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setPeriodAt(event.target.valueAsNumber)
		localStorage.setItem(periodAtName, event.target.valueAsNumber.toString())
	}
	const periodEndHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setPeriodEnd(event.target.valueAsNumber)
		localStorage.setItem(periodEndName, event.target.valueAsNumber.toString())
	}

	//TODO надо бы запоминать период при переходе по страницам
	const navigateUser = (req?: IUserParams) => () => {
		navigate('users', { state: req })
	}

	const navigateOrder = (req?: IOrderParams) => () => {
		navigate('orders', { state: req })
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
				</TableRow>
			)

			const clients = o.clients.map(c => {
				usersCount += 1
				ordersCount += c.ordersCount
				snpPositionCount += c.snpPositionCount

				return (
					<TableRow
						key={c.id}
						hover
						onClick={navigateOrder({ userId: c.id, periodAt, periodEnd })}
						sx={{ cursor: 'pointer' }}
					>
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
							Кол-во СНП
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
								<TableRow hover onClick={navigateUser()} sx={{ cursor: 'pointer' }}>
									<TableCell>Всего пользователей зарегистрировалось</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.usersCountRegister}
									</TableCell>
								</TableRow>
								<TableRow hover onClick={navigateUser({ useLink: true })} sx={{ cursor: 'pointer' }}>
									<TableCell>Пользователей зарегистрировалось (от менеджера)</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.userCountLink}
									</TableCell>
								</TableRow>
								<TableRow hover onClick={navigateUser({ useLink: false })} sx={{ cursor: 'pointer' }}>
									<TableCell>Пользователей зарегистрировалось (с сайта)</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data ? data?.data.usersCountRegister - data?.data.userCountLink : ''}
									</TableCell>
								</TableRow>
								<TableRow hover onClick={navigateUser({ hasOrders: true })} sx={{ cursor: 'pointer' }}>
									<TableCell>Всего пользователей сделало заказ</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.userCount}
									</TableCell>
								</TableRow>
								<TableRow hover onClick={navigateOrder()} sx={{ cursor: 'pointer' }}>
									<TableCell>Всего заявок</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.ordersCount}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Всего СНП заказано</TableCell>
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
								<TableRow
									hover
									onClick={navigateUser({ periodAt, periodEnd })}
									sx={{ cursor: 'pointer' }}
								>
									{/* //? можно еще выводить компании пользователей которые зарегались */}
									<TableCell>Пользователей зарегистрировалось</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.newUserCount || 0}
									</TableCell>
								</TableRow>
								<TableRow
									hover
									onClick={navigateUser({ periodAt, periodEnd, useLink: true })}
									sx={{ cursor: 'pointer' }}
								>
									<TableCell>Пользователей зарегистрировалось (от менеджера)</TableCell>
									<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
										{data?.data.newUserCountLink || 0}
									</TableCell>
								</TableRow>
								<TableRow
									hover
									onClick={navigateUser({ periodAt, periodEnd, useLink: false })}
									sx={{ cursor: 'pointer' }}
								>
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
