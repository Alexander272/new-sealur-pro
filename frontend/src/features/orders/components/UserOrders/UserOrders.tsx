import { useState } from 'react'
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { TopFallback } from '@/components/Fallback/TopFallback'
import { NoRowsOverlay } from '@/components/NoRowsOverlay/NoRowsOverlay'
import { Pagination } from '@/components/Pagination/Pagination'
import { useGetOrdersByUserQuery } from '../../ordersApiSlice'
import { Row } from './Row'

export const UserOrders = () => {
	const [page, setPage] = useState(1)

	const { data, isFetching } = useGetOrdersByUserQuery(page)

	const totalPages = Math.ceil((data?.total || 1) / 10)

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

	return (
		<TableContainer>
			{isFetching && <TopFallback />}

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
						<Row key={row.id} data={row} open={i == 0 && page == 1} />
					))}
				</TableBody>
			</Table>

			<Stack sx={{ mx: 'auto', mt: 2 }}>
				<Pagination page={page} totalPages={totalPages} onClick={setPage} sx={{ marginX: 'auto' }} />
			</Stack>
		</TableContainer>
	)
}
