import { Breadcrumbs, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import { useGetOrderByIdQuery } from '@/features/orders/ordersApiSlice'
import { ManagerOrder } from '@/features/orders/components/ManagerOrder/ManagerOrder'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { Buttons } from '@/features/orders/components/ManagerOrder/Buttons'

export default function Order() {
	const { id } = useParams()

	const { data, isFetching } = useGetOrderByIdQuery(id || '', { skip: !id })

	return (
		<Stack mx={'auto'} width={'100%'} maxWidth={1680}>
			<Stack
				mb={3}
				sx={{
					position: 'relative',
					background: '#fff',
					borderRadius: 2,
					py: 2,
					px: 2,
					boxShadow: '0px 0px 4px 0px #2626262b;',
				}}
			>
				<Breadcrumbs aria-label='breadcrumb' sx={{ mb: -4, position: 'relative', zIndex: 20, width: 300 }}>
					<Breadcrumb to={PathRoutes.Home}>Главная</Breadcrumb>
					<Breadcrumb to={PathRoutes.Manager.Orders.Base}>Заказы</Breadcrumb>
					<Breadcrumb to={PathRoutes.Manager.Orders.Order} active>
						Заказ №{data?.data.number || '??'}
					</Breadcrumb>
				</Breadcrumbs>

				{data && (
					<Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
						<Typography variant='h5'>Заказ №{data.data.number}</Typography>
						<Buttons data={data.data} />
					</Stack>
				)}
			</Stack>

			{isFetching ? <TopFallback /> : data && <ManagerOrder data={data?.data} />}
		</Stack>
	)
}
