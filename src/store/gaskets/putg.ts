import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IMounting } from '@/types/mounting'
import type { IDrawing } from '@/types/drawing'
import type {
	IPutgConfiguration,
	IMainBlockPutg,
	IPutgMaterial,
	IMaterialBlockPutg,
	IFiller,
	IConstruction,
	IDesignBlockPutg,
	TypeMaterial,
	IPutgStandard,
	ISizeBlockPutg,
	IFlangeType,
	IPutgType,
} from '@/types/putg'
import type { IMaterial } from '@/types/material'
import { PN } from '@/types/sizes'

export interface ISNPState {
	standards: IPutgStandard[]
	configurations: IPutgConfiguration[]
	fillers: IFiller[]
	flangeTypes: IFlangeType[]
	mountings: IMounting[]
	materials?: IPutgMaterial

	cardIndex?: number
	positionId?: string
	main: IMainBlockPutg
	material: IMaterialBlockPutg
	size: ISizeBlockPutg
	design: IDesignBlockPutg
	amount: string

	hasError: boolean
	hasSizeError: boolean
	hasDesignError: boolean
	sizeError: {
		d4Err: boolean
		d3Err: boolean
		d2Err: boolean
		thickness: boolean
		emptySize: boolean
		emptyD4: boolean
		emptyD3: boolean
		emptyD2: boolean
		emptyD1: boolean
	}
	designError: {
		emptyDrawingHole: boolean
		emptyDrawingJumper: boolean
		emptyDrawingRemovable: boolean
	}

	drawing?: IDrawing
}

const initialState: ISNPState = {
	// списки
	standards: [],
	configurations: [],
	fillers: [],
	flangeTypes: [],
	mountings: [],

	// ошибки
	hasError: false,
	hasSizeError: false,
	hasDesignError: false,
	sizeError: {
		d4Err: false,
		d3Err: false,
		d2Err: false,
		thickness: false,
		emptySize: false,
		emptyD4: false,
		emptyD3: false,
		emptyD2: false,
		emptyD1: false,
	},
	designError: {
		emptyDrawingHole: false,
		emptyDrawingJumper: false,
		emptyDrawingRemovable: false,
	},

	// стандарты, тип фланца и тип прокладки
	main: {},
	// флаги об открытии и материалы с наполнителем
	material: {
		// openFiller: false,
		// openIr: false,
		// openFr: false,
		// openOr: false,
	},
	// размеры
	size: {
		dn: '',
		dnMm: '',
		d4: '',
		d3: '',
		d2: '',
		d1: '',
		pn: { mpa: '', kg: '' },
		h: '',
		another: '',
	},
	// конструктивные элементы
	design: {
		jumper: {
			hasJumper: false,
			code: 'A',
			width: '',
			hasDrawing: false,
		},
		hasHole: false,
		mounting: {
			hasMounting: false,
			code: '',
		},
	},
	// количество прокладок
	amount: '',
}

export const putgSlice = createSlice({
	name: 'putg',
	initialState,
	reducers: {
		// установка стандартов
		setStandards: (state, action: PayloadAction<IPutgStandard[]>) => {
			state.standards = action.payload
			state.main.standard = action.payload[0]
		},
		// установка возможных конфигураций прокладок
		setConfigurations: (state, action: PayloadAction<IPutgConfiguration[]>) => {
			state.configurations = action.payload
			state.main.configuration = action.payload[0]
		},
		// установка списка наполнителей
		setFiller: (state, action: PayloadAction<IFiller[]>) => {
			state.fillers = action.payload
			if (state.positionId === undefined) {
				state.material.filler = action.payload[0]
			}
		},
		// установка типов фланцев
		setFlangeTypes: (state, action: PayloadAction<IFlangeType[]>) => {
			state.flangeTypes = action.payload
			state.main.flangeType = action.payload[0]
		},
		// установка списка креплений
		setMounting: (state, action: PayloadAction<IMounting[]>) => {
			state.mountings = action.payload
			if (state.positionId === undefined) {
				//TODO
				// state.design.mounting.code = action.payload[0].title
			}
		},
		// установка списка материалов
		setMaterials: (state, action: PayloadAction<IPutgMaterial>) => {
			state.materials = action.payload
			// if (state.positionId === undefined) {
			// 	state.material.rotaryPlug = action.payload.rotaryPlug[action.payload.rotaryPlugDefaultIndex || 0]
			// 	state.material.innerRing = action.payload.innerRing[action.payload.innerRingDefaultIndex || 0]
			// 	state.material.outerRing = action.payload.outerRing[action.payload.outerRingDefaultIndex || 0]
			// }
		},

		// установка конфигурации
		setMainConfiguration: (state, action: PayloadAction<IPutgConfiguration>) => {
			state.main.configuration = action.payload
		},
		// установка стандарта
		setMainStandard: (state, action: PayloadAction<IPutgStandard>) => {
			state.main.standard = action.payload
		},
		// установка типа фланца
		setMainFlangeType: (state, action: PayloadAction<IFlangeType>) => {
			state.main.flangeType = action.payload
		},

		// установка материала прокладки
		setMaterialFiller: (state, action: PayloadAction<IFiller>) => {
			state.material.filler = action.payload
		},
		// установка кода типа прокладки
		setType: (state, action: PayloadAction<IPutgType>) => {
			state.material.type = action.payload
		},
		// установка тип конструкции
		setConstruction: (state, action: PayloadAction<IConstruction>) => {
			state.material.construction = action.payload

			if (!action.payload.hasRotaryPlug) state.material.rotaryPlug = undefined
			else state.material.rotaryPlug = state.materials?.rotaryPlug[state.materials.rotaryPlugDefaultIndex || 0]

			if (!action.payload.hasInnerRing) state.material.innerRing = undefined
			else state.material.innerRing = state.materials?.innerRing[state.materials.innerRingDefaultIndex || 0]

			if (!action.payload.hasOuterRing) state.material.outerRing = undefined
			else state.material.outerRing = state.materials?.outerRing[state.materials.outerRingDefaultIndex || 0]
		},
		// установка материалов (обтюраторов или ограничителей)
		setMaterial: (state, action: PayloadAction<{ type: TypeMaterial; material: IMaterial }>) => {
			state.material[action.payload.type] = action.payload.material
		},

		// установка отверстия
		setHasHole: (state, action: PayloadAction<boolean>) => {
			state.design.hasHole = action.payload
			state.designError.emptyDrawingHole = !state.drawing && action.payload

			state.hasDesignError =
				state.designError.emptyDrawingJumper ||
				state.designError.emptyDrawingHole ||
				state.designError.emptyDrawingRemovable
		},
		// самоклеящееся покрытие
		setHasCoating: (state, action: PayloadAction<boolean>) => {
			state.design.hasCoating = action.payload
		},
		// разъемная
		setHasRemovable: (state, action: PayloadAction<boolean>) => {
			state.design.hasRemovable = action.payload
			state.designError.emptyDrawingRemovable = !state.drawing && action.payload

			state.hasDesignError =
				state.designError.emptyDrawingJumper ||
				state.designError.emptyDrawingHole ||
				state.designError.emptyDrawingRemovable
		},
		// установка перемычки и ее ширины
		setDesignJumper: (
			state,
			action: PayloadAction<{ hasJumper?: boolean; code?: string; width?: string; hasDrawing?: boolean }>
		) => {
			if (action.payload.hasJumper != undefined) state.design.jumper.hasJumper = action.payload.hasJumper
			if (action.payload.code != undefined) state.design.jumper.code = action.payload.code
			if (action.payload.width != undefined) state.design.jumper.width = action.payload.width
			if (action.payload.hasDrawing != undefined) {
				state.design.jumper.hasDrawing = action.payload.hasDrawing
			}
			state.designError.emptyDrawingJumper = !state.drawing && (state.design.jumper.hasDrawing || false)

			if (!state.design.jumper.hasJumper) state.designError.emptyDrawingJumper = false
			state.hasDesignError = state.designError.emptyDrawingJumper || state.designError.emptyDrawingHole
		},
		// установка крепления
		setDesignMounting: (state, action: PayloadAction<{ hasMounting?: boolean; code?: string }>) => {
			if (action.payload.hasMounting != undefined) state.design.mounting.hasMounting = action.payload.hasMounting
			if (action.payload.code != undefined) state.design.mounting.code = action.payload.code
		},
		// установка чертежа
		setDesignDrawing: (state, action: PayloadAction<IDrawing | null>) => {
			if (action.payload) {
				state.drawing = action.payload
				state.design.drawing = action.payload.link
			} else {
				state.drawing = undefined
				state.design.drawing = undefined
			}
			state.designError.emptyDrawingHole = !state.drawing && (state.design.hasHole || false)
			state.designError.emptyDrawingJumper = !state.drawing && (state.design.jumper.hasDrawing || false)
			state.hasDesignError = state.designError.emptyDrawingJumper || state.designError.emptyDrawingHole
		},

		// установка всех размеров
		setSize: (state, action: PayloadAction<ISizeBlockPutg>) => {
			state.size = action.payload
			state.sizeError.emptySize = false
			state.hasSizeError = false
		},
		// установка условного прохода
		setSizePn: (
			state,
			action: PayloadAction<{
				pn: PN
				size?: { d4: string; d3: string; d2: string; d1: string }
				thickness?: { h: string; another: string }
			}>
		) => {
			state.size.pn = action.payload.pn
			if (action.payload.size) {
				state.size.d4 = action.payload.size.d4
				state.size.d3 = action.payload.size.d3
				state.size.d2 = action.payload.size.d2
				state.size.d1 = action.payload.size.d1
			}
			if (action.payload.thickness) {
				state.size.h = action.payload.thickness.h
				state.size.another = action.payload.thickness.another
			}
		},
		// установка размеров прокладки
		setSizeMain: (state, action: PayloadAction<{ d4?: string; d3?: string; d2?: string; d1?: string }>) => {
			if (action.payload.d4 != undefined) state.size.d4 = action.payload.d4
			if (action.payload.d3 != undefined) state.size.d3 = action.payload.d3
			if (action.payload.d2 != undefined) state.size.d2 = action.payload.d2
			if (action.payload.d1 != undefined) state.size.d1 = action.payload.d1

			state.sizeError.d4Err = state.size.d4 != '' && action.payload.d3 != '' && +state.size.d4 <= +state.size.d3
			state.sizeError.d3Err = state.size.d3 != '' && action.payload.d2 != '' && +state.size.d3 <= +state.size.d2
			state.sizeError.d2Err = state.size.d2 != '' && action.payload.d1 != '' && +state.size.d2 <= +state.size.d1

			state.sizeError.emptyD4 = !state.size.d4
			state.sizeError.emptyD3 = !state.size.d3
			state.sizeError.emptyD2 = !state.size.d2
			state.sizeError.emptyD1 = !state.size.d1

			const emptyD4 = (state.material.construction?.hasD4 || false) && state.sizeError.emptyD4
			const emptyD3 = (state.material.construction?.hasD3 || false) && state.sizeError.emptyD3
			const emptyD2 = (state.material.construction?.hasD2 || false) && state.sizeError.emptyD2
			const emptyD1 = (state.material.construction?.hasD1 || false) && state.sizeError.emptyD1
			state.sizeError.emptySize = emptyD4 || emptyD3 || emptyD2 || emptyD1

			state.hasSizeError =
				state.sizeError.thickness ||
				state.sizeError.d4Err ||
				state.sizeError.d3Err ||
				state.sizeError.d2Err ||
				state.sizeError.emptySize
		},
		// установка толщины
		setSizeThickness: (state, action: PayloadAction<{ h?: string; another?: string }>) => {
			if (action.payload.h != undefined) state.size.h = action.payload.h
			if (action.payload.another != undefined) {
				state.size.another = action.payload.another

				let minThickness = state.material.type?.minThickness || -1
				let maxThickness = state.material.type?.maxThickness || 99999

				state.sizeError.thickness =
					+action.payload.another.replaceAll(',', '.') < minThickness ||
					+action.payload.another.replaceAll(',', '.') > maxThickness

				state.hasSizeError =
					state.sizeError.thickness || state.sizeError.d4Err || state.sizeError.d3Err || state.sizeError.d2Err
			}
		},
	},
})

export const {
	setStandards,
	setConfigurations,
	setFiller,
	setFlangeTypes,
	setMounting,
	setMaterials,
	setMainConfiguration,
	setMainStandard,
	setMainFlangeType,
	setMaterialFiller,
	setType,
	setConstruction,
	setMaterial,
	setHasHole,
	setHasCoating,
	setHasRemovable,
	setDesignJumper,
	setDesignMounting,
	setDesignDrawing,

	setSize,
	setSizePn,
	setSizeMain,
	setSizeThickness,
} = putgSlice.actions

export default putgSlice.reducer
