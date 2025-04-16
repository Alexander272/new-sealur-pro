// import { IDesignBlockPutg, IMainBlockPutg, IMaterialBlockPutg, ISizeBlockPutg } from './putg'
import type {
	IDesignBlockPutg,
	IMainBlockPutg,
	IMainPutgDTO,
	IMaterialBlockPutg,
	IMaterialPutgDTO,
	ISizeBlockPutg,
} from '@/features/gaskets/modules/putg/types/putg'
import type {
	IDesignBlockSnp,
	IDesignBlockSnpDTO,
	IMainSnp,
	IMaterialBlockSnp,
	IMaterialBlockSnpDTO,
	ISizeBlockSnp,
} from '@/features/gaskets/modules/snp/types/snp'
import type { IWave, IWaveDTO } from '@/features/gaskets/modules/wave/types/wave'

export type SnpType = 'Snp'
export type PutgType = 'Putg'
export type PutgmType = 'Putgm'
export type WaveType = 'Wave'

export type PositionType = SnpType | PutgType | WaveType

export type PositionBase<Type, ExtraProps> = {
	id: string
	orderId: string
	count: number
	title: string
	amount: string
	info?: string
	type: Type
} & ExtraProps

export type PositionSnpDTO = PositionBase<
	SnpType,
	{
		snpData: { main: IMainSnp; size: ISizeBlockSnp; material: IMaterialBlockSnpDTO; design: IDesignBlockSnpDTO }
	}
>
export type PositionSnp = PositionBase<
	SnpType,
	{
		data: { main: IMainSnp; size: ISizeBlockSnp; material: IMaterialBlockSnp; design: IDesignBlockSnp }
	}
>

export type PositionPutgDTO = PositionBase<
	PutgType,
	{
		putgData: { main: IMainPutgDTO; size: ISizeBlockPutg; material: IMaterialPutgDTO; design: IDesignBlockPutg }
	}
>
export type PositionPutg = PositionBase<
	PutgType,
	{
		data: {
			main: IMainBlockPutg
			size: ISizeBlockPutg
			material: IMaterialBlockPutg
			design: IDesignBlockPutg
		}
	}
>

export type PositionWaveDTO = PositionBase<WaveType, { waveData: IWaveDTO }>
export type PositionWave = PositionBase<WaveType, { data: IWave }>

export type PositionDTO = PositionSnpDTO | PositionPutgDTO | PositionWaveDTO
export type Position = PositionSnp | PositionPutg | PositionWave

export interface IActive {
	index: number
	id: string
	type: SnpType | PutgType | WaveType
}

export interface ICopyPosition {
	id: string
	count: number
	amount: string
	orderId: string
	fromOrderId: string
}
