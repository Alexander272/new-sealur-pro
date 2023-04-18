import {
	Dialog,
	DialogContent,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useGetManagersQuery, useSetOrderManagerMutation, useSetUserManagerMutation } from '@/store/api/manager'
import { IUser } from '@/types/user'
import { IManagerOrder } from '@/types/order'
import { useAppSelector } from '@/hooks/useStore'
import { Loader } from '@/components/Loader/Loader'
import { Alert } from './Orders'

type Props = {
	manager: { order: IManagerOrder | null; type: 'order' | 'manager'; open: boolean }
	onClose: () => void
	setAlert: (alert: Alert) => void
}

export default function Managers({ manager, onClose, setAlert }: Props) {
	const userId = useAppSelector(state => state.user.userId)
	const { data, error, isLoading: isLoadingData } = useGetManagersQuery(null, { skip: !manager.open })

	const [setOrder, { error: errorOrder, isLoading: isLoadingOrder, isSuccess: isSuccessOrder }] =
		useSetOrderManagerMutation()
	const [setManager, { error: errorManager, isLoading: isLoadingManager, isSuccess: isSuccessManager }] =
		useSetUserManagerMutation()

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
		if (isSuccessOrder) setAlert({ type: 'success', message: `Заявка перенаправлена`, open: true })
		if (isSuccessManager) setAlert({ type: 'success', message: `Клиент передан`, open: true })
	}, [errorOrder, errorManager, isSuccessOrder, isSuccessManager])

	const changeHandler = (user: IUser) => () => {
		if (!manager.order) return

		if (manager.type == 'manager') setManager({ id: manager.order.userId, managerId: user.id })
		setOrder({
			orderId: manager.order.id,
			managerId: user.id,
			managerEmail: user.email,
			userId: manager.order.userId,
			oldManagerId: userId,
		})
		onClose()
	}

	return (
		<Dialog onClose={onClose} open={manager.open} fullWidth maxWidth={'sm'}>
			<DialogTitle>Укажите менеджера</DialogTitle>
			<DialogContent>
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
