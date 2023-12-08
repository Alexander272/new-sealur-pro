import type { IUser } from '@/types/user'
import { api } from './base'

export const userApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение полных данных о пользователе
		getUser: builder.query<{ data: IUser }, string>({
			query: userId => `users/${userId}`,
		}),

		// подтверждение пользователя
		confirm: builder.mutation<{ data: IUser }, string>({
			query: code => ({
				url: `/users/confirm/${code}`,
				method: 'POST',
			}),
		}),

		// запрос на получение кода для восстановления пароля
		getRecoveryCode: builder.mutation<null, string>({
			query: email => ({
				url: '/users/recovery',
				method: 'POST',
				body: { email },
			}),
		}),

		// запрос на обновление пароля
		setPassword: builder.mutation<null, { code: string; password: string }>({
			query: data => ({
				url: `/users/recovery/${data.code}`,
				method: 'POST',
				body: { password: data.password },
			}),
		}),
	}),
})

export const { useGetUserQuery, useConfirmMutation, useGetRecoveryCodeMutation, useSetPasswordMutation } = userApi
