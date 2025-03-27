import { Breadcrumbs, Container } from '@mui/material'
import { useLocation } from 'react-router-dom'

import type { IUserParams } from '@/features/analytics/types/analytics'
import { PathRoutes } from '@/constants/routes'
import { UsersInfo } from '@/features/analytics/components/UsersInfo/UsersInfo'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'

export default function Info() {
	const location = useLocation()
	const params = location.state as IUserParams | null

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
				<Breadcrumb to={PathRoutes.Manager.Analytics.Users} active>
					Пользователи
				</Breadcrumb>
			</Breadcrumbs>

			<UsersInfo params={params} />
		</Container>
	)
}
