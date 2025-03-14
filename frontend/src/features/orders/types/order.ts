import { ICopyPosition, Position } from '@/features/card/types/card'

type Status = 'new' | 'work' | 'finish'

export interface IOrderResponse {
	data: {
		id: string
		number?: number
		info?: string
		positions?: Position[]
	}
}

export interface ICopyOrder {
	// targetId: string
	// fromId: string
	// count: number
	id: string
	positions: ICopyPosition[]
}

export interface IFullOrder {
	id: string
	number: number
	date: string
	countPosition: number
	positions: Position[]
	info?: string
	userId: string
}

// export interface IFullOrder {
// 	id: string
// 	manager: string
// 	clients: IClient[]
// }

export interface IClient {
	id: string
	company: string
	name: string
	orders: IOrder[]
}

export interface IOrder {
	id: string
	number: string
	date: string
	status: Status
}

export interface IOrderWithCompany {
	id: string
	number: string
	date: string
	countPosition: number
	status: Status
	company: string
	userId: string
	managerId: string
}

export interface ISaveOrder {
	id: string
	count: number
}

export interface IOrderCount {
	id: string
	name: string
	company: string
	orderCount: number
	//TODO надо это все сгруппировать
	snpOrderCount?: number
	putgOrderCount?: number
	positionCount: number
	snpPositionCount?: number
	putgPositionCount?: number
	averagePosition: number
	averageSnpPosition?: number
	averagePutgPosition?: number

	// orderCount: {
	// 	main: number
	// 	withSnp: number
	// 	withPutg: number
	// },
	// positionCount: {
	// 	main: number
	// 	snp: number
	// 	putg: number
	// }
	// average: {
	// 	main: number
	// 	snp: number
	// 	putg: number
	// }
}
