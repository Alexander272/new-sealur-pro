import { IUser } from '@/types/user'
import { api } from './base'

export const userApi = api.injectEndpoints({
	endpoints: builder => ({
		getUser: builder.query<{ data: IUser }, string>({
			query: userId => `users/${userId}`,
		}),
	}),
	overrideExisting: false,
})

export const { useGetUserQuery } = userApi
