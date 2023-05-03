import type { IAnalytics } from '@/types/analytics'
import { api } from './base'
import { proUrl } from './snp'

type AnalyticRequest = {
	periodAt: string
	periodEnd: string
}

type AnalyticsResponse = {
	data: IAnalytics
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
	}),
	overrideExisting: false,
})

export const { useGetAnalyticsQuery } = analyticApi
