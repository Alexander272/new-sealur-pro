import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Position } from '@/types/card'

const localKey = 'sealur_pro_card'

export interface ICardState {
	// count: number
	open: boolean
	positions: Position[]
}

const initialState: ICardState = {
	// count: 0,
	open: false,
	positions: JSON.parse(localStorage.getItem(localKey) || 'null') || [],
}

export const cardSlice = createSlice({
	name: 'card',
	initialState,
	reducers: {
		toggle: (state, action: PayloadAction<{ open: boolean } | undefined>) => {
			if (action.payload) {
				state.open = action.payload.open
			} else state.open = !state.open
		},

		addPosition: (state, action: PayloadAction<Position>) => {
			// state.count += 1
			state.positions.push(action.payload)

			localStorage.setItem(localKey, JSON.stringify(state.positions))
		},
		updatePosition: (state, action: PayloadAction<{ index: number; position: Position }>) => {
			state.positions[action.payload.index] = action.payload.position

			localStorage.setItem(localKey, JSON.stringify(state.positions))
		},
		deletePosition: (state, action: PayloadAction<string>) => {
			state.positions = state.positions.filter(p => p.id != action.payload)
			state.positions = state.positions.map((p, idx) => {
				p.count = idx + 1
				return p
			})

			localStorage.setItem(localKey, JSON.stringify(state.positions))
		},
	},
})

export const { toggle, addPosition, updatePosition, deletePosition } = cardSlice.actions

export default cardSlice.reducer
