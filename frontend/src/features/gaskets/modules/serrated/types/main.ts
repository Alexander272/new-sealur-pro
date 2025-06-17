import type { IFlangeStandard, IStandard } from '@/features/gaskets/modules/snp/types/main'

export interface IMainSerrated {
	standard?: ISerratedStandard
	flangeType?: IFlangeType
	type?: ISerratedType
	construction?: IConstruction
}

export interface ISerratedStandard {
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

export interface ISerratedType {
	id: string
	baseId: string
	baseCode: string
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
