export interface ISizeSerrated {
	id?: string
	dn: string
	dnAlt: number
	pn: string
	pnAlt: string
	d4: string
	d3: string
	d2: string
	d1: string
	h: string
}

export interface IDn {
	dn: string
	alt: number
}

export interface ISize {
	id: string
	dn: string
	dnAlt: number
	pn: string
	pnAlt: string
	d4: string
	d3: string
	d2: string
	d1: string
}

export type DSize = 'd4' | 'd3' | 'd2' | 'd1'
