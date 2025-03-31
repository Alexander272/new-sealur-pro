import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IDrawing } from '../../types/drawing'
import type { IConstruction, IFlangeType, IMainWave, IWaveStandard, IWaveType } from './types/main'

export interface IWaveState {
	amount: string
	info: string

	main: IMainWave

	drawing?: IDrawing
}

const initialState: IWaveState = {
	amount: '',
	info: '',

	main: {},
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
	},
})

export const wavePath = waveSlice.name
export const waveReducer = waveSlice.reducer

export const getMain = (state: RootState) => state.wave.main
export const getStandard = (state: RootState) => state.wave.main.standard
export const getFlangeType = (state: RootState) => state.wave.main.flangeType
export const getType = (state: RootState) => state.wave.main.type
export const getConstruction = (state: RootState) => state.wave.main.construction

export const { setMainStandard, setMainFlangeType, setType, setConstruction } = waveSlice.actions
