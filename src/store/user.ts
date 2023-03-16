import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IRefreshUser, IUser } from '@/types/user'

export interface IUserState {
	ready: boolean
	loading: boolean
	userId: string
	isAuth: boolean
	roleCode: string
	user?: IUser
}

const initialState: IUserState = {
	ready: false,
	loading: false,
	userId: '',
	isAuth: false,
	roleCode: 'user',
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setAuth: (state, action: PayloadAction<IRefreshUser>) => {
			state.userId = action.payload.id
			state.roleCode = action.payload.roleCode
			state.isAuth = true
		},
		setUser: (state, action: PayloadAction<IUser>) => {
			state.userId = action.payload.id
			state.roleCode = action.payload.roleCode
			state.isAuth = true
			state.user = action.payload
		},
	},
})

export const { setAuth, setUser } = userSlice.actions

export default userSlice.reducer
