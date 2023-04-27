import { IMaterial } from './material'

export interface IPutgConfiguration {
	id: string
	title: string
	code: 'round' | 'oval' | 'rectangular'
	hasDrawing?: boolean
	hasStandard?: boolean
}

export interface IFlangeStandard {
	id: string
	title: string
	code: string
}

export interface IConstruction {
	id: string
	title: string
	code: string
	hasD4: boolean
	hasD3: boolean
	hasD2: boolean
	hasD1: boolean
	hasRotaryPlug: boolean
	hasInnerRing: boolean
	hasOuterRing: boolean
}

export interface IFiller {
	id: string
	temperature: string
	title: string
	code: string
	description: string
	designation: string
}

export interface IFlangeType {
	id: string
	title: string
	code: string
}

export interface IPutgData {
	id: string
	hasJumper?: boolean
	hasHole?: boolean
	hasRemovable?: boolean
	hasMounting?: boolean
	hasCoating?: boolean
}

export interface IPutgMaterial {
	rotaryPlug: IMaterial[]
	innerRing: IMaterial[]
	outerRing: IMaterial[]
	rotaryPlugDefaultIndex?: number
	innerRingDefaultIndex?: number
	outerRingDefaultIndex?: number
}

export interface IMainBlockPutg {
	configuration?: IPutgConfiguration
	flangeStandard?: IFlangeStandard
	flangeTypeCode: string
	flangeTypeTitle: string
}

export interface IMaterialBlockPutg {
	filler?: IFiller
	typeCode: string
	construction?: IConstruction
	rotaryPlug?: IMaterial
	innerRing?: IMaterial
	outerRing?: IMaterial
}
