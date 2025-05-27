import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IDrawing } from '../../types/drawing'
import type { IMaterial } from '../../types/material'
import type { IConstruction, IFlangeType, IMainSerrated, ISerratedStandard, ISerratedType } from './types/main'
import type { DSize, ISize, ISizeSerrated } from './types/sizes'
import type { IDesignSerrated } from './types/design'
import type { IDesignErrors, ISizeErrors } from './types/errors'
import type { IMaterialsSerrated, IPlating, TypeMaterial } from './types/material'
import type { ISerrated } from './types/serrated'
import { localKeys } from '@/constants/localKeys'
import { setActive } from '@/features/card/cardSlice'

export interface ISerratedState {
	amount: string
	info: string

	main: IMainSerrated
	size: ISizeSerrated
	material: IMaterialsSerrated
	design: IDesignSerrated

	designErrors: IDesignErrors
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
	material: {},
	design: {
		jumper: {
			hasJumper: false,
			code: 'A',
			width: '',
			hasDrawing: false,
		},
		drawing: JSON.parse(localStorage.getItem(localKeys.serratedDrawing) || 'null')?.src || undefined,
	},
	drawing: JSON.parse(localStorage.getItem(localKeys.serratedDrawing) || 'null') || undefined,

	designErrors: {
		hole: false,
		jumper: false,
	},
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

		//
		setPlating: (state, action: PayloadAction<IPlating>) => {
			state.material.plating = action.payload
		},
		setMaterial: (state, action: PayloadAction<{ type: TypeMaterial; material?: IMaterial }>) => {
			state.material[action.payload.type] = action.payload.material
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
			localStorage.setItem(localKeys.serratedDrawing, JSON.stringify(action.payload || ''))

			state.designErrors.hole = !action.payload && (state.design.hasHole || false)
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

		setSerrated: (state, action: PayloadAction<{ data: ISerrated; amount: string; info?: string }>) => {
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
		clearSerrated: state => {
			state.drawing = JSON.parse(localStorage.getItem(localKeys.serratedDrawing) || 'null') || undefined
			state.design.drawing = state.drawing?.src
		},
		// сброс стейта
		resetSerrated: () => initialState,
	},
	extraReducers: builder =>
		builder.addCase(setActive, (state, action) => {
			if (!action.payload) {
				state.drawing = JSON.parse(localStorage.getItem(localKeys.serratedDrawing) || 'null') || undefined
				state.design.drawing = state.drawing?.src
			}
		}),
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

export const getMaterials = (state: RootState) => state.serrated.material
export const getPlating = (state: RootState) => state.serrated.material.plating

export const getDesign = (state: RootState) => state.serrated.design
export const getHasCoating = (state: RootState) => state.serrated.design.hasCoating
export const getHasHole = (state: RootState) => state.serrated.design.hasHole
export const getWithRetainer = (state: RootState) => state.serrated.design.withRetainer
export const getJumper = (state: RootState) => state.serrated.design.jumper
export const getDrawing = (state: RootState) => state.serrated.drawing

export const getDesignErrors = (state: RootState) => state.serrated.designErrors
export const getSizeErrors = (state: RootState) => state.serrated.sizeErrors

export const getInfo = (state: RootState) => state.serrated.info
export const getAmount = (state: RootState) => state.serrated.amount

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
	setPlating,
	setMaterial,
	setHasHole,
	setHasCoating,
	setWithRetainer,
	setJumper,
	setDrawing,
	setInfo,
	setAmount,
	setSerrated,
	clearSerrated,
	resetSerrated,
} = serratedSlice.actions
