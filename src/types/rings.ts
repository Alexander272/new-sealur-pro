export interface IRingType {
	id: string
	title: string
	code: string
	description?: string
	hasRotaryPlug?: boolean
	hasDensity?: boolean
	hasThickness?: boolean
	materialType: string
	image: string
}

export interface IRingConstruction {
	id: string
	code: string
	title: string
	description?: string
	image: string
	withoutRotaryPlug?: boolean
}

export interface IRingDensity {
	id: string
	code: string
	title: string
	description?: string
	hasRotaryPlug?: boolean
}

export interface IRing {
	ringTypes: IRingType[]
	density: {
		density: {
			[id: string]: { density: IRingDensity[] }
		}
	}
	constructions: {
		constructions: {
			[id: string]: { constructions: IRingConstruction[] }
		}
	}
}

export interface IRingMaterial {
	id: string
	type: string
	title: string
	isDefault: boolean
}

export interface IRingModifying {
	id: string
	code: string
	description: string
}

export type Steps = 'typeStep' | 'sizeStep' | 'materialStep' | 'modifyingStep'

export interface IStep {
	active: boolean
	complete: boolean
	required: boolean
	error: boolean
	nextStep: Steps | null
}
