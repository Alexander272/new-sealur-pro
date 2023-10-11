export interface IAnalytics {
	ordersCount: number
	companyCount: number
	usersCountRegister: number
	userCountLink: number
	userCount: number
	positionCount: number
	snpPositionCount?: number
	putgPositionCount?: number
	ringPositionCount?: number
	kitPositionCount?: number
	newCompanyCount?: number
	newUserCount?: number
	newUserCountLink?: number
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
	snpPositionCount?: number
	putgPositionCount?: number
	ringPositionCount?: number
	kitPositionCount?: number
}

export interface IUserParams {
	periodAt?: number
	periodEnd?: number
	useLink?: boolean
	hasOrders?: boolean
}

export interface IOrderParams {
	userId?: string
	periodAt?: number
	periodEnd?: number
}

export interface IAnalyticFullClient {
	id: string
	manager: string
	users: IUserData[]
}

export interface IUserData {
	id: string
	company: string
	address: string
	name: string
	position: string
	email: string
	phone: string
	managerId: string
	useLink: boolean
	ordersCount: number
	hasOrders: boolean
}

export interface IAnalyticFullOrder {
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
	positionCount: number
	averagePosition: number

	snpOrderCount?: number
	snpPositionCount?: number
	averageSnpPosition?: number

	putgOrderCount?: number
	putgPositionCount?: number
	averagePutgPosition?: number

	ringOrderCount?: number
	ringPositionCount?: number
	averageRingPosition?: number

	kitOrderCount?: number
	kitPositionCount?: number
	averageKitPosition?: number
}
