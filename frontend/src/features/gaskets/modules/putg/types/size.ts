export interface ISizeData {
	id: string
	dn: string
	dnAlt: number
	pn: string
	pnAlt: string
	d4: string
	d3: string
	d2: string
	d1: string
	h: string
	useDimensions?: boolean
	hasRounding?: boolean
}

export interface ISizeDataDTO {
	id: string
	d4: string
	d3: string
	d2: string
	d1: string
	h: string
	useDimensions?: boolean
	hasRounding?: boolean
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
	h: string[]
}

export interface IGetDnDTO {
	filler: string
	flangeType: string
	construction: string
}
export interface IGetSizeDTO extends IGetDnDTO {
	dn: string
}
