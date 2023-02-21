import { IJumper } from './jumper'
import { IHasMounting, IMounting } from './mounting'
import { ISize } from './sizes'
import { ITemperature } from './temperature'

export interface IMaterial {}

export interface IFiller {
	id: string
	title: string
	code: string
	description: string
}

export interface ITemperatureSNP extends ITemperature {
	fillers: IFiller[]
}

export interface ISNPData {
	id: string
	type: string
	innerRing?: IMaterial
	frame: IMaterial
	outerRing?: IMaterial
	mounting: IMounting[]
	hasHole: boolean
	hasJumper: boolean
	hasMounting: boolean
	temperature: ITemperatureSNP[]
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
}

export interface ITypeGasket {
	id: string
	title: string
}

export interface IStandardForSNP {
	id: string
	standardId: string
	standard: string
	flangeStandardId: string
	flangeStandard: string
	//? or
	// standard: IStandard
	// flangeStandard: IFlangeStandard
}

export interface ISNP {
	standard: string
	typeFlangeCode: string
	typeGasket: string
	size: ISize
	temperature: string
	fillerCode: string

	innerRing: any
	frame: any
	outerRing: any

	jumper: IJumper
	mounting: IHasMounting
	hasHole: boolean
}
