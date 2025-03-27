export interface IUser {
	id: string
	nickname: string
	company: string
	address: string
	inn: string
	kpp: string
	region: string
	city: string
	name: string
	position: string
	email: string
	phone: string
	role: string
	useLink?: boolean

	token: string
}

export interface IUserInfo {
	id: string
	nickname: string
	email: string
	name: string
	company: string
	address: string
	inn: string
	kpp: string
	region: string
	city: string
	position: string
	phone: string
	manager: string
	fromManager: boolean
	fromLanding: boolean
	confirmed: boolean
	date: number
	orderDate: number
	visitDate: number
}

export interface IRefreshUser {
	id: string
	nickname: string
	email: string
	role: string
	token: string
}

export interface IUserData {
	id: string
	company: string
	address: string
	inn: string
	kpp: string
	region: string
	city: string
	name: string
	position: string
	email: string
	phone: string
	role: string
	useLink?: boolean
	confirmed?: boolean
	date?: string
	useLanding?: boolean
	lastVisit?: string
}
