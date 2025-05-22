import type { IFlangeStandard, IStandard } from '@/features/gaskets/modules/snp/types/main'

export interface IMainSerrated {
	standard?: ISerratedStandard
	flangeType?: IFlangeType
	// type?: IWaveType
	// construction?: IConstruction
}

export interface ISerratedStandard {
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
