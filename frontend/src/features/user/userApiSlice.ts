import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IUser, IUserInfo } from './types/user'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const userApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение полных данных о пользователе
		getUser: builder.query<{ data: IUser }, string>({
			query: userId => `${API.users.base}/${userId}`,
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		getUserInfo: builder.query<{ data: IUserInfo }, string>({
			query: userId => `${API.users.info}/${userId}`,
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		// подтверждение пользователя
		confirm: builder.mutation<{ data: IUser }, string>({
			query: code => ({
				url: `${API.users.confirm}/${code}`,
				method: 'POST',
			}),
		}),

		updateUser: builder.mutation<null, IUser>({
			query: user => ({
				url: `${API.users.base}/${user.id}`,
				method: 'PUT',
				body: user,
			}),
		}),
		updateUsersPassword: builder.mutation<null, { userId: string; password: string }>({
			query: data => ({
				url: `${API.users.base}/${data.userId}/password`,
				method: 'PUT',
				body: data,
			}),
		}),
	}),
})

export const {
	useGetUserQuery,
	useGetUserInfoQuery,
	useConfirmMutation,
	useUpdateUserMutation,
	useUpdateUsersPasswordMutation,
} = userApiSlice
