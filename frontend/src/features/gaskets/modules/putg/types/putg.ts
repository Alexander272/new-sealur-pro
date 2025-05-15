import { IDesignData, IDesignDataDTO } from './design'
import { IMainData, IMainDataDTO } from './main'
import { IMaterialData, IMaterialDataDTO } from './materials'
import { ISizeData, ISizeDataDTO } from './size'

export interface IPutg {
	main: IMainData
	size: ISizeData
	material: IMaterialData
	design: IDesignData
}

export interface IPutgDTO {
	main: IMainDataDTO
	size: ISizeDataDTO
	material: IMaterialDataDTO
	design: IDesignDataDTO
}

export interface IPutgData {
	id: string
	hasJumper?: boolean
	hasHole?: boolean
	hasRemovable?: boolean
	hasMounting?: boolean
	hasCoating?: boolean
}
