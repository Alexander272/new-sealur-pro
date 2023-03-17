import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISnpDateResponse, ISnpResponse, ISnpStandardResponse } from '@/types/snp'
import { IOrderResponse } from '@/types/order'
import { Position } from '@/types/card'

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

		createPosition: builder.mutation<string, Position>({
			query: position => ({
				url: 'positions',
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Api', id: 'orders/current' }],
		}),
	}),
})

export const {
	useGetSnpDataQuery,
	useGetStandardForSNPQuery,
	useGetSnpQuery,
	useGetOrderQuery,
	useCreatePositionMutation,
} = api
