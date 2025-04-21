import type { IFlangeStandard, IStandard } from '@/features/gaskets/modules/snp/types/main'

export interface IMainData {
	configuration?: IConfiguration
	standard?: IPutgStandard
	flangeType?: IFlangeType
}

export interface IMainDataDTO {
	configurationId: string
	standardId: string
	flangeTypeId: string
}

export interface IConfiguration {
	id: string
	title: string
	code: 'round' | 'oval' | 'rectangular'
	hasDrawing?: boolean
	hasStandard?: boolean
}

export interface IPutgStandard {
	id: string
	dnTitle: string
	pnTitle: string
	standard: IStandard
	flangeStandard: IFlangeStandard
}

export interface IFlangeType {
	id: string
	title: string
	code: string
}
