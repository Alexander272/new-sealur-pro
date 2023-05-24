import { FC, memo, useState } from 'react'
import { Divider, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { toggle } from '@/store/card'
import { Content, Container, LogoLink, Logo, Icon, Nav, BarLink } from './header.style'
import { clearUser } from '@/store/user'
import { signOut } from '@/services/auth'
import { sendMetric } from '@/services/metrics'

import Instruction from '@/assets/files/instruction.pdf'

type Props = {}

const Header: FC<Props> = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const userId = useAppSelector(state => state.user.userId)
	const role = useAppSelector(state => state.user.roleCode)

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
		navigate('/')
	}

	const ordersHandler = () => {
		handleClose()

		if (role == 'manager') navigate('/manager/orders')
		else navigate('/orders')
	}

	const analyticsHandler = () => {
		handleClose()
		navigate('/manager/analytics')
	}

	const signOutHandler = async () => {
		handleClose()

		const res = await signOut()
		if (res.error) {
			//TODO обработать ошибку
		}
		dispatch(clearUser())
	}

	const readHandler = () => {
		console.log('reading')
		// TODO убрать коммент с метрики
		// sendMetric('reachGoal', 'ReadInstruction')
	}

	return (
		<Container>
			<Content>
				<LogoLink to='/'>
					{/* <Logo width={192} height={192} loading='lazy' src='/logo192.webp' alt='logo' /> */}
					{/* <span>Силур</span> */}
					{/* <Logo width={340} height={100} loading='lazy' src='/logo.webp' alt='logo' /> */}
					<Logo width={391} height={100} loading='lazy' src='/logo_2.png' alt='logo' />
				</LogoLink>

				<Nav>
					{/* <Tooltip title='Связаться с нами'>
						<Icon>
							<NavLink to='/connect'>
								<img src='/image/email.svg' alt='Связаться с нами' />
							</NavLink>
						</Icon>
					</Tooltip> */}

					<Tooltip title='Инструкция'>
						<Icon>
							<BarLink href={Instruction} onClick={readHandler} target='_blank'>
								<img src='/image/question-icon.svg' alt='Инструкция' width='30' height='30' />
							</BarLink>
						</Icon>
					</Tooltip>

					{userId && (
						<>
							<Tooltip title='Главная страница'>
								<Icon onClick={homeHandler}>
									<img src='/image/home-icon.svg' alt='Главная' width='30' height='30' />
								</Icon>
							</Tooltip>

							<Tooltip title='Заявка'>
								<Icon onClick={basketHandler}>
									<img src='/image/basket.svg' alt='Заявка' width='30' height='30' />
								</Icon>
							</Tooltip>

							<Tooltip title='Профиль'>
								<Icon onClick={handleClick}>
									<img src='/image/person-profile.svg' alt='Профиль' width='30' height='30' />
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
					PaperProps={{
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
					}}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
