import {
	Dialog,
	DialogContent,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
} from '@mui/material'
import { useGetManagersQuery, useSetOrderManagerMutation, useSetUserManagerMutation } from '@/store/api/manager'
import { IUser } from '@/types/user'
import { IManagerOrder } from '@/types/order'
import { useAppSelector } from '@/hooks/useStore'

type Props = {
	manager: { order: IManagerOrder | null; type: 'order' | 'manager'; open: boolean }
	onClose: () => void
}

export default function Managers({ manager, onClose }: Props) {
	const userId = useAppSelector(state => state.user.userId)
	const { data } = useGetManagersQuery(null, { skip: !manager.open })

	//TODO обработать ошибки
	const [setOrder, { error: errorOrder }] = useSetOrderManagerMutation()
	const [setManager, { error: errorManager }] = useSetUserManagerMutation()

	const changeHandler = (user: IUser) => () => {
		if (!manager.order) return

		if (manager.type == 'manager') setManager({ id: manager.order.userId, managerId: user.id })
		setOrder({ orderId: manager.order.id, managerId: user.id })
		onClose()
	}

	return (
		<Dialog onClose={onClose} open={manager.open} fullWidth maxWidth={'sm'}>
			<DialogTitle>Укажите менеджера</DialogTitle>
			<DialogContent>
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
			</DialogContent>
		</Dialog>
	)
}
