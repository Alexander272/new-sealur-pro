import { toast } from 'react-toastify'

import type { IBaseFetchError, IFetchError } from '@/app/types/error'
import type {
	ICopyOrder,
	IFullOrder,
	IOrderCount,
	IOrderMangerDTO,
	IOrderResponse,
	IOrderWithCompany,
	ISaveOrder,
} from './types/order'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'
import { saveAs } from '../files/utils/save'

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
			query: () => API.orders.base,
			providesTags: [{ type: 'Orders', id: 'all' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить список заявок', { autoClose: false })
				}
			},
		}),

		getOrderById: builder.query<{ data: IFullOrder }, string>({
			query: id => `${API.orders.base}/${id}`,
			providesTags: (_arr, _err, arg) => [
				{ type: 'Orders', id: 'all' },
				{ type: 'Orders', id: arg },
			],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить заявку', { autoClose: false })
				}
			},
		}),
		getOrdersByManager: builder.query<{ data: IOrderWithCompany[] }, null>({
			query: () => API.orders.manager,
			providesTags: [{ type: 'Orders', id: 'all' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить список заявок', { autoClose: false })
				}
			},
		}),
		downloadOrder: builder.query<null, { id: string; name: string }>({
			queryFn: async (data, _api, _, baseQuery) => {
				let filename = ''
				const result = await baseQuery({
					url: API.orders.download.replace(':id', data.id),
					cache: 'no-cache',
					responseHandler: response => {
						filename = response.headers.get('Content-Disposition')?.split('=')[1] || ''
						return response.status === 200 ? response.blob() : response.json()
					},
				})

				if (result.error) {
					console.log(result.error)
					const fetchError = result.error as IFetchError
					toast.error(fetchError.data.message, { autoClose: false })
				}
				const type = filename.split('.')[1]

				if (result.data instanceof Blob) saveAs(result.data, `${data.name}.${type}`)
				return { data: null }
			},
		}),

		// оформление заявки с последующей ее отправкой менеджеру
		saveOrder: builder.mutation<string, ISaveOrder>({
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
				url: `${API.orders.copy}/${order.id}`,
				method: 'POST',
				body: order,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'current' }],
		}),

		// получение последних заявок
		// getLastOrders: builder.query<{ data: { orders: IFullOrder[] } }, null>({
		// 	query: () => API.orders.last,
		// 	onQueryStarted: async (_arg, api) => {
		// 		try {
		// 			await api.queryFulfilled
		// 		} catch (error) {
		// 			const fetchError = (error as IBaseFetchError).error
		// 			toast.error(fetchError.data.message, { autoClose: false })
		// 		}
		// 	},
		// }),

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

		// закрытие заявки
		finishOrder: builder.mutation<string, string>({
			query: id => ({
				url: API.orders.finish,
				method: 'POST',
				body: { orderId: id },
			}),
			invalidatesTags: [{ type: 'Orders', id: 'all' }],
		}),

		// изменение менеджера привязанного к заявке
		changeOrderManager: builder.mutation<string, IOrderMangerDTO>({
			query: data => ({
				url: API.orders.changeManager,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'all' }],
		}),
	}),
})

export const {
	useGetOrderQuery,
	useSaveOrderMutation,
	useGetAllOrdersQuery,
	useGetOrderByIdQuery,
	useGetOrdersByManagerQuery,
	useDownloadOrderQuery,
	useLazyDownloadOrderQuery,
	useSaveInfoMutation,
	useCopyOrderMutation,
	// useGetLastOrdersQuery,
	useGetOrderByNumberQuery,
	useGetOrdersCountQuery,
	useFinishOrderMutation,
	useChangeOrderManagerMutation,
} = ordersApiSlice
