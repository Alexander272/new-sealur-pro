import type { ICopyOrder, IFullOrder, IOrder, IOrderResponse } from '@/types/order'
import type { Position } from '@/types/card'
import type { ICopyPosition } from '@/types/position'
import { api } from './base'
import { proUrl } from './snp'

export const orderApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение текущей заявки
		getOrder: builder.query<IOrderResponse, null>({
			query: () => proUrl + '/orders/current',
			providesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		// получение всех прошлых заявок
		getAllOrders: builder.query<{ data: IFullOrder[] }, null>({
			query: () => proUrl + '/orders/all',
			providesTags: [{ type: 'Api', id: 'orders/all' }],
		}),

		// оформление заявки с последующей ее отправкой менеджеру
		saveOrder: builder.mutation<string, IOrder>({
			query: order => ({
				url: proUrl + '/orders/save',
				method: 'POST',
				body: order,
			}),
			invalidatesTags: [
				{ type: 'Api', id: 'orders/current' },
				{ type: 'Api', id: 'orders/all' },
			],
		}),

		// сохранение доп. информации о заявке
		saveInfo: builder.mutation<string, { orderId: string; info: string }>({
			query: info => ({
				url: `${proUrl}/orders/info`,
				method: 'PUT',
				body: info,
			}),
		}),

		// добавление позиции
		createPosition: builder.mutation<string, Position>({
			query: position => ({
				url: proUrl + '/positions',
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		// обновление позиции
		updatePosition: builder.mutation<string, Position>({
			query: position => ({
				url: `${proUrl}/positions/${position.id}`,
				method: 'PUT',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		// удаление позиции
		deletePosition: builder.mutation<string, string>({
			query: positionId => ({
				url: `${proUrl}/positions/${positionId}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),

		// перенос позиции из прошлой заявки в текущую
		copyPosition: builder.mutation<string, ICopyPosition>({
			query: position => ({
				url: `${proUrl}/positions/${position.id}`,
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		// перенос всех позиций из прошлой заявки в текущую
		copyOrder: builder.mutation<string, ICopyOrder>({
			query: order => ({
				url: proUrl + '/orders/copy',
				method: 'POST',
				body: order,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetOrderQuery,
	useGetAllOrdersQuery,
	useSaveOrderMutation,
	useSaveInfoMutation,
	useCreatePositionMutation,
	useUpdatePositionMutation,
	useDeletePositionMutation,
	useCopyPositionMutation,
	useCopyOrderMutation,
} = orderApi
