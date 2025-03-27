import { Breadcrumbs, Container } from '@mui/material'
import { useLocation } from 'react-router-dom'

import type { PositionType } from '@/features/card/types/card'
import { PathRoutes } from '@/constants/routes'
import { OrdersCount } from '@/features/analytics/components/OrdersCount/OrdersCount'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'

export default function Count() {
	const location = useLocation()
	const req = location.state as PositionType | undefined

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
			<Breadcrumbs aria-label='breadcrumb' sx={{ mt: 1, position: 'relative', zIndex: 20 }}>
				<Breadcrumb to={PathRoutes.Home}>Главная</Breadcrumb>
				<Breadcrumb to={PathRoutes.Manager.Analytics.Base}>Статистика</Breadcrumb>
				<Breadcrumb to={PathRoutes.Manager.Analytics.User} active>
					Кол-во заявок
				</Breadcrumb>
			</Breadcrumbs>

			<OrdersCount type={req} />
		</Container>
	)
}
