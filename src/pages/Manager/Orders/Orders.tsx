import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useGetOpenQuery } from '@/store/api'
import { stampToDate } from '@/services/date'
import { Container, ItemBlock } from './order.style'
import { OrderRow } from './OrderRow'
import { MouseEvent } from 'react'

export default function Orders() {
	const { data } = useGetOpenQuery(null)

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
						{/* {data?.data?.map(d => (
							<TableRow key={d.id}>
								<TableCell>№{d.number}</TableCell>
								<TableCell>{d.company}</TableCell>
								<TableCell>{stampToDate(+d.date)}</TableCell>
								<TableCell>{d.countPosition}</TableCell>
								<TableCell></TableCell>
							</TableRow>
						))} */}
						{data?.data?.map(d => (
							<OrderRow key={d.id} data={d} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	)
}
