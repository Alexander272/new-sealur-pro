import type { ISignIn, ISignUp } from '@/types/auth'
import type { IUser } from '@/types/user'
import { api } from './base'
import { clearUser } from '../user'

export const authApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		signIn: builder.mutation<{ data: IUser }, ISignIn>({
			query: data => ({
				url: '/auth/sign-in',
				method: 'POST',
				body: data,
			}),
		}),

		signUp: builder.mutation<null, ISignUp>({
			query: data => ({
				url: '/auth/sign-up',
				method: 'POST',
				body: data,
			}),
		}),

		signOut: builder.mutation<null, null>({
			query: () => ({
				url: '/auth/sign-out',
				method: 'POST',
			}),
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					console.log(error)
				} finally {
					api.dispatch(clearUser())
				}
			},
		}),

		refresh: builder.query<{ data: IUser }, null>({
			query: () => ({
				url: '/auth/refresh',
				method: 'POST',
			}),
		}),
	}),
})

export const { useSignInMutation, useSignUpMutation, useSignOutMutation, useRefreshQuery } = authApi
