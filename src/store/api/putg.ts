import { api } from './base'
import { proUrl } from './snp'
import type {
	IConstruction,
	IPutgStandard,
	IFlangeType,
	IPutgConfiguration,
	IPutgData,
	IFiller,
	IPutgMaterial,
	IPutgType,
} from '@/types/putg'
import type { IPutgSize } from '@/types/sizes'
import type { IMounting } from '@/types/mounting'

type PutgBaseRequest = {
	standardId: string
	typeFlangeId: string
}

type PutgBaseResponse = {
	data: {
		configurations: IPutgConfiguration[]
		standards: IPutgStandard[]
		mounting: IMounting[]
		constructions: IConstruction[]
		materials: IPutgMaterial
		flangeTypes: IFlangeType[]
	}
}

type PutgDataRequest = {
	standardId: string
	constructionId: string
	baseConstructionId: string
	configuration: string
	// fillerId: string
	// changeStandard: boolean
}
type PutgDataResponse = {
	data: {
		fillers: IFiller[]
		sizes: IPutgSize[]
	}
}

type PutgRequest = {
	fillerId: string
	baseId: string
}
type PutgResponse = {
	data: {
		putgTypes: IPutgType[]
		data: IPutgData
	}
}

export const putgApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение основных данных для путг (конфигурации, стандарты на фланцы, конструкции)
		getPutgBase: builder.query<PutgBaseResponse, PutgBaseRequest>({
			query: req => ({
				url: `${proUrl}/putg/base`,
				method: 'GET',
				params: new URLSearchParams([
					['standardId', req.standardId],
					['typeFlangeId', req.typeFlangeId],
				]),
			}),
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
					['baseConstructionId', req.baseConstructionId],
					// ['fillerId', req.fillerId],
					// ['changeStandard', `${req.changeStandard}`],
				]),
			}),
		}),
		// получение типов прокладок и дынных о конструктивных элементах
		getPutg: builder.query<PutgResponse, PutgRequest>({
			query: req => ({
				url: `${proUrl}/putg`,
				method: 'GET',
				params: new URLSearchParams([
					['fillerId', req.fillerId],
					['baseId', req.baseId],
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

export const { useGetPutgBaseQuery, useGetPutgDataQuery, useGetPutgQuery } = putgApi
