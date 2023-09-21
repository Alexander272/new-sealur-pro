import { FC } from 'react'
import { Alert, IconButton, Snackbar } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { toggle } from '@/store/card'

export type Alert = {
	type: 'error' | 'success'
	message: string
	method: 'create' | 'update' | 'delete'
	open: boolean
}

type Props = {
	alert: Alert
	onClose: () => void
}

export const PositionAlert: FC<Props> = ({ alert, onClose }) => {
	const dispatch = useAppDispatch()

	const openCardHandler = () => {
		dispatch(toggle({ open: true }))
		onClose()
	}

	return (
		<Snackbar
			open={alert.open}
			// autoHideDuration={6000}
			onClose={onClose}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		>
			<Alert
				onClose={onClose}
				severity={alert.type}
				action={
					alert.type == 'success' ? (
						<IconButton color='inherit' size='small' sx={{ lineHeight: '18px' }} onClick={openCardHandler}>
							➜
						</IconButton>
					) : (
						<IconButton color='inherit' size='small' sx={{ lineHeight: '18px' }} onClick={onClose}>
							&times;
						</IconButton>
					)
				}
				sx={{ width: '100%' }}
			>
				{alert.type == 'error' && alert.method == 'create'
					? 'Не удалось добавить позицию. ' + alert.message
					: ''}
				{alert.type == 'error' && alert.method == 'update' ? 'Не удалось обновить позицию' : ''}
				{alert.type == 'success' && <>Позиция {alert.method == 'update' ? 'изменена' : 'добавлена'}</>}
			</Alert>
		</Snackbar>
	)
}
