import { toast } from 'react-toastify'

import type { IConstruction, IFlangeType, ISerratedStandard, ISerratedType } from './types/main'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'
import { IDn, ISize } from './types/sizes'

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

		// получение условного прохода
		getSerratedDn: builder.query<{ data: IDn[] }, string>({
			query: flange => ({
				url: API.serrated.sizes.dn,
				params: new URLSearchParams({ flange }),
			}),
			providesTags: [{ type: 'Serrated', id: 'dn' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить условный проход', { autoClose: false })
				}
			},
		}),
		// получение размеров
		getSerratedSizes: builder.query<{ data: ISize[] }, { type: string; dn: string }>({
			query: req => ({
				url: API.serrated.sizes.base,
				params: new URLSearchParams({
					type: req.type,
					dn: req.dn,
				}),
			}),
			providesTags: [{ type: 'Serrated', id: 'sizes' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить размеры', { autoClose: false })
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
	useGetSerratedDnQuery,
	useGetSerratedSizesQuery,
} = serratedApi
