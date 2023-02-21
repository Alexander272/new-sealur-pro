import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IFlangeType, ISNP, IStandardForSNP } from '@/types/snp'

export interface ISNPState {
	standardForSNP: IStandardForSNP[]
	flangeType: IFlangeType[]

	snp?: ISNP
}

const initialState: ISNPState = {
	standardForSNP: [
		{
			id: '1',
			standardId: '1',
			standard: 'ОСТ 26.260.454',
			flangeStandardId: '1',
			flangeStandard: 'ГОСТ 33259(12815) (трубопроводы)',
		},
		{
			id: '2',
			standardId: '1',
			standard: 'ОСТ 26.260.454',
			flangeStandardId: '2',
			flangeStandard: 'ГОСТ 28759 (сосуды и аппараты)',
		},
		{
			id: '3',
			standardId: '2',
			standard: 'ГОСТ Р 52376-2005',
			flangeStandardId: '1',
			flangeStandard: 'ГОСТ 33259(12815) (трубопроводы)',
		},
		{
			id: '4',
			standardId: '3',
			standard: 'ASME B 16.20',
			flangeStandardId: '3',
			flangeStandard: 'ASME B 16.5',
		},
		{
			id: '5',
			standardId: '3',
			standard: 'ASME B 16.20',
			flangeStandardId: '4',
			flangeStandard: 'ASME B 16.47 A',
		},
		{
			id: '6',
			standardId: '3',
			standard: 'ASME B 16.20',
			flangeStandardId: '5',
			flangeStandard: 'ASME B 16.47 B',
		},
		{
			id: '7',
			standardId: '4',
			standard: 'EN 12560-2',
			flangeStandardId: '3',
			flangeStandard: 'ASME B 16.5',
		},
		{
			id: '8',
			standardId: '4',
			standard: 'EN 12560-2',
			flangeStandardId: '4',
			flangeStandard: 'ASME B 16.47 A',
		},
		{
			id: '9',
			standardId: '4',
			standard: 'EN 12560-2',
			flangeStandardId: '5',
			flangeStandard: 'ASME B 16.47 B',
		},
		{
			id: '10',
			standardId: '5',
			standard: 'EN 1514-2',
			flangeStandardId: '6',
			flangeStandard: 'DIN EN 1092',
		},
		{
			id: '11',
			standardId: '6',
			standard: 'ТУ 3689-010-93978201-2008',
			flangeStandardId: '0',
			flangeStandard: '',
		},
	],
	flangeType: [],
	snp: undefined,
}

export const snpSlice = createSlice({
	name: 'snp',
	initialState,
	reducers: {},
})

export const {} = snpSlice.actions

export default snpSlice.reducer
