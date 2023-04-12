import { IUser } from '@/types/user'
import { api } from './base'

export const userApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение полных данных о пользователе
		getUser: builder.query<{ data: IUser }, string>({
			query: userId => `users/${userId}`,
		}),
	}),
	overrideExisting: false,
})

export const { useGetUserQuery } = userApi
