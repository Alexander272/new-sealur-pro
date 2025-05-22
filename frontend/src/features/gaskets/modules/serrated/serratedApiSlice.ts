import { toast } from 'react-toastify'

import type { IConstruction, IFlangeType, ISerratedStandard, ISerratedType } from './types/main'
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
		// получение типов прокладок
		getSerratedTypes: builder.query<{ data: ISerratedType[] }, string>({
			query: flange => ({
				url: API.serrated.types,
				params: new URLSearchParams({ flange }),
			}),
			providesTags: [{ type: 'Serrated', id: 'types' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы прокладок', { autoClose: false })
				}
			},
		}),
		// получение типов конструкций
		getSerratedConstructions: builder.query<{ data: IConstruction[] }, string>({
			query: type => ({
				url: API.serrated.constructions,
				params: new URLSearchParams({ type }),
			}),
			providesTags: [{ type: 'Serrated', id: 'constructions' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы конструкций', { autoClose: false })
				}
			},
		}),
	}),
})

export const {
	useGetSerratedStandardQuery,
	useGetSerratedFlangeTypesQuery,
	useGetSerratedTypesQuery,
	useGetSerratedConstructionsQuery,
} = serratedApi
