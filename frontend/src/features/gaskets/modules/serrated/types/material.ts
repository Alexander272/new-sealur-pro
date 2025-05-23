import { IMaterial } from '@/features/gaskets/types/material'

export type TypeMaterial = 'base' | 'rotaryPlug'

export interface IMaterialsSerrated {
	plating?: IPlating
	base?: IMaterial
	rotaryPlug?: IMaterial
}

export interface IPlating {
	id: string
	temperature: string
	title: string
	code: string
	description: string
	designation: string
}

export interface IMaterials {
	rotaryPlug: IMaterial[]
	base: IMaterial[]
	rotaryPlugDefaultIndex?: number
	baseDefaultIndex?: number
}
