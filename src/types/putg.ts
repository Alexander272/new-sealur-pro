import { IJumper } from './jumper'
import { IMaterial } from './material'
import { IHasMounting } from './mounting'

export type TypeMaterial = 'innerRing' | 'rotaryPlug' | 'outerRing'

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
	baseId: string
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

export interface IPutgType {
	id: string
	title: string
	code: string
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

export interface IDesignBlockPutg {
	jumper: IJumper
	hasHole?: boolean
	hasCoating?: boolean
	hasRemovable?: boolean
	mounting: IHasMounting
	drawing?: string
}
