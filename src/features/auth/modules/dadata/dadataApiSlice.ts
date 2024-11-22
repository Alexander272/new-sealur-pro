import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

import type { CompanyInfo } from './types/company'

const url = 'https://suggestions.dadata.ru'
const token = '9a6dcd7726f126ca397fedf086f2ee87ff9319f1'

// часть возвращаемых данных (то, что используется в программе)

export const dadataApi = createApi({
	reducerPath: 'dadata',
	baseQuery: fetchBaseQuery({
		baseUrl: url,
		mode: 'cors',
		credentials: 'same-origin',
		prepareHeaders: headers => {
			headers.set('authorization', `Token ${token}`)

			return headers
		},
	}),
	tagTypes: ['Dadata'],
	endpoints: builder => ({
		findCompany: builder.query<{ suggestions: CompanyInfo[] }, string>({
			query: query => ({
				url: '/suggestions/api/4_1/rs/suggest/party',
				method: 'POST',
				body: { query },
			}),
		}),
	}),
})

export const { useFindCompanyQuery } = dadataApi
