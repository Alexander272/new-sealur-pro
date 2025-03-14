import { FC } from 'react'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { toast } from 'react-toastify'

import type { IUser } from '../../types/user'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { changeDialogIsOpen, getDialogState } from '@/features/dialogs/dialogSlice'
import { Dialog } from '@/features/dialogs/components/Dialog'
import { Fallback } from '@/components/Fallback/Fallback'
import { useChangeClientManagerMutation, useGetManagersQuery } from '../../managerApiSlice'
import { getUserId } from '../../userSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { PathRoutes } from '@/constants/routes'

type Context = { id: string; userId: string }

export const ManagersDialog = () => {
	const modalOrder = useAppSelector(getDialogState('Orders'))
	const modalClients = useAppSelector(getDialogState('Clients'))

	const dispatch = useAppDispatch()

	const closeHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Orders', isOpen: false }))
		dispatch(changeDialogIsOpen({ variant: 'Clients', isOpen: false }))
	}

	return (
		<Dialog
			title={'Укажите менеджера'}
			body={
				<Form
					data={(modalOrder?.content || modalClients?.content) as Context}
					isSentClient={modalClients?.isOpen}
				/>
			}
			open={modalOrder?.isOpen || modalClients?.isOpen || false}
			onClose={closeHandler}
			maxWidth='sm'
			fullWidth
		/>
	)
}

type FormProps = {
	data: Context
	isSentClient?: boolean
}

const Form: FC<FormProps> = ({ data: context, isSentClient }) => {
	const location = useLocation()
	const navigate = useNavigate()

	const userId = useAppSelector(getUserId)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetManagersQuery(null)
	const [change] = useChangeClientManagerMutation()

	const changeHandler = (user: IUser) => async () => {
		if (isSentClient) {
			const managerDTO = { id: context.userId, managerId: user.id }
			try {
				await change(managerDTO).unwrap()
				dispatch(changeDialogIsOpen({ variant: 'Clients', isOpen: false }))
			} catch {
				toast.error('Не удалось изменить менеджера')
			}
		}

		// const orderDTO = {
		// 	orderId: context.id,
		// 	userId: context.userId,
		// 	managerId: user.id,
		// 	managerEmail: user.email,
		// 	oldManagerId: userId,
		// }
		dispatch(changeDialogIsOpen({ variant: 'Orders', isOpen: false }))

		if (location.pathname != PathRoutes.Manager.Orders.Base) navigate(PathRoutes.Manager.Orders.Base)
	}

	if (isFetching) return <Fallback />
	return (
		<List sx={{ mt: -3 }}>
			{data?.data
				.filter(d => d.id != userId)
				.map(d => (
					<ListItem disablePadding divider>
						<ListItemButton onClick={changeHandler(d)} sx={{ borderRadius: 4 }}>
							<ListItemText inset primary={d.name} />
						</ListItemButton>
					</ListItem>
				))}
		</List>
	)
}
