import { Breadcrumbs, Container, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'

import type { IOrderParams } from '@/features/analytics/types/analytics'
import type { IFilter } from '@/features/orders/types/order'
import { PathRoutes } from '@/constants/routes'
import { OrdersList } from '@/features/orders/components/OrdersList/OrdersList'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { stampToDate } from '@/utils/date'

export default function Orders() {
	const location = useLocation()
	const req = location.state as IOrderParams

	const filters: IFilter[] = []
	if (req.userId) filters.push({ field: 'userId', value: req.userId, compareType: 'eq' })
	if (req.from) filters.push({ field: 'date', value: req.from, compareType: 'gte' })
	if (req.to) filters.push({ field: 'date', value: req.to, compareType: 'lte' })

	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				background: '#fff',
				borderRadius: 3,
				py: 1,
				px: 2,
				boxShadow: '0px 0px 4px 0px #2626262b;',
			}}
		>
			<Breadcrumbs aria-label='breadcrumb' sx={{ mt: 1, mb: -3.5, position: 'relative', zIndex: 20 }}>
				<Breadcrumb to={PathRoutes.Home}>Главная</Breadcrumb>
				<Breadcrumb to={PathRoutes.Manager.Analytics.Base}>Статистика</Breadcrumb>
				<Breadcrumb to={PathRoutes.Manager.Analytics.Orders} active>
					Заказы
				</Breadcrumb>
			</Breadcrumbs>

			<Typography variant='h5' textAlign={'center'} mb={1}>
				Заказы клиента
			</Typography>
			<Typography textAlign={'center'} mb={3}>
				{req?.from
					? `За период с ${stampToDate(+req.from * 1000)} по ${stampToDate(+(req?.to || 0) * 1000)}`
					: 'За все время'}
			</Typography>

			<OrdersList filters={filters} />
		</Container>
	)
}
