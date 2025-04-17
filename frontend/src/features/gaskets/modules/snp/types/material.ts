import { IMaterial } from '@/features/gaskets/types/material'

export interface IMaterialData {
	filler: IFiller
	frame?: IMaterial
	innerRing?: IMaterial
	outerRing?: IMaterial
	openFiller: boolean
	openIr: boolean
	openFr: boolean
	openOr: boolean
}

export interface IMaterialDataDTO {
	fillerId: string
	frameId: string
	innerRingId: string
	outerRingId: string
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

export type TypeMaterial = 'outerRing' | 'frame' | 'innerRing'
export type OpenMaterial = 'filler' | TypeMaterial

export interface ISnpMaterials {
	frame: IMaterial[]
	innerRing: IMaterial[]
	outerRing: IMaterial[]
	frameDefaultIndex?: number
	innerRingDefaultIndex?: number
	outerRingDefaultIndex?: number
}
