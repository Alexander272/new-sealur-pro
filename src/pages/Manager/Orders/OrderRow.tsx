import { IconButton, Menu, MenuItem, TableCell, TableRow } from '@mui/material'
import React, { FC, MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stampToDate } from '@/services/date'
import { IManagerOrder } from '@/types/order'
import { Icon } from './order.style'
import { useFinishOrderMutation } from '@/store/api/manager'

type Props = {
	data: IManagerOrder
	onOpen: (order: IManagerOrder, type: 'order' | 'manager') => void
}

export const OrderRow: FC<Props> = ({ data, onOpen }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const navigate = useNavigate()

	//TODO обработать ошибку
	const [finish, { error }] = useFinishOrderMutation()

	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
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

	return (
		<TableRow key={data.id} hover role='checkbox' tabIndex={-1} onClick={selectHandler} sx={{ cursor: 'pointer' }}>
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
