export interface IUser {
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
	roleCode: string
	useLink?: boolean
}

export interface IRefreshUser {
	id: string
	roleCode: string
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
	roleCode: string
	useLink?: boolean
	confirmed?: boolean
	date?: string
	useLanding?: boolean
	lastVisit?: string
}
