import { IDesignData, IDesignDataDTO } from './design'
import { IMainData, IMainDataDTO } from './main'
import { IMaterialData, IMaterialDataDTO } from './material'
import { ISizeData, ISizeDataDTO } from './size'

export interface ISnpData {
	id: string
	typeId: string
	hasInnerRing?: boolean
	hasFrame?: boolean
	hasOuterRing?: boolean
	hasHole?: boolean
	hasJumper?: boolean
	hasMounting?: boolean
}

export interface ISnpInfo {
	id: string
	hasInnerRing?: boolean
	hasFrame?: boolean
	hasOuterRing?: boolean
	hasHole?: boolean
	hasJumper?: boolean
	hasMounting?: boolean
}

export interface ISnp {
	main: IMainData
	size: ISizeData
	material: IMaterialData
	design: IDesignData
}

export interface ISnpDTO {
	main: IMainDataDTO
	size: ISizeDataDTO
	material: IMaterialDataDTO
	design: IDesignDataDTO
}
