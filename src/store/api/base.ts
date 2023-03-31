import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseUrl = '/api/v1/'

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
	tagTypes: ['Api'],
	endpoints: builder => ({}),
})

export const {} = api
