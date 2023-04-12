import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Position } from '@/types/card'

// const localKey = 'sealur_pro_card'

export interface ICardState {
	// count: number
	open: boolean
	orderId: string
	positions: Position[]
}

const initialState: ICardState = {
	// count: 0,
	open: false,
	orderId: '',
	// positions: JSON.parse(localStorage.getItem(localKey) || 'null') || [],
	positions: [],
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
		setOrder: (state, action: PayloadAction<{ id: string; positions: Position[] }>) => {
			state.orderId = action.payload.id
			state.positions = action.payload.positions
		},

		// добавление позиции
		addPosition: (state, action: PayloadAction<Position>) => {
			// state.count += 1
			state.positions.push(action.payload)

			// localStorage.setItem(localKey, JSON.stringify(state.positions))
		},
		// обновление позиции
		updatePosition: (state, action: PayloadAction<{ index: number; position: Position }>) => {
			state.positions[action.payload.index] = action.payload.position

			// localStorage.setItem(localKey, JSON.stringify(state.positions))
		},
		// удаление позиции
		deletePosition: (state, action: PayloadAction<string>) => {
			state.positions = state.positions.filter(p => p.id != action.payload)
			state.positions = state.positions.map((p, idx) => {
				p.count = idx + 1
				return p
			})

			// localStorage.setItem(localKey, JSON.stringify(state.positions))
		},
	},
})

export const { toggle, setOrder, addPosition, updatePosition, deletePosition } = cardSlice.actions

export default cardSlice.reducer
