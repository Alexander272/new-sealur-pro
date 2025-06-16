import type { IDesignJacketed } from './design'
import type { IMainJacketed } from './main'
import type { IMaterialsJacketed } from './material'
import type { ISizeJacketed } from './sizes'

export interface IJacketed {
	main: IMainJacketed
	size: ISizeJacketed
	material: IMaterialsJacketed
	design: IDesignJacketed
}

export interface IJacketedDTO {
	main: IMainDTO
	size: ISizeDTO
	material: IMaterialDTO
	design: IDesignDTO
}

export interface IMainDTO {
	standardId: string
	flangeTypeId: string
	jacketedTypeId: string
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
	fillerId: string
	shellId: string
}

export interface IDesignDTO {
	// jumper?: IJumperDTO
	// hasHole: boolean
	// hasCoating: boolean
	// withRetainer: boolean
	drawing: string
}
// export interface IJumperDTO {
// 	code: string
// 	width: string
// }
