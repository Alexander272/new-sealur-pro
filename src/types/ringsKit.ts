export interface IRingsKit {
	ringsKitTypes: IKitType[]
	// constructions: {
	// 	constructions: {
	// 		[id: string]: { constructions: IKitConstructions[] }
	// 	}
	// }
	constructionMap: {
		[id: string]: { constructions: IKitConstructions[] }
	}
}

export interface IKitData {
	amount: string
	info?: string
	kitData: IRingsKitData
}

export interface IRingsKitData {
	typeId: string
	type: string
	construction: IKitConstructions
	count: string

	size: string
	thickness: string

	material: string
	modifying?: string

	drawing?: string
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
	defaultMaterials: string
	enabledMaterials?: string[]
}

export interface IKitSize {
	id: string
	outer: number
	inner: number
	thickness: number
}

export type Steps = 'typeStep' | 'countStep' | 'sizeStep' | 'materialStep' | 'modifyingStep'

export interface IStep {
	active: boolean
	complete: boolean
	required: boolean
	error: boolean
	nextStep?: Steps
}
