export interface IDesignErrors {
	hole: boolean
	jumper: boolean
}

export interface ISizeErrors {
	d4?: boolean
	d3?: boolean
	d2?: boolean
	thickness?: boolean
	emptyD4?: boolean
	emptyD3?: boolean
	emptyD2?: boolean
	emptyD1?: boolean

	difD4D1?: boolean
	difD4D2?: boolean
	difD3D1?: boolean

	maxWidth?: boolean
	minWidth?: boolean
	maxSize?: boolean

	jumper?: boolean
}
