import {
	Alert,
	Dialog,
	DialogContent,
	DialogTitle,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from '@mui/material'
import { useGetManagersQuery, useSetOrderManagerMutation, useSetUserManagerMutation } from '@/store/api/manager'
import { IUser } from '@/types/user'
import { IManagerOrder } from '@/types/order'
import { useAppSelector } from '@/hooks/useStore'
import { Loader } from '@/components/Loader/Loader'
import { useEffect, useState } from 'react'

type Props = {
	manager: { order: IManagerOrder | null; type: 'order' | 'manager'; open: boolean }
	onClose: () => void
}

type Alert = { type: 'success' | 'error'; message: string; open: boolean }

export default function Managers({ manager, onClose }: Props) {
	const [alert, setAlert] = useState<Alert>({ type: 'success', message: '', open: false })
	const userId = useAppSelector(state => state.user.userId)
	const { data, error, isLoading: isLoadingData } = useGetManagersQuery(null, { skip: !manager.open })

	//TODO обработать ошибки
	const [setOrder, { error: errorOrder, isLoading: isLoadingOrder, isSuccess }] = useSetOrderManagerMutation()
	const [setManager, { error: errorManager, isLoading: isLoadingManager }] = useSetUserManagerMutation()

	useEffect(() => {
		if (errorManager) {
			setAlert({
				type: 'error',
				message: `Не удалось передать клиента. ${(errorManager as any).data.message}`,
				open: true,
			})
		}
		if (errorOrder) {
			setAlert({
				type: 'error',
				message: `Не удалось передать заявку. ${(errorOrder as any).data.message}`,
				open: true,
			})
		}
	}, [errorOrder, errorManager])

	const changeHandler = (user: IUser) => () => {
		if (!manager.order) return

		if (manager.type == 'manager') setManager({ id: manager.order.userId, managerId: user.id })
		setOrder({ orderId: manager.order.id, managerId: user.id })
		onClose()
	}

	const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setAlert({ type: 'success', message: '', open: false })
	}

	return (
		<Dialog onClose={onClose} open={manager.open} fullWidth maxWidth={'sm'}>
			<DialogTitle>Укажите менеджера</DialogTitle>
			<DialogContent>
				{/* //TODO а будет ли это выводиться? */}
				<Snackbar
					open={alert.open}
					onClose={alertClose}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				>
					<Alert onClose={alertClose} severity={alert.type} sx={{ width: '100%' }}>
						{alert.type == 'error' && alert.message}
						{alert.type == 'success' && alert.message}
					</Alert>
				</Snackbar>

				{isLoadingData || isLoadingOrder || isLoadingManager ? <Loader background='fill' /> : null}

				{error ? (
					<Typography color={'error'}>
						Не удалось получить список менеджеров. {(error as any).data.message}
					</Typography>
				) : (
					<TableContainer>
						<Table>
							<TableBody>
								{data?.data.users?.map(u => {
									if (u.id != userId)
										return (
											<TableRow
												key={u.id}
												onClick={changeHandler(u)}
												hover
												role='checkbox'
												tabIndex={-1}
												sx={{ cursor: 'pointer' }}
											>
												<TableCell align='center'>{u.name}</TableCell>
											</TableRow>
										)
								})}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</DialogContent>
		</Dialog>
	)
}
