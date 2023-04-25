import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IMounting } from '@/types/mounting'
import { IDrawing } from '@/types/drawing'
import { IFlangeStandard, IGasketConfiguration, IMainBlockPutg } from '@/types/putg'

export interface ISNPState {
	mountings: IMounting[]
	// materialsIr?: ISNPMaterial
	// materialsFr?: ISNPMaterial
	// materialsOr?: ISNPMaterial
	// materials?: ISnpMaterial

	cardIndex?: number
	positionId?: string
	//TODO
	main: IMainBlockPutg
	material: any
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
	// materialsIr: undefined,
	// materialsFr: undefined,
	// materialsOr: undefined,

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
		openFiller: false,
		openIr: false,
		openFr: false,
		openOr: false,
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
	// 	s2: '',
	// 	s3: '',
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
		setMainConfiguration: (state, action: PayloadAction<IGasketConfiguration>) => {
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
	},
})

export const { setMainConfiguration, setMainStandard, setMainFlangeType } = putgSlice.actions

export default putgSlice.reducer
