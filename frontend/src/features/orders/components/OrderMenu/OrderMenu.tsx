import { FC, MouseEvent, useRef, useState } from 'react'
import { Box, CircularProgress, IconButton, Menu, MenuItem } from '@mui/material'
import { toast } from 'react-toastify'

import { useAppDispatch } from '@/hooks/redux'
import { changeDialogIsOpen } from '@/features/dialogs/dialogSlice'
import { useFinishOrderMutation } from '../../ordersApiSlice'
import { DotsIcon } from '@/components/Icons/DotsIcon'

interface Data {
	id: string
	userId: string
}

type Props = {
	data: Data
}

export const OrderMenu: FC<Props> = ({ data }) => {
	const anchor = useRef<HTMLButtonElement>(null)
	const [open, setOpen] = useState(false)
	const dispatch = useAppDispatch()

	const [finish, { isLoading }] = useFinishOrderMutation()

	const toggle = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()
		event.preventDefault()
		setOpen(prev => !prev)
	}

	const orderHandler = (event: MouseEvent<HTMLLIElement>) => {
		event.stopPropagation()
		setOpen(prev => !prev)
		dispatch(changeDialogIsOpen({ variant: 'Orders', isOpen: true, content: data }))
	}
	const clientHandler = (event: MouseEvent<HTMLLIElement>) => {
		event.stopPropagation()
		setOpen(prev => !prev)
		dispatch(changeDialogIsOpen({ variant: 'Clients', isOpen: true, content: data }))
	}

	const finishHandler = async (event: MouseEvent<HTMLLIElement>) => {
		event.stopPropagation()
		event.preventDefault()
		setOpen(prev => !prev)

		try {
			await finish(data.id).unwrap()
			toast.success('Заявка закрыта')
		} catch {
			toast.error('Не удалось завершить заявку')
		}
	}

	return (
		<>
			{isLoading ? (
				<Box width={32} height={32} display={'flex'} justifyContent={'center'} alignItems={'center'}>
					<CircularProgress size={18} />
				</Box>
			) : (
				<IconButton ref={anchor} onClick={toggle}>
					<DotsIcon fontSize={18} />
				</IconButton>
			)}
			<Menu open={open} anchorEl={anchor.current} onClose={toggle}>
				<MenuItem onClick={finishHandler}>Заявка выполнена</MenuItem>
				<MenuItem onClick={orderHandler}>Передать заявку</MenuItem>
				<MenuItem onClick={clientHandler}>Передать клиента</MenuItem>
			</Menu>
		</>
	)
}
