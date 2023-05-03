export interface IAnalytics {
	ordersCount: number
	usersCountRegister: number
	userCountLink: number
	userCount: number
	positionCount: number
	snpPositionCount: number
	newUserCount: number
	newUserCountLink: number
	orders?: IAnalyticOrder[]
}

export interface IAnalyticOrder {
	id: string
	manager: string
	clients: IAnalyticClient[]
}

export interface IAnalyticClient {
	id: string
	name: string
	ordersCount: number
	positionCount: number
	snpPositionCount: number
}
