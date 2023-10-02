import type { IDrawing } from '@/types/drawing'
import type { IStep, IKitConstructions, Steps, IKitType, IRingsKit, IKitData } from '@/types/ringsKit'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type KitState = {
	typeStep: IStep
	countStep: IStep
	sizeStep: IStep
	materialStep: IStep
	modifyingStep: IStep

	typeId: string
	type: string
	construction: IKitConstructions | null

	count: string

	sizes: string | null
	thickness: string | null

	sizeError: boolean
	thicknessError: boolean

	materials: string | null
	modifying: string | null

	drawing: IDrawing | null

	amount: string
	info: string
}

const initialState: KitState = {
	typeStep: {
		active: true,
		complete: false,
		required: true,
		error: false,
		nextStep: 'sizeStep',
	},
	countStep: {
		active: false,
		complete: false,
		required: true,
		error: false,
	},
	sizeStep: {
		active: false,
		complete: false,
		required: true,
		error: false,
	},
	materialStep: {
		active: false,
		complete: false,
		required: true,
		error: false,
	},
	modifyingStep: {
		active: false,
		complete: false,
		required: false,
		error: false,
	},

	typeId: '',
	type: '',
	construction: null,

	count: '',

	sizes: null,
	thickness: null,

	sizeError: false,
	thicknessError: false,

	materials: null,
	modifying: null,

	drawing: null,

	amount: '',
	info: '',
}

export const kitSlice = createSlice({
	name: 'kit',
	initialState,
	reducers: {
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

		setKitType: (state, action: PayloadAction<IKitType>) => {
			state.typeId = action.payload?.id
			state.type = action.payload?.code

			state.construction = null
			state.typeStep.complete = false

			state.sizes = null
			state.thickness = null
			state.sizeStep.complete = false

			// if (!action.payload?.hasThickness) state.thickness = null
		},
		setConstruction: (state, action: PayloadAction<IKitConstructions>) => {
			state.construction = action.payload

			state.sizes = null
			state.thickness = null
			state.sizeStep.complete = false

			state.countStep.complete = true
			state.count = action.payload.defaultCount
			state.materialStep.complete = true
			state.materials = action.payload.defaultMaterials

			if (!action.payload?.hasThickness) state.thickness = null
		},
		setCount: (state, action: PayloadAction<string>) => {
			state.count = action.payload
		},

		setMaterials: (state, action: PayloadAction<string>) => {
			state.materials = action.payload
			state.materialStep.complete = true
			state.materialStep.error = false
		},
		setModifying: (state, action: PayloadAction<string | null>) => {
			state.modifying = action.payload
		},

		setSize: (state, action: PayloadAction<string>) => {
			state.sizes = action.payload

			const s = action.payload.split('×')
			state.sizeError = +s[0] < +s[1]
		},
		setThickness: (state, action: PayloadAction<string>) => {
			state.thickness = action.payload

			// if (action.payload) {
			// 	state.thicknessError = +action.payload < 1.5
			// }
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
		setKit: (state, action: PayloadAction<IKitData>) => {
			state.type = action.payload.kitData.type
			state.typeId = action.payload.kitData.typeId
			state.construction = action.payload.kitData.construction
			state.count = action.payload.kitData.count

			state.typeStep.complete = true
			state.typeStep.active = false
			state.typeStep.error = false

			state.countStep.complete = true
			state.countStep.active = false
			state.countStep.error = false

			state.sizes = action.payload.kitData.size
			state.thickness = action.payload.kitData.thickness

			state.sizeStep.complete = true
			state.sizeStep.active = false
			state.sizeStep.error = false

			state.materials = action.payload.kitData.material
			state.modifying = action.payload.kitData.modifying || null

			state.materialStep.complete = true
			state.materialStep.active = false
			state.materialStep.error = false

			if (action.payload.kitData.drawing) {
				const parts = action.payload.kitData.drawing.split('/')
				const drawing: IDrawing = {
					id: parts[parts.length - 2],
					name: `${parts[parts.length - 2]}_${parts[parts.length - 1]}`,
					origName: parts[parts.length - 1],
					link: action.payload.kitData.drawing,
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
		clearKit: state => {
			state.drawing = null
		},
	},
})

export const {
	setStep,
	toggleActiveStep,
	setKitType,
	setConstruction,
	setCount,
	setSize,
	setThickness,
	setMaterials,
	setModifying,
	setDrawing,
	setInfo,
	setAmount,
	setKit,
	clearKit,
} = kitSlice.actions

export default kitSlice.reducer
