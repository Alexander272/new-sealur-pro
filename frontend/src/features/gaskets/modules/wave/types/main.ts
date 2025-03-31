import type { IFlangeStandard, IStandard } from '@/features/gaskets/modules/snp/types/snp'

export interface IMainWave {
	standard?: IWaveStandard
	flangeType?: IFlangeType
	type?: IWaveType
	construction?: IConstruction
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
}

export interface IConstruction {
	id: string
	title: string
	code: string
	description: string
}
