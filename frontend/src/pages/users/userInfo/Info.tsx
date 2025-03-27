import { Breadcrumbs, Container } from '@mui/material'
import { useLocation } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { UserFullInfo } from '@/features/analytics/components/UserFullInfo/UserFullInfo'

export default function Info() {
	const location = useLocation()
	const id = location.state as string

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
					Пользователь
				</Breadcrumb>
			</Breadcrumbs>

			<UserFullInfo id={id} />
		</Container>
	)
}
