import { Button, Divider, Stack, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'

import { PathRoutes } from '@/constants/routes'
import Header from '@/components/Layout/Header/Header'
import { Wrapper } from '@/components/Layout/Manager/manager.style'
import { Container } from './forbidden.style'

import logo from '@/assets/logo192.webp'

export default function Forbidden() {
	const { palette } = useTheme()

	return (
		<>
			<Header disableCard />
			<Wrapper>
				<Container>
					<Stack
						direction={'row'}
						divider={<Divider orientation='vertical' flexItem />}
						spacing={4}
						alignItems={'center'}
					>
						<img width={148} height={148} src={logo} alt='logo' />
						<Typography
							variant='h4'
							sx={{
								fontSize: '8rem',
								fontWeight: 'bold',
								color: palette.common.white,
								WebkitTextStrokeWidth: 3,
								WebkitTextStrokeColor: palette.primary.main,
							}}
						>
							403
						</Typography>
					</Stack>

					<Typography mt={3} mb={3} sx={{ fontSize: '2rem', color: palette.primary.main }}>
						Доступ к данному разделу запрещен
					</Typography>

					<Link to={PathRoutes.Home}>
						<Button variant='outlined' size='large' sx={{ borderRadius: '12px', padding: '8px 32px' }}>
							На главную
						</Button>
					</Link>
				</Container>
			</Wrapper>
		</>
	)
}
