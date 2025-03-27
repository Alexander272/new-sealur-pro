import { ChangeEvent, FC, useState } from 'react'
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'

import type { IFilter } from '../../types/order'
import { stampToDate } from '@/utils/date'
import { useDebounce } from '@/hooks/debounce'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { Pagination } from '@/components/Pagination/Pagination'
import { Size } from '../../constants/default'
import { useGetAllOrdersQuery } from '../../ordersApiSlice'

type Props = {
	filers?: IFilter[]
}

export const OrdersList: FC<Props> = () => {
	const [number, setNumber] = useState('')
	const [page, setPage] = useState(1)
	const search = useDebounce(number, 500)

	const { data, isFetching } = useGetAllOrdersQuery({
		page,
		filters: search
			? [
					{
						field: 'number',
						compareType: 'con',
						value: search,
					},
			  ]
			: [],
	})

	const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setNumber(event.target.value)
	}

	const totalPages = Math.ceil((data?.total || 1) / Size)

	return (
		<Stack>
			<TextField
				value={number}
				onChange={searchHandler}
				size='small'
				fullWidth
				sx={{ maxWidth: '500px', mx: 'auto' }}
				placeholder='№ заявки'
			/>

			<TableContainer sx={{ position: 'relative' }}>
				{isFetching ? <TopFallback /> : null}

				<Table>
					<TableHead>
						<TableRow>
							<TableCell width={'28%'}>Менеджер</TableCell>
							<TableCell width={'20%'}>Компания</TableCell>
							<TableCell width={'28%'}>Клиент</TableCell>
							<TableCell width={'12%'} align='center'>
								№ заявки
							</TableCell>
							<TableCell width={'12%'} align='center'>
								Дата
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.data.map(d => (
							<TableRow key={d.id}>
								<TableCell>{d.manager}</TableCell>
								<TableCell>{d.company}</TableCell>
								<TableCell>{d.user}</TableCell>
								<TableCell align='center'>{d.number}</TableCell>
								<TableCell align='center'>{stampToDate(+d.date)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<Stack sx={{ mx: 'auto', mt: 2 }}>
					<Pagination page={page} totalPages={totalPages} onClick={setPage} sx={{ marginX: 'auto' }} />
				</Stack>
			</TableContainer>
		</Stack>
	)
}
