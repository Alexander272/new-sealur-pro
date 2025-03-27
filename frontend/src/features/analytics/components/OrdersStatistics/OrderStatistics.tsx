import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import type { PositionType } from '@/features/card/types/card'
import { PathRoutes } from '@/constants/routes'
import { FormatNumber } from '@/utils/numbers'
import { Fallback } from '@/components/Fallback/Fallback'
import { useGetOrdersStatsQuery } from '../../analyticsApiSlice'

export const OrderStatistics = () => {
	const navigate = useNavigate()
	const { data, isFetching } = useGetOrdersStatsQuery(null)

	const navigateHandler = (type?: PositionType) => () => {
		navigate(PathRoutes.Manager.Analytics.Count, { state: type })
	}

	const navigateUserHandler = () => {
		navigate(PathRoutes.Manager.Analytics.Users, { state: { withOrders: true } })
	}

	return (
		<TableContainer sx={{ height: '100%' }}>
			{isFetching && <Fallback />}

			<Table>
				<TableBody>
					{/* //TODO make navigation */}
					<TableRow hover onClick={navigateUserHandler} sx={{ cursor: 'pointer' }}>
						<TableCell>Всего пользователей сделало заказ</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold', p: '13px 16px' }}>
							{FormatNumber(data?.data.usersCount)}
						</TableCell>
					</TableRow>
					<TableRow hover onClick={navigateHandler()} sx={{ cursor: 'pointer' }}>
						<TableCell>Всего заявок</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold', p: '13px 16px' }}>
							{FormatNumber(data?.data.ordersCount)}
						</TableCell>
					</TableRow>
					<TableRow hover onClick={navigateHandler('Snp')} sx={{ cursor: 'pointer' }}>
						<TableCell>Всего СНП заказано</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold', p: '13px 16px' }}>
							{FormatNumber(data?.data.positions?.snp)}
						</TableCell>
					</TableRow>
					<TableRow hover onClick={navigateHandler('Putg')} sx={{ cursor: 'pointer' }}>
						<TableCell>Всего ПУТГ заказано</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold', p: '13px 16px' }}>
							{FormatNumber(data?.data.positions?.putg)}
						</TableCell>
					</TableRow>
					{/* <TableRow hover onClick={navigateHandler('ring')} sx={{ cursor: 'pointer' }}>
						<TableCell>Всего колец заказано</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
							{FormatNumber(data?.data.ringPositionCount)}
						</TableCell>
					</TableRow>
					<TableRow hover onClick={navigateHandler('kit')} sx={{ cursor: 'pointer' }}>
						<TableCell>Всего комплектов колец заказано</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold' }}>
							{FormatNumber(data?.data.kitPositionCount)}
						</TableCell>
					</TableRow> */}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
