import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IAnalyticFullClient, IAnalyticFullOrder, IAnalytics, IOrderParams, IUserParams } from './types/analytics'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const analyticsApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение аналитики
		getAnalytics: builder.query<{ data: IAnalytics }, { periodAt: string; periodEnd: string }>({
			query: req => ({
				url: API.analytics.base,
				method: 'GET',
				params: new URLSearchParams([
					['periodAt', req.periodAt],
					['periodEnd', req.periodEnd],
				]),
			}),
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		// получение аналитики по пользователям
		getAnalyticUsers: builder.query<{ data: IAnalyticFullClient[] }, IUserParams | null>({
			query: req => ({
				url: API.analytics.users,
				method: 'GET',
				params: new URLSearchParams([
					['periodAt', req?.periodAt?.toString() || ''],
					['periodEnd', req?.periodEnd?.toString() || ''],
					['useLink', `${req?.useLink != undefined ? req?.useLink : ''}`],
					['hasOrder', `${req?.hasOrders || ''}`],
				]),
			}),
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		// получение аналитики по заявкам
		getAnalyticsOrders: builder.query<{ data: IAnalyticFullOrder[] }, IOrderParams | null>({
			query: req => ({
				url: API.analytics.orders,
				method: 'GET',
				params: new URLSearchParams([
					['periodAt', req?.periodAt?.toString() || ''],
					['periodEnd', req?.periodEnd?.toString() || ''],
					['userId', req?.userId || ''],
				]),
			}),
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		// получение данных о пользователе
		// getUserData: builder.query<UserResponse, string>({
		// 	query: userId => `users/full/${userId}`,
		// }),
	}),
})

export const { useGetAnalyticsQuery, useGetAnalyticUsersQuery, useGetAnalyticsOrdersQuery } = analyticsApiSlice
