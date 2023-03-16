import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISnpDateResponse, ISnpResponse, ISnpStandardResponse } from '@/types/snp'

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
	}),
})

export const { useGetSnpDataQuery, useGetStandardForSNPQuery, useGetSnpQuery } = api
