import type { IMaterial } from '@/features/gaskets/types/material'

export interface IMaterialData {
	filler?: IFiller
	putgType?: IPutgType
	construction?: IConstruction
	rotaryPlug?: IMaterial
	innerRing?: IMaterial
	outerRing?: IMaterial
}

export interface IMaterialDataDTO {
	fillerId: string
	typeId: string
	constructionId: string
	rotaryPlugId: string
	innerRingId: string
	outerRingId: string
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

export interface IPutgType {
	id: string
	title: string
	code: string
	minThickness: number
	maxThickness: number
	description: string
	typeCode: string
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

export interface IPutgMaterials {
	rotaryPlug: IMaterial[]
	innerRing: IMaterial[]
	outerRing: IMaterial[]
	rotaryPlugDefaultIndex?: number
	innerRingDefaultIndex?: number
	outerRingDefaultIndex?: number
}

export type TypeMaterial = 'innerRing' | 'rotaryPlug' | 'outerRing'
