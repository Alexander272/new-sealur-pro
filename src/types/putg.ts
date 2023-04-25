export interface IGasketConfiguration {
	id: string
	title: string
	code: 'round' | 'oval' | 'rectangular'
	hasDrawing?: boolean
	hasStandard?: boolean
}

export interface IFlangeStandard {
	id: string
	title: string
	code: string
}

export interface IMainBlockPutg {
	configuration?: IGasketConfiguration
	flangeStandard?: IFlangeStandard
	flangeTypeCode: string
	flangeTypeTitle: string
}
