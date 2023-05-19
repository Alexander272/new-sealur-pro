import { useLocation } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useGetUserDataQuery } from '@/store/api/analytics'
import { Loader } from '@/components/Loader/Loader'
import { Container, TableContainer } from './user.style'
import { stampToDate } from '@/services/date'

export default function User() {
	const location = useLocation()
	const req = location.state as string

	const { data, isError, isLoading } = useGetUserDataQuery(req)

	return (
		<Container>
			{isLoading && <Loader background='fill' />}

			{isError && (
				<Typography variant='h5' color='error' align='center'>
					При загрузке данных произошла ошибка
				</Typography>
			)}

			{!isError && (
				<TableContainer>
					<Typography variant='h5' align='center'>
						Пользователь {data?.data.name}
					</Typography>

					<Table>
						{/* <TableHead>
						<TableRow>
							<TableCell>Менеджер</TableCell>
							<TableCell>Компания</TableCell>
							<TableCell>Клиент</TableCell>
							<TableCell>Кол-во заявок</TableCell>
							{from == '' && <TableCell>От менеджера</TableCell>}
						</TableRow>
					</TableHead> */}
						<TableBody>
							<TableRow>
								<TableCell>Компания</TableCell>
								<TableCell>{data?.data.company}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Юр. адрес</TableCell>
								<TableCell>{data?.data.address}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>ИНН</TableCell>
								<TableCell>{data?.data.inn}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>КПП</TableCell>
								<TableCell>{data?.data.kpp}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Клиент</TableCell>
								<TableCell>{data?.data.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Должность</TableCell>
								<TableCell>{data?.data.position}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Email</TableCell>
								<TableCell>{data?.data.email}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Телефон</TableCell>
								<TableCell>{data?.data.phone}</TableCell>
							</TableRow>

							<TableRow>
								<TableCell>Аккаунт подтвержден</TableCell>
								<TableCell>{data?.data.confirmed ? 'Да' : 'Нет'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Дата подтверждения аккаунта</TableCell>
								<TableCell>{stampToDate(+(data?.data.date || 0))}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Пришел от менеджера</TableCell>
								<TableCell>{data?.data.useLink ? 'Да' : 'Нет'}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	)
}
