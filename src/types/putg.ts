import { IJumper } from './jumper'
import { IMaterial } from './material'
import { IHasMounting } from './mounting'
import { PN } from './sizes'
import { IFlangeStandard, IStandard } from './snp'

export type TypeMaterial = 'reinforce' | 'innerRing' | 'rotaryPlug' | 'outerRing'

export interface IPutgConfiguration {
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

export interface IConstruction {
	id: string
	baseId: string
	title: string
	code: string
	hasD4: boolean
	hasD3: boolean
	hasD2: boolean
	hasD1: boolean
	hasRotaryPlug: boolean
	hasInnerRing: boolean
	hasOuterRing: boolean
	description: string
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
	minThickness: number
	maxThickness: number
	description: string
	typeCode: string
	hasReinforce?: boolean
}

export interface IPutgMaterial {
	reinforce: IMaterial[]
	rotaryPlug: IMaterial[]
	innerRing: IMaterial[]
	outerRing: IMaterial[]
	reinforceDefaultIndex?: number
	rotaryPlugDefaultIndex?: number
	innerRingDefaultIndex?: number
	outerRingDefaultIndex?: number
}

export interface IMainBlockPutg {
	configuration?: IPutgConfiguration
	standard?: IPutgStandard
	flangeType?: IFlangeType
}

export interface IMaterialBlockPutg {
	filler?: IFiller
	putgType?: IPutgType
	construction?: IConstruction
	reinforce?: IMaterial
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

export interface ISizeBlockPutg {
	dn: string
	dnMm: string
	d4: string
	d3: string
	d2: string
	d1: string
	pn: PN
	h: string
	useDimensions?: boolean
	hasRounding?: boolean
}
