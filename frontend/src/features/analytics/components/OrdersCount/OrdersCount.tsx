import { FC } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import type { PositionType } from '@/features/card/types/card'
import { PathRoutes } from '@/constants/routes'
import { Fallback } from '@/components/Fallback/Fallback'
import { useGetOrdersCountQuery } from '../../analyticsApiSlice'
import { HoverCell } from '../styled/HoverCell'

type Props = {
	type?: PositionType
}

const titles = new Map<PositionType, string>([
	['Snp', 'с СНП'],
	['Putg', 'с ПУТГ'],
	['Wave', 'с волновыми прокладками'],
	// ['Rings', 'Кольца'],
	// ['Kit', 'Комплект'],
])

export const OrdersCount: FC<Props> = ({ type }) => {
	const navigate = useNavigate()
	const { data, isFetching } = useGetOrdersCountQuery(type)

	const showInfo = (id: string) => () => {
		navigate(PathRoutes.Manager.Analytics.User, { state: id })
	}

	const showOrders = (id: string) => () => {
		navigate(PathRoutes.Manager.Analytics.Orders, { state: { userId: id } })
	}

	return (
		<TableContainer>
			{isFetching && <Fallback />}

			<Typography variant='h5' align='center' mb={2}>
				Количество заявок {type && titles.get(type)} по клиентам
			</Typography>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Компания</TableCell>
						<TableCell>Клиент</TableCell>
						<TableCell align='center'>Кол-во заявок</TableCell>
						<TableCell align='center'>Кол-во позиций</TableCell>
						<TableCell align='center'>Среднее кол-во в 1 заявке</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{data?.data.map(item => (
						<TableRow key={item.userId}>
							<HoverCell onClick={showInfo(item.userId)}>{item.company}</HoverCell>
							<TableCell>{item.name}</TableCell>
							<HoverCell onClick={showOrders(item.userId)} align='center'>
								{item.orders}
							</HoverCell>
							<TableCell align='center'>{item.positions}</TableCell>
							<TableCell align='center'>{item.average}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
