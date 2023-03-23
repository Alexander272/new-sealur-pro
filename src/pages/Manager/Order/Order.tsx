import { FileDownload } from '@/components/FileInput/FileDownload'
import { useGetFullOrderQuery } from '@/store/api'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Container, OrderList, Row, UserContainer } from './order.style'

export default function Order() {
	const ref = useRef<HTMLAnchorElement | null>(null)

	const params = useParams()
	const location = useLocation()

	const { data } = useGetFullOrderQuery(params.id || '', { skip: !params.id })

	useEffect(() => {
		if (location.search == '?action=save' && ref.current) ref.current.click()
	}, [])

	const user = data?.data.user
	const order = data?.data.order

	return (
		<Container>
			<Typography variant='h5'>Заявка №{order?.number}</Typography>
			<Row>
				<OrderList>
					<TableContainer sx={{ maxHeight: 470 }}>
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell>№</TableCell>
									<TableCell>Наименование</TableCell>
									<TableCell>Количество</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{order?.positions?.map(p => (
									<TableRow key={p.id}>
										<TableCell>{p.count}</TableCell>
										<TableCell>{p.title}</TableCell>
										<TableCell align='center'>{p.amount}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</OrderList>

				<UserContainer>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>Компания</TableCell>
								<TableCell>{user?.company}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Юр. адрес</TableCell>
								<TableCell>{user?.address}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>ИНН</TableCell>
								<TableCell>{user?.inn}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>КПП</TableCell>
								<TableCell>{user?.kpp}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>ФИО</TableCell>
								<TableCell>{user?.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Должность</TableCell>
								<TableCell>{user?.position}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Email</TableCell>
								<TableCell>{user?.email}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Телефон</TableCell>
								<TableCell>{user?.phone}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</UserContainer>
			</Row>
			<FileDownload ref={ref} text='Скачать' link={`/api/v1/sealur-pro/orders/${params.id}/заявка.zip`} />
			{/* //TODO Order */}
		</Container>
	)
}
