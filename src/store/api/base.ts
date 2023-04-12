import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { clearUser } from '../user'

export const baseUrl = '/api/v1/'

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
	tagTypes: ['Api'],
	endpoints: builder => ({}),
})

export const {} = api

// проверка статуса ответа. если он 401, то пользователь не авторизован и его надо выкинуть на страницу авторизации
export const unauthenticatedMiddleware: Middleware =
	({ dispatch }: MiddlewareAPI) =>
	next =>
	action => {
		if (isRejectedWithValue(action) && action.payload.status === 401) {
			dispatch(clearUser())
		}
		return next(action)
	}
