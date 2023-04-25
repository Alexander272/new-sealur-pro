import { configureStore } from '@reduxjs/toolkit'
import snpReducer from './gaskets/snp'
import putgReducer from './gaskets/putg'
import cardReducer from './card'
import userReducer from './user'
import { api, unauthenticatedMiddleware } from './api/base'

export const store = configureStore({
	reducer: {
		snp: snpReducer,
		putg: putgReducer,
		card: cardReducer,
		user: userReducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware).concat(unauthenticatedMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
