import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IUser } from './types/user'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const managerApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getManagers: builder.query<{ data: IUser[] }, null>({
			query: () => API.users.managers,
			providesTags: [{ type: 'Managers', id: 'All' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		changeClientManager: builder.mutation<null, { id: string; managerId: string }>({
			query: data => ({
				url: API.users.changeManager,
				method: 'POST',
				body: data,
			}),
			// invalidatesTags: [{ type: 'Managers', id: 'ALL' }],
		}),
	}),
})

export const { useGetManagersQuery, useChangeClientManagerMutation } = managerApiSlice
