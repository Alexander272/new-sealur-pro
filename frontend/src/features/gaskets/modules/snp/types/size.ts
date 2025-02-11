import { PN } from '@/features/gaskets/types/sizes'

export interface ISnpSize {
	id: string
	dn: string
	dnMm?: string
	d2?: string
	sizes: ISNPMainSize[]
}

export interface ISNPMainSize {
	id: string
	d4: string
	d3: string
	d2: string
	d1: string
	pn: PN[]
	pnIndex?: number
	h: string[]
	hIndex?: number
	s2: string[]
	s3: string[]
}

export interface ISizeBlock {
	pn: PN
	pnIndex?: number
	sizes?: ISNPMainSize
	thicknesses?: {
		h: string
		s2: string
		s3: string
		another: string
	}
}
