export interface IMainData {
	snpStandardId: string
	snpStandard?: ISnpStandard
	snpTypeId: string
	snpType?: ISnpType
	flangeTypeId: string
	flangeTypeTitle: string
	flangeTypeCode: string
}

export interface IMainDataDTO {
	snpStandardId: string
	snpTypeId: string
	flangeTypeId: string
}

export interface ISnpStandard {
	id: string
	dnTitle: string
	pnTitle: string
	hasD2?: boolean
	standard: IStandard
	flangeStandard: IFlangeStandard
}
export interface IStandard {
	id: string
	title: string
}
export interface IFlangeStandard {
	id: string
	title: string
	code: string
}

export interface IFlangeType {
	id: string
	title: string
	code: string
	description: string
	types: ISnpType[]
}

export interface ISnpType {
	id: string
	title: string
	code: string
	hasD4?: boolean
	hasD3?: boolean
	hasD2?: boolean
	hasD1?: boolean
}
