import type { IDesignWave } from './design'
import type { IMainWave } from './main'
import type { IMaterialsWave } from './material'
import type { ISizeWave } from './sizes'

export interface IWave {
	main: IMainWave
	size: ISizeWave
	material: IMaterialsWave
	design: IDesignWave
}

export interface IWaveDTO {
	main: IMainDTO
	size: ISizeDTO
	material: IMaterialDTO
	design: IDesignDTO
}

export interface IMainDTO {
	configurationId: string
	standardId: string
	flangeTypeId: string
	waveTypeId: string
	constructionId: string
}

export interface ISizeDTO {
	id: string
	d4: string
	d3: string
	d2: string
	d1: string
	h: string
	hasRounding: boolean
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
