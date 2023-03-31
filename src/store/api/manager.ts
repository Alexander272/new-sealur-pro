import { IFullOrder, IManagerOrder } from '@/types/order'
import { IUser } from '@/types/user'
import { api } from './base'
import { proUrl } from './snp'

export const managerApi = api.injectEndpoints({
	endpoints: builder => ({
		getOpen: builder.query<{ data: IManagerOrder[] }, null>({
			query: () => `${proUrl}/orders/open`,
			providesTags: [{ type: 'Api', id: 'orders/open' }],
		}),
		getFullOrder: builder.query<{ data: { user: IUser; order: IFullOrder } }, string>({
			query: id => `${proUrl}/orders/${id}`,
		}),

		finishOrder: builder.mutation<string, string>({
			query: id => ({
				url: `${proUrl}/orders/finish`,
				method: 'POST',
				body: { orderId: id },
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/open' }],
		}),

		getManagers: builder.query<{ data: { users: IUser[] } }, null>({
			query: () => `users/managers`,
		}),
		setOrderManager: builder.mutation<string, { orderId: string; managerId: string }>({
			query: data => ({
				url: `${proUrl}/orders/manager`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/open' }],
		}),
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
