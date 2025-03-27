import { FC } from 'react'
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
import { useNavigate } from 'react-router-dom'

import type { PositionType } from '@/features/card/types/card'
import { PathRoutes } from '@/constants/routes'
import { Fallback } from '@/components/Fallback/Fallback'
import { useGetOrdersCountQuery } from '../../analyticsApiSlice'

type Props = {
	type?: PositionType
}

const titles = new Map<PositionType, string>([
	['Snp', 'с СНП'],
	['Putg', 'с ПУТГ'],
	// ['Wave', 'с волновыми'],
	// ['Rings', 'Кольца'],
	// ['Kit', 'Комплект'],
])

const CellStyle: SxProps<Theme> = {
	cursor: 'pointer',
	transition: '0.3s all ease-in-out',
	borderRadius: 3,
	':hover': {
		background: '#eee',
	},
}

export const OrdersCount: FC<Props> = ({ type }) => {
	const navigate = useNavigate()
	const { data, isFetching } = useGetOrdersCountQuery(type)

	const showInfo = (id: string) => () => {
		navigate(PathRoutes.Manager.Analytics.User, { state: id })
	}

	return (
		<TableContainer>
			{isFetching && <Fallback />}

			<Typography variant='h5' align='center' mb={2}>
				Количество заявок {type && titles.get(type)} по клиентам
			</Typography>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Компания</TableCell>
						<TableCell>Клиент</TableCell>
						<TableCell align='center'>Кол-во заявок</TableCell>
						<TableCell align='center'>Кол-во позиций</TableCell>
						<TableCell align='center'>Среднее кол-во в 1 заявке</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{data?.data.map(item => (
						<TableRow key={item.userId}>
							<TableCell sx={CellStyle} onClick={showInfo(item.userId)}>
								{item.company}
							</TableCell>
							<TableCell>{item.name}</TableCell>
							<TableCell align='center'>{item.orders}</TableCell>
							<TableCell align='center'>{item.positions}</TableCell>
							<TableCell align='center'>{item.average}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
