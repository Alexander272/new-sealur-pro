import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { IDrawing } from '../../types/drawing'
import type { IConstruction, IFlangeType, IJacketedStandard, IJacketedType, IMainJacketed } from './types/main'
import type { IFiller, IMaterialsJacketed, TypeMaterial, MaterialWithThickness } from './types/material'
import type { DSize, ISize, ISizeJacketed } from './types/sizes'
import type { IDesignJacketed } from './types/design'
import type { IDesignErrors, ISizeErrors } from './types/errors'
import type { IJacketed } from './types/jacketed'
import { localKeys } from '@/constants/localKeys'
import { RootState } from '@/app/store'

export interface IJacketedState {
	amount: string
	info: string

	main: IMainJacketed
	size: ISizeJacketed
	material: IMaterialsJacketed
	design: IDesignJacketed

	designErrors: IDesignErrors
	sizeErrors: ISizeErrors

	drawing?: IDrawing
}

const initialState: IJacketedState = {
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
		h: '3.6',
	},
	material: {},
	design: {
		jumper: {
			hasJumper: false,
			code: 'A',
			width: '',
			hasDrawing: false,
		},
		drawing: JSON.parse(localStorage.getItem(localKeys.jacketedDrawing) || 'null')?.src || undefined,
	},
	drawing: JSON.parse(localStorage.getItem(localKeys.jacketedDrawing) || 'null') || undefined,

	designErrors: {
		jumper: false,
	},
	sizeErrors: {},
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
		setMaterial: (state, action: PayloadAction<{ type: TypeMaterial; material?: MaterialWithThickness }>) => {
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
		setSizeErrors: (state, action: PayloadAction<ISizeErrors>) => {
			state.sizeErrors = { ...state.sizeErrors, ...action.payload }
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
			localStorage.setItem(localKeys.jacketedDrawing, JSON.stringify(action.payload || ''))

			state.designErrors.jumper =
				!action.payload && ((state.design.jumper.hasJumper && state.design.jumper.hasDrawing) || false)
		},

		// установка доп. инфы
		setInfo: (state, action: PayloadAction<string>) => {
			state.info = action.payload
		},
		// установка количества
		setAmount: (state, action: PayloadAction<string>) => {
			state.amount = action.payload
		},

		setJacketed: (state, action: PayloadAction<{ data: IJacketed; amount: string; info?: string }>) => {
			state.main = action.payload.data.main
			state.size = action.payload.data.size
			state.material = action.payload.data.material

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
		clearJacketed: state => {
			state.drawing = JSON.parse(localStorage.getItem(localKeys.jacketedDrawing) || 'null') || undefined
			state.design.drawing = state.drawing?.src
		},
		// сброс стейта
		resetJacketed: () => initialState,
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
export const getShell = (state: RootState) => state.jacketed.material.shell

export const getSize = (state: RootState) => state.jacketed.size
export const getSizeId = (state: RootState) => state.jacketed.size.id
export const getDn = (state: RootState) => state.jacketed.size.dnAlt
export const getPn = (state: RootState) => state.jacketed.size.pn
export const getH = (state: RootState) => state.jacketed.size.h

export const getDrawing = (state: RootState) => state.jacketed.drawing
export const getJumper = (state: RootState) => state.jacketed.design.jumper
export const getDesign = (state: RootState) => state.jacketed.design

export const getDesignErrors = (state: RootState) => state.jacketed.designErrors
export const getSizeErrors = (state: RootState) => state.jacketed.sizeErrors

export const getInfo = (state: RootState) => state.jacketed.info
export const getAmount = (state: RootState) => state.jacketed.amount

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
	setFiller,
	setMaterial,
	setJumper,
	setDrawing,
	setInfo,
	setAmount,
	setJacketed,
	clearJacketed,
	resetJacketed,
} = jacketedSlice.actions
