// export interface IMaterial {
// 	id: string
// 	title: string
// 	code: string
// 	shortEn: string
// 	shortRus: string
// }

export interface IMaterial {
	id: string
	materialId: string
	type: string
	isDefault: boolean
	code: string
	isStandard: boolean
	baseCode: string
	title: string
}
