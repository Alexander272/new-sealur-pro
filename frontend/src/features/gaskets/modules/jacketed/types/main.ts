import type { IFlangeStandard, IStandard } from '@/features/gaskets/modules/snp/types/main'

export interface IMainJacketed {
	standard?: IJacketedStandard
	flangeType?: IFlangeType
	type?: IJacketedType
	construction?: IConstruction
}

export interface IJacketedStandard {
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

export interface IJacketedType {
	id: string
	baseId: string
	title: string
	code: string
	description: string
	hasD4: boolean
	hasD3: boolean
	hasD2: boolean
	hasD1: boolean
}

export interface IConstruction {
	id: string
	title: string
	code: string
	description: string
	hasMaterial: boolean
}
