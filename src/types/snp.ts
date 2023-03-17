import { IJumper } from './jumper'
import { IHasMounting, IMounting } from './mounting'
import { IMaterial } from './material'
import { ISnpSize, PN } from './sizes'
import { ITemperature } from './temperature'

export type OpenMaterial = 'filler' | 'ir' | 'fr' | 'or'

export interface ISNPMaterial {
	id: string
	default: IMaterial
	materials: IMaterial[]
	type: 'fr' | 'ir' | 'or'
}

export interface IFiller {
	id: string
	title: string
	anotherTitle: string
	code: string
	description: string
	designation: string
	temperature: string
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

export interface ISnpDateResponse {
	data: {
		flangeTypes: IFlangeType[]
		materials: ISNPMaterial[]
		mounting?: IMounting[]
		fillers?: IFiller[]
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
	snpTypeTitle: string
	flangeTypeTitle: string
	snpTypeCode: string
}

export interface IMaterialBlockSnp {
	filler: IFiller
	ir?: IMaterial
	fr?: IMaterial
	or?: IMaterial
	openFiller: boolean
	openIr: boolean
	openFr: boolean
	openOr: boolean
}

export interface ISizeBlockSnp {
	dn: string
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
}

export interface ISNP {
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
}
