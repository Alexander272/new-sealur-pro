import { createListenerMiddleware, TypedStartListening } from '@reduxjs/toolkit'

import { apiSlice } from '@/app/apiSlice'
import { AppDispatch, RootState } from '@/app/store'
import { resetUser } from '@/features/user/userSlice'
import { resetSnp } from '@/features/gaskets/modules/snp/snpSlice'
import { resetPutg } from '@/features/gaskets/modules/putg/putgSlice'
import { resetWave } from '@/features/gaskets/modules/wave/waveSlice'
import { resetSerrated } from '@/features/gaskets/modules/serrated/serratedSlice'
import { resetJacketed } from '@/features/gaskets/modules/jacketed/jacketedSlice'
import { resetCard } from '@/features/card/cardSlice'
import { resetDialog } from '@/features/dialogs/dialogSlice'

export const resetStoreListener = createListenerMiddleware()

const startResetStoreListener = resetStoreListener.startListening as TypedStartListening<RootState, AppDispatch>

startResetStoreListener({
	actionCreator: resetUser,
	effect: async (_, listenerApi) => {
		await listenerApi.delay(100)
		//TODO
		listenerApi.dispatch(apiSlice.util.resetApiState())
		listenerApi.dispatch(resetSnp())
		listenerApi.dispatch(resetPutg())
		listenerApi.dispatch(resetWave())
		listenerApi.dispatch(resetSerrated())
		listenerApi.dispatch(resetJacketed())
		listenerApi.dispatch(resetCard())
		listenerApi.dispatch(resetDialog())
	},
})
