import { toast } from 'react-toastify'

import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'
import { IConstruction, IFlangeType, IWaveStandard, IWaveType } from './types/main'

export const waveApi = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
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
			query: standard => ({
				url: API.wave.types,
				params: new URLSearchParams({ standard }),
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
	}),
})

export const {
	useGetWaveStandardQuery,
	useGetWaveFlangeTypesQuery,
	useGetWaveTypesQuery,
	useGetWaveConstructionsQuery,
} = waveApi
