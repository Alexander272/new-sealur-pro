import { FC } from 'react'
import { Content, Container, LogoLink, Logo } from './header.style'

type Props = {}

export const Header: FC<Props> = () => {
	// const { user, setUser } = useContext(AuthContext)

	// const logoutHandler = async () => {
	// 	try {
	// 		await signOut()
	// 		setUser(null)
	// 	} catch (error) {}
	// }

	return (
		<Container>
			<Content>
				<LogoLink to='/'>
					{/* <Logo width={192} height={192} loading='lazy' src='/logo192.webp' alt='logo' /> */}
					<Logo width={340} height={100} loading='lazy' src='/logo.webp' alt='logo' />
					{/* <span>Силур</span> */}
				</LogoLink>

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
