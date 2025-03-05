import type { IMaterial } from '@/features/gaskets/types/material'
import type { PN } from '@/features/gaskets/types/sizes'
import type { IJumper } from '@/features/gaskets/types/jumper'
import type { IFlangeStandard, IStandard } from '@/features/gaskets/modules/snp/types/snp'

export type TypeMaterial = 'innerRing' | 'rotaryPlug' | 'outerRing'

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
	jumperRange: number[]
	widthRange?: IWidthRange[]
	minSize?: number
}

export interface IWidthRange {
	maxD3: number
	width: number
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
	standard?: IPutgStandard
	flangeType?: IFlangeType
}
export interface IMainPutgDTO {
	configurationId: string
	standardId: string
	flangeTypeId: string
}

export interface IMaterialBlockPutg {
	filler?: IFiller
	putgType?: IPutgType
	construction?: IConstruction
	rotaryPlug?: IMaterial
	innerRing?: IMaterial
	outerRing?: IMaterial
}
export interface IMaterialPutgDTO {
	fillerId: string
	typeId: string
	constructionId: string
	rotaryPlugId: string
	innerRingId: string
	outerRingId: string
}

export interface IDesignBlockPutg {
	jumper: IJumper
	hasHole?: boolean
	hasCoating?: boolean
	hasRemovable?: boolean
	// mounting: IHasMounting
	drawing?: string
}

export interface ISizeBlockPutg {
	index?: number
	sizeId?: string
	dn: string
	dnMm: string
	d4: string
	d3: string
	d2: string
	d1: string
	pn: PN
	pnIndex?: number
	h: string
	useDimensions?: boolean
	hasRounding?: boolean
}
