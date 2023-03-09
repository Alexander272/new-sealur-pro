import { IDesignBlockSnp, IMainSnp, IMaterialBlockSnp, ISizeBlockSnp } from './snp'

export type SnpType = 'Snp'
export type PutgType = 'Putg'
export type PutgmType = 'Putgm'

//TODO возможно тут все таки надо добавить id (например date.new + count)
export type PositionBase<Type, ExtraProps> = {
	id: string
	count: number
	title: string
	amount: string
	type: Type
} & ExtraProps

export type PositionSnp = PositionBase<
	SnpType,
	{
		main: IMainSnp
		sizes: ISizeBlockSnp
		materials: IMaterialBlockSnp
		design: IDesignBlockSnp
	}
>

export type Position = PositionSnp
