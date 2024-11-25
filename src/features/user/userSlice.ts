import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { IRefreshUser, IUser } from './types/user'
import { RootState } from '@/app/store'

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
		// установка авторизации пользователя
		setAuth: (state, action: PayloadAction<IRefreshUser>) => {
			state.userId = action.payload.id
			state.roleCode = action.payload.roleCode
			state.isAuth = true
		},
		// установка данных о пользователе и авторизации
		setUser: (state, action: PayloadAction<IUser>) => {
			state.userId = action.payload.id
			state.roleCode = action.payload.roleCode
			state.isAuth = true
			state.user = action.payload
		},
		// сброс пользователя
		resetUser: () => initialState,
	},
})

export const userPath = userSlice.name
export const userReducer = userSlice.reducer

export const getIsAuth = (state: RootState) => state.user.isAuth
export const getUserId = (state: RootState) => state.user.userId
export const getUser = (state: RootState) => state.user.user
export const getRole = (state: RootState) => state.user.roleCode

export const { setAuth, setUser, resetUser } = userSlice.actions
