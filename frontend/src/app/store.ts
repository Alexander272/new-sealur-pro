import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { userPath, userReducer } from '@/features/user/userSlice'
import { cardPath, cardReducer } from '@/features/card/cardSlice'
import { snpPath, snpReducer } from '@/features/gaskets/modules/snp/snpSlice'
import { putgPath, putgReducer } from '@/features/gaskets/modules/putg/putgSlice'
import { wavePath, waveReducer } from '@/features/gaskets/modules/wave/waveSlice'
import { serratedPath, serratedReducer } from '@/features/gaskets/modules/serrated/serratedSlice'
import { jacketedPath, jacketedReducer } from '@/features/gaskets/modules/jacketed/jacketedSlice'
import { dialogPath, dialogReducer } from '@/features/dialogs/dialogSlice'
import { dadataApi } from '@/features/auth/modules/dadata/dadataApiSlice'
import { resetStoreListener } from './middlewares/resetStore'
import { apiSlice } from './apiSlice'

const rootReducer = combineReducers({
	[apiSlice.reducerPath]: apiSlice.reducer,
	[dadataApi.reducerPath]: dadataApi.reducer,
	[dialogPath]: dialogReducer,
	[userPath]: userReducer,
	[cardPath]: cardReducer,
	[snpPath]: snpReducer,
	[putgPath]: putgReducer,
	[wavePath]: waveReducer,
	[serratedPath]: serratedReducer,
	[jacketedPath]: jacketedReducer,
})

export const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV === 'development',
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.prepend(resetStoreListener.middleware)
			.concat([apiSlice.middleware, dadataApi.middleware]),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
