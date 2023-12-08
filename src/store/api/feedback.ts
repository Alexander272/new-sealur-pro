import type { IFeedback } from '@/types/feedback'
import { api } from './base'
import { proUrl } from './snp'

export const feedbackApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		sendFeedback: builder.mutation<null, IFeedback>({
			query: data => ({
				url: `${proUrl}/connect/feedback`,
				method: 'POST',
				body: data,
			}),
		}),
	}),
})

export const { useSendFeedbackMutation } = feedbackApi
