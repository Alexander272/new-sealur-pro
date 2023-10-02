import { IDesignBlockPutg, IMainBlockPutg, IMaterialBlockPutg, ISizeBlockPutg } from './putg'
import { IRingConstruction, IRingDensity, IRingType } from './rings'
import { IRingsKitData } from './ringsKit'
import { IDesignBlockSnp, IMainSnp, IMaterialBlockSnp, ISizeBlockSnp } from './snp'

export type SnpType = 'Snp'
export type PutgType = 'Putg'
export type PutgmType = 'Putgm'
export type RingType = 'Ring'
export type RingsKitType = 'RingsKit'

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

export type PositionPutg = PositionBase<
	PutgType,
	{
		putgData: { main: IMainBlockPutg; size: ISizeBlockPutg; material: IMaterialBlockPutg; design: IDesignBlockPutg }
	}
>

export type PositionRing = PositionBase<
	RingType,
	{
		ringData: {
			// typeId: string
			// typeCode: string
			// densityId: string
			// densityCode: string
			// constructionCode: string
			// constructionWRP: boolean
			// constructionBaseCode: string
			// size: string
			// thickness: string
			// material: string
			// modifying: string
			// drawing: string

			ringType: IRingType
			density: IRingDensity
			construction: IRingConstruction
			size: string
			thickness: string
			material: string
			modifying?: string
			drawing?: string
		}
	}
>

export type PositionKit = PositionBase<
	RingsKitType,
	{
		kitData: IRingsKitData
	}
>

export type Position = PositionSnp | PositionPutg | PositionRing | PositionKit

export interface IActivePosition {
	index: number
	id: string
	type: SnpType | PutgType | RingType | RingsKitType
}
