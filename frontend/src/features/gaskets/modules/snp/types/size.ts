export interface IDn {
	dn: string
	alt: number
	d2: string
}

export interface ISize {
	id: string
	dn: string
	pn: string
	pnAlt: string
	d4: string
	d3: string
	d2: string
	d1: string
	h: string[]
	s2: string[]
	s3: string[]
}

export interface ISizeData {
	id: string
	dn: string
	dnAlt?: string
	pn: string
	pnAlt: string
	d4: string
	d3: string
	d2: string
	d1: string
	hIndex?: number
	h: string
	s2: string
	s3: string
	another: string
}

export interface ISizeDataDTO {
	id: string
	d4: string
	d3: string
	d2: string
	d1: string
	hIndex?: number
	another: string
}

export type DSize = 'd4' | 'd3' | 'd2' | 'd1'

export interface IThickness {
	h?: string
	hIndex?: number
	s2?: string
	s3?: string
	another?: string
}
