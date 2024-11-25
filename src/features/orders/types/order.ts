export interface IFullOrder {
	id: string
	manager: string
	clients: IClient[]
}

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
	status: 'new' | 'work' | 'finish'
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
}
