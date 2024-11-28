import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { ICopyOrder, IFullOrder, IOrder, IOrderCount, IOrderResponse } from './types/order'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const ordersApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение текущей заявки
		getOrder: builder.query<IOrderResponse, null>({
			query: () => API.orders.current,
			providesTags: [{ type: 'Orders', id: 'current' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить текущую заявку', { autoClose: false })
				}
			},
		}),
		// получение всех прошлых заявок
		getAllOrders: builder.query<{ data: IFullOrder[] }, null>({
			query: () => API.orders.all,
			providesTags: [{ type: 'Orders', id: 'all' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить список заявок', { autoClose: false })
				}
			},
		}),
		// оформление заявки с последующей ее отправкой менеджеру
		saveOrder: builder.mutation<string, IOrder>({
			query: order => ({
				url: API.orders.save,
				method: 'POST',
				body: order,
			}),
			invalidatesTags: [
				{ type: 'Orders', id: 'current' },
				{ type: 'Orders', id: 'all' },
			],
		}),

		// сохранение доп. информации о заявке
		saveInfo: builder.mutation<string, { orderId: string; info: string }>({
			query: info => ({
				url: API.orders.info,
				method: 'PUT',
				body: info,
			}),
		}),
		// перенос всех позиций из прошлой заявки в текущую
		copyOrder: builder.mutation<string, ICopyOrder>({
			query: order => ({
				url: API.orders.copy,
				method: 'POST',
				body: order,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'current' }],
		}),

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

export const {
	useGetOrderQuery,
	useSaveOrderMutation,
	useGetAllOrdersQuery,
	useSaveInfoMutation,
	useCopyOrderMutation,
	useGetLastOrdersQuery,
	useGetOrderByNumberQuery,
	useGetOrdersCountQuery,
} = ordersApiSlice
