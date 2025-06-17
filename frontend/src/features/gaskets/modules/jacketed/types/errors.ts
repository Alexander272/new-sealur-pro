export interface IDesignErrors {
	jumper: boolean
}

export interface ISizeErrors {
	d3?: boolean
	thickness?: boolean
	emptyD3?: boolean
	emptyD2?: boolean

	maxWidth?: boolean
	minWidth?: boolean
	maxSize?: boolean
}
