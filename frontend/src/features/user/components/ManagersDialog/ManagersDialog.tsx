import { FC } from 'react'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import type { IUser } from '../../types/user'
import { PathRoutes } from '@/constants/routes'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { changeDialogIsOpen, getDialogState } from '@/features/dialogs/dialogSlice'
import { useChangeOrderManagerMutation } from '@/features/orders/ordersApiSlice'
import { Dialog } from '@/features/dialogs/components/Dialog'
import { Fallback } from '@/components/Fallback/Fallback'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { useChangeClientManagerMutation, useGetManagersQuery } from '../../managerApiSlice'
import { getUserId } from '../../userSlice'

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
	const [change, { isLoading: isChanging }] = useChangeClientManagerMutation()
	const [changeOrder, { isLoading }] = useChangeOrderManagerMutation()

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

		const orderDTO = {
			orderId: context.id,
			userId: context.userId,
			managerId: user.id,
			managerEmail: user.email,
			oldManagerId: userId || '',
		}
		try {
			await changeOrder(orderDTO).unwrap()
			dispatch(changeDialogIsOpen({ variant: 'Orders', isOpen: false }))
		} catch {
			toast.error('Не удалось изменить менеджера в заказе')
		}

		if (location.pathname != PathRoutes.Manager.Orders.Base) navigate(PathRoutes.Manager.Orders.Base)
	}

	if (isFetching) return <Fallback />
	return (
		<>
			{isLoading || isChanging ? <TopFallback /> : null}
			<List sx={{ mt: -3 }}>
				{data?.data
					.filter(d => d.id != userId)
					.map(d => (
						<ListItem key={d.id} disablePadding divider>
							<ListItemButton onClick={changeHandler(d)} sx={{ borderRadius: 4 }}>
								<ListItemText inset primary={d.name} />
							</ListItemButton>
						</ListItem>
					))}
			</List>
		</>
	)
}
