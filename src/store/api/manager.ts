import { IFullOrder, IManagerOrder } from '@/types/order'
import { IUser } from '@/types/user'
import { api } from './base'
import { proUrl } from './snp'

// кусок стора для менеджеров
export const managerApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение всех открытых заявок конкретного менеджера
		getOpen: builder.query<{ data: IManagerOrder[] }, null>({
			query: () => `${proUrl}/orders/open`,
			providesTags: [{ type: 'Api', id: 'orders/open' }],
		}),
		// получение заявки с ее позициями и данными о пользователями который ее оформил
		getFullOrder: builder.query<{ data: { user: IUser; order: IFullOrder } }, string>({
			query: id => `${proUrl}/orders/${id}`,
		}),

		// закрытие заявки
		finishOrder: builder.mutation<string, string>({
			query: id => ({
				url: `${proUrl}/orders/finish`,
				method: 'POST',
				body: { orderId: id },
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/open' }],
		}),

		// получение списка пользователь с ролью менеджера
		getManagers: builder.query<{ data: { users: IUser[] } }, null>({
			query: () => `users/managers`,
		}),
		// изменение менеджера привязанного к заявке
		setOrderManager: builder.mutation<string, { orderId: string; managerId: string }>({
			query: data => ({
				url: `${proUrl}/orders/manager`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/open' }],
		}),
		// изменение менеджера привязанного к пользователю
		setUserManager: builder.mutation<string, { id: string; managerId: string }>({
			query: data => ({
				url: 'users/manager',
				method: 'POST',
				body: data,
			}),
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetOpenQuery,
	useGetFullOrderQuery,
	useFinishOrderMutation,
	useGetManagersQuery,
	useSetOrderManagerMutation,
	useSetUserManagerMutation,
} = managerApi
