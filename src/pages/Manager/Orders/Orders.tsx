import { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useGetOpenQuery } from '@/store/api/manager'
import { IManagerOrder } from '@/types/order'
import { OrderRow } from './OrderRow'
import { Container } from './order.style'
import Managers from './Managers'

export default function Orders() {
	const { data } = useGetOpenQuery(null)

	const [manager, setManager] = useState<{ order: IManagerOrder | null; type: 'order' | 'manager'; open: boolean }>({
		order: null,
		type: 'order',
		open: false,
	})

	const openHandler = (order: IManagerOrder, type: 'order' | 'manager') => {
		setManager({ order, type, open: true })
	}
	const closeHandler = () => {
		setManager({ order: null, type: 'order', open: false })
	}

	// может все-таки сделать тут таблицу
	return (
		<Container>
			{/* {data?.data.map(d => (
				<ItemBlock key={d.id}>
					<Typography align='center'>
						<Link to={d.id}>Заявка №{d.number}</Link>
					</Typography>
					<Stack direction='row' spacing={2}>
						{/* <Typography>Компания</Typography>
						<Typography>От</Typography>
						<Typography>{d.company}</Typography>
					</Stack>
					<Stack direction='row' spacing={2}>
						<Typography>Дата</Typography>
						<Typography>{stampToDate(+d.date)}</Typography>
					</Stack>
					{/* <Stack direction='row' spacing={2}>
						<Typography>Количество</Typography>
						<Typography>{d.countPosition}</Typography>
					</Stack> 
				</ItemBlock>
			))} */}
			<Managers manager={manager} onClose={closeHandler} />
			<TableContainer sx={{ maxHeight: 740 }}>
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
							<OrderRow key={d.id} data={d} onOpen={openHandler} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	)
}
