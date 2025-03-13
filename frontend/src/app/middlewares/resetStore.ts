import { createListenerMiddleware, TypedStartListening } from '@reduxjs/toolkit'

import { apiSlice } from '@/app/apiSlice'
import { AppDispatch, RootState } from '@/app/store'
import { resetUser } from '@/features/user/userSlice'
import { dadataApi } from '@/features/auth/modules/dadata/dadataApiSlice'
import { resetSnp } from '@/features/gaskets/modules/snp/snpSlice'
import { resetPutg } from '@/features/gaskets/modules/putg/putgSlice'
import { resetCard } from '@/features/card/cardSlice'

export const resetStoreListener = createListenerMiddleware()

const startResetStoreListener = resetStoreListener.startListening as TypedStartListening<RootState, AppDispatch>

startResetStoreListener({
	actionCreator: resetUser,
	effect: async (_, listenerApi) => {
		await listenerApi.delay(100)
		//TODO
		listenerApi.dispatch(apiSlice.util.resetApiState())
		listenerApi.dispatch(dadataApi.util.resetApiState())
		listenerApi.dispatch(resetSnp())
		listenerApi.dispatch(resetPutg())
		listenerApi.dispatch(resetCard())
	},
})
