import { IJumper } from '@/components/Jumper/type'
import { IHasMounting } from '@/features/gaskets/types/mounting'

export interface IDesignData {
	jumper: IJumper
	hasHole?: boolean
	mounting: IHasMounting
	drawing?: string
}

export interface IDesignDataDTO {
	jumper?: IJumper
	hasHole?: boolean
	mounting: string
	drawing?: string
}
