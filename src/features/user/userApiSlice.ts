import { API } from '@/app/api'
import type { IUser } from './types/user'
import { apiSlice } from '@/app/apiSlice'

export const userApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение полных данных о пользователе
		getUser: builder.query<{ data: IUser }, string>({
			query: userId => `${API.users.base}/${userId}`,
		}),

		// подтверждение пользователя
		confirm: builder.mutation<{ data: IUser }, string>({
			query: code => ({
				url: `${API.users.confirm}/${code}`,
				method: 'POST',
			}),
		}),
	}),
})

export const { useGetUserQuery, useConfirmMutation } = userApiSlice
