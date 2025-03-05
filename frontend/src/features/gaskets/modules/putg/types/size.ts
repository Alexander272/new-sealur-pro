import { IPutgMainSize, PN } from '@/features/gaskets/types/sizes'

export interface ISizeBlock {
	pn: PN
	pnIndex?: number
	sizes?: IPutgMainSize
	thickness?: {
		h: string
		another: string
	}
}
