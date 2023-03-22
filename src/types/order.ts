import { Position } from './card'

export interface IOrderResponse {
	data: {
		id: string
		number?: number
		positions?: Position[]
	}
}

export interface IFullOrder {
	id: string
	number?: number
	date?: string
	countPosition?: number
	positions?: Position[]
}

export interface IOrder {
	id: string
	count: number
}

export interface IManagerOrder {
	id: string
	date: string
	countPosition: number
	number: number
	status: 'new' | 'work' | 'finish'
	userId: string
	company: string
	managerId?: string
}

export interface ICopyOrder {
	targetId: string
	fromId: string
	count: number
}
