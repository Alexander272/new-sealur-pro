import { useAppDispatch } from '@/hooks/useStore'
import { toggle } from '@/store/card'
import { Tooltip } from '@mui/material'
import { FC } from 'react'
import { Content, Container, LogoLink, Logo, Icon, Nav } from './header.style'

type Props = {}

export const Header: FC<Props> = () => {
	// const { user, setUser } = useContext(AuthContext)

	// const logoutHandler = async () => {
	// 	try {
	// 		await signOut()
	// 		setUser(null)
	// 	} catch (error) {}
	// }

	const dispatch = useAppDispatch()

	const basketHandler = () => {
		dispatch(toggle())
	}

	return (
		<Container>
			<Content>
				<LogoLink to='/'>
					{/* <Logo width={192} height={192} loading='lazy' src='/logo192.webp' alt='logo' /> */}
					<Logo width={340} height={100} loading='lazy' src='/logo.webp' alt='logo' />
					{/* <span>Силур</span> */}
				</LogoLink>

				<Nav>
					<Tooltip title='Заявка'>
						<Icon onClick={basketHandler}>
							<img src='/image/basket.svg' alt='Заявка' width='30' height='30' />
						</Icon>
					</Tooltip>
				</Nav>

				{/* {user && (
					<div className={classes.nav}>
						<Tooltip title='Главная'>
							<Link to='/' className={classes.profile}>
								<img src='/image/home.svg' alt='home' width='32' height='32' />
							</Link>
						</Tooltip>

						{user?.role === 'master' || user?.role === 'display' || user?.role === 'manager' ? (
							<Tooltip title='Список заказов'>
								<Link to='/orders' className={classes.profile}>
									<img src='/image/list.svg' alt='orders' width='30' height='30' />
								</Link>
							</Tooltip>
						) : null}

						<Tooltip title='Выход'>
							<div className={classes.profile} onClick={logoutHandler}>
								<img src='/image/logout.svg' alt='log-out' width='30' height='30' />
							</div>
						</Tooltip>
					</div>
				)} */}
			</Content>
		</Container>
	)
}
