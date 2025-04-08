import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IDrawing } from '../../types/drawing'
import type { IConfiguration, IConstruction, IFlangeType, IMainWave, IWaveStandard, IWaveType } from './types/main'
import type { DSize, ISize, ISizeWave } from './types/sizes'
import type { IDesignWave } from './types/design'
import type { IMaterialsWave, IPlating, TypeMaterial } from './types/material'
import type { IMaterial } from '../../types/material'
import { localKeys } from '@/constants/localKeys'

export interface IWaveState {
	amount: string
	info: string

	main: IMainWave
	material: IMaterialsWave
	size: ISizeWave
	design: IDesignWave

	drawing?: IDrawing
}

const initialState: IWaveState = {
	amount: '',
	info: '',

	main: {},
	material: {},
	size: {
		dn: '',
		pnMpa: '',
		pnKg: '',
		d4: '',
		d3: '',
		d2: '',
		d1: '',
		h: '3.0',
	},
	design: {
		jumper: {
			hasJumper: false,
			code: 'A',
			width: '',
			hasDrawing: false,
		},
	},
}

export const waveSlice = createSlice({
	name: 'wave',
	initialState,
	reducers: {
		// установка конфигурации
		setConfiguration: (state, action: PayloadAction<IConfiguration>) => {
			state.main.configuration = action.payload
			// state.size.useDimensions = (action.payload.code != 'round' && state.size.useDimensions) || false
			// state.sizeError.emptyD1 = false
			// state.sizeError.emptyD2 = false
			// state.sizeError.emptyD3 = false
			// state.sizeError.emptyD4 = false
			// state.sizeError.emptySize = false
			// state.sizeError.minWidth = false
			// state.sizeError.maxSize = false
			// state.hasSizeError = false
			// state.designError.emptyDrawingForm = action.payload.hasDrawing || false
			// state.hasDesignError = Object.values(state.designError).some(v => v)
		},
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
		setPlating: (state, action: PayloadAction<IPlating>) => {
			state.material.plating = action.payload
		},
		setMaterial: (state, action: PayloadAction<{ type: TypeMaterial; material?: IMaterial }>) => {
			state.material[action.payload.type] = action.payload.material
		},
		//
		setDn: (state, action: PayloadAction<string>) => {
			state.size.dn = action.payload
		},
		setSize: (state, action: PayloadAction<ISize>) => {
			state.size = { ...state.size, ...action.payload }
		},
		setDSize: (state, action: PayloadAction<{ name: DSize; value: string }>) => {
			state.size[action.payload.name] = action.payload.value
			//TODO валидация
		},
		setThickness: (state, action: PayloadAction<string>) => {
			state.size.h = action.payload
		},
		// Размеры задаются через Габариты?
		setUseDimensions: (state, action: PayloadAction<boolean>) => {
			state.size.useDimensions = action.payload

			state.size.d4 = ''
			state.size.d3 = ''
			state.size.d2 = ''
			state.size.d1 = ''

			// state.sizeError.emptyD1 = false
			// state.sizeError.emptyD2 = false
			// state.sizeError.emptyD3 = false
			// state.sizeError.emptyD4 = false
			// state.sizeError.emptySize = false
			// state.sizeError.minWidth = false
			// state.sizeError.maxSize = false
			// state.hasSizeError = false
		},
		// есть скругления (для прямоугольной)
		setHasRounding: (state, action: PayloadAction<boolean>) => {
			state.size.hasRounding = action.payload

			// state.designError.emptyDrawingRounding = !state.drawing && (state.size.hasRounding || false)
			// state.hasDesignError = Object.values(state.designError).some(v => v)
		},

		// установка отверстия
		setHasHole: (state, action: PayloadAction<boolean>) => {
			state.design.hasHole = action.payload
			// state.designError.emptyDrawingHole = !state.drawing && action.payload

			// state.hasDesignError = Object.values(state.designError).some(v => v)
		},
		// самоклеящееся покрытие
		setHasCoating: (state, action: PayloadAction<boolean>) => {
			state.design.hasCoating = action.payload
		},
		// фиксатор
		setWithRetainer: (state, action: PayloadAction<boolean>) => {
			state.design.withRetainer = action.payload
		},
		// установка перемычки и ее ширины
		setJumper: (
			state,
			action: PayloadAction<{ hasJumper?: boolean; code?: string; width?: string; hasDrawing?: boolean }>
		) => {
			if (action.payload.hasJumper != undefined) state.design.jumper.hasJumper = action.payload.hasJumper
			if (action.payload.code != undefined) state.design.jumper.code = action.payload.code
			if (action.payload.width != undefined) state.design.jumper.width = action.payload.width
			if (action.payload.hasDrawing != undefined) {
				state.design.jumper.hasDrawing = action.payload.hasDrawing
			}
			// state.designError.emptyDrawingJumper = !state.drawing && (state.design.jumper.hasDrawing || false)

			// if (!state.design.jumper.hasJumper) state.designError.emptyDrawingJumper = false
			// state.hasDesignError = Object.values(state.designError).some(v => v)
		},
		// установка чертежа
		setDrawing: (state, action: PayloadAction<IDrawing | undefined>) => {
			state.drawing = action.payload
			state.design.drawing = action.payload?.link
			localStorage.setItem(localKeys.waveDrawing, JSON.stringify(action.payload || ''))

			// state.designError.emptyDrawingHole = !state.drawing && (state.design.hasHole || false)
			// state.designError.emptyDrawingJumper = !state.drawing && (state.design.jumper.hasDrawing || false)
			// state.designError.emptyDrawingRemovable = !state.drawing && (state.design.hasRemovable || false)
			// state.designError.emptyDrawingRounding = !state.drawing && (state.size.hasRounding || false)
			// state.designError.emptyDrawingForm = !state.drawing && (state.main.configuration?.hasDrawing || false)
			// state.hasDesignError = Object.values(state.designError).some(v => v)
		},

		// установка доп. инфы
		setInfo: (state, action: PayloadAction<string>) => {
			state.info = action.payload
		},
		// установка количества
		setAmount: (state, action: PayloadAction<string>) => {
			state.amount = action.payload
		},
	},
})

export const wavePath = waveSlice.name
export const waveReducer = waveSlice.reducer

export const getMain = (state: RootState) => state.wave.main
export const getConfiguration = (state: RootState) => state.wave.main.configuration
export const getStandard = (state: RootState) => state.wave.main.standard
export const getFlangeType = (state: RootState) => state.wave.main.flangeType
export const getType = (state: RootState) => state.wave.main.type
export const getConstruction = (state: RootState) => state.wave.main.construction

export const getMaterials = (state: RootState) => state.wave.material
export const getPlating = (state: RootState) => state.wave.material.plating

export const getSize = (state: RootState) => state.wave.size
export const getSizeId = (state: RootState) => state.wave.size.id
export const getDn = (state: RootState) => state.wave.size.dn
export const getPnMpa = (state: RootState) => state.wave.size.pnMpa
export const getH = (state: RootState) => state.wave.size.h
export const getUseDimensions = (state: RootState) => state.wave.size.useDimensions
export const getHasRounding = (state: RootState) => state.wave.size.hasRounding

export const getDesign = (state: RootState) => state.wave.design
export const getHasCoating = (state: RootState) => state.wave.design.hasCoating
export const getHasHole = (state: RootState) => state.wave.design.hasHole
export const getWithRetainer = (state: RootState) => state.wave.design.withRetainer
export const getJumper = (state: RootState) => state.wave.design.jumper
export const getDrawing = (state: RootState) => state.wave.drawing

export const getInfo = (state: RootState) => state.wave.info
export const getAmount = (state: RootState) => state.wave.amount

export const {
	setConfiguration,
	setMainStandard,
	setMainFlangeType,
	setType,
	setConstruction,
	setPlating,
	setMaterial,
	setDn,
	setSize,
	setDSize,
	setThickness,
	setUseDimensions,
	setHasRounding,
	setHasHole,
	setHasCoating,
	setWithRetainer,
	setJumper,
	setDrawing,
	setInfo,
	setAmount,
} = waveSlice.actions
