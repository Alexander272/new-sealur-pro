import type { IJumper } from '@/features/gaskets/types/jumper'

export interface IDesignSerrated {
	jumper: IJumper
	hasHole?: boolean
	hasCoating?: boolean
	withRetainer?: boolean
	drawing?: string
}
