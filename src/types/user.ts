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
}

export interface IRefreshUser {
	id: string
	roleCode: string
}
