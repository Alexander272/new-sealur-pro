import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IDrawing } from '../../types/drawing'
import type { IConstruction, IFlangeType, IMainSerrated, ISerratedStandard, ISerratedType } from './types/main'
import type { DSize, ISize, ISizeSerrated } from './types/sizes'
import { localKeys } from '@/constants/localKeys'
import { ISizeErrors } from './types/errors'

export interface ISerratedState {
	amount: string
	info: string

	main: IMainSerrated
	size: ISizeSerrated
	// material: IMaterialsSerrated
	// design: IDesignSerrated

	// designErrors: IDesignErrors
	sizeErrors: ISizeErrors

	drawing?: IDrawing
}

const initialState: ISerratedState = {
	amount: '',
	info: '',

	main: {},
	size: {
		dn: '',
		dnAlt: 0,
		pn: '',
		pnAlt: '',
		d4: '',
		d3: '',
		d2: '',
		d1: '',
		h: '3.0',
	},
	// material: {},
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
	sizeErrors: {},
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
		//
		setDn: (state, action: PayloadAction<number>) => {
			state.size.dnAlt = action.payload
		},
		setSize: (state, action: PayloadAction<ISize>) => {
			state.size = { ...state.size, ...action.payload }
		},
		setDSize: (state, action: PayloadAction<{ name: DSize; value: string }>) => {
			state.size[action.payload.name] = action.payload.value
		},
		setThickness: (state, action: PayloadAction<string>) => {
			state.size.h = action.payload
		},
		setSizeErrors: (state, action: PayloadAction<ISizeErrors>) => {
			state.sizeErrors = { ...state.sizeErrors, ...action.payload }
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

export const getSize = (state: RootState) => state.serrated.size
export const getSizeId = (state: RootState) => state.serrated.size.id
export const getDn = (state: RootState) => state.serrated.size.dnAlt
export const getPn = (state: RootState) => state.serrated.size.pn
export const getH = (state: RootState) => state.serrated.size.h

export const getSizeErrors = (state: RootState) => state.serrated.sizeErrors

export const {
	setMainStandard,
	setMainFlangeType,
	setType,
	setConstruction,
	setDn,
	setSize,
	setDSize,
	setThickness,
	setSizeErrors,
	// setPlating,
	// setMaterial,
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
