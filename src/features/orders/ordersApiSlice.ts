import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IFullOrder, IOrderCount } from './types/order'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const ordersApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение последних заявок
		getLastOrders: builder.query<{ data: { orders: IFullOrder[] } }, null>({
			query: () => API.orders.last,
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		// получение заявки по номеру
		getOrderByNumber: builder.query<{ data: IFullOrder }, string>({
			query: number => `${API.orders.number}/${number}`,
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		getOrdersCount: builder.query<{ data: IOrderCount[] }, null>({
			query: () => API.orders.count,
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		// // получение всех открытых заявок конкретного менеджера
		// getOpen: builder.query<{ data: IManagerOrder[] }, null>({
		// 	query: () => `${proUrl}/orders/open`,
		// 	providesTags: [{ type: 'Api', id: 'orders/open' }],
		// }),
		// // получение заявки с ее позициями и данными о пользователями который ее оформил
		// getFullOrder: builder.query<{ data: { user: IUser; order: IFullOrder } }, string>({
		// 	query: id => `${proUrl}/orders/${id}`,
		// }),

		// // закрытие заявки
		// finishOrder: builder.mutation<string, string>({
		// 	query: id => ({
		// 		url: `${proUrl}/orders/finish`,
		// 		method: 'POST',
		// 		body: { orderId: id },
		// 	}),
		// 	invalidatesTags: [{ type: 'Api', id: 'orders/open' }],
		// }),

		// // изменение менеджера привязанного к заявке
		// setOrderManager: builder.mutation<string, OrderManger>({
		// 	query: data => ({
		// 		url: `${proUrl}/orders/manager`,
		// 		method: 'POST',
		// 		body: data,
		// 	}),
		// 	invalidatesTags: [{ type: 'Api', id: 'orders/open' }],
		// }),
	}),
})

export const { useGetLastOrdersQuery, useGetOrderByNumberQuery, useGetOrdersCountQuery } = ordersApiSlice
