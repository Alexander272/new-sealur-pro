// export const IOrderStatistic = {
// 	id: string
// 	Manager   string         `json:"manager" db:"manager"`
// 	ManagerId string         `json:"managerId" db:"manager_id"`
// 	UserId    string         `json:"userId" db:"user_id"`
// 	User      string         `json:"user" db:"name"`
// 	Company   string         `json:"company" db:"company"`
// 	Count     int            `json:"count" db:"count"`
// 	Position  *PositionStats `json:"positions"`
// }

export interface IGroupedOrderStatistics {
	id: string
	manager: string
	managerId: string
	userId: string
	user: string
	company: string
	count: number
	positions: IPositionStatistics | null
}
export interface IPositionStatistics {
	count: number
	snp: number
	putg: number
	wave: number
	rings: number
	kit: number
}

export interface IOrderStatistics {
	ordersCount: number
	usersCount: number
	positions: IPositionStatistics | null
}

export interface IOrderCount {
	userId: string
	name: string
	company: string
	orders: number
	positions: number
	average: number
}

export interface IUsersStatistics {
	companyCount: number
	usersCount: number
	notConfirmedUsers: number
	usersFromManager: number
}

export interface IUserParams {
	from?: string
	to?: string
	fromManager?: boolean
	withOrders?: boolean
	confirmed?: boolean
}

export interface IUsersInfo {
	id: string
	company: string
	user: string
	manager: string
	fromManager: boolean
	ordersCount: number
	hasOrders: boolean
}

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

export interface IOrderParams {
	userId?: string
	from?: string
	to?: string
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
	snpOrderCount?: number
	putgOrderCount?: number
	positionCount: number
	snpPositionCount?: number
	putgPositionCount?: number
	averagePosition: number
	averageSnpPosition?: number
	averagePutgPosition?: number
}
