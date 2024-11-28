import type {
	IFiller,
	IFlangeType,
	ISnp,
	ISnpDataResponse,
	ISnpMaterial,
	ISnpResponse,
	ISnpStandardResponse,
} from './types/snp'
import { apiSlice } from '@/app/apiSlice'
import { API } from '@/app/api'
import { toast } from 'react-toastify'
import { ISnpSize } from './types/size'
import { IMounting } from '../../types/mounting'

type SnpDataRequest = {
	standardId?: string
	snpStandardId?: string
}

type SnpRequest = {
	typeId: string
	hasD2?: boolean
}

export const proUrl = 'sealur-pro'

export const snpApi = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// получение стандартов на прокладки и фланцы
		getStandard: builder.query<ISnpStandardResponse, null>({
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
		getFlangeTypes: builder.query<{ data: IFlangeType[] }, SnpDataRequest>({
			query: ({ standardId = '', snpStandardId = '' }) => ({
				url: API.snp.flangeTypes,
				params: new URLSearchParams({ standardId, snpStandardId }),
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
		getFillers: builder.query<{ data: IFiller[] }, string>({
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
		getMaterials: builder.query<{ data: ISnpMaterial }, string>({
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
		getSnpInfo: builder.query<{ data: ISnp }, string>({
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
		// получение размеров
		getSizes: builder.query<{ data: ISnpSize[] }, SnpRequest>({
			query: req => ({
				url: API.snp.sizes,
				params: new URLSearchParams({ typeId: req.typeId, hasD2: `${req.hasD2}` }),
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
				url: API.snp.fastenings,
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
		getSnpData: builder.query<ISnpDataResponse, SnpDataRequest>({
			query: ({ standardId = '', snpStandardId = '' }) => ({
				url: API.snp.data,
				method: 'GET',
				// params: new URLSearchParams([
				// 	['standardId', standardId],
				// 	['snpStandardId', snpStandardId],
				// ]),
				params: new URLSearchParams({ standardId, snpStandardId }),
			}),
		}),

		// получение данных о выбранной прокладке и ее размеры (зависит от выбранного типа)
		getSnp: builder.query<ISnpResponse, SnpRequest>({
			query: ({ typeId, hasD2 }) => ({
				url: API.snp.base,
				method: 'GET',
				// params: new URLSearchParams([
				// 	['typeId', typeId],
				// 	['hasD2', `${hasD2 || ''}`],
				// ]),
				params: new URLSearchParams({ typeId: typeId, hasD2: `${hasD2 || ''}` }),
			}),
		}),
	}),
})

export const {
	useGetStandardQuery,
	useGetFlangeTypesQuery,
	useGetFillersQuery,
	useGetMaterialsQuery,
	useGetSnpInfoQuery,
	useGetSizesQuery,
	useGetFasteningsQuery,
	useGetSnpDataQuery,
	useGetSnpQuery,
} = snpApi
