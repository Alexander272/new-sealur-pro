import type { IDesignSerrated } from './design'
import type { IMainSerrated } from './main'
import type { IMaterialsSerrated } from './material'
import type { ISizeSerrated } from './sizes'

export interface ISerrated {
	main: IMainSerrated
	size: ISizeSerrated
	material: IMaterialsSerrated
	design: IDesignSerrated
}

export interface ISerratedDTO {
	main: IMainDTO
	size: ISizeDTO
	material: IMaterialDTO
	design: IDesignDTO
}

export interface IMainDTO {
	standardId: string
	flangeTypeId: string
	serratedTypeId: string
	constructionId: string
}

export interface ISizeDTO {
	id: string
	d4: string
	d3: string
	d2: string
	d1: string
	h: string
}

export interface IMaterialDTO {
	platingId: string
	baseId: string
	rotaryPlugId: string
}

export interface IDesignDTO {
	jumper?: IJumperDTO
	hasHole: boolean
	hasCoating: boolean
	withRetainer: boolean
	drawing: string
}
export interface IJumperDTO {
	code: string
	width: string
}
