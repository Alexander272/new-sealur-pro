import { FC } from 'react'
import { TableCell, TableRow } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import type { IOrderWithCompany } from '../../types/order'
import { PathRoutes } from '@/constants/routes'
import { stampToDate } from '@/utils/date'
import { OrderMenu } from '../OrderMenu/OrderMenu'

type Props = {
	data: IOrderWithCompany
}

export const Row: FC<Props> = ({ data }) => {
	const navigate = useNavigate()

	const selectHandler = () => {
		navigate(PathRoutes.Manager.Orders.Base + '/' + data.id)
	}

	return (
		<TableRow hover role='checkbox' tabIndex={-1} onClick={selectHandler} sx={{ cursor: 'pointer' }}>
			<TableCell>№{data.number}</TableCell>
			<TableCell>{data.company}</TableCell>
			<TableCell>{stampToDate(+data.date * 1000)}</TableCell>
			<TableCell>{data.countPosition}</TableCell>
			<TableCell width={20} align='right' onClick={e => e.stopPropagation()}>
				<OrderMenu data={data} />
			</TableCell>
		</TableRow>
	)
}
