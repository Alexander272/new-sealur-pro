import type { IFeedback } from './types/feedback'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const feedbackApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		sendFeedback: builder.mutation<null, IFeedback>({
			query: data => ({
				url: API.feedback,
				method: 'POST',
				body: data,
			}),
		}),
	}),
})

export const { useSendFeedbackMutation } = feedbackApiSlice
