export interface IDesignErrors {
	hole: boolean
	jumper: boolean
	rounding: boolean
	configuration: boolean
}

export interface ISizeErrors {
	d4?: boolean
	d3?: boolean
	d2?: boolean
	thickness?: boolean
	// emptySize?: boolean
	emptyD4?: boolean
	emptyD3?: boolean
	emptyD2?: boolean
	emptyD1?: boolean

	minWidth?: boolean
	maxSize?: boolean
}
