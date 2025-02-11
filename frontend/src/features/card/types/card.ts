// import { IDesignBlockPutg, IMainBlockPutg, IMaterialBlockPutg, ISizeBlockPutg } from './putg'
import type {
	IDesignBlockPutg,
	IMainBlockPutg,
	IMaterialBlockPutg,
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

export type SnpType = 'Snp'
export type PutgType = 'Putg'
export type PutgmType = 'Putgm'

export type PositionType = SnpType | PutgType

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
		putgData: { main: IMainBlockPutg; size: ISizeBlockPutg; material: IMaterialBlockPutg; design: IDesignBlockPutg }
	}
>
export type PositionPutg = PositionBase<
	PutgType,
	{
		data: { main: IMainBlockPutg; size: ISizeBlockPutg; material: IMaterialBlockPutg; design: IDesignBlockPutg }
	}
>

export type PositionDTO = PositionSnpDTO | PositionPutgDTO

export type Position = PositionSnp | PositionPutg

export interface IActive {
	index: number
	id: string
	type: SnpType | PutgType
}

export interface ICopyPosition {
	id: string
	count: number
	amount: string
	orderId: string
	fromOrderId: string
}
