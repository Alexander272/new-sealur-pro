import { toast } from 'react-toastify'

import type { IMounting } from '@/features/gaskets/types/mounting'
import type { IDn, ISize } from './types/size'
import type { ISnpStandard, IFlangeType } from './types/main'
import type { IFiller, ISnpMaterials } from './types/material'
import type { ISnpInfo } from './types/snp'
import { apiSlice } from '@/app/apiSlice'
import { API } from '@/app/api'

type SnpDataRequest = {
	standardId?: string
	snpStandardId?: string
}

export const snpApi = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение стандартов на прокладки и фланцы
		getSnpStandard: builder.query<{ data: ISnpStandard[] }, null>({
			query: () => API.snp.standards,
			providesTags: [{ type: 'Snp', id: 'standards' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить стандарты', { autoClose: false })
				}
			},
		}),
		// получение типов фланцев
		getSnpFlangeTypes: builder.query<{ data: IFlangeType[] }, SnpDataRequest>({
			query: ({ standardId = '' }) => ({
				url: API.snp.types,
				params: new URLSearchParams({ standardId }),
			}),
			providesTags: [{ type: 'Snp', id: 'flangeTypes' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы фланцев', { autoClose: false })
				}
			},
		}),
		// получение наполнителя
		getSnpFillers: builder.query<{ data: IFiller[] }, string>({
			query: standardId => ({
				url: API.snp.fillers,
				params: new URLSearchParams({ standardId }),
			}),
			providesTags: [{ type: 'Snp', id: 'fillers' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить типы фланцев', { autoClose: false })
				}
			},
		}),
		// получение материалов
		getSnpMaterials: builder.query<{ data: ISnpMaterials }, string>({
			query: standardId => ({
				url: API.snp.materials,
				params: new URLSearchParams({ standardId }),
			}),
			providesTags: [{ type: 'Snp', id: 'materials' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить материалы', { autoClose: false })
				}
			},
		}),
		// получение информации о прокладке
		getSnpInfo: builder.query<{ data: ISnpInfo }, string>({
			query: typeId => ({
				url: API.snp.info,
				params: new URLSearchParams({ typeId }),
			}),
			providesTags: [{ type: 'Snp', id: 'info' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить информацию о прокладке', { autoClose: false })
				}
			},
		}),
		// получение условного прохода
		getSnpDn: builder.query<{ data: IDn[] }, { typeId: string; hasD2?: boolean }>({
			query: req => ({
				url: API.snp.sizes.dn,
				params: new URLSearchParams({ typeId: req.typeId, hasD2: `${req.hasD2}` }),
			}),
			providesTags: [{ type: 'Snp', id: 'dn' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить условный проход', { autoClose: false })
				}
			},
		}),
		// получение размеров
		getSnpSizes: builder.query<{ data: ISize[] }, { typeId: string; dn: string }>({
			query: req => ({
				url: API.snp.sizes.base,
				params: new URLSearchParams({
					type: req.typeId,
					dn: req.dn,
				}),
			}),
			providesTags: [{ type: 'Snp', id: 'sizes' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить размеры', { autoClose: false })
				}
			},
		}),

		// получение списка креплений
		getFastenings: builder.query<{ data: IMounting[] }, null>({
			query: () => ({
				url: API.fastenings,
			}),
			providesTags: [{ type: 'Snp', id: 'fastenings' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить список креплений', { autoClose: false })
				}
			},
		}),

		// получение общих данных (материалов, наполнителей, типах фланца, креплений) о типах прокладок (зависит от стандарта)
		// getSnpData: builder.query<ISnpDataResponse, SnpDataRequest>({
		// 	query: ({ standardId = '', snpStandardId = '' }) => ({
		// 		url: API.snp.data,
		// 		method: 'GET',
		// 		// params: new URLSearchParams([
		// 		// 	['standardId', standardId],
		// 		// 	['snpStandardId', snpStandardId],
		// 		// ]),
		// 		params: new URLSearchParams({ standardId, snpStandardId }),
		// 	}),
		// }),

		// получение данных о выбранной прокладке и ее размеры (зависит от выбранного типа)
		// getSnp: builder.query<ISnpResponse, SnpRequest>({
		// 	query: ({ typeId, hasD2 }) => ({
		// 		url: API.snp.base,
		// 		method: 'GET',
		// 		// params: new URLSearchParams([
		// 		// 	['typeId', typeId],
		// 		// 	['hasD2', `${hasD2 || ''}`],
		// 		// ]),
		// 		params: new URLSearchParams({ typeId: typeId, hasD2: `${hasD2 || ''}` }),
		// 	}),
		// }),
	}),
})

export const {
	useGetSnpStandardQuery,
	useGetSnpFlangeTypesQuery,
	useGetSnpFillersQuery,
	useGetSnpMaterialsQuery,
	useGetSnpInfoQuery,
	useGetSnpDnQuery,
	useGetSnpSizesQuery,
	useGetFasteningsQuery,
	// useGetSnpDataQuery,
	// useGetSnpQuery,
} = snpApi
