import { configureStore } from '@reduxjs/toolkit'
import snpReducer from './gaskets/snp'
import cardReducer from './card'
import userReducer from './user'
import { api } from './api'

export const store = configureStore({
	reducer: {
		snp: snpReducer,
		card: cardReducer,
		user: userReducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
