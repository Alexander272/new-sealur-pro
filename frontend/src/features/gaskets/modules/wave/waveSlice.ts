import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IDrawing } from '../../types/drawing'
import type { IMaterial } from '../../types/material'
import type { IConfiguration, IConstruction, IFlangeType, IMainWave, IWaveStandard, IWaveType } from './types/main'
import type { DSize, ISize, ISizeWave } from './types/sizes'
import type { IDesignWave } from './types/design'
import type { IMaterialsWave, IPlating, TypeMaterial } from './types/material'
import type { IDesignErrors, ISizeErrors } from './types/errors'
import type { IWave } from './types/wave'
import { localKeys } from '@/constants/localKeys'
import { setActive } from '@/features/card/cardSlice'

export interface IWaveState {
	amount: string
	info: string

	main: IMainWave
	material: IMaterialsWave
	size: ISizeWave
	design: IDesignWave

	designErrors: IDesignErrors
	sizeErrors: ISizeErrors

	drawing?: IDrawing
}

const initialState: IWaveState = {
	amount: '',
	info: '',

	main: {},
	material: {},
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
	design: {
		jumper: {
			hasJumper: false,
			code: 'A',
			width: '',
			hasDrawing: false,
		},
		drawing: JSON.parse(localStorage.getItem(localKeys.waveDrawing) || 'null')?.src || undefined,
	},
	drawing: JSON.parse(localStorage.getItem(localKeys.waveDrawing) || 'null') || undefined,

	designErrors: {
		hole: false,
		jumper: false,
		rounding: false,
		configuration: false,
	},
	sizeErrors: {},
}

export const waveSlice = createSlice({
	name: 'wave',
	initialState,
	reducers: {
		// установка конфигурации
		setConfiguration: (state, action: PayloadAction<IConfiguration>) => {
			const hasChange = state.main.configuration?.id != action.payload.id
			state.main.configuration = action.payload
			if (!hasChange) return
			state.material = initialState.material
			state.design = { ...initialState.design }
			state.design.drawing = state.drawing?.src
			state.size = { ...initialState.size }
			state.size.useDimensions = (action.payload.code != 'round' && state.size.useDimensions) || false
			state.sizeErrors = initialState.sizeErrors
			state.designErrors = { ...initialState.designErrors }
			state.designErrors.configuration = !state.drawing && (action.payload.hasDrawing || false)
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
		// Размеры задаются через Габариты?
		setUseDimensions: (state, action: PayloadAction<boolean>) => {
			state.size.useDimensions = action.payload

			state.size.d4 = ''
			state.size.d3 = ''
			state.size.d2 = ''
			state.size.d1 = ''

			state.sizeErrors.emptyD1 = false
			state.sizeErrors.emptyD2 = false
			state.sizeErrors.emptyD3 = false
			state.sizeErrors.emptyD4 = false
			// state.sizeError.emptySize = false
			state.sizeErrors.minWidth = false
			state.sizeErrors.maxSize = false
			// state.hasSizeError = false
		},
		setSizeErrors: (state, action: PayloadAction<ISizeErrors>) => {
			state.sizeErrors = { ...state.sizeErrors, ...action.payload }
		},
		// есть скругления (для прямоугольной)
		setHasRounding: (state, action: PayloadAction<boolean>) => {
			state.size.hasRounding = action.payload
			state.designErrors.rounding = !state.drawing && (state.size.hasRounding || false)
		},

		// установка отверстия
		setHasHole: (state, action: PayloadAction<boolean>) => {
			state.design.hasHole = action.payload
			state.designErrors.hole = !state.drawing && action.payload
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
			if (action.payload.hasDrawing != undefined) state.design.jumper.hasDrawing = action.payload.hasDrawing

			state.designErrors.jumper =
				!state.drawing && (state.design.jumper.hasJumper || false) && (state.design.jumper.hasDrawing || false)
		},
		// установка чертежа
		setDrawing: (state, action: PayloadAction<IDrawing | undefined>) => {
			state.drawing = action.payload
			state.design.drawing = action.payload?.src
			localStorage.setItem(localKeys.waveDrawing, JSON.stringify(action.payload || ''))

			state.designErrors.hole = !action.payload && (state.design.hasHole || false)
			state.designErrors.jumper =
				!action.payload && ((state.design.jumper.hasJumper && state.design.jumper.hasDrawing) || false)
			state.designErrors.rounding = !action.payload && (state.size.hasRounding || false)
			state.designErrors.configuration = !action.payload && (state.main.configuration?.hasDrawing || false)
		},

		// установка доп. инфы
		setInfo: (state, action: PayloadAction<string>) => {
			state.info = action.payload
		},
		// установка количества
		setAmount: (state, action: PayloadAction<string>) => {
			state.amount = action.payload
		},

		setWave: (state, action: PayloadAction<{ data: IWave; amount: string; info?: string }>) => {
			state.main = action.payload.data.main
			state.size = action.payload.data.size
			state.material = action.payload.data.material

			state.design.hasHole = action.payload.data.design.hasHole || false
			state.design.hasCoating = action.payload.data.design.hasCoating || false
			state.design.withRetainer = action.payload.data.design.withRetainer || false
			state.design.jumper.hasJumper = action.payload.data.design.jumper.hasJumper || false
			state.design.jumper.code = action.payload.data.design.jumper.code
			state.design.jumper.width = action.payload.data.design.jumper.width
			state.design.drawing = action.payload.data.design.drawing

			if (action.payload.data.design.drawing) {
				const params = new URLSearchParams(action.payload.data.design.drawing.split('?')[1])
				const id = params.get('name')?.split('_')[0]
				const drawing: IDrawing = {
					id: id || '',
					name: params.get('name') || '',
					origName: params.get('orig') || '',
					src: action.payload.data.design.drawing,
					group: params.get('group') || '',
				}
				state.drawing = drawing
			} else {
				state.drawing = undefined
			}

			state.amount = action.payload.amount
			state.info = action.payload.info || ''
		},
		// сброс выбранной позиции
		clearWave: state => {
			state.drawing = JSON.parse(localStorage.getItem(localKeys.waveDrawing) || 'null') || undefined
			state.design.drawing = state.drawing?.src
		},
		// сброс стейта
		resetWave: () => initialState,
	},
	extraReducers: builder =>
		builder.addCase(setActive, (state, action) => {
			if (!action.payload) {
				state.drawing = JSON.parse(localStorage.getItem(localKeys.waveDrawing) || 'null') || undefined
				state.design.drawing = state.drawing?.src
			}
		}),
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
export const getDn = (state: RootState) => state.wave.size.dnAlt
export const getPn = (state: RootState) => state.wave.size.pn
export const getH = (state: RootState) => state.wave.size.h
export const getUseDimensions = (state: RootState) => state.wave.size.useDimensions
export const getHasRounding = (state: RootState) => state.wave.size.hasRounding

export const getDesign = (state: RootState) => state.wave.design
export const getHasCoating = (state: RootState) => state.wave.design.hasCoating
export const getHasHole = (state: RootState) => state.wave.design.hasHole
export const getWithRetainer = (state: RootState) => state.wave.design.withRetainer
export const getJumper = (state: RootState) => state.wave.design.jumper
export const getDrawing = (state: RootState) => state.wave.drawing

export const getDesignErrors = (state: RootState) => state.wave.designErrors
export const getSizeErrors = (state: RootState) => state.wave.sizeErrors

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
	setSizeErrors,
	setUseDimensions,
	setHasRounding,
	setHasHole,
	setHasCoating,
	setWithRetainer,
	setJumper,
	setDrawing,
	setInfo,
	setAmount,
	setWave,
	clearWave,
	resetWave,
} = waveSlice.actions
