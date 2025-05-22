import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IDrawing } from '../../types/drawing'
import type { IConstruction, IFlangeType, IMainSerrated, ISerratedStandard, ISerratedType } from './types/main'
import { localKeys } from '@/constants/localKeys'

export interface ISerratedState {
	amount: string
	info: string

	main: IMainSerrated
	// material: IMaterialsSerrated
	// size: ISizeSerrated
	// design: IDesignSerrated

	// designErrors: IDesignErrors
	// sizeErrors: ISizeErrors

	drawing?: IDrawing
}

const initialState: ISerratedState = {
	amount: '',
	info: '',

	main: {},
	// material: {},
	// size: {
	// 	dn: '',
	// 	dnAlt: 0,
	// 	pn: '',
	// 	pnAlt: '',
	// 	d4: '',
	// 	d3: '',
	// 	d2: '',
	// 	d1: '',
	// 	h: '3.0',
	// },
	// design: {
	// 	jumper: {
	// 		hasJumper: false,
	// 		code: 'A',
	// 		width: '',
	// 		hasDrawing: false,
	// 	},
	// 	drawing: JSON.parse(localStorage.getItem(localKeys.waveDrawing) || 'null')?.src || undefined,
	// },
	drawing: JSON.parse(localStorage.getItem(localKeys.serratedDrawing) || 'null') || undefined,

	// designErrors: {
	// 	hole: false,
	// 	jumper: false,
	// 	rounding: false,
	// 	configuration: false,
	// },
	// sizeErrors: {},
}

export const serratedSlice = createSlice({
	name: 'serrated',
	initialState,
	reducers: {
		// установка стандарта
		setMainStandard: (state, action: PayloadAction<ISerratedStandard>) => {
			state.main.standard = action.payload
		},
		// установка типа фланца
		setMainFlangeType: (state, action: PayloadAction<IFlangeType>) => {
			state.main.flangeType = action.payload
		},
		// установка кода типа прокладки
		setType: (state, action: PayloadAction<ISerratedType>) => {
			state.main.type = action.payload
		},
		// установка тип конструкции
		setConstruction: (state, action: PayloadAction<IConstruction>) => {
			state.main.construction = action.payload
		},
	},
})

export const serratedPath = serratedSlice.name
export const serratedReducer = serratedSlice.reducer

export const getMain = (state: RootState) => state.serrated.main
export const getStandard = (state: RootState) => state.serrated.main.standard
export const getFlangeType = (state: RootState) => state.serrated.main.flangeType
export const getType = (state: RootState) => state.serrated.main.type
export const getConstruction = (state: RootState) => state.serrated.main.construction

export const {
	setMainStandard,
	setMainFlangeType,
	setType,
	setConstruction,
	// setPlating,
	// setMaterial,
	// setDn,
	// setSize,
	// setDSize,
	// setThickness,
	// setSizeErrors,
	// setUseDimensions,
	// setHasRounding,
	// setHasHole,
	// setHasCoating,
	// setWithRetainer,
	// setJumper,
	// setDrawing,
	// setInfo,
	// setAmount,
	// setWave,
	// clearWave,
	// resetWave,
} = serratedSlice.actions
