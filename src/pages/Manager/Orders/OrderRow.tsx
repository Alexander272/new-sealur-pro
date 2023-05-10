import { Alert, IconButton, Menu, MenuItem, Snackbar, TableCell, TableRow } from '@mui/material'
import { FC, MouseEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stampToDate } from '@/services/date'
import { IManagerOrder } from '@/types/order'
import { Icon } from './order.style'
import { useFinishOrderMutation } from '@/store/api/manager'
import { Loader } from '@/components/Loader/Loader'

type Props = {
	data: IManagerOrder
	onOpen: (order: IManagerOrder, type: 'order' | 'manager') => void
}

type Alert = { type: 'success' | 'error'; open: boolean }

export const OrderRow: FC<Props> = ({ data, onOpen }) => {
	const [alert, setAlert] = useState<Alert>({ type: 'success', open: false })
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const navigate = useNavigate()

	const [finish, { isError, isLoading, isSuccess }] = useFinishOrderMutation()

	useEffect(() => {
		if (isError) setAlert({ type: 'error', open: true })
		if (isSuccess) setAlert({ type: 'success', open: true })
	}, [isError, isSuccess])

	const open = Boolean(anchorEl)
	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const finishHandler = () => {
		handleClose()
		finish(data.id)
	}

	const orderHandler = () => {
		handleClose()
		onOpen(data, 'order')
	}

	const clientHandler = () => {
		handleClose()
		onOpen(data, 'manager')
	}

	const selectHandler = (event: MouseEvent<HTMLTableRowElement>) => {
		const { id } = (event.target as HTMLTableRowElement).dataset

		if (id) {
			navigate(id)
		}
	}

	const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setAlert({ type: 'success', open: false })
	}

	return (
		<TableRow key={data.id} hover role='checkbox' tabIndex={-1} onClick={selectHandler} sx={{ cursor: 'pointer' }}>
			<Snackbar
				open={alert.open}
				autoHideDuration={6000}
				onClose={alertClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={alertClose} severity={alert.type} sx={{ width: '100%' }}>
					{isError && 'Не удалось закрыть заявку'}
					{alert.type == 'success' && 'Заявка закрыта.'}
				</Alert>
			</Snackbar>
			{isLoading ? <Loader background='fill' /> : null}

			<TableCell data-id={data.id}>№{data.number}</TableCell>
			<TableCell data-id={data.id}>{data.company}</TableCell>
			<TableCell data-id={data.id}>{stampToDate(+data.date)}</TableCell>
			<TableCell data-id={data.id}>{data.countPosition}</TableCell>
			<TableCell width={20} align='right'>
				<IconButton
					aria-label='more'
					id='long-button'
					aria-controls={open ? 'long-menu' : undefined}
					aria-expanded={open ? 'true' : undefined}
					aria-haspopup='true'
					onClick={handleClick}
				>
					<Icon height={16} width={16} src='/image/dots.svg' />
				</IconButton>
				<Menu
					id='long-menu'
					MenuListProps={{
						'aria-labelledby': 'long-button',
					}}
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
				>
					<MenuItem selected={false} onClick={finishHandler}>
						Заявка выполнена
					</MenuItem>
					<MenuItem selected={false} onClick={orderHandler}>
						Передать заявку
					</MenuItem>
					<MenuItem selected={false} onClick={clientHandler}>
						Передать клиента
					</MenuItem>
				</Menu>
			</TableCell>
		</TableRow>
	)
}
