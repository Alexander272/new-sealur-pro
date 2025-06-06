import { IMaterial } from '@/features/gaskets/types/material'

export type TypeMaterial = 'shell'

export interface IMaterialsJacketed {
	filler?: IFiller
	shell?: IMaterial
}

export interface IFiller {
	id: string
	temperature: string
	title: string
	code: string
	description: string
	designation: string
}

export interface IMaterials {
	shell: IMaterial[]
	shellDefaultIndex?: number
}
