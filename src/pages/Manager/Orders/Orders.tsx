import { useState } from 'react'
import {
	Alert,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import { useGetOpenQuery } from '@/store/api/manager'
import { IManagerOrder } from '@/types/order'
import { Loader } from '@/components/Loader/Loader'
import { OrderRow } from './OrderRow'
import { Container } from './order.style'
import Managers from './Managers'

export type Alert = { type: 'success' | 'error'; message: string; open: boolean }

export default function Orders() {
	const [alert, setAlert] = useState<Alert>({ type: 'success', message: '', open: false })

	const { data, error, isLoading } = useGetOpenQuery(null)

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

	const changeAlert = (alert: Alert) => setAlert(alert)
	const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setAlert({ type: 'success', message: '', open: false })
	}

	// может все-таки сделать тут таблицу
	return (
		<Container>
			<Snackbar open={alert.open} onClose={alertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
				<Alert onClose={alertClose} severity={alert.type} sx={{ width: '100%' }}>
					{alert.type == 'error' && alert.message}
					{alert.type == 'success' && alert.message}
				</Alert>
			</Snackbar>
			{isLoading ? <Loader background='fill' /> : null}

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
			{error ? (
				<Typography color={'error'}>Не удалось загрузить заказы. {(error as any).data.message}</Typography>
			) : (
				<>
					<Managers manager={manager} onClose={closeHandler} setAlert={changeAlert} />

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
				</>
			)}
		</Container>
	)
}
