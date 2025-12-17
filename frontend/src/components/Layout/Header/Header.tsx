import { FC, memo, useState } from 'react'
import { Badge, Divider, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ym } from 'react-metrika'

import { PathRoutes } from '@/constants/routes'
import { MetricId } from '@/constants/metric'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { useSignOutMutation } from '@/features/auth/authApiSlice'
import { getPositions, toggle } from '@/features/card/cardSlice'
import { getRole, getUserId } from '@/features/user/userSlice'
import { HomeIcon } from '@/components/Icons/HomeIcon'
import { UserIcon } from '@/components/Icons/UserIcon'
import { CartIcon } from '@/components/Icons/CartIcon'
import { HelpIcon } from '@/components/Icons/HelpIcon'
import { Content, Container, LogoLink, Logo, Nav, BarLink, NavBox } from './header.style'

import Instruction from '@/assets/files/instruction.pdf'

type Props = {
	disableCard?: boolean
}

const Header: FC<Props> = ({ disableCard }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const userId = useAppSelector(getUserId)
	const role = useAppSelector(getRole)
	const positions = useAppSelector(getPositions)

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
		else if (role == 'root' || role == 'cco') navigate(PathRoutes.Manager.Orders.List)
		else navigate(PathRoutes.Orders)
	}
	const profileHandler = () => {
		handleClose()
		navigate(PathRoutes.Profile)
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
		console.log('reading instruction')
		ym(MetricId, 'reachGoal', 'ReadInstruction')
	}

	return (
		<Container>
			<Content>
				<LogoLink to={PathRoutes.Home}>
					<Logo width={391} height={100} loading='lazy' src='/logo_2.webp' alt='logo' />
				</LogoLink>

				<Nav>
					<Tooltip enterDelay={500} title='Инструкция'>
						<NavBox onClick={readHandler}>
							<BarLink href={Instruction} target='_blank'>
								<HelpIcon sx={{ fill: 'var(--primary-color)', fontSize: 30 }} />
							</BarLink>
						</NavBox>
					</Tooltip>

					{userId && (
						<>
							{!disableCard && (
								<Tooltip enterDelay={800} title='Заявка'>
									<NavBox onClick={basketHandler}>
										<Badge
											color='primary'
											badgeContent={positions.length}
											invisible={!positions.length}
										>
											<CartIcon sx={{ fill: 'var(--primary-color)', fontSize: 30 }} />
										</Badge>
									</NavBox>
								</Tooltip>
							)}

							<Tooltip enterDelay={800} title='Профиль'>
								<NavBox onClick={handleClick}>
									<UserIcon sx={{ fill: 'var(--primary-color)', fontSize: 30 }} />
								</NavBox>
							</Tooltip>
						</>
					)}

					<Tooltip enterDelay={800} title='Главная страница'>
						<NavBox onClick={homeHandler}>
							<HomeIcon fill={'var(--primary-color)'} sx={{ fontSize: 30 }} />
						</NavBox>
					</Tooltip>
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
									right: 18,
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
					<MenuItem onClick={profileHandler} selected={false}>
						<ListItemIcon>
							<img height={24} width={18} src='/image/registration.svg' />
						</ListItemIcon>
						Профиль
					</MenuItem>
					{role != 'user' && role != 'manager' ? (
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
