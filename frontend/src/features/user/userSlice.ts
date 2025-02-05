import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { IRefreshUser, IUser } from './types/user'
import { RootState } from '@/app/store'

export interface IUserState {
	id: string | null
	name: string
	role: string | null
	token: string | null
	user?: IUser
}

const initialState: IUserState = {
	id: null,
	name: '',
	role: null,
	token: null,
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// установка авторизации пользователя
		setAuth: (state, action: PayloadAction<IRefreshUser>) => {
			state.id = action.payload.id
			state.role = action.payload.role
			state.token = action.payload.token
		},
		// установка данных о пользователе и авторизации
		setUser: (state, action: PayloadAction<IUser>) => {
			state.id = action.payload.id
			state.role = action.payload.role
			state.token = action.payload.token
			state.user = action.payload
		},
		// сброс пользователя
		resetUser: () => initialState,
	},
})

export const userPath = userSlice.name
export const userReducer = userSlice.reducer

export const getUserId = (state: RootState) => state.user.id
export const getUser = (state: RootState) => state.user.user
export const getRole = (state: RootState) => state.user.role
export const getToken = (state: RootState) => state.user.token

export const { setAuth, setUser, resetUser } = userSlice.actions
