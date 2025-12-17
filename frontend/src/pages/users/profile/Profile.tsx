import { Breadcrumbs, Container, Stack, Typography } from '@mui/material'

import { PathRoutes } from '@/constants/routes'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { EditUserInfo } from '@/features/user/components/Edit/Edit'

export default function Profile() {
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
				height: 'fit-content',
				minHeight: 250,
			}}
		>
			<Breadcrumbs
				aria-label='breadcrumb'
				sx={{ mt: 1, mb: { sm: 0, md: -3 }, position: 'relative', zIndex: 20 }}
			>
				<Breadcrumb to={PathRoutes.Home}>Главная</Breadcrumb>
				<Breadcrumb to={PathRoutes.Profile} active>
					Профиль
				</Breadcrumb>
			</Breadcrumbs>

			<Typography variant='h5' textAlign={'center'} mb={1.5}>
				Профиль
			</Typography>

			<Stack sx={{ maxWidth: 600, width: '100%', height: '100%', mx: 'auto' }}>
				<EditUserInfo />
			</Stack>
		</Container>
	)
}
