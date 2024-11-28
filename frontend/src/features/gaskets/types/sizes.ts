// export interface ISize {
// 	dn: string
// 	pn: string
// 	d4: string
// 	d3: string
// 	d2: string
// 	d1: string
// 	thickness: string
// }

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

export interface PN {
	mpa: string
	kg: string
}

export interface IPutgSize {
	id: string
	dn: string
	dnMm?: string
	sizes: IPutgMainSize[]
}

export interface IPutgMainSize {
	pn: PN[]
	d4?: string
	d3: string
	d2: string
	d1?: string
	h: string[]
}
