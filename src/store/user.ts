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
		clearUser: state => {
			state.userId = ''
			state.roleCode = ''
			state.isAuth = false
			state.user = undefined
		},
	},
})

export const { setAuth, setUser, clearUser } = userSlice.actions

export default userSlice.reducer
