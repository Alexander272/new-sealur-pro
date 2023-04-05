import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
	IDesignBlockSnp,
	IFiller,
	IMainSnp,
	IMaterialBlockSnp,
	ISizeBlockSnp,
	ISnp,
	ISNPMaterial,
	ISnpMaterial,
	ISNPType,
	IStandardForSNP,
	OpenMaterial,
	TypeMaterial,
} from '@/types/snp'
import { IMaterial } from '@/types/material'
import { PN } from '@/types/sizes'
import { IMounting } from '@/types/mounting'
import { IDrawing } from '@/types/drawing'

export interface ISNPState {
	fillers: IFiller[]
	mountings: IMounting[]
	materialsIr?: ISNPMaterial
	materialsFr?: ISNPMaterial
	materialsOr?: ISNPMaterial
	materials?: ISnpMaterial

	cardIndex?: number
	main: IMainSnp
	material: IMaterialBlockSnp
	size: ISizeBlockSnp
	design: IDesignBlockSnp
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
	fillers: [],
	mountings: [],
	materialsIr: undefined,
	materialsFr: undefined,
	materialsOr: undefined,

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

	main: {
		snpStandardId: 'not_selected',
		snpTypeId: 'not_selected',
		flangeTypeCode: 'not_selected',
		flangeTypeTitle: '',
		// snpTypeTitle: 'Д',
		// snpTypeCode: '',
	},
	material: {
		openFiller: false,
		openIr: false,
		openFr: false,
		openOr: false,
		filler: {} as IFiller,
	},
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
	amount: '',
}

export const snpSlice = createSlice({
	name: 'snp',
	initialState,
	reducers: {
		setFiller: (state, action: PayloadAction<IFiller[]>) => {
			state.fillers = action.payload
			state.material.filler = action.payload[0]
		},
		setMounting: (state, action: PayloadAction<IMounting[]>) => {
			state.mountings = action.payload
			state.design.mounting.code = action.payload[0].title
		},
		setMaterials: (state, action: PayloadAction<ISnpMaterial>) => {
			state.materials = action.payload
			if (state.cardIndex === undefined) {
				state.material.frame = action.payload.frame[action.payload.frameDefaultIndex || 0]
				state.material.innerRing = action.payload.innerRing[action.payload.innerRingDefaultIndex || 0]
				state.material.outerRing = action.payload.outerRing[action.payload.outerRingDefaultIndex || 0]
			}
		},

		// setHasError: (state, action: PayloadAction<boolean>) => {
		// 	// возможно стоит тут прописать все поля в которых могут быть ошибки
		// 	// и назвать функцию checkErrors
		// 	state.hasError = action.payload
		// },
		checkErrors: state => {
			state.hasError = state.hasSizeError
		},
		setSizeError: (state, action: PayloadAction<boolean>) => {
			state.hasSizeError = action.payload
		},

		setMainStandard: (state, action: PayloadAction<{ id: string; standard: IStandardForSNP }>) => {
			state.main.snpStandardId = action.payload.id
			state.main.snpStandard = action.payload.standard
		},
		setMainFlangeType: (state, action: PayloadAction<{ code: string; title: string }>) => {
			state.main.flangeTypeCode = action.payload.code
			state.main.flangeTypeTitle = action.payload.title
		},
		setMainSnpType: (state, action: PayloadAction<{ id: string; type: ISNPType }>) => {
			state.main.snpTypeId = action.payload.id
			state.main.snpType = action.payload.type
			// state.main.snpTypeTitle = action.payload.title
			// state.main.snpTypeCode = action.payload.code

			if (state.material.filler.disabledTypes?.includes(action.payload.id)) {
				const filler = state.fillers.find(f => !f.disabledTypes?.includes(action.payload.id))
				state.material.filler = filler!
			}

			// state.sizeError.emptyD4 = !state.size.d4
			// state.sizeError.emptyD3 = !state.size.d3
			// state.sizeError.emptyD2 = !state.size.d2
			// state.sizeError.emptyD1 = !state.size.d1

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

		setMaterialToggle: (state, action: PayloadAction<{ type: OpenMaterial; isOpen: boolean }>) => {
			if (action.payload.type == 'filler') state.material.openFiller = action.payload.isOpen
			if (action.payload.type == 'ir') state.material.openIr = action.payload.isOpen
			if (action.payload.type == 'fr') state.material.openFr = action.payload.isOpen
			if (action.payload.type == 'or') state.material.openOr = action.payload.isOpen
		},
		setMaterialFiller: (state, action: PayloadAction<IFiller>) => {
			state.material.filler = action.payload
		},
		setMaterial: (state, action: PayloadAction<{ type: TypeMaterial; material: IMaterial }>) => {
			state.material[action.payload.type] = action.payload.material
		},

		setSize: (state, action: PayloadAction<ISizeBlockSnp>) => {
			state.size = action.payload
			state.sizeError.emptySize = false
			state.hasSizeError = false
		},
		setSizePn: (
			state,
			action: PayloadAction<{
				pn: PN
				size?: { d4: string; d3: string; d2: string; d1: string }
				thickness?: { h: string; s2: string; s3: string; another: string }
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
				state.size.s2 = action.payload.thickness.s2
				state.size.s3 = action.payload.thickness.s3
				state.size.another = action.payload.thickness.another
			}
		},
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
		setSizeThickness: (
			state,
			action: PayloadAction<{ h?: string; s2?: string; s3?: string; another?: string }>
		) => {
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

		clearMaterialAndDesign: (state, action: PayloadAction<ISnp>) => {
			if (!action.payload.hasInnerRing) state.material.innerRing = undefined
			else if (state.cardIndex === undefined)
				state.material.innerRing = state.materials?.innerRing[state.materials.innerRingDefaultIndex || 0]

			if (!action.payload.hasFrame) state.material.frame = undefined
			else if (state.cardIndex === undefined)
				state.material.frame = state.materials?.frame[state.materials.frameDefaultIndex || 0]

			if (!action.payload.hasOuterRing) state.material.outerRing = undefined
			else if (state.cardIndex === undefined)
				state.material.outerRing = state.materials?.outerRing[state.materials.outerRingDefaultIndex || 0]

			if (!action.payload.hasJumper) state.design.jumper.hasJumper = false
			if (!action.payload.hasMounting) state.design.mounting.hasMounting = false
		},

		setHasHole: (state, action: PayloadAction<boolean>) => {
			state.design.hasHole = action.payload
			state.designError.emptyDrawingHole = !state.drawing && action.payload

			state.hasDesignError = state.designError.emptyDrawingJumper || state.designError.emptyDrawingHole
		},
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
		setDesignMounting: (state, action: PayloadAction<{ hasMounting?: boolean; code?: string }>) => {
			if (action.payload.hasMounting != undefined) state.design.mounting.hasMounting = action.payload.hasMounting
			if (action.payload.code != undefined) state.design.mounting.code = action.payload.code
		},
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

		setAmount: (state, action: PayloadAction<string>) => {
			state.amount = action.payload
		},

		setSnp: (
			state,
			action: PayloadAction<{
				main: IMainSnp
				sizes: ISizeBlockSnp
				materials: IMaterialBlockSnp
				design: IDesignBlockSnp
				amount: string
				cardIndex: number
			}>
		) => {
			state.cardIndex = action.payload.cardIndex
			state.main = action.payload.main
			state.size = action.payload.sizes

			state.material = action.payload.materials

			state.design.hasHole = action.payload.design.hasHole || false
			state.design.jumper.hasJumper = action.payload.design.jumper.hasJumper || false
			state.design.jumper.code = action.payload.design.jumper.code
			state.design.jumper.width = action.payload.design.jumper.width
			state.design.mounting.hasMounting = action.payload.design.mounting.hasMounting || false
			state.design.mounting.code = action.payload.design.mounting.code
			state.design.drawing = action.payload.design.drawing

			if (action.payload.design.drawing) {
				const parts = action.payload.design.drawing.split('/')
				const drawing: IDrawing = {
					id: parts[parts.length - 2],
					name: `${parts[parts.length - 2]}_${parts[parts.length - 1]}`,
					origName: parts[parts.length - 1],
					link: action.payload.design.drawing,
					group: parts[parts.length - 3],
				}
				state.drawing = drawing
			}

			state.amount = action.payload.amount
		},
		clearSnp: state => {
			state.cardIndex = undefined
		},
	},
})

export const {
	setFiller,
	setMounting,
	setMaterials,
	setSizeError,
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
	clearMaterialAndDesign,
	setHasHole,
	setDesignJumper,
	setDesignMounting,
	setDesignDrawing,
	setAmount,
	setSnp,
	clearSnp,
} = snpSlice.actions

export default snpSlice.reducer
