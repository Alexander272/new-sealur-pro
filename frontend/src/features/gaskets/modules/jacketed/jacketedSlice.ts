import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { IConstruction, IFlangeType, IJacketedStandard, IJacketedType, IMainJacketed } from './types/main'
import type { IDrawing } from '../../types/drawing'
import { localKeys } from '@/constants/localKeys'
import { RootState } from '@/app/store'
import { IFiller, IMaterialsJacketed, TypeMaterial } from './types/material'
import { IMaterial } from '../../types/material'

export interface IJacketedState {
	amount: string
	info: string

	main: IMainJacketed
	// size: ISizeJacketed
	material: IMaterialsJacketed
	// design: IDesignJacketed

	// designErrors: IDesignErrors
	// sizeErrors: ISizeErrors

	drawing?: IDrawing
}

const initialState: IJacketedState = {
	amount: '',
	info: '',

	main: {},
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
	material: {},
	// design: {
	// 	jumper: {
	// 		hasJumper: false,
	// 		code: 'A',
	// 		width: '',
	// 		hasDrawing: false,
	// 	},
	// 	drawing: JSON.parse(localStorage.getItem(localKeys.jacketedDrawing) || 'null')?.src || undefined,
	// },
	drawing: JSON.parse(localStorage.getItem(localKeys.jacketedDrawing) || 'null') || undefined,

	// designErrors: {
	// 	hole: false,
	// 	jumper: false,
	// },
	// sizeErrors: {},
}

export const jacketedSlice = createSlice({
	name: 'jacketed',
	initialState,
	reducers: {
		// установка стандарта
		setMainStandard: (state, action: PayloadAction<IJacketedStandard>) => {
			state.main.standard = action.payload
		},
		// установка типа фланца
		setMainFlangeType: (state, action: PayloadAction<IFlangeType>) => {
			state.main.flangeType = action.payload
		},
		// установка кода типа прокладки
		setType: (state, action: PayloadAction<IJacketedType>) => {
			state.main.type = action.payload
		},
		// установка тип конструкции
		setConstruction: (state, action: PayloadAction<IConstruction>) => {
			state.main.construction = action.payload
		},

		//
		setFiller: (state, action: PayloadAction<IFiller>) => {
			state.material.filler = action.payload
		},
		setMaterial: (state, action: PayloadAction<{ type: TypeMaterial; material?: IMaterial }>) => {
			state.material[action.payload.type] = action.payload.material
		},
	},
})

export const jacketedPath = jacketedSlice.name
export const jacketedReducer = jacketedSlice.reducer

export const getMain = (state: RootState) => state.jacketed.main
export const getStandard = (state: RootState) => state.jacketed.main.standard
export const getFlangeType = (state: RootState) => state.jacketed.main.flangeType
export const getType = (state: RootState) => state.jacketed.main.type
export const getConstruction = (state: RootState) => state.jacketed.main.construction

export const getMaterials = (state: RootState) => state.jacketed.material
export const getFiller = (state: RootState) => state.jacketed.material.filler

export const {
	setMainStandard,
	setMainFlangeType,
	setType,
	setConstruction,
	// setDn,
	// setSize,
	// setDSize,
	// setThickness,
	// setSizeErrors,
	setFiller,
	setMaterial,
	// setHasHole,
	// setHasCoating,
	// setWithRetainer,
	// setJumper,
	// setDrawing,
	// setInfo,
	// setAmount,
	// setSerrated,
	// clearSerrated,
	// resetSerrated,
} = jacketedSlice.actions
