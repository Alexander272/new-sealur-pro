// import { IDesignBlockPutg, IMainBlockPutg, IMaterialBlockPutg, ISizeBlockPutg } from './putg'
import { IDesignBlockSnp, IMainSnp, IMaterialBlockSnp, ISizeBlockSnp } from '@/features/gaskets/modules/snp/types/snp'

export type SnpType = 'Snp'
export type PutgType = 'Putg'
export type PutgmType = 'Putgm'

export type PositionBase<Type, ExtraProps> = {
	id: string
	orderId: string
	count: number
	title: string
	amount: string
	info?: string
	type: Type
} & ExtraProps

export type PositionSnp = PositionBase<
	SnpType,
	{
		snpData: { main: IMainSnp; size: ISizeBlockSnp; material: IMaterialBlockSnp; design: IDesignBlockSnp }
	}
>

// export type PositionPutg = PositionBase<
// 	PutgType,
// 	{
// 		putgData: { main: IMainBlockPutg; size: ISizeBlockPutg; material: IMaterialBlockPutg; design: IDesignBlockPutg }
// 	}
// >

export type Position = PositionSnp
// | PositionPutg

export interface IActive {
	index: number
	id: string
	type: SnpType | PutgType
}
