import type { IDrawing } from '@/types/drawing'
import type { IRingConstruction, IRingData, IRingDensity, IRingType, IStep, Steps } from '@/types/rings'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type RingState = {
	typeStep: IStep
	sizeStep: IStep
	materialStep: IStep
	modifyingStep: IStep

	ringType: IRingType | null
	density: IRingDensity | null
	construction: IRingConstruction | null

	sizes: string | null
	thickness: string | null

	sizeError: boolean
	thicknessError: boolean

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

	sizeError: false,
	thicknessError: false,

	material: null,
	modifying: null,

	drawing: null,

	// доп. информация к позиции
	info: '',
	// количество колец
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
		setStep: (state, action: PayloadAction<{ step: Steps; active?: boolean; complete: boolean }>) => {
			if (action.payload.active != undefined) state[action.payload.step].active = action.payload.active
			state[action.payload.step].complete = action.payload.complete
			state[action.payload.step].error = false
			if (state[action.payload.step].nextStep != null) {
				if (!state[state[action.payload.step].nextStep as Steps].complete) {
					state[state[action.payload.step].nextStep as Steps].active = true
				}
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
		setConstruction: (state, action: PayloadAction<IRingConstruction>) => {
			state.construction = action.payload
		},
		setDensity: (state, action: PayloadAction<IRingDensity>) => {
			state.density = action.payload
			// state.construction = null
			// state.typeStep.complete = false
		},

		setSize: (state, action: PayloadAction<string>) => {
			state.sizes = action.payload

			const s = action.payload.split('×')
			state.sizeError = +s[0] < +s[1]
		},
		setThickness: (state, action: PayloadAction<string>) => {
			state.thickness = action.payload

			if (action.payload) {
				state.thicknessError = +action.payload < 1.5
			}
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

		// выбор кольца (для редактирования)
		setRing: (state, action: PayloadAction<IRingData>) => {
			state.ringType = action.payload.ringData.ringType
			state.construction = action.payload.ringData.construction
			state.density = action.payload.ringData.density

			state.typeStep.complete = true
			state.typeStep.active = false
			state.typeStep.error = false

			state.sizes = action.payload.ringData.size
			state.thickness = action.payload.ringData.thickness

			state.sizeStep.complete = true
			state.sizeStep.active = false
			state.sizeStep.error = false

			state.material = action.payload.ringData.material
			state.modifying = action.payload.ringData.modifying || null

			state.materialStep.complete = true
			state.materialStep.active = false
			state.materialStep.error = false

			if (action.payload.ringData.drawing) {
				const parts = action.payload.ringData.drawing.split('/')
				const drawing: IDrawing = {
					id: parts[parts.length - 2],
					name: `${parts[parts.length - 2]}_${parts[parts.length - 1]}`,
					origName: parts[parts.length - 1],
					link: action.payload.ringData.drawing,
					group: parts[parts.length - 3],
				}
				state.drawing = drawing
			} else {
				state.drawing = null
			}

			state.info = action.payload.info || ''
			state.amount = action.payload.amount
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
	setRing,
	clearRing,
} = ringSlice.actions

export default ringSlice.reducer
