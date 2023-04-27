import {
	IConstruction,
	IFlangeStandard,
	IFlangeType,
	IPutgConfiguration,
	IPutgData,
	IFiller,
	IPutgMaterial,
} from '@/types/putg'
import { IPutgSize } from '@/types/sizes'
import { api } from './base'
import { proUrl } from './snp'

type PutgBaseResponse = {
	data: {
		configurations: IPutgConfiguration[]
		standards: IFlangeStandard[]
		constructions: IConstruction[]
	}
}

type PutgDataRequest = {
	standardId: string
	constructionId: string
	configuration: string
	// fillerId: string
	// changeStandard: boolean
}
type PutgDataResponse = {
	data: {
		materials: IPutgMaterial
		fillers: IFiller[]
		flangeTypes: IFlangeType[]
		data: IPutgData[]
		sizes: IPutgSize[]
	}
}

export const putgApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение основных данных для путг (конфигурации, стандарты на фланцы, конструкции)
		getPutgBase: builder.query<PutgBaseResponse, null>({
			query: () => `${proUrl}/putg/base`,
		}),
		// получение второй части данных о путг (типы фланцев, материалы, размеры)
		getPutgData: builder.query<PutgDataResponse, PutgDataRequest>({
			query: req => ({
				url: `${proUrl}/putg/data`,
				method: 'GET',
				params: new URLSearchParams([
					['standardId', req.standardId],
					['constructionId', req.constructionId],
					['configuration', req.configuration],
					// ['fillerId', req.fillerId],
					// ['changeStandard', `${req.changeStandard}`],
				]),
			}),
		}),
		// // получение стандартов на прокладки и фланцы
		// getStandardForSNP: builder.query<ISnpStandardResponse, null>({
		// 	query: () => `${proUrl}/snp-standards/`,
		// }),
		// // получение общих данных (материалов, наполнителей, типах фланца, креплений) о типах прокладок (зависит от стандарта)
		// getSnpData: builder.query<ISnpDataResponse, SnpDataRequest>({
		// 	query: ({ standardId = '', snpStandardId = '' }) => ({
		// 		url: `${proUrl}/snp-new/data`,
		// 		method: 'GET',
		// 		params: new URLSearchParams([
		// 			['standardId', standardId],
		// 			['snpStandardId', snpStandardId],
		// 		]),
		// 	}),
		// }),
		// // получение данных о выбранной прокладке и ее размеры (зависит от выбранного типа)
		// getSnp: builder.query<ISnpResponse, SnpRequest>({
		// 	query: ({ typeId, hasD2 }) => ({
		// 		url: `${proUrl}/snp-new`,
		// 		method: 'GET',
		// 		params: new URLSearchParams([
		// 			['typeId', typeId],
		// 			['hasD2', `${hasD2 || ''}`],
		// 		]),
		// 	}),
		// }),
	}),
	overrideExisting: false,
})

export const { useGetPutgBaseQuery, useGetPutgDataQuery } = putgApi
