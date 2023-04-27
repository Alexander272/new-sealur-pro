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
} from '@/types/putg'

export interface ISNPState {
	mountings: IMounting[]
	materials?: IPutgMaterial

	cardIndex?: number
	positionId?: string
	//TODO
	main: IMainBlockPutg
	material: IMaterialBlockPutg
	// main: IMainSnp
	// material: IMaterialBlockSnp
	// size: ISizeBlockSnp
	// design: IDesignBlockSnp
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
	}

	drawing?: IDrawing
}

const initialState: ISNPState = {
	// списки
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
	// design: {
	// 	jumper: {
	// 		hasJumper: false,
	// 		code: 'A',
	// 		width: '',
	// 		hasDrawing: false,
	// 	},
	// 	hasHole: false,
	// 	mounting: {
	// 		hasMounting: false,
	// 		code: '',
	// 	},
	// },
	// количество прокладок
	amount: '',
}

export const putgSlice = createSlice({
	name: 'putg',
	initialState,
	reducers: {
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
		// установка тип конструкции
		setConstruction: (state, action: PayloadAction<IConstruction>) => {
			state.material.construction = action.payload
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
	},
})

export const {
	setMainConfiguration,
	setMainStandard,
	setMainFlangeType,
	setMaterialFiller,
	setConstruction,
	setMaterials,
} = putgSlice.actions

export default putgSlice.reducer
