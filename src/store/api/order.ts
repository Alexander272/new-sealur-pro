import { ICopyOrder, IFullOrder, IOrder, IOrderResponse } from '@/types/order'
import { Position } from '@/types/card'
import { ICopyPosition } from '@/types/position'
import { api } from './base'
import { proUrl } from './snp'

export const orderApi = api.injectEndpoints({
	endpoints: builder => ({
		getOrder: builder.query<IOrderResponse, null>({
			query: () => proUrl + '/orders/current',
			providesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		getAllOrders: builder.query<{ data: IFullOrder[] }, null>({
			query: () => proUrl + 'orders/all',
			providesTags: [{ type: 'Api', id: 'orders/all' }],
		}),

		saveOrder: builder.mutation<string, IOrder>({
			query: order => ({
				url: proUrl + 'orders/save',
				method: 'POST',
				body: order,
			}),
			invalidatesTags: [
				{ type: 'Api', id: 'orders/current' },
				{ type: 'Api', id: 'orders/all' },
			],
		}),

		createPosition: builder.mutation<string, Position>({
			query: position => ({
				url: proUrl + 'positions',
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		updatePosition: builder.mutation<string, Position>({
			query: position => ({
				url: `${proUrl}/positions/${position.id}`,
				method: 'PUT',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		deletePosition: builder.mutation<string, string>({
			query: positionId => ({
				url: `${proUrl}/positions/${positionId}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),

		copyPosition: builder.mutation<string, ICopyPosition>({
			query: position => ({
				url: `${proUrl}/positions/${position.id}`,
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		copyOrder: builder.mutation<string, ICopyOrder>({
			query: order => ({
				url: proUrl + 'orders/copy',
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
	useCreatePositionMutation,
	useUpdatePositionMutation,
	useDeletePositionMutation,
	useCopyPositionMutation,
	useCopyOrderMutation,
} = orderApi
