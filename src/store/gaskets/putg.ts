import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IMounting } from '@/types/mounting'
import type { IDrawing } from '@/types/drawing'
import type {
	IFlangeStandard,
	IPutgConfiguration,
	IMainBlockPutg,
	IPutgMaterial,
	IMaterialBlockPutg,
	IFiller,
	IConstruction,
	IDesignBlockPutg,
	TypeMaterial,
} from '@/types/putg'
import { IMaterial } from '@/types/material'

export interface ISNPState {
	fillers: IFiller[]
	mountings: IMounting[]
	materials?: IPutgMaterial

	cardIndex?: number
	positionId?: string
	//TODO
	main: IMainBlockPutg
	material: IMaterialBlockPutg
	// size: ISizeBlockSnp
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
	fillers: [],
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
	main: {
		flangeTypeCode: 'not_selected',
		flangeTypeTitle: '',
	},
	// флаги об открытии и материалы с наполнителем
	material: {
		typeCode: 'not_selected',
		// openFiller: false,
		// openIr: false,
		// openFr: false,
		// openOr: false,
	},
	// размеры
	// size: {
	// 	dn: '',
	// 	dnMm: '',
	// 	d4: '',
	// 	d3: '',
	// 	d2: '',
	// 	d1: '',
	// 	pn: { mpa: '', kg: '' },
	// 	h: '',
	// 	another: '',
	// },
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
		// установка списка наполнителей
		setFiller: (state, action: PayloadAction<IFiller[]>) => {
			state.fillers = action.payload
			if (state.positionId === undefined) {
				state.material.filler = action.payload[0]
			}
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
			if (state.positionId === undefined) {
				state.material.rotaryPlug = action.payload.rotaryPlug[action.payload.rotaryPlugDefaultIndex || 0]
				state.material.innerRing = action.payload.innerRing[action.payload.innerRingDefaultIndex || 0]
				state.material.outerRing = action.payload.outerRing[action.payload.outerRingDefaultIndex || 0]
			}
		},

		// установка конфигурации
		setMainConfiguration: (state, action: PayloadAction<IPutgConfiguration>) => {
			state.main.configuration = action.payload
		},
		// установка стандарта
		setMainStandard: (state, action: PayloadAction<IFlangeStandard>) => {
			state.main.flangeStandard = action.payload
		},
		// установка типа фланца
		setMainFlangeType: (state, action: PayloadAction<{ code: string; title: string }>) => {
			state.main.flangeTypeCode = action.payload.code
			state.main.flangeTypeTitle = action.payload.title
		},

		// установка материала прокладки
		setMaterialFiller: (state, action: PayloadAction<IFiller>) => {
			state.material.filler = action.payload
		},
		// установка кода типа прокладки
		setType: (state, action: PayloadAction<string>) => {
			state.material.typeCode = action.payload
		},
		// установка тип конструкции
		setConstruction: (state, action: PayloadAction<IConstruction>) => {
			state.material.construction = action.payload
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
	},
})

export const {
	setFiller,
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
} = putgSlice.actions

export default putgSlice.reducer
