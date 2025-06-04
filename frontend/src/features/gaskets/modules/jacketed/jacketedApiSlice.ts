import { toast } from 'react-toastify'

import type { IConstruction, IFlangeType, IJacketedStandard, IJacketedType } from './types/main'
import { apiSlice } from '@/app/apiSlice'
import { API } from '@/app/api'

export const jacketedApi = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение стандартов на прокладки и фланцы
		getJacketedStandard: builder.query<{ data: IJacketedStandard[] }, null>({
			query: () => API.jacketed.standards,
			providesTags: [{ type: 'Jacketed', id: 'standards' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить стандарты', { autoClose: false })
				}
			},
		}),
		// получение типов фланцев
		getJacketedFlangeTypes: builder.query<{ data: IFlangeType[] }, string>({
			query: standard => ({
				url: API.jacketed.flangeTypes,
				params: new URLSearchParams({ standard }),
			}),
			providesTags: [{ type: 'Jacketed', id: 'flangeTypes' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы фланцев', { autoClose: false })
				}
			},
		}),
		// получение типов прокладок
		getJacketedTypes: builder.query<{ data: IJacketedType[] }, string>({
			query: flange => ({
				url: API.jacketed.types,
				params: new URLSearchParams({ flange }),
			}),
			providesTags: [{ type: 'Jacketed', id: 'types' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы прокладок', { autoClose: false })
				}
			},
		}),
		// получение типов конструкций
		getJacketedConstructions: builder.query<{ data: IConstruction[] }, null>({
			query: () => ({
				url: API.jacketed.constructions,
			}),
			providesTags: [{ type: 'Jacketed', id: 'constructions' }],
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
	useGetJacketedStandardQuery,
	useGetJacketedFlangeTypesQuery,
	useGetJacketedTypesQuery,
	useGetJacketedConstructionsQuery,
} = jacketedApi
