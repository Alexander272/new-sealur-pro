import type { IFlangeStandard, IStandard } from '@/features/gaskets/modules/snp/types/main'

export interface IMainWave {
	configuration?: IConfiguration
	standard?: IWaveStandard
	flangeType?: IFlangeType
	type?: IWaveType
	construction?: IConstruction
}

export interface IConfiguration {
	id: string
	title: string
	code: 'rectangular' | 'round' | 'oval'
	hasDrawing?: boolean
	hasStandard?: boolean
}

export interface IWaveStandard {
	id: string
	dnTitle: string
	pnTitle: string
	standard: IStandard
	flangeStandard: IFlangeStandard
}

export interface IFlangeType {
	id: string
	title: string
	code: string
}

export interface IWaveType {
	id: string
	baseId: string
	title: string
	code: string
	description: string
	priority: number
	dnRange: string[]
	widthRange: number[]
	hasD4: boolean
	hasD3: boolean
	hasD2: boolean
	hasD1: boolean
}

export interface IConstruction {
	id: string
	title: string
	code: string
	description: string
	hasMaterial: boolean
}
