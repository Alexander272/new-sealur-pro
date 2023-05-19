import type { IAnalyticFullClient, IAnalyticFullOrder, IAnalytics, IOrderParams, IUserParams } from '@/types/analytics'
import type { IUserData } from '@/types/user'
import { api } from './base'
import { proUrl } from './snp'

type AnalyticRequest = {
	periodAt: string
	periodEnd: string
}

type AnalyticsResponse = {
	data: IAnalytics
}

type AnalyticUserResponse = {
	data: IAnalyticFullClient[]
}

type AnalyticsOrderResponse = {
	data: IAnalyticFullOrder[]
}

type UserResponse = {
	data: IUserData
}

// кусок стора для аналитики
export const analyticApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение аналитики
		getAnalytics: builder.query<AnalyticsResponse, AnalyticRequest>({
			query: req => ({
				url: `${proUrl}/orders/analytics`,
				method: 'GET',
				params: new URLSearchParams([
					['periodAt', req.periodAt],
					['periodEnd', req.periodEnd],
				]),
			}),
		}),

		// получение аналитики по пользователям
		getAnalyticUsers: builder.query<AnalyticUserResponse, IUserParams | null>({
			query: req => ({
				url: `users/analytics`,
				method: 'GET',
				params: new URLSearchParams([
					['periodAt', req?.periodAt?.toString() || ''],
					['periodEnd', req?.periodEnd?.toString() || ''],
					['useLink', `${req?.useLink != undefined ? req?.useLink : ''}`],
					['hasOrder', `${req?.hasOrders || ''}`],
				]),
			}),
		}),

		// получение данных о пользователе
		getUserData: builder.query<UserResponse, string>({
			query: userId => `users/full/${userId}`,
		}),

		// получение аналитики по заявкам
		getAnalyticsOrders: builder.query<AnalyticsOrderResponse, IOrderParams | null>({
			query: req => ({
				url: `${proUrl}/orders/analytics/full`,
				method: 'GET',
				params: new URLSearchParams([
					['periodAt', req?.periodAt?.toString() || ''],
					['periodEnd', req?.periodEnd?.toString() || ''],
					['userId', req?.userId || ''],
				]),
			}),
		}),
	}),
	overrideExisting: false,
})

export const { useGetAnalyticsQuery, useGetAnalyticUsersQuery, useGetAnalyticsOrdersQuery, useGetUserDataQuery } =
	analyticApi
