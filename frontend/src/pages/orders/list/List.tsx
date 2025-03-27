import { Breadcrumbs, Container, Typography } from '@mui/material'

import { PathRoutes } from '@/constants/routes'
import { OrdersList } from '@/features/orders/components/OrdersList/OrdersList'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'

export default function List() {
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
				<Breadcrumb to={PathRoutes.Manager.Orders.List} active>
					Заказы
				</Breadcrumb>
			</Breadcrumbs>

			<Typography variant='h5' textAlign={'center'} mb={2}>
				Заказы
			</Typography>
			<OrdersList />
		</Container>
	)
}
