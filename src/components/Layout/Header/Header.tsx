import { FC, memo, useState } from 'react'
import { Divider, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { PathRoutes } from '@/constants/routes'
import { toggle } from '@/store/card'
import { useSignOutMutation } from '@/store/api/auth'
import { sendMetric } from '@/services/metrics'
import { Content, Container, LogoLink, Logo, Icon, Nav, BarLink } from './header.style'

import Instruction from '@/assets/files/instruction.pdf'

type Props = {
	disableCard?: boolean
}

const Header: FC<Props> = ({ disableCard }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const userId = useAppSelector(state => state.user.userId)
	const role = useAppSelector(state => state.user.roleCode)

	const [signOut] = useSignOutMutation()

	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const basketHandler = () => {
		dispatch(toggle())
	}

	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const homeHandler = () => {
		navigate(PathRoutes.Home)
	}

	const ordersHandler = () => {
		handleClose()

		if (role == 'manager') navigate(PathRoutes.Manager.Orders.Base)
		else if (role == 'root' || role == 'cco') navigate(PathRoutes.Manager.Orders.Last)
		else navigate(PathRoutes.Orders)
	}

	const analyticsHandler = () => {
		handleClose()
		navigate(PathRoutes.Manager.Analytics.Base)
	}

	const signOutHandler = () => {
		void signOut(null)
		handleClose()
	}

	const readHandler = () => {
		// TODO убрать коммент с метрики
		// sendMetric('reachGoal', 'ReadInstruction')
	}

	return (
		<Container>
			<Content>
				<LogoLink to={PathRoutes.Home}>
					<Logo width={391} height={100} loading='lazy' src='/logo_2.webp' alt='logo' />
				</LogoLink>

				<Nav>
					<Tooltip title='Инструкция'>
						<Icon>
							<BarLink href={Instruction} onClick={readHandler} target='_blank'>
								<img src='/image/question-icon.svg' alt='Инструкция' width='30' height='30' />
							</BarLink>
						</Icon>
					</Tooltip>

					{userId && (
						<>
							{!disableCard && (
								<Tooltip title='Заявка'>
									<Icon onClick={basketHandler}>
										<img src='/image/basket.svg' alt='Заявка' width='30' height='30' />
									</Icon>
								</Tooltip>
							)}

							<Tooltip title='Профиль'>
								<Icon onClick={handleClick}>
									<img src='/image/person-profile.svg' alt='Профиль' width='30' height='30' />
								</Icon>
							</Tooltip>

							<Tooltip title='Главная страница'>
								<Icon onClick={homeHandler}>
									<img src='/image/home-icon.svg' alt='Главная' width='30' height='30' />
								</Icon>
							</Tooltip>
						</>
					)}
				</Nav>

				<Menu
					anchorEl={anchorEl}
					id='account-menu'
					open={open}
					onClose={handleClose}
					onClick={handleClose}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					slotProps={{
						paper: {
							elevation: 0,
							sx: {
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
								mt: 1.5,
								'&:before': {
									content: '""',
									display: 'block',
									position: 'absolute',
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: 'background.paper',
									transform: 'translateY(-50%) rotate(45deg)',
									zIndex: 0,
								},
							},
						},
					}}
				>
					<MenuItem onClick={ordersHandler} selected={false}>
						<ListItemIcon>
							<img height={24} width={18} src='/image/list.svg' />
						</ListItemIcon>
						Заказы
					</MenuItem>
					{role !== 'user' && role != 'manager' ? (
						<MenuItem onClick={analyticsHandler} selected={false}>
							<ListItemIcon>
								<img height={24} width={18} src='/image/graph.svg' />
							</ListItemIcon>
							Отчет
						</MenuItem>
					) : null}
					<Divider />
					<MenuItem onClick={signOutHandler} selected={false}>
						<ListItemIcon>
							<img height={24} width={18} src='/image/logout.svg' />
						</ListItemIcon>
						Выйти
					</MenuItem>
				</Menu>
			</Content>
		</Container>
	)
}

export default memo(Header)
