import { MouseEvent, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Button, Menu, MenuItem } from '@mui/material'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { GasketRoute, PutgRoute, RingRoute, RingsKitRoute, RingsRoute, SnpRoute } from '@/routes'
import { MenuLink } from './production.style'

export const Products = () => {
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)
	const button = useRef<null | HTMLButtonElement>(null)
	const open = Boolean(anchor)

	const location = useLocation()

	useEffect(() => {
		if (location.pathname == '/') button.current?.click()
	}, [location.pathname])

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchor(event.currentTarget)
	}
	const handleClose = () => {
		setAnchor(null)
	}

	return (
		<Box>
			<Button
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				ref={button}
				onClick={handleClick}
				variant='outlined'
				disableElevation
				size='small'
				endIcon={<ArrowDownIcon />}
				sx={{ borderRadius: '12px', padding: '5px 20px', fontSize: '0.8rem', lineHeight: '1.7' }}
			>
				Продукция
			</Button>

			<Menu
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				anchorEl={anchor}
				transformOrigin={{ horizontal: 'left', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
				MenuListProps={{
					role: 'listbox',
					disableListWrap: true,
				}}
				// slotProps={{
				// 	paper: {
				// 		elevation: 0,
				// 		sx: {
				// 			overflow: 'visible',
				// 			filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
				// 			marginTop: 1,
				// 			'&:before': {
				// 				content: '""',
				// 				display: 'block',
				// 				position: 'absolute',
				// 				top: 0,
				// 				left: '14px',
				// 				width: 10,
				// 				height: 10,
				// 				bgcolor: 'background.paper',
				// 				transform: 'translateY(-50%) rotate(45deg)',
				// 				zIndex: 0,
				// 			},
				// 		},
				// 	},
				// }}
			>
				<MenuLink to={GasketRoute}>
					<MenuItem
						selected={location.pathname == GasketRoute}
						sx={{ margin: '0 8px', borderRadius: '12px', fontWeight: 'bold' }}
					>
						Фланцевые прокладки
					</MenuItem>
				</MenuLink>
				<MenuLink to={SnpRoute}>
					<MenuItem
						selected={location.pathname == SnpRoute}
						sx={{ margin: '0 8px', borderRadius: '12px', paddingLeft: 4 }}
					>
						Спирально-навитая прокладка (СНП)
					</MenuItem>
				</MenuLink>
				<MenuLink to={PutgRoute}>
					<MenuItem
						selected={location.pathname == PutgRoute}
						sx={{ margin: '0 8px', borderRadius: '12px', paddingLeft: 4 }}
					>
						Графитовая прокладка ПУТГ
					</MenuItem>
				</MenuLink>

				<MenuLink to={RingsRoute}>
					<MenuItem
						selected={location.pathname == RingsRoute}
						sx={{ margin: '0 8px', borderRadius: '12px', fontWeight: 'bold' }}
					>
						Сальниковые кольца и комплекты
					</MenuItem>
				</MenuLink>
				<MenuLink to={RingRoute}>
					<MenuItem
						selected={location.pathname == RingRoute}
						sx={{ margin: '0 8px', borderRadius: '12px', paddingLeft: 4 }}
					>
						Кольца
					</MenuItem>
				</MenuLink>
				<MenuLink to={RingsKitRoute}>
					<MenuItem
						selected={location.pathname == RingsKitRoute}
						sx={{ margin: '0 8px', borderRadius: '12px', paddingLeft: 4 }}
					>
						Комплекты колец
					</MenuItem>
				</MenuLink>
			</Menu>
		</Box>
	)
}
