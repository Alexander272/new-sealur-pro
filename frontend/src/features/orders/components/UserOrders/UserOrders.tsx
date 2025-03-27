import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { TopFallback } from '@/components/Fallback/TopFallback'
import { NoRowsOverlay } from '@/components/NoRowsOverlay/NoRowsOverlay'
import { useGetOrdersByUserQuery } from '../../ordersApiSlice'
import { Row } from './Row'

export const UserOrders = () => {
	const { data, isFetching } = useGetOrdersByUserQuery(null)

	if (!data || data.data.length === 0)
		return (
			<Box
				position={'relative'}
				width={300}
				height={300}
				borderRadius={3}
				overflow={'hidden'}
				margin={'auto'}
				boxShadow={'0px 0px 4px 0px #26262642'}
			>
				<NoRowsOverlay title='Ни одного заказа еще не создано' />
			</Box>
		)

	if (isFetching) return <TopFallback />
	return (
		<TableContainer>
			<Table aria-label='collapsible table'>
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell align='center'>№ заказа</TableCell>
						{/* <TableCell>Доп. информация</TableCell> */}
						<TableCell align='center'>Дата</TableCell>
						<TableCell align='center'>Кол-во позиций</TableCell>
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.data.map((row, i) => (
						<Row key={row.id} data={row} open={i == 0} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
