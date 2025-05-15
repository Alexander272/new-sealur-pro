import { IJumper } from '@/features/gaskets/types/jumper'

export interface IDesignData {
	jumper: IJumper
	hasHole?: boolean
	hasCoating?: boolean
	hasRemovable?: boolean
	// mounting: IHasMounting
	drawing?: string
}

export interface IDesignDataDTO {
	jumper?: IJumper
	hasHole?: boolean
	hasCoating?: boolean
	hasRemovable?: boolean
	drawing?: string
}
