import { toast } from 'react-toastify'

import type { IPutgData, IPutgType } from './types/putg'
import type { IConfiguration, IFlangeType, IPutgStandard } from './types/main'
import type { IConstruction, IFiller, IPutgMaterials } from './types/materials'
import type { IDn, IGetDnDTO, IGetSizeDTO, ISize } from './types/size'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const putgApi = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение конфигураций прокладок
		getPutgConfigurations: builder.query<{ data: IConfiguration[] }, null>({
			query: () => API.putg.configurations,
			providesTags: [{ type: 'Putg', id: 'configurations' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось конфигурации прокладок', { autoClose: false })
				}
			},
		}),
		// получение стандартов на прокладки и фланцы
		getPutgStandard: builder.query<{ data: IPutgStandard[] }, null>({
			query: () => API.putg.standards,
			providesTags: [{ type: 'Putg', id: 'standards' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить стандарты', { autoClose: false })
				}
			},
		}),
		// получение типов фланцев
		getPutgFlangeTypes: builder.query<{ data: IFlangeType[] }, string>({
			query: standard => ({
				url: API.putg.flangeTypes,
				params: new URLSearchParams({ standard }),
			}),
			providesTags: [{ type: 'Putg', id: 'flangeTypes' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы фланцев', { autoClose: false })
				}
			},
		}),
		// получение типов прокладок
		getPutgTypes: builder.query<{ data: IPutgType[] }, string>({
			query: base => ({
				url: API.putg.types,
				params: new URLSearchParams({ base }),
			}),
			providesTags: [{ type: 'Putg', id: 'types' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы прокладок', { autoClose: false })
				}
			},
		}),
		// получение конструкций прокладок
		getPutgConstructions: builder.query<{ data: IConstruction[] }, { filler: string; flangeType: string }>({
			query: req => ({
				url: API.putg.constructions,
				params: new URLSearchParams({ filler: req.filler, flangeType: req.flangeType }),
			}),
			providesTags: [{ type: 'Putg', id: 'constructions' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить конструкции прокладок', { autoClose: false })
				}
			},
		}),
		// получение наполнителя
		getPutgFillers: builder.query<{ data: IFiller[] }, string>({
			query: standard => ({
				url: API.putg.fillers,
				params: new URLSearchParams({ standard }),
			}),
			providesTags: [{ type: 'Putg', id: 'fillers' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить материалы прокладки', { autoClose: false })
				}
			},
		}),
		// получение материалов
		getPutgMaterials: builder.query<{ data: IPutgMaterials }, string>({
			query: standard => ({
				url: API.putg.materials,
				params: new URLSearchParams({ standard }),
			}),
			providesTags: [{ type: 'Putg', id: 'materials' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить материалы прокладки', { autoClose: false })
				}
			},
		}),
		// получение условного прохода
		getPutgDn: builder.query<{ data: IDn[] }, IGetDnDTO>({
			query: req => ({
				url: API.putg.sizes.dn,
				params: new URLSearchParams({
					filler: req.filler,
					flangeType: req.flangeType,
					construction: req.construction,
				}),
			}),
			providesTags: [{ type: 'Putg', id: 'dn' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить условный проход', { autoClose: false })
				}
			},
		}),
		// получение размеров
		getPutgSizes: builder.query<{ data: ISize[] }, IGetSizeDTO>({
			query: req => ({
				url: API.putg.sizes.base,
				params: new URLSearchParams({
					filler: req.filler,
					flangeType: req.flangeType,
					construction: req.construction,
					dn: req.dn,
				}),
			}),
			providesTags: [{ type: 'Putg', id: 'sizes' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить размеры', { autoClose: false })
				}
			},
		}),
		// // получение размеров
		// getPutgSizes: builder.query<
		// 	{ data: IPutgSize[] },
		// 	{ filler: string; flangeType: string; construction: string }
		// >({
		// 	query: req => ({
		// 		url: API.putg.sizes.grouped,
		// 		params: new URLSearchParams({
		// 			filler: req.filler,
		// 			flangeType: req.flangeType,
		// 			construction: req.construction,
		// 		}),
		// 	}),
		// 	providesTags: [{ type: 'Putg', id: 'sizes' }],
		// 	onQueryStarted: async (_arg, api) => {
		// 		try {
		// 			await api.queryFulfilled
		// 		} catch {
		// 			toast.error('Не удалось получить размеры', { autoClose: false })
		// 		}
		// 	},
		// }),
		// получение информации о прокладке
		getPutgInfo: builder.query<{ data: IPutgData }, string>({
			query: filler => ({
				url: API.putg.info.filler,
				params: new URLSearchParams({ filler }),
			}),
			providesTags: [{ type: 'Putg', id: 'info' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить информацию о прокладке', { autoClose: false })
				}
			},
		}),
	}),
})

export const {
	useGetPutgConfigurationsQuery,
	useGetPutgStandardQuery,
	useGetPutgFlangeTypesQuery,
	useGetPutgTypesQuery,
	useGetPutgConstructionsQuery,
	useGetPutgFillersQuery,
	useGetPutgMaterialsQuery,
	useGetPutgDnQuery,
	useGetPutgSizesQuery,
	useGetPutgInfoQuery,
} = putgApi
