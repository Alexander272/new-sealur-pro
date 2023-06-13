import { FC, MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useGetOrdersCountQuery } from '@/store/api/analytics'
import type { IOrderCount, IOrderParams } from '@/types/analytics'
import { Loader } from '@/components/Loader/Loader'
import { Container, TableContainer } from './count.style'
import { Question } from '../analytics.style'

type DataProps = {
	o: IOrderCount
}

const CommonHeader: FC = () => (
	<>
		<TableCell align='center'>Кол-во позиций</TableCell>
		<TableCell align='center'>Среднее кол-во в 1 заявке</TableCell>
	</>
)
const CommonData: FC<DataProps> = ({ o }) => (
	<>
		<TableCell align='center'>{o.positionCount}</TableCell>
		<TableCell align='center'>{o.averagePosition}</TableCell>
	</>
)

const SnpHeader: FC = () => (
	<>
		<TableCell align='center'>Кол-во заявок с СНП</TableCell>
		<TableCell align='center'>Кол-во СНП</TableCell>
		<TableCell align='center'>Среднее кол-во СНП в 1 заявке</TableCell>
	</>
)
const SnpData: FC<DataProps> = ({ o }) => (
	<>
		<TableCell align='center'>{o.snpOrderCount}</TableCell>
		<TableCell align='center'>{o.snpPositionCount}</TableCell>
		<TableCell align='center'>{o.averageSnpPosition}</TableCell>
	</>
)

export default function OrderCount() {
	const location = useLocation()
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

	const renderHeader = () => {
		if (location.hash == '#common') return <CommonHeader />
		if (location.hash == '#snp') return <SnpHeader />
	}

	const renderRow = (o: IOrderCount) => {
		if (location.hash == '#common') return <CommonData o={o} />
		if (location.hash == '#snp') return <SnpData o={o} />
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
								<TableCell align='center'>Кол-во заявок</TableCell>
								{renderHeader()}
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.data.map(o => (
								<TableRow key={o.id} hover onClick={orderNavigate(o.id)} sx={{ cursor: 'pointer' }}>
									<TableCell onClick={userNavigate(o.id)} sx={{ cursor: 'pointer' }}>
										{o.company} <Question>?</Question>
									</TableCell>
									<TableCell>{o.name}</TableCell>
									<TableCell align='center'>{o.orderCount}</TableCell>
									{renderRow(o)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	)
}
