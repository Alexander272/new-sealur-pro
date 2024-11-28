import { PN } from '@/features/gaskets/types/sizes'

export interface ISnpSize {
	id: string
	dn: string
	dnMm?: string
	d2?: string
	sizes: ISNPMainSize[]
}

export interface ISNPMainSize {
	d4: string
	d3: string
	d2: string
	d1: string
	h: string[]
	pn: PN[]
	s2: string[]
	s3: string[]
}

export interface ISizeBlock {
	pn: PN
	sizes?: {
		d4: string
		d3: string
		d2: string
		d1: string
	}
	thicknesses?: {
		h: string
		s2: string
		s3: string
		another: string
	}
}
