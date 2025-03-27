import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type {
	IGroupedOrderStatistics,
	IOrderCount,
	IOrderStatistics,
	IUserParams,
	IUsersInfo,
	IUsersStatistics,
} from './types/analytics'
import type { PositionType } from '../card/types/card'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const analyticsApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getOrdersStats: builder.query<{ data: IOrderStatistics }, null>({
			query: () => ({
				url: API.analytics.ordersStats.base,
				method: 'GET',
			}),
			providesTags: [{ type: 'Analytics', id: 'OrdersStats' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),
		getGroupedOrdersStats: builder.query<{ data: IGroupedOrderStatistics[] }, { from: string; to: string } | null>({
			query: req => ({
				url: API.analytics.ordersStats.grouped,
				method: 'GET',
				params: req ? { 'period[from]': req.from, 'period[to]': req.to } : undefined,
			}),
			providesTags: [{ type: 'Analytics', id: 'GroupedOrdersStats' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),
		getOrdersCount: builder.query<{ data: IOrderCount[] }, PositionType | undefined>({
			query: req => ({
				url: API.analytics.ordersCount,
				method: 'GET',
				params: req ? { type: req } : undefined,
			}),
			providesTags: [{ type: 'Analytics', id: 'OrdersCount' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		getUsersStats: builder.query<{ data: IUsersStatistics }, { from: string; to: string } | null>({
			query: req => ({
				url: API.analytics.users.stats,
				method: 'GET',
				params: req ? { 'period[from]': req.from, 'period[to]': req.to } : undefined,
			}),
			providesTags: [{ type: 'Analytics', id: 'UsersStats' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),
		getUsersInfo: builder.query<{ data: IUsersInfo[] }, IUserParams | null>({
			query: req => ({
				url: API.analytics.users.info,
				method: 'GET',
				params: new URLSearchParams({
					'period[from]': req?.from || '',
					'period[to]': req?.to || '',
					fromManager: `${req?.fromManager == undefined ? '' : req?.fromManager}`,
					withOrders: `${req?.withOrders == undefined ? '' : req?.withOrders}`,
					confirmed: `${req?.confirmed == undefined ? '' : req?.confirmed}`,
				}),
			}),
			providesTags: [{ type: 'Analytics', id: 'UsersInfo' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),
	}),
})

export const {
	useGetOrdersStatsQuery,
	useGetGroupedOrdersStatsQuery,
	useGetOrdersCountQuery,
	useGetUsersStatsQuery,
	useGetUsersInfoQuery,
} = analyticsApiSlice
