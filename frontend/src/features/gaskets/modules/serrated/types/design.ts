import type { IJumper } from '@/features/gaskets/types/jumper'

export interface IDesignSerrated {
	jumper: IJumper
	hasHole?: boolean
	hasCoating?: boolean
	withRetainer?: boolean
	drawing?: string
}

export interface ISerratedInfo {
	id?: string
	hasJumper?: boolean
	hasHole?: boolean
	hasCoating?: boolean
	withRetainer?: boolean
}
