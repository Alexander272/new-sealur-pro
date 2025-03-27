import { FC } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'

import { Fallback } from '@/components/Fallback/Fallback'
import { useGetUserInfoQuery } from '@/features/user/userApiSlice'
import { stampToDate } from '@/utils/date'

type Props = {
	id: string
}

export const UserFullInfo: FC<Props> = ({ id }) => {
	const { data, isFetching } = useGetUserInfoQuery(id, { skip: !id })

	return (
		<TableContainer sx={{ height: '100%' }}>
			{isFetching && <Fallback />}

			<Typography variant='h5' align='center' mt={1} mb={2}>
				Пользователь "{data?.data.name}"
			</Typography>

			<Table>
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
						<TableCell>{stampToDate((data?.data.date || 0) * 1000)}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Пришел от менеджера</TableCell>
						<TableCell>{data?.data.fromManager ? 'Да' : 'Нет'}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Пришел с landing</TableCell>
						<TableCell>{data?.data.fromLanding ? 'Да' : 'Нет'}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Дата последнего посещения</TableCell>
						<TableCell>
							{data?.data.visitDate ? stampToDate((data?.data.visitDate || 0) * 1000) : '-'}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Дата последнего заказа</TableCell>
						<TableCell>
							{data?.data.orderDate ? stampToDate((data?.data.orderDate || 0) * 1000) : '-'}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	)
}
