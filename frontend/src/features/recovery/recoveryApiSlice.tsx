import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const recoveryApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// запрос на получение кода для восстановления пароля
		getRecoveryCode: builder.mutation<null, string>({
			query: email => ({
				url: API.users.recovery,
				method: 'POST',
				body: { email },
			}),
		}),

		// запрос на обновление пароля
		setPassword: builder.mutation<null, { code: string; password: string }>({
			query: data => ({
				url: `${API.users.recovery}/${data.code}`,
				method: 'POST',
				body: { password: data.password },
			}),
		}),
	}),
})

export const { useGetRecoveryCodeMutation, useSetPasswordMutation } = recoveryApiSlice
