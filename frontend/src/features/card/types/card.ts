import type { IPutg, IPutgDTO } from '@/features/gaskets/modules/putg/types/putg'
import type { ISerrated, ISerratedDTO } from '@/features/gaskets/modules/serrated/types/serrated'
import type { ISnp, ISnpDTO } from '@/features/gaskets/modules/snp/types/snp'
import type { IWave, IWaveDTO } from '@/features/gaskets/modules/wave/types/wave'

export type SnpType = 'Snp'
export type PutgType = 'Putg'
export type PutgmType = 'Putgm'
export type WaveType = 'Wave'
export type SerratedType = 'Serrated'
export type JacketType = 'Jacketed'

export type PositionType = SnpType | PutgType | WaveType | SerratedType

export type PositionBase<Type, ExtraProps> = {
	id: string
	orderId: string
	count: number
	title: string
	amount: string
	info?: string
	type: Type
} & ExtraProps

export type PositionSnpDTO = PositionBase<SnpType, { snpData: ISnpDTO }>
export type PositionSnp = PositionBase<SnpType, { data: ISnp }>

export type PositionPutgDTO = PositionBase<PutgType, { putgData: IPutgDTO }>
export type PositionPutg = PositionBase<PutgType, { data: IPutg }>

export type PositionWaveDTO = PositionBase<WaveType, { waveData: IWaveDTO }>
export type PositionWave = PositionBase<WaveType, { data: IWave }>

export type PositionSerratedDTO = PositionBase<SerratedType, { serratedData: ISerratedDTO }>
export type PositionSerrated = PositionBase<SerratedType, { data: ISerrated }>

export type PositionDTO = PositionSnpDTO | PositionPutgDTO | PositionWaveDTO | PositionSerratedDTO
export type Position = PositionSnp | PositionPutg | PositionWave | PositionSerrated

export interface IActive {
	index: number
	id: string
	type: PositionType
}

export interface ICopyPosition {
	id: string
	count: number
	amount: string
	orderId: string
	fromOrderId: string
}
