import { Position } from './card'

export interface IOrderResponse {
	data: {
		id: string
		number?: number
		positions?: Position[]
	}
}
