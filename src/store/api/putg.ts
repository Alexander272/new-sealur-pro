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
	empty: boolean
	// typeFlangeId: string
}

type PutgBaseResponse = {
	data: {
		configurations: IPutgConfiguration[]
		standards: IPutgStandard[]
		mounting: IMounting[]
		// constructions: IConstruction[]
		fillers: IFiller[]
		materials: IPutgMaterial
		flangeTypes: IFlangeType[]
	}
}

type PutgDataRequest = {
	standardId: string
	constructionId: string
	baseConstructionId: string
	// configuration: string
	// fillerId: string
	// changeStandard: boolean
}
type PutgDataResponse = {
	data: {
		// fillers: IFiller[]
		sizes: IPutgSize[]
	}
}

type PutgSizeRequest = {
	flangeTypeId: string
	baseConstructionId: string
	baseFillerId: string
	// configuration: string
}
type PutgSizeResponse = {
	data: {
		// fillers: IFiller[]
		sizes: IPutgSize[]
	}
}

type PutgRequest = {
	fillerId: string
	baseId: string
	flangeTypeId: string
}
type PutgResponse = {
	data: {
		putgTypes: IPutgType[]
		data: IPutgData
		constructions: IConstruction[]
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
					['empty', `${req.empty}`],
					// ['typeFlangeId', req.typeFlangeId],
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
					// ['configuration', req.configuration],
					['baseConstructionId', req.baseConstructionId],
					// ['fillerId', req.fillerId],
					// ['changeStandard', `${req.changeStandard}`],
				]),
			}),
		}),
		// получение размеров путг
		getPutgSize: builder.query<PutgSizeResponse, PutgSizeRequest>({
			query: req => ({
				url: `${proUrl}/putg/sizes`,
				method: 'GET',
				params: new URLSearchParams([
					['flangeTypeId', req.flangeTypeId],
					['baseConstructionId', req.baseConstructionId],
					['baseFillerId', req.baseFillerId],
					// ['configuration', req.configuration],
					// ['changeStandard', `${req.changeStandard}`],
				]),
			}),
		}),
		// получение типов прокладок и данных о конструктивных элементах
		getPutg: builder.query<PutgResponse, PutgRequest>({
			query: req => ({
				url: `${proUrl}/putg`,
				method: 'GET',
				params: new URLSearchParams([
					['fillerId', req.fillerId],
					['baseId', req.baseId],
					['flangeTypeId', req.flangeTypeId],
				]),
			}),
		}),
	}),
	overrideExisting: false,
})

export const { useGetPutgBaseQuery, useGetPutgDataQuery, useGetPutgQuery, useGetPutgSizeQuery } = putgApi
