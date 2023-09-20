export interface IRingsKit {
	ringsKitTypes: IKitType[]
	// constructions: {
	// 	constructions: {
	// 		[id: string]: { constructions: IKitConstructions[] }
	// 	}
	// }
	constructionGroups: {
		[id: string]: { constructions: IKitConstructions[] }
	}
}

export interface IKitType {
	id: string
	title: string
	code: string
	description?: string
	// sameRings?: boolean
	// hasThickness?: boolean
	// materialType: string
	image: string
	designation: string
}

export interface IKitConstructions {
	id: string
	code: string
	title: string
	image: string
	sameRings?: boolean
	materialTypes: string
	hasThickness?: boolean
	defaultCount: string
}

export type Steps = 'typeStep' | 'countStep' | 'sizeStep' | 'materialStep' | 'modifyingStep'

export interface IStep {
	active: boolean
	complete: boolean
	required: boolean
	error: boolean
	nextStep?: Steps
}
