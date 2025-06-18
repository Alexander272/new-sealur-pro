import { toast } from 'react-toastify'

import type { IConstruction, IFlangeType, IJacketedStandard, IJacketedType } from './types/main'
import { apiSlice } from '@/app/apiSlice'
import { API } from '@/app/api'
import { IFiller, IMaterials } from './types/material'
import { IDn, ISize } from './types/sizes'

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
			query: filler => ({
				url: API.jacketed.types,
				params: new URLSearchParams({ filler }),
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

		getJacketedFillers: builder.query<{ data: IFiller[] }, string>({
			query: standard => ({
				url: API.jacketed.fillers,
				params: new URLSearchParams({ standard }),
			}),
			providesTags: [{ type: 'Jacketed', id: 'fillers' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить материалы основания', { autoClose: false })
				}
			},
		}),
		getJacketedMaterials: builder.query<{ data: IMaterials }, string>({
			query: standard => ({
				url: API.jacketed.materials,
				params: new URLSearchParams({ standard }),
			}),
			providesTags: [{ type: 'Jacketed', id: 'materials' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить материалы', { autoClose: false })
				}
			},
		}),

		// получение условного прохода
		getJacketedDn: builder.query<{ data: IDn[] }, string>({
			query: flange => ({
				url: API.jacketed.sizes.dn,
				params: new URLSearchParams({ flange }),
			}),
			providesTags: [{ type: 'Jacketed', id: 'dn' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить условный проход', { autoClose: false })
				}
			},
		}),
		// получение размеров
		getJacketedSizes: builder.query<{ data: ISize[] }, { flange: string; dn: string }>({
			query: req => ({
				url: API.jacketed.sizes.base,
				params: new URLSearchParams({
					flange: req.flange,
					dn: req.dn,
				}),
			}),
			providesTags: [{ type: 'Jacketed', id: 'sizes' }],
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
	useGetJacketedStandardQuery,
	useGetJacketedFlangeTypesQuery,
	useGetJacketedTypesQuery,
	useGetJacketedConstructionsQuery,
	useGetJacketedFillersQuery,
	useGetJacketedMaterialsQuery,
	useGetJacketedDnQuery,
	useGetJacketedSizesQuery,
} = jacketedApi
