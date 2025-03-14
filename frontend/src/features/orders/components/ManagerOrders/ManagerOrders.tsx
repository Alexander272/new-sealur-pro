import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { ManagersDialog } from '@/features/user/components/ManagersDialog/ManagersDialog'
import { NoRowsOverlay } from '@/components/NoRowsOverlay/NoRowsOverlay'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { useGetOrdersByManagerQuery } from '../../ordersApiSlice'
import { Row } from './Row'

export const ManagerOrders = () => {
	const { data, isFetching } = useGetOrdersByManagerQuery(null)

	if (!data || data.data.length === 0)
		return (
			<Box
				position={'relative'}
				width={'100%'}
				height={'100%'}
				borderRadius={3}
				overflow={'hidden'}
				margin={'auto'}
				// boxShadow={'0px 0px 4px 0px #26262642'}
			>
				<NoRowsOverlay title='Ни одного заказа еще не создано' />
			</Box>
		)

	return (
		<TableContainer>
			{isFetching && <TopFallback />}
			<ManagersDialog />

			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell>Заявка</TableCell>
						<TableCell>Компания</TableCell>
						<TableCell>Дата</TableCell>
						<TableCell colSpan={2}>Количество позиций</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.data?.map(d => (
						<Row key={d.id} data={d} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
