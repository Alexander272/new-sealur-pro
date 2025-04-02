import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IDrawing } from '../../types/drawing'
import type { IConstruction, IFlangeType, IMainWave, IWaveStandard, IWaveType } from './types/main'
import type { ISize, ISizeWave } from './types/sizes'

export interface IWaveState {
	amount: string
	info: string

	main: IMainWave
	size: ISizeWave

	drawing?: IDrawing
}

const initialState: IWaveState = {
	amount: '',
	info: '',

	main: {},
	size: {
		dn: '',
		pnMpa: '',
		pnKg: '',
		d4: '',
		d3: '',
		d2: '',
		d1: '',
		h: '3,0',
	},
}

export const waveSlice = createSlice({
	name: 'wave',
	initialState,
	reducers: {
		// установка стандарта
		setMainStandard: (state, action: PayloadAction<IWaveStandard>) => {
			state.main.standard = action.payload
		},
		// установка типа фланца
		setMainFlangeType: (state, action: PayloadAction<IFlangeType>) => {
			state.main.flangeType = action.payload
		},
		// установка кода типа прокладки
		setType: (state, action: PayloadAction<IWaveType>) => {
			state.main.type = action.payload
		},
		// установка тип конструкции
		setConstruction: (state, action: PayloadAction<IConstruction>) => {
			state.main.construction = action.payload
		},
		//
		setDn: (state, action: PayloadAction<string>) => {
			state.size.dn = action.payload
		},
		setSize: (state, action: PayloadAction<ISize>) => {
			state.size = { ...state.size, ...action.payload }
		},
		setThickness: (state, action: PayloadAction<string>) => {
			state.size.h = action.payload
		},
	},
})

export const wavePath = waveSlice.name
export const waveReducer = waveSlice.reducer

export const getMain = (state: RootState) => state.wave.main
export const getStandard = (state: RootState) => state.wave.main.standard
export const getFlangeType = (state: RootState) => state.wave.main.flangeType
export const getType = (state: RootState) => state.wave.main.type
export const getConstruction = (state: RootState) => state.wave.main.construction

export const getSize = (state: RootState) => state.wave.size
export const getSizeId = (state: RootState) => state.wave.size.id
export const getDn = (state: RootState) => state.wave.size.dn
export const getPnMpa = (state: RootState) => state.wave.size.pnMpa
export const getH = (state: RootState) => state.wave.size.h

export const { setMainStandard, setMainFlangeType, setType, setConstruction, setDn, setSize, setThickness } =
	waveSlice.actions
