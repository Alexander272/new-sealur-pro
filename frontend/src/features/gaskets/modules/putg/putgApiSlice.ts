import { toast } from 'react-toastify'

import type {
	IConstruction,
	IFiller,
	IFlangeType,
	IPutgConfiguration,
	IPutgData,
	IPutgMaterial,
	IPutgStandard,
	IPutgType,
} from './types/putg'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'
import { IPutgSize } from '../../types/sizes'

export const putgApi = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение конфигураций прокладок
		getPutgConfigurations: builder.query<{ data: IPutgConfiguration[] }, null>({
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
		getPutgMaterials: builder.query<{ data: IPutgMaterial }, string>({
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
		// получение размеров
		getPutgSizes: builder.query<
			{ data: IPutgSize[] },
			{ filler: string; flangeType: string; construction: string }
		>({
			query: req => ({
				url: API.putg.sizes,
				params: new URLSearchParams({
					filler: req.filler,
					flangeType: req.flangeType,
					construction: req.construction,
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
	useGetPutgSizesQuery,
	useGetPutgInfoQuery,
} = putgApi
