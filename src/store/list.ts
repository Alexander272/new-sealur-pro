import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface IListState {}

const initialState: IListState = {}

export const listSlice = createSlice({
	name: 'list',
	initialState,
	reducers: {},
})

export const {} = listSlice.actions

export default listSlice.reducer
