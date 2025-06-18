import { IMaterial } from '@/features/gaskets/types/material'

export type TypeMaterial = 'shell'

type MaterialWithThickness = IMaterial & { thickness: string }

export interface IMaterialsJacketed {
	filler?: IFiller
	shell?: MaterialWithThickness
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
	shell: MaterialWithThickness[]
	shellDefaultIndex?: number
}
