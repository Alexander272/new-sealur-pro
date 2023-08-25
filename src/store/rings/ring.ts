import type { IDrawing } from '@/types/drawing'
import type { IRingDensity, IRingType, IStep, Steps } from '@/types/rings'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type RingState = {
	typeStep: IStep
	sizeStep: IStep
	materialStep: IStep
	modifyingStep: IStep

	ringType: IRingType | null
	density: IRingDensity | null
	construction: string | null

	sizes: string | null
	thickness: string | null

	material: string | null
	modifying: string | null

	drawing: IDrawing | null

	amount: string
	info: string
}

const initialState: RingState = {
	typeStep: {
		active: true,
		complete: false,
		required: true,
		error: false,
		nextStep: 'sizeStep',
	},
	sizeStep: {
		active: false,
		complete: false,
		required: true,
		error: false,
		nextStep: null,
	},
	materialStep: {
		active: false,
		complete: false,
		required: true,
		error: false,
		nextStep: null,
	},
	modifyingStep: {
		active: false,
		complete: false,
		required: false,
		error: false,
		nextStep: null,
	},

	ringType: {
		id: '',
		title: '',
		code: '',
		materialType: '',
		image: '',
		// hasDensity: true,
		// hasRotaryPlug: true,
		hasThickness: true,
		designation: '',
	},
	density: null,
	construction: null,

	sizes: null,
	thickness: null,

	material: null,
	modifying: null,

	drawing: null,

	// доп. информация к позиции
	info: '',
	// количество прокладок
	amount: '',
}

export const ringSlice = createSlice({
	name: 'ring',
	initialState,
	reducers: {
		setTypeStep: (state, action: PayloadAction<{ active: boolean; complete: boolean }>) => {
			state.typeStep.active = action.payload.active
			state.typeStep.complete = action.payload.complete
			state.typeStep.error = false
		},
		setStep: (state, action: PayloadAction<{ step: Steps; active: boolean; complete: boolean }>) => {
			state[action.payload.step].active = action.payload.active
			state[action.payload.step].complete = action.payload.complete
			state[action.payload.step].error = false
			if (state[action.payload.step].nextStep != null) {
				state[state[action.payload.step].nextStep as Steps].active = true
			}
		},
		toggleActiveStep: (state, action: PayloadAction<Steps>) => {
			state[action.payload].active = !state[action.payload].active
			state[action.payload].error = false

			if (state[action.payload].required && !state[action.payload].active && !state[action.payload].complete) {
				state[action.payload].error = true
			}
		},

		setRingType: (state, action: PayloadAction<IRingType | null>) => {
			state.ringType = action.payload

			state.density = null
			state.construction = null
			state.typeStep.complete = false

			state.sizes = null
			state.thickness = null
			state.sizeStep.complete = false

			if (!action.payload?.hasThickness) state.thickness = null
		},
		setConstruction: (state, action: PayloadAction<string>) => {
			state.construction = action.payload
		},
		setDensity: (state, action: PayloadAction<IRingDensity>) => {
			state.density = action.payload
			state.construction = null
			state.typeStep.complete = false
		},

		setSize: (state, action: PayloadAction<string>) => {
			// TODO ставить шагу ошибку если размеры нулевые
			state.sizes = action.payload
		},
		setThickness: (state, action: PayloadAction<string>) => {
			// TODO ставить шагу ошибку если размеры нулевые
			state.thickness = action.payload
		},

		setMaterial: (state, action: PayloadAction<string>) => {
			state.material = action.payload
			state.materialStep.complete = true
			state.materialStep.error = false
		},
		setModifying: (state, action: PayloadAction<string | null>) => {
			state.modifying = action.payload
		},

		// установка чертежа
		setDrawing: (state, action: PayloadAction<IDrawing | null>) => {
			state.drawing = action.payload
		},

		// установка доп. инфы
		setInfo: (state, action: PayloadAction<string>) => {
			state.info = action.payload
		},
		// установка количества
		setAmount: (state, action: PayloadAction<string>) => {
			state.amount = action.payload
		},

		// сброс выбранной позиции
		clearRing: state => {
			state.drawing = null
		},
	},
})

export const {
	setTypeStep,
	setStep,
	toggleActiveStep,
	setRingType,
	setConstruction,
	setDensity,
	setSize,
	setThickness,
	setMaterial,
	setModifying,
	setDrawing,
	setInfo,
	setAmount,
	clearRing,
} = ringSlice.actions

export default ringSlice.reducer
