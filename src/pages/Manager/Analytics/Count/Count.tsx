import { FC, MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useGetOrdersCountQuery } from '@/store/api/analytics'
import type { IOrderCount, IOrderParams } from '@/types/analytics'
import { Loader } from '@/components/Loader/Loader'
import { Container, TableContainer } from './count.style'
import { Question } from '../analytics.style'
import { PathRoutes } from '@/constants/routes'

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

const Header: FC<{ order: string; position: string; average: string }> = ({ order, position, average }) => (
	<>
		<TableCell align='center'>Кол-во заявок с {order}</TableCell>
		<TableCell align='center'>Кол-во {position}</TableCell>
		<TableCell align='center'>Среднее кол-во {average} в 1 заявке</TableCell>
	</>
)
const Data: FC<{ order?: number; position?: number; average?: number }> = ({ order, position, average }) => (
	<>
		<TableCell align='center'>{order || 0}</TableCell>
		<TableCell align='center'>{position || 0}</TableCell>
		<TableCell align='center'>{average || 0}</TableCell>
	</>
)

export default function OrderCount() {
	const location = useLocation()
	const navigate = useNavigate()

	const { data, isError, isLoading } = useGetOrdersCountQuery(null)

	const orderNavigate = (id: string) => () => {
		let state: IOrderParams = { userId: id }
		navigate(PathRoutes.Manager.Analytics.Orders, { state })
	}

	const userNavigate = (userId: string) => (event: MouseEvent<HTMLTableCellElement>) => {
		event.stopPropagation()
		navigate(PathRoutes.Manager.Analytics.User, { state: userId })
	}

	const renderHeader = () => {
		if (location.hash == '#common') return <CommonHeader />
		if (location.hash == '#snp') return <Header order='СНП' position='СНП' average='СНП' />
		if (location.hash == '#putg') return <Header order='ПУТГ' position='ПУТГ' average='ПУТГ' />
		if (location.hash == '#ring') return <Header order='кольцами' position='колец' average='колец' />
		if (location.hash == '#kit')
			return <Header order='комплектами колец' position='комплектов колец' average='комплектов колец' />
	}

	const renderRow = (o: IOrderCount) => {
		if (location.hash == '#common') return <CommonData o={o} />
		if (location.hash == '#snp')
			return <Data order={o.snpOrderCount} position={o.snpPositionCount} average={o.averageSnpPosition} />
		if (location.hash == '#putg')
			return <Data order={o.putgOrderCount} position={o.putgPositionCount} average={o.averagePutgPosition} />
		if (location.hash == '#ring')
			return <Data order={o.ringOrderCount} position={o.ringPositionCount} average={o.averageRingPosition} />
		if (location.hash == '#kit')
			return <Data order={o.kitOrderCount} position={o.kitPositionCount} average={o.averageKitPosition} />
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
