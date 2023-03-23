import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISnpDateResponse, ISnpResponse, ISnpStandardResponse } from '@/types/snp'
import { ICopyOrder, IFullOrder, IManagerOrder, IOrder, IOrderResponse } from '@/types/order'
import { Position } from '@/types/card'
import { IUser } from '@/types/user'
import { ICopyPosition } from '@/types/position'

export const baseUrl = '/api/v1/sealur-pro/'

type SnpDataRequest = {
	standardId?: string
	snpStandardId?: string
}

type SnpRequest = {
	typeId: string
	hasD2?: boolean
}

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
	tagTypes: ['Api'],
	endpoints: builder => ({
		getStandardForSNP: builder.query<ISnpStandardResponse, null>({
			query: () => `snp-standards`,
		}),
		getSnpData: builder.query<ISnpDateResponse, SnpDataRequest>({
			query: ({ standardId = '', snpStandardId = '' }) => ({
				url: 'snp-new/data',
				method: 'GET',
				params: new URLSearchParams([
					['standardId', standardId],
					['snpStandardId', snpStandardId],
				]),
			}),
		}),
		getSnp: builder.query<ISnpResponse, SnpRequest>({
			query: ({ typeId, hasD2 }) => ({
				url: 'snp-new',
				method: 'GET',
				params: new URLSearchParams([
					['typeId', typeId],
					['hasD2', `${hasD2 || ''}`],
				]),
			}),
		}),
		getOrder: builder.query<IOrderResponse, null>({
			query: () => 'orders/current',
			providesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		getAllOrders: builder.query<{ data: IFullOrder[] }, null>({
			query: () => 'orders/all',
			providesTags: [{ type: 'Api', id: 'orders/all' }],
		}),

		saveOrder: builder.mutation<string, IOrder>({
			query: order => ({
				url: 'orders/save',
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
				url: 'positions',
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		updatePosition: builder.mutation<string, Position>({
			query: position => ({
				url: `positions/${position.id}`,
				method: 'PUT',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		deletePosition: builder.mutation<string, string>({
			query: positionId => ({
				url: `positions/${positionId}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),

		copyPosition: builder.mutation<string, ICopyPosition>({
			query: position => ({
				url: `positions/${position.id}`,
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
		copyOrder: builder.mutation<string, ICopyOrder>({
			query: order => ({
				url: 'orders/copy',
				method: 'POST',
				body: order,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),

		// managers functions
		getOpen: builder.query<{ data: IManagerOrder[] }, null>({
			query: () => `orders/open`,
			providesTags: [{ type: 'Api', id: 'orders/open' }],
		}),
		getFullOrder: builder.query<{ data: { user: IUser; order: IFullOrder } }, string>({
			query: id => `orders/${id}`,
		}),

		finishOrder: builder.mutation<string, string>({
			query: id => ({
				url: 'orders/finish',
				method: 'POST',
				body: { orderId: id },
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/open' }],
		}),
	}),
})

export const {
	useGetSnpDataQuery,
	useGetStandardForSNPQuery,
	useGetSnpQuery,
	useGetOrderQuery,
	useGetAllOrdersQuery,
	useSaveOrderMutation,
	useCreatePositionMutation,
	useUpdatePositionMutation,
	useDeletePositionMutation,
	useCopyPositionMutation,
	useCopyOrderMutation,

	useGetOpenQuery,
	useGetFullOrderQuery,
	useFinishOrderMutation,
} = api
