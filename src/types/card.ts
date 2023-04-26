import { IDesignBlockSnp, IMainSnp, IMaterialBlockSnp, ISizeBlockSnp } from './snp'

export type SnpType = 'Snp'
export type PutgType = 'Putg'
export type PutgmType = 'Putgm'

export type PositionBase<Type, ExtraProps> = {
	id: string
	orderId: string
	count: number
	title: string
	amount: string
	info: string
	type?: Type
} & ExtraProps

export type PositionSnp = PositionBase<
	SnpType,
	{
		snpData: { main: IMainSnp; size: ISizeBlockSnp; material: IMaterialBlockSnp; design: IDesignBlockSnp }
	}
>

export type Position = PositionSnp
