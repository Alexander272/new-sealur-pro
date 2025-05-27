import type { IJumper } from '@/features/gaskets/types/jumper'

export interface IDesignWave {
	jumper: IJumper
	hasHole?: boolean
	hasCoating?: boolean
	withRetainer?: boolean
	drawing?: string
}

export interface IWaveInfo {
	id?: string
	hasJumper?: boolean
	hasHole?: boolean
	hasCoating?: boolean
	withRetainer?: boolean
}
