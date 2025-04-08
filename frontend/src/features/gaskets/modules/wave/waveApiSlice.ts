import { toast } from 'react-toastify'

import type { IConfiguration, IConstruction, IFlangeType, IWaveStandard, IWaveType } from './types/main'
import type { IDn, ISize } from './types/sizes'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'
import { IMaterials, IPlating } from './types/material'

export const waveApi = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение конфигураций прокладок
		getWaveConfigurations: builder.query<{ data: IConfiguration[] }, null>({
			query: () => API.wave.configurations,
			providesTags: [{ type: 'Wave', id: 'configurations' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось конфигурации прокладок', { autoClose: false })
				}
			},
		}),
		// получение стандартов на прокладки и фланцы
		getWaveStandard: builder.query<{ data: IWaveStandard[] }, null>({
			query: () => API.wave.standards,
			providesTags: [{ type: 'Wave', id: 'standards' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить стандарты', { autoClose: false })
				}
			},
		}),
		// получение типов фланцев
		getWaveFlangeTypes: builder.query<{ data: IFlangeType[] }, string>({
			query: standard => ({
				url: API.wave.flangeTypes,
				params: new URLSearchParams({ standard }),
			}),
			providesTags: [{ type: 'Wave', id: 'flangeTypes' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы фланцев', { autoClose: false })
				}
			},
		}),
		// получение типов прокладок
		getWaveTypes: builder.query<{ data: IWaveType[] }, string>({
			query: flange => ({
				url: API.wave.types,
				params: new URLSearchParams({ flange }),
			}),
			providesTags: [{ type: 'Wave', id: 'types' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы прокладок', { autoClose: false })
				}
			},
		}),
		// получение типов конструкций
		getWaveConstructions: builder.query<{ data: IConstruction[] }, string>({
			query: type => ({
				url: API.wave.constructions,
				params: new URLSearchParams({ type }),
			}),
			providesTags: [{ type: 'Wave', id: 'constructions' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы конструкций', { autoClose: false })
				}
			},
		}),

		// получение условного прохода
		getWaveDn: builder.query<{ data: IDn[] }, string>({
			query: flange => ({
				url: API.wave.sizes.dn,
				params: new URLSearchParams({ flange }),
			}),
			providesTags: [{ type: 'Wave', id: 'dn' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить условный проход', { autoClose: false })
				}
			},
		}),
		// получение размеров
		getWaveSizes: builder.query<{ data: ISize[] }, { type: string; dn: string }>({
			query: req => ({
				url: API.wave.sizes.base,
				params: new URLSearchParams({
					type: req.type,
					dn: req.dn,
				}),
			}),
			providesTags: [{ type: 'Wave', id: 'sizes' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить размеры', { autoClose: false })
				}
			},
		}),

		getWavePlating: builder.query<{ data: IPlating[] }, null>({
			query: () => API.wave.plating,
			providesTags: [{ type: 'Wave', id: 'plating' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить материалы основания', { autoClose: false })
				}
			},
		}),
		getWaveMaterials: builder.query<{ data: IMaterials }, null>({
			query: () => API.wave.materials,
			providesTags: [{ type: 'Wave', id: 'materials' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить материалы', { autoClose: false })
				}
			},
		}),
	}),
})

export const {
	useGetWaveConfigurationsQuery,
	useGetWaveStandardQuery,
	useGetWaveFlangeTypesQuery,
	useGetWaveTypesQuery,
	useGetWaveConstructionsQuery,
	useGetWavePlatingQuery,
	useGetWaveMaterialsQuery,
	useGetWaveDnQuery,
	useGetWaveSizesQuery,
} = waveApi
