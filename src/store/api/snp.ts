import type { ISnpDataResponse, ISnpResponse, ISnpStandardResponse } from '@/types/snp'
import { api } from './base'

type SnpDataRequest = {
	standardId?: string
	snpStandardId?: string
}

type SnpRequest = {
	typeId: string
	hasD2?: boolean
}

export const proUrl = 'sealur-pro'

export const snpApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение стандартов на прокладки и фланцы
		getStandardForSNP: builder.query<ISnpStandardResponse, null>({
			query: () => `${proUrl}/snp-standards/`,
		}),
		// получение общих данных (материалов, наполнителей, типах фланца, креплений) о типах прокладок (зависит от стандарта)
		getSnpData: builder.query<ISnpDataResponse, SnpDataRequest>({
			query: ({ standardId = '', snpStandardId = '' }) => ({
				url: `${proUrl}/snp-new/data`,
				method: 'GET',
				params: new URLSearchParams([
					['standardId', standardId],
					['snpStandardId', snpStandardId],
				]),
			}),
		}),
		// получение данных о выбранной прокладке и ее размеры (зависит от выбранного типа)
		getSnp: builder.query<ISnpResponse, SnpRequest>({
			query: ({ typeId, hasD2 }) => ({
				url: `${proUrl}/snp-new`,
				method: 'GET',
				params: new URLSearchParams([
					['typeId', typeId],
					['hasD2', `${hasD2 || ''}`],
				]),
			}),
		}),
	}),
	overrideExisting: false,
})

export const { useGetSnpDataQuery, useGetStandardForSNPQuery, useGetSnpQuery } = snpApi
