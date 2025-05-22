import { toast } from 'react-toastify'

import type { IFlangeType, ISerratedStandard } from './types/main'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const serratedApi = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение стандартов на прокладки и фланцы
		getSerratedStandard: builder.query<{ data: ISerratedStandard[] }, null>({
			query: () => API.serrated.standards,
			providesTags: [{ type: 'Serrated', id: 'standards' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить стандарты', { autoClose: false })
				}
			},
		}),
		// получение типов фланцев
		getSerratedFlangeTypes: builder.query<{ data: IFlangeType[] }, string>({
			query: standard => ({
				url: API.serrated.flangeTypes,
				params: new URLSearchParams({ standard }),
			}),
			providesTags: [{ type: 'Serrated', id: 'flangeTypes' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы фланцев', { autoClose: false })
				}
			},
		}),
	}),
})

export const { useGetSerratedStandardQuery, useGetSerratedFlangeTypesQuery } = serratedApi
