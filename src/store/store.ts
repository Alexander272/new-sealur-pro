import { configureStore } from '@reduxjs/toolkit'
import snpReducer from './gaskets/snp'
import putgReducer from './gaskets/putg'
import ringReducer from './rings/ring'
import kitReducer from './rings/kit'
import cardReducer from './card'
import userReducer from './user'
import { api, unauthenticatedMiddleware } from './api/base'
import { dadataApi } from './api/dadata'

export const store = configureStore({
	reducer: {
		snp: snpReducer,
		putg: putgReducer,
		ring: ringReducer,
		kit: kitReducer,
		card: cardReducer,
		user: userReducer,
		[api.reducerPath]: api.reducer,
		[dadataApi.reducerPath]: dadataApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat([api.middleware, dadataApi.middleware, unauthenticatedMiddleware]),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
