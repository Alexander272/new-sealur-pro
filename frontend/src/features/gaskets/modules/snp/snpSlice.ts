import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IMaterial } from '@/features/gaskets/types/material'
import type { IDrawing } from '@/features/gaskets/types/drawing'
import type { ISizeBlock } from './types/size'
import type {
	IDesignBlockSnp,
	IFiller,
	IMainSnp,
	IMaterialBlockSnp,
	ISizeBlockSnp,
	ISNPType,
	IStandardForSNP,
	IThickness,
	OpenMaterial,
	TypeMaterial,
} from './types/snp'

export interface ISNPState {
	// fillers: IFiller[]
	// mountings: IMounting[]
	// materialsIr?: ISNPMaterial
	// materialsFr?: ISNPMaterial
	// materialsOr?: ISNPMaterial
	// materials?: ISnpMaterial

	// cardIndex?: number
	// positionId?: string

	main: IMainSnp
	material: IMaterialBlockSnp
	size: ISizeBlockSnp
	design: IDesignBlockSnp
	amount: string
	info: string

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
		snpStandardId: 'not_selected',
		snpTypeId: 'not_selected',
		flangeTypeCode: 'not_selected',
		flangeTypeTitle: '',
		// snpTypeTitle: 'Д',
		// snpTypeCode: '',
	},
	// флаги об открытии и материалы с наполнителем
	material: {
		openFiller: false,
		openIr: false,
		openFr: false,
		openOr: false,
		// TODO стоит ли передавать пустой объект?
		filler: {} as IFiller,
	},
	// размеры
	// TODO надо ли явно указывать пустое значение?
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
		s2: '',
		s3: '',
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
	// доп. информация к позиции
	info: '',
	// количество прокладок
	amount: '',
}

export const snpSlice = createSlice({
	name: 'snp',
	initialState,
	reducers: {
		// установка стандарта
		setMainStandard: (state, action: PayloadAction<{ id: string; standard: IStandardForSNP }>) => {
			state.main.snpStandardId = action.payload.id
			state.main.snpStandard = action.payload.standard
		},
		// установка типа фланца
		setMainFlangeType: (state, action: PayloadAction<{ code: string; title: string }>) => {
			state.main.flangeTypeCode = action.payload.code
			state.main.flangeTypeTitle = action.payload.title
		},
		// установка типа прокладки и проверка размеров на ошибку (пустоту)
		setMainSnpType: (state, action: PayloadAction<{ id: string; type: ISNPType }>) => {
			state.main.snpTypeId = action.payload.id
			state.main.snpType = action.payload.type

			const emptyD4 = (state.main.snpType?.hasD4 || false) && !state.size.d4
			const emptyD3 = (state.main.snpType?.hasD3 || false) && !state.size.d3
			const emptyD2 = (state.main.snpType?.hasD2 || false) && !state.size.d2
			const emptyD1 = (state.main.snpType?.hasD1 || false) && !state.size.d1

			state.sizeError.emptySize = emptyD4 || emptyD3 || emptyD2 || emptyD1

			state.hasSizeError =
				state.sizeError.thickness ||
				state.sizeError.d4Err ||
				state.sizeError.d3Err ||
				state.sizeError.d2Err ||
				state.sizeError.emptySize
		},

		// установка флагов об открытии select
		setMaterialToggle: (state, action: PayloadAction<{ type: OpenMaterial; isOpen: boolean }>) => {
			if (action.payload.type == 'filler') state.material.openFiller = action.payload.isOpen
			if (action.payload.type == 'innerRing') state.material.openIr = action.payload.isOpen
			if (action.payload.type == 'frame') state.material.openFr = action.payload.isOpen
			if (action.payload.type == 'outerRing') state.material.openOr = action.payload.isOpen
		},
		// установка наполнителя
		setMaterialFiller: (state, action: PayloadAction<IFiller>) => {
			state.material.filler = action.payload
		},
		// установка материалов (каркаса или колец)
		setMaterial: (state, action: PayloadAction<{ type: TypeMaterial; material?: IMaterial }>) => {
			state.material[action.payload.type] = action.payload.material
		},

		// установка всех размеров
		setSize: (state, action: PayloadAction<ISizeBlockSnp>) => {
			state.size = action.payload
			state.sizeError.emptySize = false
			state.hasSizeError = false
		},
		// установка условного прохода
		setSizePn: (state, action: PayloadAction<ISizeBlock>) => {
			state.size.pn = action.payload.pn
			if (action.payload.sizes) {
				state.size.d4 = action.payload.sizes.d4
				state.size.d3 = action.payload.sizes.d3
				state.size.d2 = action.payload.sizes.d2
				state.size.d1 = action.payload.sizes.d1
			}
			if (action.payload.thicknesses) {
				state.size.h = action.payload.thicknesses.h
				state.size.s2 = action.payload.thicknesses.s2
				state.size.s3 = action.payload.thicknesses.s3
				state.size.another = action.payload.thicknesses.another
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

			const emptyD4 = (state.main.snpType?.hasD4 || false) && state.sizeError.emptyD4
			const emptyD3 = (state.main.snpType?.hasD3 || false) && state.sizeError.emptyD3
			const emptyD2 = (state.main.snpType?.hasD2 || false) && state.sizeError.emptyD2
			const emptyD1 = (state.main.snpType?.hasD1 || false) && state.sizeError.emptyD1
			state.sizeError.emptySize = emptyD4 || emptyD3 || emptyD2 || emptyD1

			state.hasSizeError =
				state.sizeError.thickness ||
				state.sizeError.d4Err ||
				state.sizeError.d3Err ||
				state.sizeError.d2Err ||
				state.sizeError.emptySize
		},
		// установка толщины
		setSizeThickness: (state, action: PayloadAction<IThickness>) => {
			if (action.payload.h != undefined) state.size.h = action.payload.h
			if (action.payload.s2 != undefined) state.size.s2 = action.payload.s2
			if (action.payload.s3 != undefined) state.size.s3 = action.payload.s3
			if (action.payload.another != undefined) {
				state.size.another = action.payload.another
				state.sizeError.thickness =
					+action.payload.another.replaceAll(',', '.') < 2.3 ||
					+action.payload.another.replaceAll(',', '.') > 10

				state.hasSizeError =
					state.sizeError.thickness || state.sizeError.d4Err || state.sizeError.d3Err || state.sizeError.d2Err
			}
		},

		// установка отверстия
		setHasHole: (state, action: PayloadAction<boolean>) => {
			state.design.hasHole = action.payload
			state.designError.emptyDrawingHole = !state.drawing && action.payload

			state.hasDesignError = state.designError.emptyDrawingJumper || state.designError.emptyDrawingHole
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

		// установка доп. информации
		setInfo: (state, action: PayloadAction<string>) => {
			state.info = action.payload
		},
		// установка количества
		setAmount: (state, action: PayloadAction<string>) => {
			state.amount = action.payload
		},

		setSnp: (
			state,
			action: PayloadAction<{
				data: {
					main: IMainSnp
					size: ISizeBlockSnp
					material: IMaterialBlockSnp
					design: IDesignBlockSnp
				}
				amount: string
				info?: string
			}>
		) => {
			state.main = action.payload.data.main
			state.size = action.payload.data.size
			state.material = action.payload.data.material

			state.design.hasHole = action.payload.data.design.hasHole || false
			state.design.jumper.hasJumper = action.payload.data.design.jumper.hasJumper || false
			state.design.jumper.code = action.payload.data.design.jumper.code
			state.design.jumper.width = action.payload.data.design.jumper.width
			state.design.mounting.hasMounting = action.payload.data.design.mounting.hasMounting || false
			state.design.mounting.code = action.payload.data.design.mounting.code
			state.design.drawing = action.payload.data.design.drawing

			if (action.payload.data.design.drawing) {
				const parts = action.payload.data.design.drawing.split('/')
				const drawing: IDrawing = {
					id: parts[parts.length - 2],
					name: `${parts[parts.length - 2]}_${parts[parts.length - 1]}`,
					origName: parts[parts.length - 1],
					link: action.payload.data.design.drawing,
					group: parts[parts.length - 3],
				}
				state.drawing = drawing
			} else {
				state.drawing = undefined
			}

			state.info = action.payload.info || ''
			state.amount = action.payload.amount
		},
		// сброс выбранной позиции
		clearSnp: state => {
			// state.cardIndex = undefined
			// state.positionId = undefined
			state.drawing = undefined
			state.design.drawing = undefined
		},
	},
})

export const snpPath = snpSlice.name
export const snpReducer = snpSlice.reducer

export const getMain = (state: RootState) => state.snp.main
export const getStandardId = (state: RootState) => state.snp.main.snpStandardId
export const getStandard = (state: RootState) => state.snp.main.snpStandard
export const getFlangeType = (state: RootState) => state.snp.main.flangeTypeCode
export const getSnpTypeId = (state: RootState) => state.snp.main.snpTypeId
export const getSnpType = (state: RootState) => state.snp.main.snpType

export const getFiller = (state: RootState) => state.snp.material.filler
export const getMaterials = (state: RootState) => state.snp.material

export const getSize = (state: RootState) => state.snp.size
export const getSizeErr = (state: RootState) => state.snp.sizeError
export const getDn = (state: RootState) => state.snp.size.dn
export const getD2 = (state: RootState) => state.snp.size.d2
export const getPn = (state: RootState) => state.snp.size.pn
export const getSizeIndex = (state: RootState) => state.snp.size.index
export const getThickness = (state: RootState) => state.snp.size.h
export const getAnother = (state: RootState) => state.snp.size.another

export const getDesign = (state: RootState) => state.snp.design
export const getJumper = (state: RootState) => state.snp.design.jumper
export const getHasHole = (state: RootState) => state.snp.design.hasHole
export const getMounting = (state: RootState) => state.snp.design.mounting
export const getDrawing = (state: RootState) => state.snp.drawing

export const getHasSizeError = (state: RootState) => state.snp.hasSizeError
export const getHasDesignError = (state: RootState) => state.snp.hasDesignError

export const getInfo = (state: RootState) => state.snp.info
export const getAmount = (state: RootState) => state.snp.amount

export const {
	setMainStandard,
	setMainFlangeType,
	setMainSnpType,
	setMaterialToggle,
	setMaterialFiller,
	setMaterial,
	setSize,
	setSizePn,
	setSizeMain,
	setSizeThickness,
	setHasHole,
	setDesignJumper,
	setDesignMounting,
	setDesignDrawing,
	setInfo,
	setAmount,
	setSnp,
	clearSnp,
} = snpSlice.actions
