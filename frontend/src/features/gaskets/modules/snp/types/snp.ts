import { IMaterial } from '@/features/gaskets/types/material'
import { IHasMounting, IMounting } from '@/features/gaskets/types/mounting'
import { PN } from '@/features/gaskets/types/sizes'
import { IJumper } from '@/features/gaskets/types/jumper'
import { ISnpSize } from './size'

export type TypeMaterial = 'outerRing' | 'frame' | 'innerRing'
export type OpenMaterial = 'filler' | TypeMaterial

export interface ISNPMaterial {
	id: string
	default: IMaterial
	materials: IMaterial[]
	type: TypeMaterial
}
export interface ISnpMaterial {
	frame: IMaterial[]
	innerRing: IMaterial[]
	outerRing: IMaterial[]
	frameDefaultIndex?: number
	innerRingDefaultIndex?: number
	outerRingDefaultIndex?: number
}

export interface IFiller {
	id: string
	temperature: string
	baseCode: string
	code: string
	title: string
	description: string
	designation: string
	disabledTypes?: string[]
}

// export interface ITemperatureSNP extends ITemperature {
// 	fillers: IFiller[]
// }

// export interface ISNPData {
// 	id: string
// 	type: string
// 	innerRing?: IMaterial
// 	frame: IMaterial
// 	outerRing?: IMaterial
// 	mounting: IMounting[]
// 	hasHole: boolean
// 	hasJumper: boolean
// 	hasMounting: boolean
// 	temperature: ITemperatureSNP[]
// }

export interface ISnpDataResponse {
	data: {
		flangeTypes: IFlangeType[]
		fillers: IFiller[]
		mounting?: IMounting[]
		materials: ISnpMaterial
	}
}
export interface ISnpStandardResponse {
	data: IStandardForSNP[]
}
export interface ISnpResponse {
	data: {
		snp: ISnp
		sizes: ISnpSize[]
	}
}

export interface ISNPData {
	id: string
	typeId: string
	hasInnerRing?: boolean
	hasFrame?: boolean
	hasOuterRing?: boolean
	hasHole?: boolean
	hasJumper?: boolean
	hasMounting?: boolean
}

export interface ISnp {
	id: string
	hasInnerRing?: boolean
	hasFrame?: boolean
	hasOuterRing?: boolean
	hasHole?: boolean
	hasJumper?: boolean
	hasMounting?: boolean
}

export interface IStandard {
	id: string
	title: string
	// hasSizes?: boolean
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
	types: ISNPType[]
}

export interface ISNPType {
	id: string
	title: string
	code: string
	hasD4?: boolean
	hasD3?: boolean
	hasD2?: boolean
	hasD1?: boolean
}

export interface ITypeGasket {
	id: string
	title: string
}

export interface IStandardForSNP {
	id: string
	// standardId: string
	// standard: string
	// flangeStandardId: string
	// flangeStandard: string
	//? or
	dnTitle: string
	pnTitle: string
	hasD2?: boolean
	standard: IStandard
	flangeStandard: IFlangeStandard
}

export interface IMainSnp {
	snpStandardId: string
	flangeTypeCode: string
	snpTypeId: string
	snpStandard?: IStandardForSNP
	// snpTypeTitle: string
	flangeTypeTitle: string
	// snpTypeCode: string
	snpType?: ISNPType
}

export interface IMaterialBlockSnp {
	filler: IFiller
	// ir?: IMaterial
	// fr?: IMaterial
	// or?: IMaterial
	frame?: IMaterial
	innerRing?: IMaterial
	outerRing?: IMaterial
	openFiller: boolean
	openIr: boolean
	openFr: boolean
	openOr: boolean
}

export interface ISizeBlockSnp {
	index?: number
	dn: string
	dnMm: string
	d4: string
	d3: string
	d2: string
	d1: string
	pn: PN
	h: string
	another: string
	s2: string
	s3: string
}

export interface IDesignBlockSnp {
	jumper: IJumper
	hasHole?: boolean
	mounting: IHasMounting
	drawing?: string
}

// export interface ISNP {
// standard: string
// typeFlangeCode: string
// typeGasket: string
// size: ISize
// temperature: string
// fillerCode: string
// innerRing: any
// frame: any
// outerRing: any
// jumper: IJumper
// mounting: IHasMounting
// hasHole: boolean
// }

export interface IThickness {
	h?: string
	s2?: string
	s3?: string
	another?: string
}
