import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	SxProps,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
	Typography,
} from '@mui/material'

import type { IUserParams } from '../../types/analytics'
import { stampToDate } from '@/utils/date'
import { Fallback } from '@/components/Fallback/Fallback'
import { useGetUsersInfoQuery } from '../../analyticsApiSlice'
import { PathRoutes } from '@/constants/routes'

type Props = {
	params: IUserParams | null
}

const CellStyle: SxProps<Theme> = {
	cursor: 'pointer',
	transition: '0.3s all ease-in-out',
	borderRadius: 3,
	':hover': {
		background: '#eee',
	},
}

export const UsersInfo: FC<Props> = ({ params }) => {
	const navigate = useNavigate()
	const { data, isFetching } = useGetUsersInfoQuery(params)

	const showInfo = (id: string) => () => {
		navigate(PathRoutes.Manager.Analytics.User, { state: id })
	}

	const period = params?.from
		? `За период с ${stampToDate(+params?.from * 1000)} по ${stampToDate(+(params?.to || 0) * 1000)}`
		: 'За все время'
	const source = params?.fromManager != undefined ? (params?.fromManager ? '(от менеджеров)' : '(с сайта)') : ''

	return (
		<TableContainer sx={{ height: '100%' }}>
			{isFetching && <Fallback />}

			<Typography variant='h5' align='center' sx={{ mb: 1 }}>
				Пользователи {params?.withOrders && 'которые сделали заказ'}
			</Typography>
			<Typography align='center' sx={{ mb: 3 }}>
				{period} {source}
			</Typography>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Компания</TableCell>
						<TableCell>Клиент</TableCell>
						<TableCell>Менеджер</TableCell>
						<TableCell align='center'>Кол-во заявок</TableCell>
						{source == '' && <TableCell align='center'>От менеджера</TableCell>}
					</TableRow>
				</TableHead>

				<TableBody>
					{data?.data.map(item => (
						<TableRow key={item.id}>
							<TableCell sx={CellStyle} onClick={showInfo(item.id)}>
								{item.company}
							</TableCell>
							<TableCell>{item.user}</TableCell>
							<TableCell>{item.manager}</TableCell>
							<TableCell align='center'>{item.ordersCount}</TableCell>
							{source == '' && <TableCell align='center'>{item.fromManager ? 'Да' : 'Нет'}</TableCell>}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
