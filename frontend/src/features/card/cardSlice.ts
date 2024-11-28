import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IActive, Position } from './types/card'

export interface ICardState {
	open: boolean
	orderId: string
	info: string
	positions: Position[]
	active?: IActive
}

const initialState: ICardState = {
	open: false,
	orderId: '',
	info: '',
	positions: [],
	active: undefined,
}

export const cardSlice = createSlice({
	name: 'card',
	initialState,
	reducers: {
		// открытие (закрытие) заявки
		toggle: (state, action: PayloadAction<{ open: boolean } | undefined>) => {
			if (action.payload) {
				state.open = action.payload.open
			} else state.open = !state.open
		},

		// установка текущей заявки
		setOrder: (state, action: PayloadAction<{ id: string; info: string; positions: Position[] }>) => {
			state.orderId = action.payload.id
			state.info = action.payload.info
			state.positions = action.payload.positions
		},

		// изменение доп. информации о заявке
		setInfo: (state, action: PayloadAction<string>) => {
			state.info = action.payload
		},

		// установка позиции для редактирования
		setActive: (state, action: PayloadAction<IActive | undefined>) => {
			state.active = action.payload
		},
		// сброс позиции для редактирования
		clearActive: state => {
			state.active = undefined
		},

		// сброс состояния
		resetState: () => initialState,
	},
})

export const cardPath = cardSlice.name
export const cardReducer = cardSlice.reducer

export const getActive = (state: RootState) => state.card.active
export const getOrderId = (state: RootState) => state.card.orderId
export const getPositions = (state: RootState) => state.card.positions

export const { toggle, setOrder, setInfo, setActive, clearActive, resetState } = cardSlice.actions
