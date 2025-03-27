import { FC } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material'

import { Fallback } from '@/components/Fallback/Fallback'
import { useGetGroupedOrdersStatsQuery } from '../../analyticsApiSlice'
import { FormatNumber } from '@/utils/numbers'

type Props = {
	from: string
	to: string
}

export const GroupedOrders: FC<Props> = ({ from, to }) => {
	const { data, isFetching } = useGetGroupedOrdersStatsQuery({ from, to }, { skip: !from || !to })

	const total = data?.data.reduce(
		(acc, item) => {
			acc.clients++
			acc.orders += item.count
			acc.positions.snp += item.positions?.snp || 0
			acc.positions.putg += item.positions?.putg || 0
			acc.positions.rings += item.positions?.rings || 0
			acc.positions.kit += item.positions?.kit || 0
			return acc
		},
		{ clients: 0, orders: 0, positions: { snp: 0, putg: 0, rings: 0, kit: 0 } }
	)

	return (
		<TableContainer>
			{isFetching && <Fallback />}

			<Table>
				<TableHead>
					<TableRow>
						<TableCell sx={{ fontWeight: 'bold' }}>Менеджер</TableCell>
						<TableCell sx={{ fontWeight: 'bold' }}>Клиент</TableCell>
						<TableCell width={160} align='center' sx={{ fontWeight: 'bold' }}>
							Кол-во заявок
						</TableCell>
						<TableCell width={160} align='center' sx={{ fontWeight: 'bold' }}>
							Кол-во СНП
						</TableCell>
						<TableCell width={160} align='center' sx={{ fontWeight: 'bold' }}>
							Кол-во ПУТГ
						</TableCell>
						{/* <TableCell width={160} align='center' sx={{ fontWeight: 'bold' }}>
							Кол-во колец
						</TableCell>
						<TableCell width={160} align='center' sx={{ fontWeight: 'bold' }}>
							Кол-во комплектов колец
						</TableCell> */}
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.data.map(item => (
						<TableRow key={item.userId}>
							<TableCell>{item.manager}</TableCell>
							<TableCell>
								{item.company} ({item.user})
							</TableCell>
							<TableCell align='center'>{FormatNumber(item.count)}</TableCell>
							<TableCell align='center'>{FormatNumber(item.positions?.snp)}</TableCell>
							<TableCell align='center'>{FormatNumber(item.positions?.putg)}</TableCell>
							{/* <TableCell align='center'>{FormatNumber(item.positions?.rings)}</TableCell>
                            <TableCell align='center'>{FormatNumber(item.positions?.kit)}</TableCell> */}
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell>Всего</TableCell>
						<TableCell align='center'>{total?.clients}</TableCell>
						<TableCell align='center'>{total?.orders}</TableCell>
						<TableCell align='center'>{total?.positions.snp}</TableCell>
						<TableCell align='center'>{total?.positions.putg}</TableCell>
						{/* <TableCell align='center'>{total?.positions.rings}</TableCell>
						<TableCell align='center'>{total?.positions.kit}</TableCell> */}
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	)
}
